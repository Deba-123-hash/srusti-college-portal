// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Forgot Password Page Component
// =============================================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordSchema, ForgotPasswordInput } from "@srusti/shared";
import { api } from "../../lib/api";
import { Mail, ArrowLeft, KeyRound, AlertCircle, Loader2 } from "lucide-react";

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setApiError(null);
    try {
      await api.post("/auth/forgot-password", data);
      // Navigate to OTP verification screen with email prefilled
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message ||
        "An unexpected error occurred. Please try again later.";
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 shadow-xl shadow-amber-950/30">
          <KeyRound className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Reset Your Password
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter your registered institutional email to receive a 6-digit verification code.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          {apiError && (
            <div
              className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300 flex items-start gap-3"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Request Failed</p>
                <p className="mt-0.5 text-rose-200/80">{apiError}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Institutional Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  {...register("email")}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.email ? "border-rose-500/80" : "border-slate-800 focus:border-blue-500"
                  }`}
                  placeholder="name@srusti.ac.in"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>
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
                    Generating Verification Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
