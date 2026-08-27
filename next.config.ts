import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      /**
       * Server Action request bodies are capped at 1MB by default — and a body that
       * exceeds the cap is rejected *before* the action runs, so the action's own error
       * state never reaches the form and the admin panel just appears to do nothing.
       *
       * That default is below a single photo straight off a phone: an iPhone shoots
       * HEIC and Safari re-encodes it to full-resolution JPEG on upload, which lands at
       * several megabytes. The desktop/Android files that "worked" were simply smaller.
       *
       * This sits above `MAX_VIDEO_BYTES` (45MB) in `src/lib/uploads.ts` on purpose, with
       * room for multipart boundaries and field metadata on top, so an oversized file is
       * refused by our own check with a readable Persian message instead of vanishing
       * into a platform-level rejection. The gallery accepts video, which is what makes
       * the figure this large; images are still capped at `MAX_UPLOAD_BYTES` (5MB).
       *
       * The limit is global, and two Server Actions are public (`submitLead`,
       * `submitTestimonial`). `src/proxy.ts` therefore caps request bodies on the public
       * pages separately, so raising this for the admin gallery does not hand anonymous
       * visitors a 50MB write.
       *
       * If a reverse proxy is ever put in front of this app, its own body limit has to be
       * raised to match (nginx's `client_max_body_size` also defaults to 1MB and fails
       * exactly as silently).
       */
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
