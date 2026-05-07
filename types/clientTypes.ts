/* eslint-disable @typescript-eslint/no-explicit-any */
// types/clientTypes.ts
import { z } from "zod";

export interface ClientResponse {
  status: boolean;
  data: {
    total: number;
    active: number;
    inactive: number;
    client_data: ClientListItem[];
  };
}
export interface ClientStaff {
  id: number;
  client_id: string;
  employee_id: string;
  sstatus: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ClientContact {
  id: number;
  client_id: string;
  name: string;
  email: string;
  phone: string;
  sstatus: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ClientListItem {
  id: number;
  user_id: string;
  name: string;
  email: string;
  address: string;
  location: string;
  service: string;
  // staff_number: string;
  // start_date: string;
  // end_date: string;
  is_active: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  staff: ClientStaff[];
  contact: ClientContact[];
}

export interface EscalationReply {
  id: number;
  complaint_id: string;
  user_id: string;
  message: string;
  attachment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Escalation {
  id: number;
  complaint_from: string;
  client_id: string;
  complaint_against: string;
  title: string;
  complaint_date: string;
  description: string;
  attachment: string | null;
  status: string;
  priority: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  replies: EscalationReply[];
}

export interface AccountOfficer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Branch {
  id: number;
  client_id: string;
  name: string;
  address: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientDetailsFullResponse {
  status: boolean;
  data: {
    details: ClientDetail;
    documents: ClientDocument[];
    deployment: any[];
    services: Service[];
    escalation: Escalation[];
    account_officer?: AccountOfficer[];
    branches?: Branch[];
  };
}

export interface ClientLocation {
  id: number;
  name: string;
  client_id: string | null;
  location: string | null;
  is_active: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ClientDetail {
  id: number;
  user_id: string;
  name: string;
  email: string;
  address: string;
  location: ClientLocation | string | null;
  service: string;
  logo: string | null;
  is_active: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ClientDocument {
  id: number;
  client_id: string;
  document_type: string;
  document_value: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  user_id: string;
  client_id: string;
  service_name: string;
  plan_type: string | null;
  start_date: string;
  end_date: string;
  next_payment_date: string;
  amount: string;
  currency: string;
  billing_cycle: string;
  staff_count: string;
  equipment_count: string;
  status: string;
  notes: string | null;
  invoice_url: string | null;
  auto_renew: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ── Create / Update client form ───────────────────────────────────

export const contactPersonSchema = z.object({
  contact_name: z.string().min(1, "Name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().min(1, "Phone number is required"),
});

export const addClientSchema = z.object({
  name: z.string().min(1, "Client/Company name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().optional(),

  location: z.string().min(1, "Location is required"), // ✅ just this

  service: z
    .string()
    .min(1, "Service requirement is required")
    .transform((val) => {
      const found = SERVICE_REQUIREMENTS.find(
        (s) => s.toLowerCase() === val.toLowerCase().trim(),
      );
      return found || val;
    })
    .refine(
      (val) =>
        SERVICE_REQUIREMENTS.some((s) => s.toLowerCase() === val.toLowerCase()),
      { message: "Please select a valid service" },
    ),

  Logo: z.string().nullable().optional(),
  sla: z.string().nullable().optional(),
  sop: z.string().nullable().optional(),

  contact_person: z
    .array(contactPersonSchema)
    .min(1, "At least one contact is required"),

  // staff_number: z
  //   .string()
  //   .regex(/^\d+$/, "Must be a valid number")
  //   .min(1, "Number of staff is required")
  //   .transform((val) => val.trim()),

  // start_date: z.string().min(1, "Start date is required"),
  // end_date: z.string().min(1, "End date is required"),
});

export type AddClientFormValues = z.infer<typeof addClientSchema>;
export type ContactPerson = z.infer<typeof contactPersonSchema>;

export interface ApiCreateClientResponse {
  status: boolean;
  message: string;
  data?: any;
}

export type AddClientResult =
  | { success: true; message: string; data?: any }
  | { success: false; error: string };

// ── Constants ──────────────────────────────────────────────────────

export interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LOCATIONS = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Ibadan",
  "Kaduna",
  "Benin City",
] as const;

export const SERVICE_REQUIREMENTS = [
  "Man Guarding",
  "Journey Management",
  "Telecommunication",
  "Security",
] as const;

// export const STAFF_NUMBERS = [
//   "5",
//   "10",
//   "15",
//   "20",
//   "25",
//   "30",
//   "40",
//   "50",
//   "100",
// ] as const;

export function formatDateForAPI(date: Date | null): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
