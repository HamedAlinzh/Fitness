/**
 * Renders the counting pixel (see src/app/px/route.ts). A plain `<img>` on purpose: the
 * browser fetches it with no JavaScript involved, so visits from someone whose JS is
 * blocked or still loading are counted like everyone else's, and the surrounding page
 * stays statically renderable.
 *
 * `referrerPolicy="same-origin"` guarantees the full path of the current page reaches
 * our own server (and nothing reaches anyone else's) regardless of the browser's default.
 */
export default function ViewPixel() {
  return (
    /* A tracking pixel must not be optimised, resized or served from the image cache —
       next/image would do all three, and the last one would stop it counting at all. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/px"
      alt=""
      width={1}
      height={1}
      aria-hidden="true"
      referrerPolicy="same-origin"
      // Not `hidden` / `display:none`: some browsers skip fetching images that are never
      // laid out. It stays a real 1px box, just an invisible, untouchable one.
      className="pointer-events-none fixed bottom-0 left-0 -z-50 h-px w-px opacity-0"
    />
  );
}
