import {
   createContext,
   useContext,
   useState,
   useEffect,
   useCallback,
   type ReactNode,
} from "react";
import type { User } from "../types/api";
import {
   authApi,
   type LoginPayload,
   type SignupPayload,
} from "../api/auth.api";

interface AuthContextType {
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   login: (payload: LoginPayload) => Promise<void>;
   signup: (payload: SignupPayload) => Promise<void>;
   logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [token, setToken] = useState<string | null>(() =>
      localStorage.getItem("token"),
   );
   const [isLoading, setIsLoading] = useState<boolean>(true);

   // Validate existing session on mount
   useEffect(() => {
      let isMounted = true;

      const initAuth = async () => {
         const storedToken = localStorage.getItem("token");
         if (!storedToken) {
            if (isMounted) {
               setUser(null);
               setIsLoading(false);
            }
            return;
         }

         try {
            const currentUser = await authApi.getMe();
            if (isMounted) {
               setUser(currentUser);
               setToken(storedToken);
            }
         } catch {
            if (isMounted) {
               localStorage.removeItem("token");
               setUser(null);
               setToken(null);
            }
         } finally {
            if (isMounted) {
               setIsLoading(false);
            }
         }
      };

      initAuth();

      return () => {
         isMounted = false;
      };
   }, []);

   const login = useCallback(async (payload: LoginPayload) => {
      const data = await authApi.login(payload);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
   }, []);

   const signup = useCallback(async (payload: SignupPayload) => {
      const data = await authApi.signup(payload);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
   }, []);

   const logout = useCallback(async () => {
      try {
         await authApi.logout();
      } catch {
         // Silently catch network failures during logout
      } finally {
         localStorage.removeItem("token");
         setToken(null);
         setUser(null);
      }
   }, []);

   return (
      <AuthContext.Provider
         value={{
            user,
            token,
            isAuthenticated: !!user,
            isLoading,
            login,
            signup,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = (): AuthContextType => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};
