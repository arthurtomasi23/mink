"use client";

import { useActionState, useState } from "react";
import {
  inviteAdminAction,
  type AdminMutationState,
} from "../actions";

export function InviteAdminForm() {
  const [state, formAction, pending] = useActionState<
    AdminMutationState,
    FormData
  >(inviteAdminAction, undefined);

  return (
    <div className="grid gap-3">
      <form
        action={formAction}
        className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="new-admin@mink.app"
          className="rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-(--mink-brand) focus:outline-none"
        />
        <input
          type="text"
          name="displayName"
          placeholder="Display name (optional)"
          className="rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-(--mink-brand) focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-pill bg-(--mink-brand) px-5 py-3 text-sm font-semibold text-white transition hover:bg-(--mink-brand-600) disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Provisioning…" : "Invite admin"}
        </button>
      </form>

      {state && !state.ok ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/8 px-3 py-2 text-xs text-red-200">
          {state.error}
        </div>
      ) : null}

      {state && state.ok && state.password && state.email ? (
        <CredentialsCallout
          email={state.email}
          password={state.password}
          createdNew={state.createdNew ?? false}
          message={state.message}
        />
      ) : null}

      {state && state.ok && !state.password ? (
        <div className="rounded-xl border border-teal-400/40 bg-teal-400/8 px-3 py-2 text-xs text-teal-300">
          {state.message}
        </div>
      ) : null}
    </div>
  );
}

function CredentialsCallout({
  email,
  password,
  createdNew,
  message,
}: {
  email: string;
  password: string;
  createdNew: boolean;
  message: string;
}) {
  const [copied, setCopied] = useState<"none" | "password" | "both">("none");

  async function copy(text: string, kind: "password" | "both") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied("none"), 2000);
    } catch {
      // ignored — user can still select & copy manually
    }
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/8 p-4 text-sm">
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-400/20 text-amber-200"
        >
          !
        </div>
        <div className="grid gap-1">
          <p className="font-semibold text-amber-100">{message}</p>
          <p className="text-xs text-amber-200/80">
            Copy the password now — it will <strong>not</strong> be shown again.
            Send it to the new admin over a secure channel (Signal, 1Password,
            in person). Ask them to change it after their first sign-in.
          </p>
        </div>
      </div>

      <dl className="grid gap-2 sm:grid-cols-[auto_1fr]">
        <dt className="text-xs uppercase tracking-wider text-amber-200/70">
          Email
        </dt>
        <dd className="font-mono text-sm text-amber-50">{email}</dd>

        <dt className="text-xs uppercase tracking-wider text-amber-200/70">
          Password
        </dt>
        <dd>
          <code className="block rounded-lg border border-amber-300/30 bg-black/30 px-3 py-2 font-mono text-base tracking-wider text-amber-50 select-all">
            {password}
          </code>
        </dd>
      </dl>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copy(password, "password")}
          className="inline-flex items-center justify-center gap-2 rounded-pill border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/20"
        >
          {copied === "password" ? "Copied ✓" : "Copy password"}
        </button>
        <button
          type="button"
          onClick={() => copy(`${email}\n${password}`, "both")}
          className="inline-flex items-center justify-center gap-2 rounded-pill border border-amber-300/40 bg-transparent px-4 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/10"
        >
          {copied === "both" ? "Copied ✓" : "Copy email + password"}
        </button>
        {createdNew ? (
          <span className="inline-flex items-center rounded-pill border border-amber-300/30 px-3 py-2 text-xs text-amber-200/80">
            New account created
          </span>
        ) : (
          <span className="inline-flex items-center rounded-pill border border-amber-300/30 px-3 py-2 text-xs text-amber-200/80">
            Existing user — other sign-in methods still work
          </span>
        )}
      </div>
    </div>
  );
}
