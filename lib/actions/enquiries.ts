"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  quoteRequestSchema,
  subscriptionSchema,
  outgrowerApplicationSchema,
  jobApplicationSchema,
  labSampleSchema,
  contactSchema,
} from "@/lib/validations/enquiry";
import { generateLabReference } from "@/lib/orders/reference";

export type EnquiryActionState = { error?: string } | null;

export async function submitQuoteRequestAction(
  _prevState: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const parsed = quoteRequestSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    company: formData.get("company"),
    requestType: formData.get("requestType"),
    productOrService: formData.get("productOrService"),
    quantity: formData.get("quantity"),
    timeline: formData.get("timeline"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    company: parsed.data.company || null,
    request_type: parsed.data.requestType,
    product_or_service: parsed.data.productOrService || null,
    quantity: parsed.data.quantity || null,
    timeline: parsed.data.timeline || null,
    notes: parsed.data.notes || null,
  });
  if (error) return { error: "Could not submit your request. Please try again." };

  redirect(`/enquiry-success?type=quote&topic=${encodeURIComponent(parsed.data.productOrService || parsed.data.requestType)}`);
}

export async function submitSubscriptionAction(
  _prevState: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const parsed = subscriptionSchema.safeParse({
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    plan: formData.get("plan"),
    item: formData.get("item"),
    quantity: formData.get("quantity"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const supabase = await createClient();
  const { error } = await supabase.from("subscriptions").insert({
    customer_name: parsed.data.customerName,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    plan: parsed.data.plan,
    item: parsed.data.item,
    quantity: parsed.data.quantity,
    notes: parsed.data.notes || null,
  });
  if (error) return { error: "Could not submit your subscription. Please try again." };

  redirect(`/enquiry-success?type=subscription&topic=${encodeURIComponent(parsed.data.item)}`);
}

export async function submitOutgrowerApplicationAction(
  _prevState: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const parsed = outgrowerApplicationSchema.safeParse({
    farmerName: formData.get("farmerName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    location: formData.get("location"),
    crop: formData.get("crop"),
    landSize: formData.get("landSize"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const supabase = await createClient();
  const { error } = await supabase.from("outgrower_applications").insert({
    farmer_name: parsed.data.farmerName,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    location: parsed.data.location,
    crop: parsed.data.crop,
    land_size: parsed.data.landSize || null,
    notes: parsed.data.notes || null,
  });
  if (error) return { error: "Could not submit your application. Please try again." };

  redirect(`/enquiry-success?type=outgrower&topic=${encodeURIComponent(parsed.data.crop)}`);
}

export async function submitJobApplicationAction(
  _prevState: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const parsed = jobApplicationSchema.safeParse({
    openingId: formData.get("openingId"),
    applicantName: formData.get("applicantName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    coverNote: formData.get("coverNote"),
    cvUrl: formData.get("cvUrl"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const supabase = await createClient();
  const { error } = await supabase.from("job_applications").insert({
    opening_id: parsed.data.openingId || null,
    applicant_name: parsed.data.applicantName,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    cover_note: parsed.data.coverNote || null,
    cv_url: parsed.data.cvUrl || null,
  });
  if (error) return { error: "Could not submit your application. Please try again." };

  redirect(`/enquiry-success?type=job&topic=${encodeURIComponent("your application")}`);
}

export async function submitLabSampleAction(
  _prevState: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const parsed = labSampleSchema.safeParse({
    clientName: formData.get("clientName"),
    clientPhone: formData.get("clientPhone"),
    clientEmail: formData.get("clientEmail"),
    sampleType: formData.get("sampleType"),
    tests: formData.get("tests"),
    notes: formData.get("notes"),
    attachmentUrl: formData.get("attachmentUrl"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const reference = generateLabReference();
  const supabase = await createClient();
  const { error } = await supabase.from("lab_samples").insert({
    reference,
    client_name: parsed.data.clientName,
    client_phone: parsed.data.clientPhone,
    client_email: parsed.data.clientEmail || null,
    sample_type: parsed.data.sampleType,
    tests: parsed.data.tests.split(",").map((t) => t.trim()).filter(Boolean),
    notes: (parsed.data.notes || "") + (parsed.data.attachmentUrl ? `\nAttachment: ${parsed.data.attachmentUrl}` : ""),
  });
  if (error) return { error: "Could not submit your sample. Please try again." };

  redirect(`/enquiry-success?type=lab&ref=${reference}`);
}

export async function submitContactAction(
  _prevState: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").insert({
    name: parsed.data.name,
    phone: parsed.data.phone || "N/A",
    email: parsed.data.email,
    request_type: "general",
    notes: parsed.data.message,
  });
  if (error) return { error: "Could not send your message. Please try again." };

  redirect(`/enquiry-success?type=contact`);
}
