import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Location } from '../lib/locations';
import { TimeData, getTimeData } from '../lib/time';
import { Calendar } from './ui/calendar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Clock, Calendar as CalendarIcon, Plus, X, ArrowDownUp } from 'lucide-react';
import { formatDateForInput, formatTimeForInput, parseDateTimeFromInputs } from '../lib/utils';

interface MeetingPlannerProps {
  locations: Location[];
  timeData: Map<string, TimeData>;
  selectedDateTime: Date;
  onDateTimeChange: (date: Date) => void;
  initialParticipants?: Array<{ locationId: string; name: string }>;
  initialMeetingTitle?: string;
  initialMeetingDuration?: string;
}

export default function MeetingPlanner({
  locations,
  timeData,
  selectedDateTime,
  onDateTimeChange,
  initialParticipants = [],
  initialMeetingTitle = '',
  initialMeetingDuration = '60',
}: MeetingPlannerProps) {
  const [meetingTitle, setMeetingTitle] = useState(initialMeetingTitle);
  const [meetingDuration, setMeetingDuration] = useState(initialMeetingDuration);
  const [selectedDate, setSelectedDate] = useState<Date>(selectedDateTime);
  const [selectedTime, setSelectedTime] = useState(formatTimeForInput(selectedDateTime));
  const [participants, setParticipants] = useState<Array<{ locationId: string; name: string }>>(initialParticipants);
  const [showCalendar, setShowCalendar] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantLocation, setNewParticipantLocation] = useState('');

  // Format date for display
  const dateString = formatDateForInput(selectedDate);

  // Handle adding a new participant
  const handleAddParticipant = () => {
    if (newParticipantName.trim() && newParticipantLocation) {
      setParticipants([
        ...participants,
        {
          locationId: newParticipantLocation,
          name: newParticipantName.trim(),
        },
      ]);
      setNewParticipantName('');
      setNewParticipantLocation('');
    }
  };

  // Handle removing a participant
  const handleRemoveParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowCalendar(false);
      
      // Update the global selected time
      const newDateTime = parseDateTimeFromInputs(
        formatDateForInput(date),
        selectedTime
      );
      onDateTimeChange(newDateTime);
    }
  };

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    
    // Update the global selected time
    const newDateTime = parseDateTimeFromInputs(dateString, e.target.value);
    onDateTimeChange(newDateTime);
  };

  // Handle drag end for reordering participants
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = [...participants];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setParticipants(items);
  };

  // Get location by ID
  const getLocationById = (id: string) => {
    return locations.find(loc => loc.id === id);
  };

  // Generate a meeting link/invite
  const generateMeetingLink = () => {
    // Create a meeting object with all the necessary details
    const meetingData = {
      id: Math.random().toString(36).substring(2, 10),
      title: meetingTitle || "Untitled Meeting",
      date: dateString,
      time: selectedTime,
      duration: meetingDuration,
      participants: participants.map(p => {
        const location = getLocationById(p.locationId);
        const localTime = location ? timeData.get(location.id)?.time || 'Unknown time' : 'Unknown time';
        return {
          name: p.name,
          location: location ? `${location.name}, ${location.country}` : 'Unknown location',
          timezone: location?.timezone || 'Unknown timezone',
          localTime
        };
      })
    };
    
    // Encode the meeting data to share in the URL
    const encodedData = encodeURIComponent(JSON.stringify(meetingData));
    
    // Build a query string to append to the URL
    const queryString = new URLSearchParams({
      meeting: encodedData
    }).toString();
    
    // Create the full link
    const meetingLink = `${window.location.origin}/meeting-planner?${queryString}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(meetingLink)
      .then(() => {
        alert("Meeting invitation link copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        alert("Meeting link generated. Right-click to copy the link from the button.");
      });
      
    // Return the link for the button to use
    return meetingLink;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Meeting Planner</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Time Zone Converter
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Meeting details */}
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Meeting Title</Label>
            <Input
              id="meeting-title"
              placeholder="Enter meeting title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-date">Meeting Date</Label>
              <div className="relative">
                <div className="flex">
                  <Input
                    id="meeting-date"
                    type="text"
                    value={dateString}
                    readOnly
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="ml-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </div>
                {showCalendar && (
                  <div className="absolute z-10 mt-1 bg-background border rounded-md shadow-md">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-time">Meeting Time</Label>
              <Input
                id="meeting-time"
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting-duration">Duration</Label>
            <Select value={meetingDuration} onValueChange={setMeetingDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select meeting duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Add participant */}
          <div className="space-y-2">
            <Label>Add Participant</Label>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Participant name"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                className="flex-1"
              />
              <Select value={newParticipantLocation} onValueChange={setNewParticipantLocation}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}, {location.country}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddParticipant}
                disabled={!newParticipantName || !newParticipantLocation}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          {/* Participants list */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Participants List</Label>
              {participants.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="participants">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {participants.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No participants added yet
                      </div>
                    ) : (
                      participants.map((participant, index) => {
                        const location = getLocationById(participant.locationId);
                        const localTime = location
                          ? timeData.get(location.id)?.time || 'Time data unavailable'
                          : 'Unknown location';
                        
                        return (
                          <Draggable
                            key={index}
                            draggableId={`participant-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">{participant.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {location?.name}, {location?.country} ({location?.timezone})
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="font-mono">
                                    {localTime}
                                  </Badge>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveParticipant(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {participants.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Meeting Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {meetingTitle || "Untitled Meeting"} will start on {dateString} at {selectedTime},
                    lasting for {meetingDuration} minute{meetingDuration !== '1' ? 's' : ''}. 
                    There {participants.length === 1 ? 'is' : 'are'} {participants.length} participant{participants.length !== 1 ? 's' : ''} from different time zones.
                  </p>
                </div>

                <Button className="w-full" onClick={generateMeetingLink}>
                  Generate Meeting Invitation Link
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}