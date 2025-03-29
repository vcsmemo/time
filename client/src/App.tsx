import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import TimeZonePage from "@/pages/TimeZonePage";
import CityPage from "@/pages/CityPage";
import ComparisonPage from "@/pages/ComparisonPage";
import TimeZonesPage from "@/pages/TimeZonesPage";
import CountriesPage from "@/pages/CountriesPage";
import CountryPage from "@/pages/CountryPage";
import BlogPage from "@/pages/BlogPage";
import BlogArticlePage from "@/pages/BlogArticlePage";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/timezone/:timezone" component={TimeZonePage} />
      <Route path="/city/:country/:city" component={CityPage} />
      <Route path="/compare/:from/:to" component={ComparisonPage} />
      <Route path="/timezones" component={TimeZonesPage} />
      <Route path="/countries" component={CountriesPage} />
      <Route path="/country/:country" component={CountryPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:articleId" component={BlogArticlePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for user preference or saved theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Apply the theme class to the document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
