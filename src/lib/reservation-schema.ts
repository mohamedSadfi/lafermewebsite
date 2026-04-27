import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

const todayUTC = () => new Date(new Date().toISOString().slice(0, 10));

const minutesFromTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const MEAL_WINDOWS = {
  brunch: { open: 8 * 60, close: 12 * 60 },
  dejeuner: { open: 12 * 60, close: 17 * 60 },
} as const;

export const reservationSchema = z
  .object({
    nom: z.string().trim().min(1, "Nom requis").max(100),
    prenom: z.string().trim().min(1, "Prénom requis").max(100),
    telephone: z
      .string()
      .trim()
      .min(6, "Numéro de téléphone requis")
      .max(30),

    // Email is optional. Empty string is normalized to undefined.
    email: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z
        .string()
        .trim()
        .email("Adresse e-mail invalide")
        .max(150)
        .optional(),
    ),

    date: z
      .string()
      .regex(dateRegex, "Date invalide")
      .refine((s) => {
        const d = new Date(`${s}T12:00:00`);
        if (Number.isNaN(d.getTime())) return false;
        return d >= todayUTC();
      }, "La date doit être aujourd'hui ou plus tard"),

    time: z.string().regex(timeRegex, "Heure invalide"),

    adultes: z.coerce
      .number()
      .int("Nombre entier requis")
      .min(1, "Au moins un adulte")
      .max(50, "Maximum 50"),

    enfants: z.coerce
      .number()
      .int("Nombre entier requis")
      .min(0)
      .max(50)
      .default(0),

    mealType: z.enum(["brunch", "dejeuner"], {
      errorMap: () => ({ message: "Choisissez Brunch ou Déjeuner" }),
    }),

    note: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.string().trim().max(500, "500 caractères maximum").optional(),
    ),

    // Honeypot — kept loose in the schema so bots that fill it still pass
    // validation; the API endpoint silently drops the request instead.
    website: z.string().optional(),
  })
  .refine(
    (d) => {
      const win = MEAL_WINDOWS[d.mealType];
      const t = minutesFromTime(d.time);
      return t >= win.open && t <= win.close;
    },
    {
      message:
        "L'heure doit correspondre à votre formule (Brunch 8h–12h ou Déjeuner 12h–17h).",
      path: ["time"],
    },
  );

export type ReservationInput = z.infer<typeof reservationSchema>;

export const MEAL_LABELS: Record<ReservationInput["mealType"], string> = {
  brunch: "Brunch",
  dejeuner: "Déjeuner",
};
