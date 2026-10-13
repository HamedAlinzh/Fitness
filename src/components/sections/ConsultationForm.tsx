"use client";

import { useActionState, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import {
  Send,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { submitLead, type SubmitLeadState } from "@/lib/actions/submit-lead";
import {
  GOALS,
  LEVELS,
  MODES,
  DAYS_PER_WEEK,
  CHANNELS,
  type Choice,
} from "@/lib/consultation";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

/**
 * Every step stays mounted and is only hidden with CSS, so the browser's own FormData
 * carries all answers on submit — no mirroring of values into React state, and a
 * half-finished answer survives stepping back and forth.
 *
 * Stepping is native for the same reason: the current step lives in a hidden radio
 * group and the nav controls are <label for> elements, so tapping "next" advances the
 * form at first paint instead of waiting on hydration. React only layers on the
 * "you skipped a question" guard and the re-anchoring below. The selectors that do the
 * actual showing/hiding live next to `[data-wz-step]` in globals.css.
 */
const steps = [
  { name: "goal", choices: GOALS },
  { name: "level", choices: LEVELS },
  { name: "mode", choices: MODES },
  { name: "daysPerWeek", choices: DAYS_PER_WEEK },
] as const;

const TOTAL_STEPS = steps.length + 2; // + injury step + contact step
const STEP_INDEXES = Array.from({ length: TOTAL_STEPS }, (_, i) => i);
const LAST_STEP = TOTAL_STEPS - 1;

/** Must match the `#wz-N` selectors in globals.css. */
const stepId = (i: number) => `wz-${i}`;

const NAV_NEXT =
  "cursor-pointer select-none items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600 [--wz-display:inline-flex]";
const NAV_BACK =
  "cursor-pointer select-none items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600 [--wz-display:inline-flex]";

function ChoiceGroup({
  name,
  choices,
  onPick,
}: {
  name: string;
  choices: readonly Choice[];
  onPick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {choices.map((choice) => (
        <label
          key={choice.value}
          className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-red-100 px-4 py-3 text-sm transition-colors hover:bg-red-50 has-checked:border-red-400 has-checked:bg-red-50"
        >
          <input
            type="radio"
            name={name}
            value={choice.value}
            onChange={onPick}
            className="h-4 w-4 shrink-0 accent-red-500"
          />
          <span className="text-ink-700">{choice.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function ConsultationForm({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).consultation;
  const rtl = lang === "fa";
  const numberLocale = rtl ? "fa-IR" : "en-US";
  // The stored value of every choice is language-independent; only the label comes from
  // the dictionary (falling back to the Persian label the admin panel uses).
  const translate = (group: keyof typeof t.choices, choices: readonly Choice[]) =>
    choices.map((choice) => ({
      value: choice.value,
      label: (t.choices[group] as Record<string, string>)[choice.value] ?? choice.label,
    }));
  const BackIcon = rtl ? ArrowRight : ArrowLeft;
  const NextIcon = rtl ? ArrowLeft : ArrowRight;

  const [state, action, pending] = useActionState<SubmitLeadState, FormData>(
    submitLead,
    undefined
  );
  const [stepError, setStepError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Steps have different numbers of options, so the form's height changes between them
   * and the nav buttons shift under the user's finger — on a phone that reads as "the
   * next button stopped working". Re-anchoring the form to the same place on every step
   * change keeps the question and the buttons where the user last saw them.
   */
  function reanchor() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * Enhancement only: blocks "next" until the current question has an answer.
   * `preventDefault` stops the <label> from flipping the step radio. Before hydration
   * there is no guard and a visitor can skip ahead, which is why `submitLead`
   * re-validates every answer server-side anyway.
   */
  function guardNext(event: MouseEvent<HTMLLabelElement>, from: number) {
    const field = steps[from]?.name;
    if (
      field &&
      !formRef.current?.querySelector(`input[name="${field}"]:checked`)
    ) {
      event.preventDefault();
      setStepError(t.pickOne);
      return;
    }
    setStepError(null);
    reanchor();
  }

  function goBack() {
    setStepError(null);
    reanchor();
  }

  /** A <label> isn't natively keyboard-activatable, so give it the button behaviour. */
  function activateOnKey(event: KeyboardEvent<HTMLLabelElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-red-100 bg-white p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-red-500" />
        <h3 className="text-lg font-bold text-ink-900">{t.successTitle}</h3>
        <p className="text-sm leading-7 text-ink-500">{state.success}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="flex scroll-mt-20 flex-col gap-6 rounded-3xl border border-red-100 bg-white p-6 text-start sm:p-8"
    >
      {/*
        The current step. These have to stay direct children of the form and come before
        everything they control, because the CSS reaches the rest of the wizard through
        `#wz-N:checked ~ *`. `__step` is submitted along with the answers and ignored by
        the Server Action.
      */}
      <input type="hidden" name="locale" value={lang} />
      {STEP_INDEXES.map((i) => (
        <input
          key={i}
          type="radio"
          name="__step"
          id={stepId(i)}
          defaultChecked={i === 0}
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
      ))}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>
            {STEP_INDEXES.map((i) => (
              <span key={i} data-wz-step={i} className="[--wz-display:inline]">
                {t.stepCounter(
                  (i + 1).toLocaleString(numberLocale),
                  TOTAL_STEPS.toLocaleString(numberLocale)
                )}
              </span>
            ))}
          </span>
          <span>
            {STEP_INDEXES.map((i) => (
              <span key={i} data-wz-step={i} className="[--wz-display:inline]">
                {Math.round(((i + 1) / TOTAL_STEPS) * 100).toLocaleString(
                  numberLocale
                )}
                {rtl ? "٪" : "%"}
              </span>
            ))}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-red-100">
          <div
            data-wz-bar
            className="h-full rounded-full bg-red-500 transition-[width] duration-300"
          />
        </div>
      </div>

      {/*
        min-height keeps the question area a constant size across the quiz steps, which
        are 2–4 options tall. Without it the nav buttons jump vertically on every step.
        The error message lives in here too, so showing it doesn't push the nav down.
      */}
      <div className="flex min-h-80 flex-col gap-6">
        {steps.map((s, i) => (
          <fieldset key={s.name} data-wz-step={i}>
            <legend className="mb-4 text-base font-bold text-ink-900">
              {t.steps[s.name]}
            </legend>
            <ChoiceGroup
              name={s.name}
              choices={translate(s.name, s.choices)}
              onPick={() => setStepError(null)}
            />
          </fieldset>
        ))}

        <fieldset data-wz-step={steps.length}>
          <legend className="mb-4 text-base font-bold text-ink-900">
            {t.injuryQuestion}
          </legend>
          <div className="wz-injury flex flex-col gap-3">
            {[
              { value: "no", label: t.injuryNo },
              { value: "yes", label: t.injuryYes },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-red-100 px-4 py-3 text-sm transition-colors hover:bg-red-50 has-checked:border-red-400 has-checked:bg-red-50"
              >
                <input
                  type="radio"
                  name="hasInjury"
                  id={`wz-injury-${opt.value}`}
                  value={opt.value}
                  defaultChecked={opt.value === "no"}
                  className="h-4 w-4 shrink-0 accent-red-500"
                />
                <span className="text-ink-700">{opt.label}</span>
              </label>
            ))}

            {/* Revealed by CSS, not React state — see the .wz-injury rule in globals.css. */}
            <div data-wz-injury-note className="flex flex-col gap-1.5">
              <label
                htmlFor="injuryNote"
                className="text-sm font-medium text-ink-700"
              >
                {t.injuryNote}
              </label>
              <textarea
                id="injuryNote"
                name="injuryNote"
                rows={3}
                maxLength={300}
                className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
              />
              <span className="text-xs text-ink-500">
                {t.injuryPrivacy}
              </span>
            </div>
          </div>
        </fieldset>

        <fieldset data-wz-step={LAST_STEP}>
          <legend className="mb-4 text-base font-bold text-ink-900">
            {t.contactQuestion}
          </legend>

          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-ink-700"
                >
                  {t.name}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  maxLength={50}
                  className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-ink-700"
                >
                  {t.phone}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder={t.phonePlaceholder}
                  dir={rtl ? undefined : "ltr"}
                  className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink-700">
                {t.channelQuestion}
              </span>
              <div className="flex flex-wrap gap-2">
                {translate("channel", CHANNELS).map((c) => (
                  <label
                    key={c.value}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-red-100 px-4 py-2 text-sm transition-colors hover:bg-red-50 has-checked:border-red-400 has-checked:bg-red-50"
                  >
                    <input
                      type="radio"
                      name="preferredChannel"
                      value={c.value}
                      defaultChecked={c.value === "whatsapp"}
                      className="h-3.5 w-3.5 accent-red-500"
                    />
                    <span className="text-ink-700">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="telegramUsername"
                className="text-sm font-medium text-ink-700"
              >
                {t.telegram}
              </label>
              <input
                id="telegramUsername"
                name="telegramUsername"
                type="text"
                dir="ltr"
                placeholder="my_username@"
                className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
              />
              <span className="text-xs text-ink-500">
                {t.telegramHint}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-sm font-medium text-ink-700"
              >
                {t.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                maxLength={1000}
                className="rounded-xl border border-red-100 px-4 py-2.5 text-sm outline-none focus:border-red-400"
              />
            </div>
          </div>
        </fieldset>

        {(stepError || state?.error) && (
          <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {stepError ?? state?.error}
          </p>
        )}
      </div>

      {/*
        One "back" and one "next" per step, all but the current pair hidden by CSS —
        a <label> can only point at a fixed step, so the alternative would be JS. Step
        zero still renders its (inert) back label so the next button doesn't jump sides.
      */}
      <div className="flex items-center justify-between gap-3">
        {STEP_INDEXES.map((i) => (
          <label
            key={`back-${i}`}
            data-wz-step={i}
            htmlFor={stepId(Math.max(i - 1, 0))}
            role="button"
            tabIndex={i === 0 ? -1 : 0}
            onClick={goBack}
            onKeyDown={activateOnKey}
            className={cn(NAV_BACK, i === 0 && "pointer-events-none invisible")}
          >
            <BackIcon className="h-4 w-4" />
            {t.back}
          </label>
        ))}

        {STEP_INDEXES.slice(0, LAST_STEP).map((i) => (
          <label
            key={`next-${i}`}
            data-wz-step={i}
            htmlFor={stepId(i + 1)}
            role="button"
            tabIndex={0}
            onClick={(event) => guardNext(event, i)}
            onKeyDown={activateOnKey}
            className={NAV_NEXT}
          >
            {t.next}
            <NextIcon className="h-4 w-4" />
          </label>
        ))}

        <button
          data-wz-step={LAST_STEP}
          type="submit"
          disabled={pending}
          className="cursor-pointer items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300/60 transition-colors hover:bg-red-600 disabled:opacity-60 [--wz-display:inline-flex]"
        >
          <Send className="h-4 w-4" />
          {pending ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
