import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import { AppLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HabitsPage } from "./pages/HabitsPage";
import { ArchivePage } from "./pages/ArchivePage";
import { ProfilePage } from "./pages/ProfilePage";
import { ActionPage } from "./pages/ActionPage";
import { LabelsPage } from "./pages/LabelsPage";

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <Routes>
               {/* Public standalone pages */}
               <Route path="/" element={<LandingPage />} />
               <Route path="/login" element={<LoginPage />} />
               <Route path="/signup" element={<SignupPage />} />

               {/* Authenticated Application Shell */}
               <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/habits" element={<HabitsPage />} />
                  <Route path="/archive" element={<ArchivePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/action" element={<ActionPage />} />
                  <Route path="/labels" element={<LabelsPage />} />
               </Route>

               {/* Catch-all redirect */}
               <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
         </BrowserRouter>
         <Toaster position="top-right" richColors closeButton />
      </QueryClientProvider>
   );
}

export default App;
