"use client";

import { useState } from "react";
import { SectionEyebrow } from "./Features";

const faqs = [
  {
    q: "When will Mink launch?",
    a: "We're rolling out early access on iOS first. Join the waitlist and you'll be among the first invited as we open seats.",
  },
  {
    q: "Is Mink really free for tattoo seekers?",
    a: "Yes. Browsing, searching by photo, saving into collections, and following artists are free, with no ads in the feed. Forever.",
  },
  {
    q: "How does the founding-artist offer work?",
    a: "The first 100 verified artists who join get three months free at launch and a permanent founding-artist badge. After three months you can stay on a transparent monthly plan or stop — your work stays yours.",
  },
  {
    q: "How does image search work?",
    a: "Upload or paste a reference photo. We use vision AI to describe the piece (style, motifs, technique) and surface the closest matching tattoos in the gallery. Matches are based on metadata, not third-party stock results.",
  },
  {
    q: "What about Android?",
    a: "We're starting with iOS to keep quality high. An Android version is on the roadmap — join the waitlist to be notified.",
  },
  {
    q: "How do you handle my data?",
    a: "We minimize what we collect, never sell it, and let you delete your account and data at any time. See our Privacy Policy for the full breakdown.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="relative scroll-mt-28 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionEyebrow>Frequently asked</SectionEyebrow>
          </div>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
            The short version.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-white/8 rounded-3xl border border-white/8 bg-white/2">
          {faqs.map((f, i) => (
            <FAQItem key={f.q} question={f.q} answer={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  question,
  answer,
  defaultOpen,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="px-5 sm:px-7">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-base font-semibold text-white sm:text-lg">
          {question}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition ${
            open ? "rotate-45 bg-(--mink-brand)" : ""
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ${
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-3xl pr-10 text-sm leading-relaxed text-(--mink-text-muted) sm:text-base">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
