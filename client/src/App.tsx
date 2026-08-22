/*
 * Design system: سجلّ الواحة المعاصر — هوية عربية تحريرية غير متماثلة.
 * The app keeps the national agriculture story focused, calm, and accessible.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import RegionPage from "./pages/RegionPage";
import SystemArchitecturePage from "./pages/SystemArchitecturePage";
import FinancialFeasibilityPage from "./pages/FinancialFeasibilityPage";
import AdminDocsPage from "./pages/AdminDocsPage";
import RoadmapPage from "./pages/RoadmapPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import WeeklySummaryPage from "./pages/WeeklySummaryPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/region/:code"} component={RegionPage} />
      <Route path={"/architecture"} component={SystemArchitecturePage} />
      <Route path={"/feasibility"} component={FinancialFeasibilityPage} />
      <Route path={"/admin/docs"} component={AdminDocsPage} />
      <Route path={"/roadmap"} component={RoadmapPage} />
      <Route path={"/settings/notifications"} component={NotificationSettingsPage} />
      <Route path={"/weekly-summary"} component={WeeklySummaryPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-left" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
