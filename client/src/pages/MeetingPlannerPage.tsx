import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Container } from '@/components/ui/container';
import MeetingPlanner from '../components/MeetingPlanner';
import { useTheme } from '../lib/ThemeContext';
import { Location, defaultLocations, searchLocation } from '../lib/locations';
import { TimeData, convertTimeToAllLocations } from '../lib/time';
import { parseDateTimeFromInputs } from '../lib/utils';
import { useLocation } from 'wouter';
import { Globe } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useMeetingWebSocket } from '../hooks/use-meeting-websocket';

export default function MeetingPlannerPage() {
  const { isDarkMode } = useTheme();
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [useRealTime, setUseRealTime] = useState(true);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map());
  const [location] = useLocation();
  const [participants, setParticipants] = useState<Array<{ id: string; locationId: string; name: string }>>([]);
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [meetingDuration, setMeetingDuration] = useState<string>('60');
  const [meetingLoaded, setMeetingLoaded] = useState<boolean>(false);
  const [meetingId, setMeetingId] = useState<string>('');
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [privacySettings, setPrivacySettings] = useState({
    hideParticipantNames: false,
    hideParticipantLocations: false
  });
  
  // 使用WebSocket钩子
  const { 
    isConnected, 
    meetingData, 
    error: wsError, 
    updateMeeting,
    updatePrivacySettings 
  } = useMeetingWebSocket(meetingId);

  // Process URL parameters to load meeting data if available
  useEffect(() => {
    // Only run this once to avoid infinite loops
    if (meetingLoaded) return;
    
    try {
      const params = new URLSearchParams(window.location.search);
      const urlMeetingId = params.get('id');
      const encodedMeetingData = params.get('meeting');
      
      // 如果URL中有会议ID，设置会议ID并连接WebSocket
      if (urlMeetingId) {
        setMeetingId(urlMeetingId);
        setIsCreator(false); // 通过ID访问的视为参与者而非创建者
        setMeetingLoaded(true);
        // WebSocket连接将通过meetingId自动建立
        return;
      }
      
      // 如果URL中有旧式会议数据格式
      if (encodedMeetingData) {
        const meeting = JSON.parse(decodeURIComponent(encodedMeetingData));
        
        // 设置会议ID或创建新ID
        if (meeting.id) {
          setMeetingId(meeting.id);
        } else {
          const newMeetingId = nanoid(10);
          setMeetingId(newMeetingId);
          setIsCreator(true); // 创建新会议
        }
        
        // 设置会议标题和时长
        if (meeting.title) setMeetingTitle(meeting.title);
        if (meeting.duration) setMeetingDuration(meeting.duration);
        
        // 设置会议时间和日期
        if (meeting.date && meeting.time) {
          const dateTime = parseDateTimeFromInputs(meeting.date, meeting.time);
          setSelectedDateTime(dateTime);
          setUseRealTime(false);
        }
        
        // 加载参与者信息
        if (meeting.participants && Array.isArray(meeting.participants)) {
          const loadedParticipants: Array<{ id: string; locationId: string; name: string }> = [];
          
          // 处理每个参与者
          meeting.participants.forEach((p: any) => {
            // 如果参与者已有locationId，直接使用
            if (p.locationId) {
              loadedParticipants.push({
                id: p.id || nanoid(8),
                name: p.name,
                locationId: p.locationId
              });
            }
            // 否则根据location信息查找位置
            else if (p.name && p.location) {
              // 在数据库中查找位置
              const locationName = p.location.split(',')[0].trim();
              const matchingLocations = searchLocation(locationName);
              
              if (matchingLocations.length > 0) {
                loadedParticipants.push({
                  id: p.id || nanoid(8),
                  name: p.name,
                  locationId: matchingLocations[0].id
                });
              }
            }
          });
          
          if (loadedParticipants.length > 0) {
            setParticipants(loadedParticipants);
          }
        }
        
        // 加载隐私设置
        if (meeting.privacySettings) {
          setPrivacySettings({
            hideParticipantNames: !!meeting.privacySettings.hideParticipantNames,
            hideParticipantLocations: !!meeting.privacySettings.hideParticipantLocations
          });
        }
        
        setMeetingLoaded(true);
      } else {
        // 没有会议数据，创建新会议
        const newMeetingId = nanoid(10);
        setMeetingId(newMeetingId);
        setIsCreator(true);
        setMeetingLoaded(true);
      }
    } catch (error) {
      console.error('Error parsing meeting data:', error);
      // 出错时创建新会议
      const newMeetingId = nanoid(10);
      setMeetingId(newMeetingId);
      setIsCreator(true);
      setMeetingLoaded(true);
    }
  }, [location, meetingLoaded]);
  
  // 当从WebSocket接收到会议数据时更新本地状态
  useEffect(() => {
    if (!meetingData) return;
    
    // 更新会议标题和时长
    if (meetingData.title) setMeetingTitle(meetingData.title);
    if (meetingData.duration) setMeetingDuration(meetingData.duration);
    
    // 更新会议时间和日期
    if (meetingData.date && meetingData.time) {
      const dateTime = parseDateTimeFromInputs(meetingData.date, meetingData.time);
      setSelectedDateTime(dateTime);
      setUseRealTime(false);
    }
    
    // 更新参与者列表，保持本地状态与服务器同步
    if (meetingData.participants && Array.isArray(meetingData.participants)) {
      const syncedParticipants = meetingData.participants.map(p => {
        // 如果已有locationId，直接使用
        if (p.locationId) {
          return {
            id: p.id,
            name: p.name,
            locationId: p.locationId
          };
        } 
        // 否则尝试从location字符串中查找位置
        else {
          return {
            id: p.id,
            name: p.name,
            locationId: defaultLocations.find(loc => loc.name === p.location?.split(',')[0]?.trim())?.id || ''
          };
        }
      }).filter(p => p.locationId); // 过滤掉无效的位置
      
      setParticipants(syncedParticipants);
    }
    
    // 更新隐私设置
    if (meetingData.privacySettings) {
      setPrivacySettings({
        hideParticipantNames: !!meetingData.privacySettings.hideParticipantNames,
        hideParticipantLocations: !!meetingData.privacySettings.hideParticipantLocations
      });
    }
  }, [meetingData]);

  // Update time data when locations or selected time changes
  useEffect(() => {
    const timer = setInterval(() => {
      if (useRealTime) {
        setSelectedDateTime(new Date());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [useRealTime]);

  // Update time data when locations or selected time changes
  useEffect(() => {
    const newTimeData = convertTimeToAllLocations(selectedDateTime, locations);
    setTimeData(newTimeData);
  }, [locations, selectedDateTime]);

  // Handle time change
  const handleDateTimeChange = (date: Date) => {
    setSelectedDateTime(date);
    setUseRealTime(false);
  };

  // Handle drag-and-drop reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(locations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocations(items);
  };

  return (
    <>
      <Helmet>
        <title>Meeting Planner | Global Time Converter</title>
        <meta name="description" content="Schedule meetings for participants in different time zones and view local times for all attendees" />
      </Helmet>

      <Container>
        <div className="py-4 space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Meeting Planner</h1>
                <p className="text-sm text-muted-foreground">
                  Schedule meetings across different time zones with ease
                </p>
              </div>
              <a href="/" className="no-underline">
                <div className="flex items-center text-sm font-medium px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors">
                  <Globe className="h-4 w-4 mr-2" />
                  Back to Home
                </div>
              </a>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <MeetingPlanner
                locations={locations}
                timeData={timeData}
                selectedDateTime={selectedDateTime}
                onDateTimeChange={handleDateTimeChange}
                initialParticipants={participants}
                initialMeetingTitle={meetingTitle}
                initialMeetingDuration={meetingDuration}
                meetingId={meetingId}
                isCreator={isCreator}
                privacySettings={privacySettings}
                onPrivacySettingsChange={(hideNames, hideLocations) => {
                  const newSettings = {
                    hideParticipantNames: hideNames,
                    hideParticipantLocations: hideLocations
                  };
                  setPrivacySettings(newSettings);
                  updatePrivacySettings(hideNames, hideLocations);
                }}
                isConnected={isConnected}
                wsError={wsError}
                onMeetingUpdate={(meeting) => updateMeeting(meeting)}
              />
            </DragDropContext>
          </div>
        </div>
      </Container>
    </>
  );
}