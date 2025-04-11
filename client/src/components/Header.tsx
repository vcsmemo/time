import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Settings, Globe, Menu, CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface HeaderProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onToggleSettings: () => void;
}

export default function Header({ onToggleTheme, isDarkMode, onToggleSettings }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  
  useEffect(() => {
    // Update the time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
              <Globe className="h-6 w-6" />
              <h1 className="text-xl font-semibold">WorldClockNow</h1>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/meeting-planner">
            <div className="flex items-center text-sm font-medium px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors cursor-pointer">
              <CalendarClock className="h-4 w-4 mr-2" />
              Meeting Planner
            </div>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleTheme}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded"
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSettings}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="md:hidden flex items-center space-x-2">
          <Link href="/meeting-planner">
            <div className="p-2 cursor-pointer">
              <CalendarClock className="h-5 w-5" />
            </div>
          </Link>
          <button className="text-xl" onClick={onToggleSettings}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
