import { z } from "zod";

/**
 * Inquiry form — replaces the old reservation form.
 * Reservations are now taken by phone; this form collects requests
 * for events, large groups, wholesale orders, and other questions.
 */

export const inquiryTypes = [
  "evenement",
  "grand-groupe",
  "commande-gros",
  "autre",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

export const INQUIRY_LABELS: Record<InquiryType, string> = {
  evenement: "Événement privé",
  "grand-groupe": "Grand groupe (10+ personnes)",
  "commande-gros": "Commande en gros",
  autre: "Autre",
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const inquirySchema = z.object({
  nom: z.string().trim().min(1, "Nom requis").max(100),
  prenom: z.string().trim().min(1, "Prénom requis").max(100),

  telephone: z
    .string()
    .trim()
    .min(6, "Numéro de téléphone requis")
    .max(30),

  email: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z
      .string()
      .trim()
      .email("Adresse e-mail invalide")
      .max(150)
      .optional(),
  ),

  inquiryType: z.enum(inquiryTypes, {
    errorMap: () => ({ message: "Choisissez un type de demande" }),
  }),

  // Optional — events/groups may have a target date, wholesale usually doesn't.
  preferredDate: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().regex(dateRegex, "Date invalide").optional(),
  ),

  // Optional headcount for events/groups.
  guestCount: z.preprocess(
    (v) =>
      typeof v === "string" && v.trim() === ""
        ? undefined
        : v === undefined || v === null
          ? undefined
          : v,
    z.coerce
      .number()
      .int("Nombre entier")
      .min(1, "Au moins 1 personne")
      .max(2000, "Maximum 2000")
      .optional(),
  ),

  message: z
    .string()
    .trim()
    .min(10, "Merci d'écrire au moins 10 caractères")
    .max(1500, "1500 caractères maximum"),

  // Honeypot — kept loose; the API silently drops requests where it's filled.
  website: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
