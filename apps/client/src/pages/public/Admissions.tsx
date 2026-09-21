// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Admissions & Inquiry Page (Phase 7)
// =============================================================================

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GraduationCap,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calendar,
  Compass,
  Phone,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";
import { useCreateInquiry } from "../../hooks/useInquiry";
import { useCourses } from "../../hooks/useCourses";
import { useToast } from "../../hooks/useToast";
import parseApiError from "../../utils/apiError";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";

const admissionInquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  phone: z.string().trim().min(7, "Phone number must be at least 7 digits").max(20),
  courseOfInterest: z.string().trim().min(1, "Please select a course of interest"),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(1000),
});

type AdmissionInquiryInput = z.infer<typeof admissionInquirySchema>;

export const AdmissionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledCourse = searchParams.get("course") || "";
  const { toast } = useToast();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const { data: coursesData } = useCourses();
  const createInquiryMutation = useCreateInquiry();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionInquiryInput>({
    resolver: zodResolver(admissionInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      courseOfInterest: prefilledCourse,
      message: "I would like to inquire about the admission eligibility, dates, and fee structure.",
    },
  });

  useEffect(() => {
    if (prefilledCourse) {
      setValue("courseOfInterest", prefilledCourse);
    }
  }, [prefilledCourse, setValue]);

  const onSubmit = async (data: AdmissionInquiryInput) => {
    setSubmissionError(null);
    try {
      await createInquiryMutation.mutateAsync({
        ...data,
        type: "ADMISSION",
        source: "WEBSITE_ADMISSIONS_PAGE",
      });

      setIsSubmitted(true);
      toast.success("Your admission inquiry has been received. Our counselor will contact you shortly.");
      reset();
    } catch (err: unknown) {
      const parsed = parseApiError(err, "Failed to submit admission inquiry. Please try again.");
      setSubmissionError(parsed.message);
      toast.error(parsed.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16 pb-20">
      {/* 1. Admissions Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Admissions 2025&ndash;2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Shape Your Academic Future
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Explore admission procedures, qualification standards, and submit an inquiry directly to the Academic Counselor desk.
        </p>
      </div>

      {/* 2. Process & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 6 Cols: Application Steps & Requirements */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Pathway
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Admission Procedure
            </h2>
            <p className="text-xs text-slate-400 mt-1.5">
              Standard 4-step walkthrough for entrance and direct enrollment.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs border border-blue-500/30">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Check Eligibility</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Verify minimal marks in qualifying degree examinations (10+2 for UG, graduation for MCA/MBA).
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs border border-amber-500/30">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Submit Inquiry &amp; Form</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Submit the online admission inquiry or visit the campus admission desk in Patia, Bhubaneswar.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center shrink-0 text-xs border border-purple-500/30">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Counseling &amp; Verification</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Present academic credentials and certificates for verification with the admission committee.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs border border-emerald-500/30">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Enrollment Confirmation</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Complete registration formalities, institutional documentation, and fee payment.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
            <h5 className="font-bold text-white">Notice on Official Standards</h5>
            <p className="leading-relaxed">
              Please contact the admissions office directly for current batch eligibility, state counseling cutoff ranks, and specific registration deadlines.
            </p>
          </div>
        </div>

        {/* Right 6 Cols: Admission Inquiry Form */}
        <div className="lg:col-span-6">
          <Card variant="glass" className="p-6 sm:p-8 border-blue-500/30 shadow-2xl">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-xl">Admission Inquiry Form</CardTitle>
              <CardDescription>
                Submit your inquiry directly to our Admissions Counselor team.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Inquiry Submitted!</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Thank you for your interest in Srusti Academy. Our academic admissions coordinator will review your inquiry and connect via email/phone.
                  </p>
                  <div className="pt-4">
                    <Button variant="secondary" size="sm" onClick={() => setIsSubmitted(false)}>
                      Submit Another Inquiry
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  {submissionError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{submissionError}</span>
                    </div>
                  )}

                  <Input
                    label="Full Name *"
                    placeholder="Enter your complete legal name"
                    disabled={isSubmitting}
                    error={errors.name?.message}
                    leftIcon={<User className="w-4 h-4" />}
                    {...register("name")}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                      error={errors.email?.message}
                      leftIcon={<Mail className="w-4 h-4" />}
                      {...register("email")}
                    />

                    <Input
                      label="Phone / Mobile Number *"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      disabled={isSubmitting}
                      error={errors.phone?.message}
                      leftIcon={<Phone className="w-4 h-4" />}
                      {...register("phone")}
                    />
                  </div>

                  <Select
                    label="Program of Interest *"
                    disabled={isSubmitting}
                    error={errors.courseOfInterest?.message}
                    {...register("courseOfInterest")}
                  >
                    <option value="">-- Select Academic Program --</option>
                    {coursesData?.data?.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.code || c.slug.toUpperCase()})
                      </option>
                    ))}
                    {!coursesData?.data && (
                      <>
                        <option value="Master of Computer Applications">Master of Computer Applications (MCA)</option>
                        <option value="Master of Business Administration">Master of Business Administration (MBA)</option>
                        <option value="Bachelor of Computer Applications">Bachelor of Computer Applications (BCA)</option>
                        <option value="Bachelor of Business Administration">Bachelor of Business Administration (BBA)</option>
                        <option value="Bachelor of Commerce">Bachelor of Commerce (B.Com)</option>
                      </>
                    )}
                  </Select>

                  <Textarea
                    label="Questions or Message *"
                    rows={4}
                    placeholder="Ask about eligibility, fee installment options, or entrance examination requirements..."
                    disabled={isSubmitting}
                    error={errors.message?.message}
                    {...register("message")}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full mt-2"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Admission Inquiry
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsPage;
