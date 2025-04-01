import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Location } from '../lib/locations';
import { TimeData, getTimeData } from '../lib/time';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { 
  Clock, 
  Plus, 
  X, 
  ArrowDownUp,
  Users,
  MapPin,
  ChevronRight,
  Star,
  Check,
  Info as InfoIcon,
  Calendar
} from 'lucide-react';
import { formatDateForInput, formatTimeForInput, parseDateTimeFromInputs } from '../lib/utils';

interface MeetingPlannerProps {
  locations: Location[];
  timeData: Map<string, TimeData>;
  selectedDateTime: Date;
  onDateTimeChange: (date: Date) => void;
  initialParticipants?: Array<{ id: string; locationId: string; name: string }>;
  initialMeetingTitle?: string;
  initialMeetingDuration?: string;
  meetingId?: string;
  isCreator?: boolean;
  privacySettings?: {
    hideParticipantNames: boolean;
    hideParticipantLocations: boolean;
  };
  onPrivacySettingsChange?: (hideNames: boolean, hideLocations: boolean) => void;
  isConnected?: boolean;
  wsError?: string | null;
  onMeetingUpdate?: (meeting: any) => void;
}

export default function MeetingPlanner({
  locations,
  timeData,
  selectedDateTime,
  onDateTimeChange,
  initialParticipants = [],
  initialMeetingTitle = '',
  initialMeetingDuration = '60',
  meetingId,
  isCreator = false,
  privacySettings = {
    hideParticipantNames: false,
    hideParticipantLocations: false
  },
  onPrivacySettingsChange,
  isConnected,
  wsError,
  onMeetingUpdate
}: MeetingPlannerProps) {
  const [meetingTitle, setMeetingTitle] = useState(initialMeetingTitle);
  const [meetingDuration, setMeetingDuration] = useState(initialMeetingDuration);
  const [selectedDate, setSelectedDate] = useState<Date>(selectedDateTime);
  const [selectedTime, setSelectedTime] = useState(formatTimeForInput(selectedDateTime));
  const [participants, setParticipants] = useState<Array<{ id: string; locationId: string; name: string }>>(
    // 处理参与者数据，确保每个参与者都有唯一ID
    initialParticipants.map(participant => ({
      id: participant.id || Math.random().toString(36).substring(2, 10),
      locationId: participant.locationId,
      name: participant.name
    }))
  );
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantLocation, setNewParticipantLocation] = useState('');
  const [showAnimatedCard, setShowAnimatedCard] = useState(false);
  const [animatedCardData, setAnimatedCardData] = useState<{
    title: string;
    date: string;
    time: string;
    duration: string;
    participants: Array<{
      name: string;
      location: string;
      timezone: string;
      localTime: string;
    }>;
  } | null>(null);

  // Format date for display
  const dateString = formatDateForInput(selectedDate);

  // Handle adding a new participant
  const handleAddParticipant = () => {
    if (newParticipantName.trim() && newParticipantLocation) {
      const newParticipant = {
        id: Math.random().toString(36).substring(2, 10),
        locationId: newParticipantLocation,
        name: newParticipantName.trim(),
      };
      
      setParticipants([...participants, newParticipant]);
      setNewParticipantName('');
      setNewParticipantLocation('');
      
      // 如果启用了WebSocket，同步更新到服务器
      if (onMeetingUpdate && meetingId) {
        updateMeetingData();
      }
    }
  };
  
  // 将当前会议数据发送到服务器
  const updateMeetingData = () => {
    if (!onMeetingUpdate || !meetingId) return;
    
    const updatedMeeting = {
      id: meetingId,
      title: meetingTitle,
      date: dateString,
      time: selectedTime,
      duration: meetingDuration,
      privacySettings,
      participants: participants.map(p => {
        const location = getLocationById(p.locationId);
        const localTime = location ? timeData.get(location.id)?.time || 'Unknown time' : 'Unknown time';
        return {
          id: p.id,
          name: p.name,
          location: location ? `${location.name}, ${location.country}` : 'Unknown location',
          timezone: location?.timezone || 'Unknown timezone',
          localTime
        };
      })
    };
    
    onMeetingUpdate(updatedMeeting);
  };

  // Handle removing a participant
  const handleRemoveParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
    
    // 如果启用了WebSocket，同步更新到服务器
    if (onMeetingUpdate && meetingId) {
      updateMeetingData();
    }
  };

  // Handle date selection
  const handleDateChange = (dateStr: string) => {
    if (dateStr) {
      const newDate = new Date(dateStr + 'T' + selectedTime);
      setSelectedDate(newDate);
      
      // Update the global selected time
      onDateTimeChange(newDate);
      
      // 如果启用了WebSocket，同步更新到服务器
      if (onMeetingUpdate && meetingId) {
        // 延迟更新，等状态更新后再同步
        setTimeout(() => updateMeetingData(), 0);
      }
    }
  };

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    
    // Update the global selected time
    const newDateTime = parseDateTimeFromInputs(dateString, e.target.value);
    onDateTimeChange(newDateTime);
    
    // 如果启用了WebSocket，同步更新到服务器
    if (onMeetingUpdate && meetingId) {
      // 延迟更新，等状态更新后再同步
      setTimeout(() => updateMeetingData(), 0);
    }
  };

  // Handle drag end for reordering participants
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = [...participants];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setParticipants(items);
    
    // 如果启用了WebSocket，同步更新到服务器
    if (onMeetingUpdate && meetingId) {
      setTimeout(() => updateMeetingData(), 0);
    }
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
    
    // Format dates for different formats
    const formatDateForICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').slice(0, -1);
    };
    
    // Generate a description with participant information
    let description = `Meeting organized across multiple time zones.\n\nParticipants:\n`;
    participants.forEach(p => {
      const location = getLocationById(p.locationId);
      const localTime = location ? timeData.get(location.id)?.time || 'Unknown time' : 'Unknown time';
      description += `- ${p.name} (${location?.name}, ${location?.country}): ${localTime}\n`;
    });
    
    // Create a regular meeting data object for website sharing
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
    const websiteLink = `${window.location.origin}/meeting-planner?${queryString}`;
    
    // Create Google Calendar URL (this works better than mailto for calendar invites)
    const googleStart = formatDateForGoogle(startDate);
    const googleEnd = formatDateForGoogle(endDate);
    const googleDetails = encodeURIComponent(description + "\n\nView online: " + websiteLink);
    const googleLocation = encodeURIComponent(participants.map(p => {
      const location = getLocationById(p.locationId);
      return location ? `${location.name}, ${location.country}` : 'Unknown location';
    }).join(' | '));
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${googleStart}/${googleEnd}&details=${googleDetails}&location=${googleLocation}&sprop=website:${encodeURIComponent(window.location.origin)}`;
    
    // Create Microsoft Outlook URL
    const outlookStart = formatDateForICS(startDate);
    const outlookEnd = formatDateForICS(endDate);
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${outlookStart}&enddt=${outlookEnd}&body=${encodeURIComponent(description)}&location=${googleLocation}`;
    
    // Create dialog with calendar options
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
      <div style="padding: 20px; max-width: 500px;">
        <h3 style="margin-top: 0;">Meeting Invitation</h3>
        <p>Select your preferred calendar service to add this meeting:</p>
        
        <div style="display: flex; flex-direction: column; gap: 10px; margin: 15px 0;">
          <a href="${googleUrl}" target="_blank" style="text-decoration: none;">
            <button style="width: 100%; padding: 10px; display: flex; align-items: center; justify-content: center; background-color: #4285F4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
              <span style="margin-right: 8px;">Add to Google Calendar</span>
            </button>
          </a>
          
          <a href="${outlookUrl}" target="_blank" style="text-decoration: none;">
            <button style="width: 100%; padding: 10px; display: flex; align-items: center; justify-content: center; background-color: #0078D4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
              <span style="margin-right: 8px;">Add to Outlook Calendar</span>
            </button>
          </a>
          
          <button id="copy-link-btn" style="width: 100%; padding: 10px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
            Copy Meeting Link
          </button>
        </div>
        
        <div style="margin-top: 15px; font-size: 14px; color: #666;">
          The meeting details include all participant time zones and will be added to your calendar.
        </div>
        
        <button id="close-dialog-btn" style="margin-top: 15px; padding: 8px 16px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
          Close
        </button>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Add event listeners
    const closeBtn = dialog.querySelector('#close-dialog-btn');
    closeBtn?.addEventListener('click', () => {
      dialog.close();
      document.body.removeChild(dialog);
    });
    
    const copyLinkBtn = dialog.querySelector('#copy-link-btn');
    copyLinkBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(websiteLink)
        .then(() => {
          alert("Meeting link copied to clipboard!");
          // Change button text temporarily
          if (copyLinkBtn instanceof HTMLElement) {
            const originalText = copyLinkBtn.innerText;
            copyLinkBtn.innerText = "Copied!";
            setTimeout(() => {
              copyLinkBtn.innerText = originalText;
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Failed to copy link: ', err);
          alert("Failed to copy link. Please try again.");
        });
    });
    
    // Show the animated card
    const cardData = {
      title: title,
      date: dateString,
      time: selectedTime,
      duration: meetingDuration,
      participants: meetingData.participants
    };
    
    setAnimatedCardData(cardData);
    setShowAnimatedCard(true);
    
    // Close the card after some time
    setTimeout(() => {
      setShowAnimatedCard(false);
    }, 7000); // Show for 7 seconds

    dialog.showModal();
    
    return websiteLink;
  };

  return (
    <>
      {/* Animated Meeting Card - this appears when a meeting is created */}
      <AnimatePresence>
        {showAnimatedCard && animatedCardData && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAnimatedCard(false)}
          >
            <motion.div 
              className="bg-gradient-to-br from-primary/90 to-primary/60 rounded-lg shadow-xl w-full max-w-md overflow-hidden text-white p-0"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                transition: { 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100
                } 
              }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.4 } }}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, transition: { delay: 0.6, type: "spring" } }}
                      className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4"
                    >
                      <Calendar className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{animatedCardData.title}</h4>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%", transition: { delay: 1, duration: 0.8 } }}
                        className="h-0.5 bg-white/40 rounded-full"
                      />
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { delay: 1.2 } }}
                    className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.8 } }}
                  className="bg-white/10 p-4 rounded-lg mb-4"
                >
                  <div className="flex items-center mb-3">
                    <Clock className="w-5 h-5 mr-2 text-white/80" />
                    <span className="text-white/80 text-sm font-medium">Meeting Time</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xl font-bold">{animatedCardData.time}</div>
                      <div className="text-white/70 text-sm">{animatedCardData.date}</div>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {animatedCardData.duration} min
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
                >
                  <div className="flex items-center mb-3">
                    <Users className="w-5 h-5 mr-2 text-white/80" />
                    <span className="text-white/80 text-sm font-medium">Participants</span>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {animatedCardData.participants.map((participant, index) => (
                      <motion.div
                        key={`participant-${index}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ 
                          x: 0, 
                          opacity: 1, 
                          transition: { 
                            delay: 1.2 + (index * 0.1),
                            type: "spring",
                            stiffness: 100
                          } 
                        }}
                        className="flex items-center justify-between bg-white/10 p-2 rounded"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                            <span className="text-xs font-bold">{participant.name.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="font-medium">{participant.name}</div>
                            <div className="text-xs text-white/70">{participant.location}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono">{participant.localTime}</div>
                          <div className="text-xs text-white/70">{participant.timezone}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 1.4 } }}
                >
                  <p className="text-white/70 text-sm mb-2">Calendar invitation created successfully</p>
                  <p className="text-white/90 text-xs">Click anywhere to close</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    
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
              onChange={(e) => {
                setMeetingTitle(e.target.value);
                if (onMeetingUpdate && meetingId) {
                  setTimeout(() => updateMeetingData(), 0);
                }
              }}
              className="border-primary/20 focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="meeting-date" className="text-sm font-medium">Date & Time</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-full">
                    <Input
                      id="meeting-date"
                      type="date"
                      value={formatDateForInput(selectedDate)}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="border-primary/20 focus:border-primary/50"
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      id="meeting-time"
                      type="time"
                      value={selectedTime}
                      onChange={handleTimeChange}
                      className="border-primary/20 focus:border-primary/50"
                    />
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Select both a date and time for your meeting</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-duration" className="text-sm font-medium">Duration</Label>
              <Select 
                value={meetingDuration} 
                onValueChange={(value) => {
                  setMeetingDuration(value);
                  if (onMeetingUpdate && meetingId) {
                    setTimeout(() => updateMeetingData(), 0);
                  }
                }}>
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
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">Meeting Details</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong className="font-semibold">{meetingTitle || "Untitled Meeting"}</strong> will start on <strong className="font-mono">{dateString}</strong> at <strong className="font-mono">{selectedTime}</strong>,
                    lasting for <strong>{meetingDuration}</strong> minutes. 
                    There {participants.length === 1 ? 'is' : 'are'} <strong>{participants.length}</strong> participant{participants.length !== 1 ? 's' : ''} from different time zones.
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
                  Creates calendar invitation links that can be added directly to Google Calendar, 
                  Outlook, or other calendar applications. Recipients can easily view and accept the meeting.
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
    </>
  );
}