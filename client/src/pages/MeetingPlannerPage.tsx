import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Container } from '@/components/ui/container';
import TimeNavigation from '../components/TimeNavigation';
import MeetingPlanner from '../components/MeetingPlanner';
import { useTheme } from '../lib/ThemeContext';
import { Location, defaultLocations, searchLocation } from '../lib/locations';
import { TimeData, convertTimeToAllLocations } from '../lib/time';
import { parseDateTimeFromInputs } from '../lib/utils';
import { useLocation } from 'wouter';

export default function MeetingPlannerPage() {
  const { isDarkMode } = useTheme();
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [useRealTime, setUseRealTime] = useState(true);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map());
  const [location] = useLocation();
  const [participants, setParticipants] = useState<Array<{ locationId: string; name: string }>>([]);
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [meetingDuration, setMeetingDuration] = useState<string>('60');
  const [meetingLoaded, setMeetingLoaded] = useState<boolean>(false);

  // Process URL parameters to load meeting data if available
  useEffect(() => {
    // Only run this once to avoid infinite loops
    if (meetingLoaded) return;
    
    try {
      const params = new URLSearchParams(window.location.search);
      const meetingData = params.get('meeting');
      
      if (meetingData) {
        const meeting = JSON.parse(decodeURIComponent(meetingData));
        
        // Set meeting title and duration
        if (meeting.title) setMeetingTitle(meeting.title);
        if (meeting.duration) setMeetingDuration(meeting.duration);
        
        // Set meeting date and time
        if (meeting.date && meeting.time) {
          const dateTime = parseDateTimeFromInputs(meeting.date, meeting.time);
          setSelectedDateTime(dateTime);
          setUseRealTime(false);
        }
        
        // Load participants if available
        if (meeting.participants && Array.isArray(meeting.participants)) {
          const loadedParticipants: Array<{ locationId: string; name: string }> = [];
          
          // Process each participant
          meeting.participants.forEach((p: any) => {
            if (p.name && p.location) {
              // Find the location in our database
              const locationName = p.location.split(',')[0].trim();
              const matchingLocations = searchLocation(locationName);
              
              if (matchingLocations.length > 0) {
                loadedParticipants.push({
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
        
        setMeetingLoaded(true);
      }
    } catch (error) {
      console.error('Error parsing meeting data:', error);
    }
  }, [location, meetingLoaded]);

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
        <div className="py-6 space-y-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Meeting Planner</h1>
            <p className="text-muted-foreground">
              Schedule meetings for participants across different time zones, view each attendee's local time, and ensure the meeting time works for everyone.
            </p>

            <TimeNavigation
              selectedDateTime={selectedDateTime}
              onDateTimeChange={handleDateTimeChange}
              useRealTime={useRealTime}
              onToggleRealTime={setUseRealTime}
            />

            <DragDropContext onDragEnd={handleDragEnd}>
              <MeetingPlanner
                locations={locations}
                timeData={timeData}
                selectedDateTime={selectedDateTime}
                onDateTimeChange={handleDateTimeChange}
                initialParticipants={participants}
                initialMeetingTitle={meetingTitle}
                initialMeetingDuration={meetingDuration}
              />
            </DragDropContext>
          </div>
        </div>
      </Container>
    </>
  );
}