import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface PublicRouteProps {
   children?: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
   const { isAuthenticated, isLoading } = useAuth();

   if (isLoading) {
      return (
         <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
               Checking session...
            </p>
         </div>
      );
   }

   if (isAuthenticated) {
      return <Navigate to="/home" replace />;
   }

   return <>{children}</>;
};
