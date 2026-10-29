import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
   email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
   password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
   const { login, signup } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();
   const [showPassword, setShowPassword] = useState(false);
   const [serverError, setServerError] = useState<string | null>(null);
   const [isDemoLoading, setIsDemoLoading] = useState(false);

   const fromLocation =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      "/home";

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = async (values: LoginFormValues) => {
      setServerError(null);
      try {
         await login(values);
         toast.success("Welcome back!");
         navigate(fromLocation, { replace: true });
      } catch (err: unknown) {
         const errorObj = err as {
            message?: string;
            details?: Record<string, string>;
         };
         const message =
            errorObj.message ||
            "Failed to log in. Please check your credentials.";
         setServerError(message);
      }
   };

   const handleDemoSignIn = async () => {
      setServerError(null);
      setIsDemoLoading(true);
      try {
         // Attempt direct login with demo credentials
         await login({
            email: "tanay@habittracker.com",
            password: "Password123!",
         });
         toast.success("Signed in as Tanay Pratap!");
         navigate(fromLocation, { replace: true });
      } catch {
         // If demo user does not exist yet on clean DB, create it
         try {
            await signup({
               firstName: "Tanay",
               lastName: "Pratap",
               email: "tanay@habittracker.com",
               password: "Password123!",
            });
            toast.success("Welcome aboard Tanay Pratap!");
            navigate(fromLocation, { replace: true });
         } catch {
            setServerError(
               "Could not initialize demo account. Please register manually.",
            );
         }
      } finally {
         setIsDemoLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Top Brand & Back to Landing */}
            <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
               <Link
                  to="/"
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
               >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to landing</span>
               </Link>

               <Link
                  to="/"
                  className="text-xl font-black tracking-tight text-primary"
               >
                  MyWebsite
               </Link>
            </div>

            <div className="text-center px-4 sm:px-0">
               <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Sign in to your account
               </h2>
               <p className="mt-2 text-sm text-muted-foreground">
                  Continue building consistent routines and daily streaks.
               </p>
            </div>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
            <div className="bg-card border border-border py-8 px-6 sm:px-10 rounded-2xl shadow-xs">
               {serverError && (
                  <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive animate-in fade-in-50">
                     <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                     <p className="text-sm font-medium">{serverError}</p>
                  </div>
               )}

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                     <Label
                        htmlFor="email"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                     >
                        Email address
                     </Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="you@domain.com"
                        autoComplete="email"
                        disabled={isSubmitting}
                        {...register("email")}
                        className={
                           errors.email
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                        }
                     />
                     {errors.email && (
                        <p className="text-xs text-destructive font-medium mt-1">
                           {errors.email.message}
                        </p>
                     )}
                  </div>

                  <div className="space-y-1.5">
                     <div className="flex items-center justify-between">
                        <Label
                           htmlFor="password"
                           className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                           Password
                        </Label>
                     </div>
                     <div className="relative">
                        <Input
                           id="password"
                           type={showPassword ? "text" : "password"}
                           placeholder="••••••••"
                           autoComplete="current-password"
                           disabled={isSubmitting}
                           {...register("password")}
                           className={
                              errors.password
                                 ? "border-destructive focus-visible:ring-destructive pr-10"
                                 : "pr-10"
                           }
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword((prev) => !prev)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                           tabIndex={-1}
                        >
                           {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                           ) : (
                              <Eye className="h-4 w-4" />
                           )}
                        </button>
                     </div>
                     {errors.password && (
                        <p className="text-xs text-destructive font-medium mt-1">
                           {errors.password.message}
                        </p>
                     )}
                  </div>

                  <Button
                     type="submit"
                     disabled={isSubmitting || isDemoLoading}
                     className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
                           Signing in...
                        </>
                     ) : (
                        "Sign in"
                     )}
                  </Button>

                  <div className="relative my-4">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                     </div>
                     <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground font-semibold">
                           or reviewer quick access
                        </span>
                     </div>
                  </div>

                  <Button
                     type="button"
                     variant="outline"
                     onClick={handleDemoSignIn}
                     disabled={isSubmitting || isDemoLoading}
                     className="w-full border-border/80 hover:bg-accent font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                     {isDemoLoading ? (
                        <>
                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
                           Accessing demo...
                        </>
                     ) : (
                        "🚀 1-Click Demo Login (Tanay Pratap)"
                     )}
                  </Button>
               </form>

               <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                     Don't have an account?{" "}
                     <Link
                        to="/signup"
                        className="font-semibold text-primary hover:underline transition-colors"
                     >
                        Create an account
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};
