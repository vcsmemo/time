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
    // Get the meeting title
    const title = meetingTitle || "Untitled Meeting";
    
    // Parse the date and time strings to create JavaScript Date objects
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    const [hours, minutes] = selectedTime.split(':').map(num => parseInt(num, 10));
    
    // Create start and end Date objects
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(new Date(startDate).setMinutes(startDate.getMinutes() + parseInt(meetingDuration)));
    
    // Format dates for iCalendar format (YYYYMMDDTHHMMSSZ)
    const formatDateForIcal = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    // Generate a description with participant information
    let description = `Meeting organized across multiple time zones.\n\nParticipants:\n`;
    participants.forEach(p => {
      const location = getLocationById(p.locationId);
      const localTime = location ? timeData.get(location.id)?.time || 'Unknown time' : 'Unknown time';
      description += `- ${p.name} (${location?.name}, ${location?.country}): ${localTime}\n`;
    });
    
    // Create the iCalendar data
    const icalData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GlobalTimeConverter//Meeting Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${Math.random().toString(36).substring(2, 15)}@globaltimeconverter.com`,
      `DTSTAMP:${formatDateForIcal(new Date())}`,
      `DTSTART:${formatDateForIcal(startDate)}`,
      `DTEND:${formatDateForIcal(endDate)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    // Create a data URL from the iCalendar data
    const icalBlob = new Blob([icalData], { type: 'text/calendar;charset=utf-8' });
    const icalUrl = URL.createObjectURL(icalBlob);
    
    // Also create a regular meeting data object for website sharing
    const meetingData = {
      id: Math.random().toString(36).substring(2, 10),
      title: title,
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
    
    // Create the full website link
    const meetingLink = `${window.location.origin}/meeting-planner?${queryString}`;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = icalUrl;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(icalUrl);
    }, 100);
    
    // Copy website link to clipboard as fallback
    navigator.clipboard.writeText(meetingLink)
      .then(() => {
        alert("Calendar invitation downloaded and meeting link copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        alert("Calendar invitation downloaded! You can share it via email.");
      });
      
    return meetingLink;
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="font-bold text-xl flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">Meeting Planner</span>
          </span>
          <Badge variant="outline" className="flex items-center gap-1 bg-primary/5 text-primary">
            <Clock className="w-3 h-3" />
            Time Zone Converter
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Meeting details */}
          <div className="space-y-2">
            <Label htmlFor="meeting-title" className="text-sm font-medium">Meeting Title</Label>
            <Input
              id="meeting-title"
              placeholder="Enter meeting title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="border-primary/20 focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meeting-date" className="text-sm font-medium">Date & Time</Label>
              <div className="relative">
                <div className="flex">
                  <Input
                    id="meeting-date"
                    type="text"
                    value={dateString}
                    readOnly
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="pr-10 border-primary/20 focus:border-primary/50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="ml-2 border-primary/20"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    id="meeting-time"
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className="ml-2 border-primary/20 focus:border-primary/50"
                  />
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
              <Label htmlFor="meeting-duration" className="text-sm font-medium">Duration</Label>
              <Select value={meetingDuration} onValueChange={setMeetingDuration}>
                <SelectTrigger className="border-primary/20 focus:border-primary/50">
                  <SelectValue placeholder="Duration" />
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
          </div>

          <Separator className="my-3" />

          {/* Add participant */}
          <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-semibold flex items-center">
                <Plus className="h-4 w-4 mr-1 text-primary" /> 
                Add Participant
              </Label>
              {participants.length > 0 && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Participant name"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                className="flex-1 border-primary/20 focus:border-primary/50"
              />
              <Select value={newParticipantLocation} onValueChange={setNewParticipantLocation}>
                <SelectTrigger className="flex-1 border-primary/20 focus:border-primary/50">
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
                className="bg-primary/90 hover:bg-primary"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          {/* Participants list */}
          <div className="space-y-2 mt-2">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="participants">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 max-h-[300px] overflow-y-auto pr-1"
                  >
                    {participants.length === 0 ? (
                      <div className="text-center py-3 text-muted-foreground text-sm border border-dashed rounded-md">
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
                                className="flex items-center justify-between p-2 border border-primary/10 rounded-md bg-background hover:bg-primary/5 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <ArrowDownUp className="h-4 w-4 text-primary/60" />
                                  <div>
                                    <div className="font-medium">{participant.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {location?.name}, {location?.country} ({location?.timezone})
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="font-mono bg-primary/5 border-primary/20 text-xs">
                                    {localTime}
                                  </Badge>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveParticipant(index)}
                                    className="h-6 w-6"
                                  >
                                    <X className="h-3 w-3" />
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
              <Separator className="my-3" />
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg">
                <div className="mb-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">Meeting Summary</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong className="font-semibold">{meetingTitle || "Untitled Meeting"}</strong> will start on <strong className="font-mono">{dateString}</strong> at <strong className="font-mono">{selectedTime}</strong>,
                    lasting for <strong>{meetingDuration}</strong> minute{meetingDuration !== '1' ? 's' : ''}. 
                    There {participants.length === 1 ? 'is' : 'are'} {participants.length} participant{participants.length !== 1 ? 's' : ''} from different time zones.
                  </p>
                </div>

                <Button 
                  className="w-full mb-2 bg-primary/90 hover:bg-primary text-white" 
                  onClick={generateMeetingLink}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Generate Calendar Invitation
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Creates a shareable link that contains meeting details formatted as a calendar event.
                  The recipient can add this meeting directly to their calendar.
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}