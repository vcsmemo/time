import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Container } from '@/components/ui/container';
import TimeNavigation from '../components/TimeNavigation';
import MeetingPlanner from '../components/MeetingPlanner';
import { useTheme } from '../lib/ThemeContext';
import { Location, defaultLocations } from '../lib/locations';
import { TimeData, convertTimeToAllLocations } from '../lib/time';

export default function MeetingPlannerPage() {
  const { isDarkMode } = useTheme();
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [useRealTime, setUseRealTime] = useState(true);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [timeData, setTimeData] = useState<Map<string, TimeData>>(new Map());

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
        <title>会议安排工具 | 全球时区转换器</title>
        <meta name="description" content="为不同时区的参与者安排会议，查看各地参与者的当地时间" />
      </Helmet>

      <Container>
        <div className="py-6 space-y-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">会议安排工具</h1>
            <p className="text-muted-foreground">
              为跨时区的参与者安排会议，查看每个参与者的当地时间，确保会议时间对所有人都合适。
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
              />
            </DragDropContext>
          </div>
        </div>
      </Container>
    </>
  );
}