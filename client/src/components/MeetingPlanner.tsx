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
}

export default function MeetingPlanner({
  locations,
  timeData,
  selectedDateTime,
  onDateTimeChange,
}: MeetingPlannerProps) {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('60');
  const [selectedDate, setSelectedDate] = useState<Date>(selectedDateTime);
  const [selectedTime, setSelectedTime] = useState(formatTimeForInput(selectedDateTime));
  const [participants, setParticipants] = useState<Array<{ locationId: string; name: string }>>([]);
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
    // In a real application, this would generate a shareable link with the meeting details
    // For now, we'll just return a placeholder
    return `https://timezonemeet.com/meeting/${Math.random().toString(36).substring(2, 10)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>会议安排工具</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            参与者时区转换
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Meeting details */}
          <div className="space-y-2">
            <Label htmlFor="meeting-title">会议名称</Label>
            <Input
              id="meeting-title"
              placeholder="请输入会议名称"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-date">会议日期</Label>
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
              <Label htmlFor="meeting-time">会议时间</Label>
              <Input
                id="meeting-time"
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting-duration">会议时长</Label>
            <Select value={meetingDuration} onValueChange={setMeetingDuration}>
              <SelectTrigger>
                <SelectValue placeholder="选择会议时长" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="30">30 分钟</SelectItem>
                  <SelectItem value="60">1 小时</SelectItem>
                  <SelectItem value="90">1.5 小时</SelectItem>
                  <SelectItem value="120">2 小时</SelectItem>
                  <SelectItem value="180">3 小时</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Add participant */}
          <div className="space-y-2">
            <Label>添加参与者</Label>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="参与者姓名"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                className="flex-1"
              />
              <Select value={newParticipantLocation} onValueChange={setNewParticipantLocation}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="选择位置" />
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
                <Plus className="h-4 w-4 mr-1" /> 添加
              </Button>
            </div>
          </div>

          {/* Participants list */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>参与者列表</Label>
              {participants.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {participants.length} 位参与者
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
                        尚未添加参与者
                      </div>
                    ) : (
                      participants.map((participant, index) => {
                        const location = getLocationById(participant.locationId);
                        const localTime = location
                          ? timeData.get(location.id)?.time || '时间数据不可用'
                          : '未知位置';
                        
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
                  <h3 className="text-lg font-medium">会议总结</h3>
                  <p className="text-sm text-muted-foreground">
                    {meetingTitle || "未命名会议"} 将于 {dateString} {selectedTime} 开始，
                    持续 {meetingDuration} 分钟。共有 {participants.length} 位参与者，来自不同时区。
                  </p>
                </div>

                <Button className="w-full" onClick={generateMeetingLink}>
                  生成会议邀请链接
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}