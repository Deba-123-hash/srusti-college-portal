// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// OTP Verification Page Component
// =============================================================================

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verifyOtpSchema, VerifyOtpInput } from "@srusti/shared";
import { api } from "../../lib/api";
import { ShieldCheck, Mail, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (data: VerifyOtpInput) => {
    setApiError(null);
    try {
      await api.post("/auth/verify-otp", data);
      // Navigate to reset password page with email and verified OTP prefilled
      navigate(
        `/reset-password?email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(
          data.otp
        )}`
      );
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message ||
        "Invalid or expired verification code. Please check and try again.";
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-4 shadow-xl shadow-teal-950/30">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Enter Verification Code
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          A 6-digit code has been dispatched to your institutional inbox.
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
                <p className="font-semibold">Verification Failed</p>
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

            <div>
              <label
                htmlFor="otp"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                6-Digit Verification Code
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                autoComplete="one-time-code"
                disabled={isSubmitting}
                {...register("otp")}
                className={`block w-full text-center tracking-[0.5em] font-mono text-xl py-2.5 bg-slate-950/80 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.otp ? "border-rose-500/80" : "border-slate-800 focus:border-blue-500"
                }`}
                placeholder="••••••"
              />
              {errors.otp && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.otp.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-teal-900/30 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying Code...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Re-enter Email
            </Link>
            <Link
              to="/login"
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
