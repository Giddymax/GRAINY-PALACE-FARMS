import { z } from "zod";

const phone = z.string().trim().min(9, "Enter a valid phone number.");
const name = z.string().trim().min(2, "Enter your name.");
const optionalEmail = z.string().trim().email("Enter a valid email address.").optional().or(z.literal(""));

export const quoteRequestSchema = z.object({
  name,
  phone,
  email: optionalEmail,
  company: z.string().trim().optional().or(z.literal("")),
  requestType: z.enum(["wholesale", "bulk", "lab_service", "general"]),
  productOrService: z.string().trim().optional().or(z.literal("")),
  quantity: z.string().trim().optional().or(z.literal("")),
  timeline: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const subscriptionSchema = z.object({
  customerName: name,
  phone,
  email: optionalEmail,
  plan: z.enum(["weekly", "monthly"]),
  item: z.string().trim().min(1, "Choose a subscription item."),
  quantity: z.coerce.number().int().min(1).max(100),
  notes: z.string().trim().optional().or(z.literal("")),
});

export const outgrowerApplicationSchema = z.object({
  farmerName: name,
  phone,
  email: optionalEmail,
  location: z.string().trim().min(2, "Enter your farm location."),
  crop: z.string().trim().min(2, "Enter the crop you grow."),
  landSize: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const jobApplicationSchema = z.object({
  openingId: z.string().uuid().optional().or(z.literal("")),
  applicantName: name,
  phone,
  email: optionalEmail,
  coverNote: z.string().trim().max(2000).optional().or(z.literal("")),
  cvUrl: z.string().trim().optional().or(z.literal("")),
});

export const labSampleSchema = z.object({
  clientName: name,
  clientPhone: phone,
  clientEmail: optionalEmail,
  sampleType: z.string().trim().min(2, "Select a sample type."),
  tests: z.string().trim().min(1, "Select at least one test."),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  attachmentUrl: z.string().trim().optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name,
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)."),
});
