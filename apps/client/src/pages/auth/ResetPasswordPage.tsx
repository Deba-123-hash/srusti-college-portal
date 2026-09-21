// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Reset Password Page Component
// =============================================================================

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordSchema, ResetPasswordInput } from "@srusti/shared";
import { api } from "../../lib/api";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const otpParam = searchParams.get("otp") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam,
      otp: otpParam,
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (emailParam) setValue("email", emailParam);
    if (otpParam) setValue("otp", otpParam);
  }, [emailParam, otpParam, setValue]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setApiError(null);
    try {
      await api.post("/auth/reset-password", data);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message ||
        "Failed to reset password. Please check your verification code and password requirements.";
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-4 shadow-xl shadow-blue-950/30">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Set New Password
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Create a strong password with at least 8 characters, uppercase, lowercase, numbers, and symbols.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Password Reset Successful</h3>
              <p className="mt-2 text-xs text-slate-400">
                Your password has been securely updated. Redirecting you to the sign in page...
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 transition"
                >
                  Sign In Now
                </Link>
              </div>
            </div>
          ) : (
            <>
              {apiError && (
                <div
                  className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300 flex items-start gap-3"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Reset Failed</p>
                    <p className="mt-0.5 text-rose-200/80">{apiError}</p>
                  </div>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
                  >
                    Institutional Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled={isSubmitting}
                    {...register("email")}
                    className={`block w-full px-3.5 py-2.5 bg-slate-950/80 border rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.email ? "border-rose-500/80" : "border-slate-800 focus:border-blue-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="otp"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
                  >
                    6-Digit Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    disabled={isSubmitting}
                    {...register("otp")}
                    className={`block w-full px-3.5 py-2.5 bg-slate-950/80 border rounded-xl text-sm font-mono tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.otp ? "border-rose-500/80" : "border-slate-800 focus:border-blue-500"
                    }`}
                  />
                  {errors.otp && (
                    <p className="mt-1 text-xs text-rose-400">{errors.otp.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      {...register("newPassword")}
                      className={`block w-full pl-3.5 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        errors.newPassword ? "border-rose-500/80" : "border-slate-800 focus:border-blue-500"
                      }`}
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-rose-400">{errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      {...register("confirmPassword")}
                      className={`block w-full pl-3.5 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        errors.confirmPassword
                          ? "border-rose-500/80"
                          : "border-slate-800 focus:border-blue-500"
                      }`}
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-900/30 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-slate-800 pt-5 text-center">
                <Link
                  to="/login"
                  className="text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel and Return to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
