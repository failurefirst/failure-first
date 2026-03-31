import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://dae8d5e1210ff8aeb35006a7d443415f@o4510818923053056.ingest.de.sentry.io/4511138848505936",
  sendDefaultPii: true,
});
