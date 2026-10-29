import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
   children?: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
   const { isAuthenticated, isLoading } = useAuth();
   const location = useLocation();

   if (isLoading) {
      return (
         <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
               Checking authorization...
            </p>
         </div>
      );
   }

   if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   return <>{children}</>;
};
