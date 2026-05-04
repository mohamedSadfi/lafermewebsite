import { useId, useState } from "react";
import {
  inquirySchema,
  inquiryTypes,
  INQUIRY_LABELS,
  type InquiryInput,
  type InquiryType,
} from "~/lib/inquiry-schema";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

const today = () => new Date().toISOString().slice(0, 10);

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
}

function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
  className = "",
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-leaf"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-accent">{error}</p>
      ) : hint ? (
        <p className="text-xs italic text-ink-soft/70">{hint}</p>
      ) : null}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full bg-transparent border-0 border-b ${
    hasError ? "border-accent" : "border-ink/20"
  } px-0 py-2 text-base text-ink placeholder:text-ink-soft/50 focus:border-primary focus:outline-none focus:ring-0 transition-colors`;

export default function InquiryForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [topError, setTopError] = useState<string>("");
  const [inquiryType, setInquiryType] = useState<InquiryType>("evenement");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setErrors({});
    setTopError("");

    const fd = new FormData(e.currentTarget);
    const candidate = {
      nom: String(fd.get("nom") ?? ""),
      prenom: String(fd.get("prenom") ?? ""),
      telephone: String(fd.get("telephone") ?? ""),
      email: String(fd.get("email") ?? ""),
      inquiryType: String(fd.get("inquiryType") ?? ""),
      preferredDate: String(fd.get("preferredDate") ?? ""),
      guestCount: String(fd.get("guestCount") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const parsed = inquirySchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const flat: FieldErrors = {};
      for (const [k, v] of Object.entries(fieldErrors)) {
        if (v && v[0]) flat[k as keyof InquiryInput] = v[0];
      }
      setErrors(flat);
      setTopError("Merci de corriger les champs en rouge.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        if (json.error === "validation") {
          setTopError("Données invalides — merci de vérifier.");
        } else {
          setTopError(
            "Une erreur est survenue. Merci de nous appeler ou de réessayer.",
          );
        }
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setTopError(
        "Connexion impossible. Merci de réessayer dans un instant.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-leaf/30 bg-leaf/5 p-8 md:p-10">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-bg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="font-serif text-2xl text-ink">
            Demande bien reçue.
          </h3>
        </div>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          Merci ! Nous revenons vers vous très rapidement par téléphone
          ou par e-mail. Pour toute urgence, vous pouvez nous joindre
          directement au{" "}
          <a className="text-primary underline" href="tel:+21629643008">
            +216 29 643 008
          </a>
          .
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";
  const showDateAndCount =
    inquiryType === "evenement" || inquiryType === "grand-groupe";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-10"
      aria-busy={submitting}
    >
      {topError ? (
        <div
          role="alert"
          className="rounded-sm border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-accent"
        >
          {topError}
        </div>
      ) : null}

      <fieldset className="space-y-6" disabled={submitting}>
        <legend className="eyebrow mb-2">Type de demande</legend>
        <div className="flex flex-wrap gap-3">
          {inquiryTypes.map((value) => {
            const checked = inquiryType === value;
            return (
              <label
                key={value}
                htmlFor={`${id}-type-${value}`}
                className={`relative cursor-pointer rounded-full border px-5 py-2.5 font-serif text-base leading-none transition-colors ${
                  checked
                    ? "border-primary bg-primary text-bg"
                    : "border-ink/20 text-ink hover:border-ink/40"
                }`}
              >
                <input
                  id={`${id}-type-${value}`}
                  type="radio"
                  name="inquiryType"
                  value={value}
                  checked={checked}
                  onChange={() => setInquiryType(value)}
                  className="sr-only"
                />
                {INQUIRY_LABELS[value]}
              </label>
            );
          })}
        </div>
        {errors.inquiryType ? (
          <p className="text-xs text-accent">{errors.inquiryType}</p>
        ) : null}
      </fieldset>

      <fieldset className="space-y-6" disabled={submitting}>
        <legend className="eyebrow mb-2">Vous</legend>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <Field
            htmlFor={`${id}-prenom`}
            label="Prénom"
            error={errors.prenom}
          >
            <input
              id={`${id}-prenom`}
              name="prenom"
              type="text"
              required
              autoComplete="given-name"
              className={inputClass(!!errors.prenom)}
            />
          </Field>
          <Field htmlFor={`${id}-nom`} label="Nom" error={errors.nom}>
            <input
              id={`${id}-nom`}
              name="nom"
              type="text"
              required
              autoComplete="family-name"
              className={inputClass(!!errors.nom)}
            />
          </Field>
          <Field
            htmlFor={`${id}-tel`}
            label="Téléphone"
            error={errors.telephone}
          >
            <input
              id={`${id}-tel`}
              name="telephone"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="+216…"
              className={inputClass(!!errors.telephone)}
            />
          </Field>
          <Field
            htmlFor={`${id}-email`}
            label="E-mail"
            hint="Optionnel"
            error={errors.email}
          >
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              className={inputClass(!!errors.email)}
            />
          </Field>
        </div>
      </fieldset>

      {showDateAndCount ? (
        <fieldset className="space-y-6" disabled={submitting}>
          <legend className="eyebrow mb-2">Détails</legend>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <Field
              htmlFor={`${id}-date`}
              label="Date envisagée"
              hint="Optionnel — nous en discuterons ensemble"
              error={errors.preferredDate}
            >
              <input
                id={`${id}-date`}
                name="preferredDate"
                type="date"
                min={today()}
                className={inputClass(!!errors.preferredDate)}
              />
            </Field>
            <Field
              htmlFor={`${id}-count`}
              label="Nombre de personnes"
              hint="Approximatif"
              error={errors.guestCount}
            >
              <input
                id={`${id}-count`}
                name="guestCount"
                type="number"
                min={1}
                max={2000}
                inputMode="numeric"
                placeholder="ex. 40"
                className={inputClass(!!errors.guestCount)}
              />
            </Field>
          </div>
        </fieldset>
      ) : null}

      <fieldset className="space-y-6" disabled={submitting}>
        <legend className="eyebrow mb-2">Votre message</legend>
        <Field
          htmlFor={`${id}-message`}
          label="Décrivez votre projet ou votre demande"
          hint="1500 caractères maximum"
          error={errors.message}
        >
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={1500}
            className={`${inputClass(!!errors.message)} resize-y border-b py-3`}
          />
        </Field>
      </fieldset>

      {/* Honeypot — visually hidden */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        tabIndex={-1}
      >
        <label htmlFor={`${id}-website`}>Site web</label>
        <input
          id={`${id}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col items-start gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs italic text-ink-soft">
          Pour réserver une simple table, appelez-nous directement —
          ce formulaire est dédié aux événements et aux demandes
          spéciales.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm uppercase tracking-wider text-bg transition-colors hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                className="animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="42"
                  strokeLinecap="round"
                />
              </svg>
              Envoi…
            </>
          ) : (
            "Envoyer ma demande"
          )}
        </button>
      </div>
    </form>
  );
}
