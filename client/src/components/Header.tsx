import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Settings, Globe, Menu } from "lucide-react";
import { useEffect, useState } from "react";

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
          <Globe className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Global Time Viewer</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
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
        <button className="md:hidden text-xl" onClick={onToggleSettings}>
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
