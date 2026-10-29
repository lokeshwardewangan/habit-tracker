import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema, type SignupFormValues } from "@/schemas/auth.schema";

export const SignupPage = () => {
   const { signup } = useAuth();
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
   const [serverError, setServerError] = useState<string | null>(null);

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         firstName: "",
         lastName: "",
         email: "",
         password: "",
      },
   });

   const onSubmit = async (values: SignupFormValues) => {
      setServerError(null);
      try {
         await signup(values);
         toast.success("Account created successfully! Welcome aboard.");
         navigate("/home", { replace: true });
      } catch (err: unknown) {
         const errorObj = err as {
            message?: string;
            details?: Record<string, string>;
         };
         const message =
            errorObj.message || "Failed to create account. Please try again.";
         setServerError(message);
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
                  HabitPulse
               </Link>
            </div>

            <div className="text-center px-4 sm:px-0">
               <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Create your account
               </h2>
               <p className="mt-2 text-sm text-muted-foreground">
                  Get started with habit tracking, streaks, and mindful
                  consistency.
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

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1.5">
                        <Label
                           htmlFor="firstName"
                           className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                           First Name
                        </Label>
                        <Input
                           id="firstName"
                           type="text"
                           placeholder="Tanay"
                           disabled={isSubmitting}
                           {...register("firstName")}
                           className={
                              errors.firstName
                                 ? "border-destructive focus-visible:ring-destructive"
                                 : ""
                           }
                        />
                        {errors.firstName && (
                           <p className="text-xs text-destructive font-medium mt-1">
                              {errors.firstName.message}
                           </p>
                        )}
                     </div>

                     <div className="space-y-1.5">
                        <Label
                           htmlFor="lastName"
                           className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                           Last Name
                        </Label>
                        <Input
                           id="lastName"
                           type="text"
                           placeholder="Pratap"
                           disabled={isSubmitting}
                           {...register("lastName")}
                           className={
                              errors.lastName
                                 ? "border-destructive focus-visible:ring-destructive"
                                 : ""
                           }
                        />
                        {errors.lastName && (
                           <p className="text-xs text-destructive font-medium mt-1">
                              {errors.lastName.message}
                           </p>
                        )}
                     </div>
                  </div>

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
                     <Label
                        htmlFor="password"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                     >
                        Password (min 6 characters)
                     </Label>
                     <div className="relative">
                        <Input
                           id="password"
                           type={showPassword ? "text" : "password"}
                           placeholder="••••••••"
                           autoComplete="new-password"
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
                     disabled={isSubmitting}
                     className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl shadow-xs transition-all cursor-pointer mt-2"
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
                           Creating account...
                        </>
                     ) : (
                        "Create Account"
                     )}
                  </Button>
               </form>

               <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                     Already have an account?{" "}
                     <Link
                        to="/login"
                        className="font-semibold text-primary hover:underline transition-colors"
                     >
                        Sign in
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};
