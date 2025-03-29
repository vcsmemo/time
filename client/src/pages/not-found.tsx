import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or user setting
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedPreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedPreference ?? darkModePreference);
  }, []);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      <Card className="w-full max-w-md mx-4 border-primary/20 dark:border-primary/10">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-16 w-16 text-primary mb-4" />
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              404 | Page Not Found
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/">
              <Button size="lg" className="mt-2">
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
