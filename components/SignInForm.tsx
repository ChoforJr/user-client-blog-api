"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { useBlog } from "@/components/BlogProvider";
import { Notice } from "@/components/Notice";

interface Credentials {
  username: string;
  password: string;
}

interface SignUpDetails extends Credentials {
  displayName: string;
  confirmPassword: string;
}

const emptyCredentials: Credentials = { username: "", password: "" };
const emptySignUp: SignUpDetails = {
  ...emptyCredentials,
  displayName: "",
  confirmPassword: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-forest placeholder:text-forest/35 shadow-sm transition focus:border-forest/50 focus:outline-none focus:ring-4 focus:ring-forest/10";

export function SignInForm() {
  const { apiUrl, authenticated, authLoading, signIn } = useBlog();
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState(emptyCredentials);
  const [signUp, setSignUp] = useState(emptySignUp);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      await signIn(credentials.username.trim(), credentials.password);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function submitSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (signUp.password !== signUp.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await apiRequest<unknown>(apiUrl, "/signup", {
        method: "POST",
        body: JSON.stringify({
          username: signUp.username.trim(),
          displayName: signUp.displayName.trim(),
          password: signUp.password,
          confirmPassword: signUp.confirmPassword,
        }),
      });
      setCredentials({ username: signUp.username.trim(), password: "" });
      setSignUp(emptySignUp);
      setIsLogin(true);
      setSuccess("Your account is ready. Sign in to continue.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create your account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="reading-surface mx-auto w-full max-w-2xl overflow-hidden rounded-[1.8rem] border border-white/10 shadow-2xl shadow-black/20">
      <div className="border-b border-forest/10 bg-forest/[0.035] px-6 py-7 sm:px-10 sm:py-9">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest/55">Your space</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-forest sm:text-5xl">
          {authLoading ? "Checking your session…" : authenticated ? "You’re signed in" : isLogin ? "Welcome back" : "Make yourself at home"}
        </h1>
        <p className="mt-3 max-w-lg leading-7 text-forest/65">
          {isLogin ? "A good story is even better when there’s someone to talk about it with." : "Join the community and add your voice to the conversation."}
        </p>
      </div>
      <div className="px-6 py-7 sm:px-10 sm:py-9">
      {authenticated ? (
        <div className="mt-6 space-y-4">
          <Notice kind="success">You are signed in and can join the conversation.</Notice>
          <Link className="font-semibold text-forest underline underline-offset-4 hover:text-[#52764e]" href="/account">
            Go to your account
          </Link>
        </div>
      ) : !authLoading ? (
        <>
          {error && <div className="mt-5"><Notice kind="error">{error}</Notice></div>}
          {success && <div className="mt-5"><Notice kind="success">{success}</Notice></div>}
          {isLogin ? (
            <form className="mt-7 space-y-5" onSubmit={submitLogin}>
              <label className="block text-sm font-semibold text-forest" htmlFor="username">
                Email address
                <input
                  autoComplete="username"
                  className={inputClass}
                  id="username"
                  onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
                  required
                  type="email"
                  value={credentials.username}
                />
              </label>
              <label className="block text-sm font-semibold text-forest" htmlFor="password">
                Password
                <input
                  autoComplete="current-password"
                  className={inputClass}
                  id="password"
                  onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                  required
                  type="password"
                  value={credentials.password}
                />
              </label>
              <button className="w-full rounded-full bg-forest px-5 py-3.5 font-bold text-paper transition hover:bg-[#31583c]" disabled={busy} type="submit">
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>
          ) : (
            <form className="mt-7 space-y-5" onSubmit={submitSignUp}>
              <label className="block text-sm font-semibold text-forest" htmlFor="displayName">
                Display name
                <input
                  autoComplete="name"
                  className={inputClass}
                  id="displayName"
                  onChange={(event) => setSignUp({ ...signUp, displayName: event.target.value })}
                  required
                  value={signUp.displayName}
                />
              </label>
              <label className="block text-sm font-semibold text-forest" htmlFor="signup-username">
                Email address
                <input
                  autoComplete="email"
                  className={inputClass}
                  id="signup-username"
                  onChange={(event) => setSignUp({ ...signUp, username: event.target.value })}
                  required
                  type="email"
                  value={signUp.username}
                />
              </label>
              <label className="block text-sm font-semibold text-forest" htmlFor="signup-password">
                Password
                <input
                  autoComplete="new-password"
                  className={inputClass}
                  id="signup-password"
                  onChange={(event) => setSignUp({ ...signUp, password: event.target.value })}
                  required
                  type="password"
                  value={signUp.password}
                />
              </label>
              <label className="block text-sm font-semibold text-forest" htmlFor="confirm-password">
                Confirm password
                <input
                  autoComplete="new-password"
                  className={inputClass}
                  id="confirm-password"
                  onChange={(event) => setSignUp({ ...signUp, confirmPassword: event.target.value })}
                  required
                  type="password"
                  value={signUp.confirmPassword}
                />
              </label>
              <button className="w-full rounded-full bg-forest px-5 py-3.5 font-bold text-paper transition hover:bg-[#31583c]" disabled={busy} type="submit">
                {busy ? "Creating account…" : "Create account"}
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-forest/65">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              className="font-bold text-forest underline underline-offset-4 hover:text-[#52764e]"
              onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}
              type="button"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </>
      ) : null}
      </div>
    </section>
  );
}
