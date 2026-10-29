import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { HomePage } from "./pages/HomePage";
import { HabitDetailPage } from "./pages/HabitDetailPage";
import { HabitEditPage } from "./pages/HabitEditPage";
import { LabelsPage } from "./pages/LabelsPage";
import { ArchivePage } from "./pages/ArchivePage";
import { TrashPage } from "./pages/TrashPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ActionPage } from "./pages/ActionPage";

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <AuthProvider>
            <BrowserRouter>
               <Routes>
                  {/* Public Standalone Pages */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Authenticated Application Shell Protected by Route Guard */}
                  <Route
                     element={
                        <ProtectedRoute>
                           <AppLayout />
                        </ProtectedRoute>
                     }
                  >
                     <Route path="/home" element={<HomePage />} />
                     <Route
                        path="/dashboard"
                        element={<Navigate to="/home" replace />}
                     />
                     <Route
                        path="/habits"
                        element={<Navigate to="/home" replace />}
                     />
                     <Route path="/habits/:id" element={<HabitDetailPage />} />
                     <Route
                        path="/habits/:id/edit"
                        element={<HabitEditPage />}
                     />
                     <Route path="/labels" element={<LabelsPage />} />
                     <Route path="/timer" element={<ActionPage />} />
                     <Route
                        path="/action"
                        element={<Navigate to="/timer" replace />}
                     />
                     <Route path="/archive" element={<ArchivePage />} />
                     <Route path="/trash" element={<TrashPage />} />
                     <Route path="/profile" element={<ProfilePage />} />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
               </Routes>
            </BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
         </AuthProvider>
      </QueryClientProvider>
   );
}

export default App;
