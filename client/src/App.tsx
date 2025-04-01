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
import MeetingPlannerPage from "@/pages/MeetingPlannerPage";
import TimeComparisonPage from "@/pages/TimeComparisonPage";
import { ThemeProvider } from "./lib/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/timezone/:timezone" component={TimeZonePage} />
      <Route path="/city/:country/:city" component={CityPage} />
      <Route path="/compare/:from/:to" component={ComparisonPage} />
      <Route path="/comparison" component={ComparisonPage} />
      <Route path="/time-comparison" component={TimeComparisonPage} />
      <Route path="/timezones" component={TimeZonesPage} />
      <Route path="/countries" component={CountriesPage} />
      <Route path="/country/:country" component={CountryPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:articleId" component={BlogArticlePage} />
      <Route path="/meeting-planner" component={MeetingPlannerPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Router />
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
