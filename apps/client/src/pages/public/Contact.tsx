// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Contact & Directions Page (Phase 7)
// =============================================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Navigation,
  User,
} from "lucide-react";
import { COLLEGE_NAME, COLLEGE_ADDRESS } from "@srusti/shared";
import { useCreateInquiry } from "../../hooks/useInquiry";
import { useToast } from "../../hooks/useToast";
import parseApiError from "../../utils/apiError";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  phone: z.string().trim().min(7, "Phone number must be at least 7 digits").max(20),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(1000),
});

type ContactFormInput = z.infer<typeof contactFormSchema>;

export const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const createInquiryMutation = useCreateInquiry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormInput) => {
    setSubmissionError(null);
    try {
      await createInquiryMutation.mutateAsync({
        ...data,
        type: "CONTACT",
        source: "WEBSITE_CONTACT_PAGE",
      });

      setIsSubmitted(true);
      toast.success("Thank you. Your message has been routed to the administration desk.");
      reset();
    } catch (err: unknown) {
      const parsed = parseApiError(err, "Failed to deliver message. Please try again.");
      setSubmissionError(parsed.message);
      toast.error(parsed.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16 pb-20">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span>Connect With Campus</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Visit our campus in Chandaka Industrial Estate, or submit an inquiry to our administrative coordinators.
        </p>
      </div>

      {/* 2. Contact Details & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 5 Cols: Campus Details */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="glass" className="p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Administrative Office
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block uppercase tracking-wider">
                    Campus Address
                  </span>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    {COLLEGE_ADDRESS}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-800">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block uppercase tracking-wider">
                    Telephone Numbers
                  </span>
                  <p className="text-slate-300 mt-1 font-mono">
                    +91 674 2744404 / 2744405
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-800">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block uppercase tracking-wider">
                    Electronic Mail
                  </span>
                  <p className="text-slate-300 mt-1">
                    info@srusti.ac.in &bull; admissions@srusti.ac.in
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-800">
                <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white block uppercase tracking-wider">
                    Office Hours
                  </span>
                  <p className="text-slate-300 mt-1">
                    Monday &ndash; Saturday: 09:30 AM &ndash; 05:30 PM
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Location Landmark Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400">
            <span className="font-bold text-white block text-sm">How to Reach</span>
            <p className="leading-relaxed">
              Situated in the Patia Infocity vicinity, within easy reach of KIIT Square, Bhubaneswar Railway Station (14 km), and Biju Patnaik International Airport (16 km).
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Contact Message Form */}
        <div className="lg:col-span-7">
          <Card variant="glass" className="p-6 sm:p-8 shadow-2xl border-blue-500/20">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-xl">Send an Administrative Inquiry</CardTitle>
              <CardDescription>
                We usually respond within one business working day.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Delivered</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Your inquiry has been submitted. Our institutional liaison desk will review your details.
                  </p>
                  <div className="pt-4">
                    <Button variant="secondary" size="sm" onClick={() => setIsSubmitted(false)}>
                      Send Another Message
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
                    label="Your Name *"
                    placeholder="Enter full name"
                    disabled={isSubmitting}
                    error={errors.name?.message}
                    leftIcon={<User className="w-4 h-4" />}
                    {...register("name")}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="name@example.com"
                      disabled={isSubmitting}
                      error={errors.email?.message}
                      leftIcon={<Mail className="w-4 h-4" />}
                      {...register("email")}
                    />

                    <Input
                      label="Contact Number *"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      disabled={isSubmitting}
                      error={errors.phone?.message}
                      leftIcon={<Phone className="w-4 h-4" />}
                      {...register("phone")}
                    />
                  </div>

                  <Textarea
                    label="Message or Inquiry Details *"
                    rows={5}
                    placeholder="Provide details regarding your communication, academic questions, or campus visit request..."
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
                    Transmit Message
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

export default ContactPage;
