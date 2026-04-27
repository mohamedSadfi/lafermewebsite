/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly MAILGUN_API_KEY: string;
  readonly MAILGUN_DOMAIN: string;
  readonly MAILGUN_REGION: "us" | "eu";
  readonly MAILGUN_FROM: string;
  readonly MAILGUN_TO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
