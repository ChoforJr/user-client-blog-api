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
  "mt-2 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white placeholder:text-white/40";

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
    <section className="mx-auto w-full max-w-lg">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-leaf">Your space</p>
      <h1 className="mt-2 font-display text-4xl font-bold">
        {authLoading ? "Checking your session…" : authenticated ? "You’re signed in" : isLogin ? "Welcome back" : "Create an account"}
      </h1>
      {authenticated ? (
        <div className="mt-6 space-y-4">
          <Notice kind="success">You are signed in and can join the conversation.</Notice>
          <Link className="font-semibold text-leaf hover:text-white" href="/account">
            Go to your account
          </Link>
        </div>
      ) : !authLoading ? (
        <>
          <p className="mt-3 leading-7 text-white/70">
            {isLogin ? "Sign in to manage your account and comment on posts." : "Join the community to take part in the conversation."}
          </p>
          {error && <div className="mt-5"><Notice kind="error">{error}</Notice></div>}
          {success && <div className="mt-5"><Notice kind="success">{success}</Notice></div>}
          {isLogin ? (
            <form className="mt-7 space-y-5" onSubmit={submitLogin}>
              <label className="block text-sm font-semibold" htmlFor="username">
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
              <label className="block text-sm font-semibold" htmlFor="password">
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
              <button className="w-full rounded-full bg-leaf px-5 py-3 font-bold text-forest hover:bg-white" disabled={busy} type="submit">
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>
          ) : (
            <form className="mt-7 space-y-5" onSubmit={submitSignUp}>
              <label className="block text-sm font-semibold" htmlFor="displayName">
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
              <label className="block text-sm font-semibold" htmlFor="signup-username">
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
              <label className="block text-sm font-semibold" htmlFor="signup-password">
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
              <label className="block text-sm font-semibold" htmlFor="confirm-password">
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
              <button className="w-full rounded-full bg-leaf px-5 py-3 font-bold text-forest hover:bg-white" disabled={busy} type="submit">
                {busy ? "Creating account…" : "Create account"}
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-white/70">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              className="font-bold text-leaf hover:text-white"
              onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}
              type="button"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </>
      ) : null}
    </section>
  );
}
