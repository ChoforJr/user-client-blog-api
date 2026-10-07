"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { useBlog } from "@/components/BlogProvider";
import { Notice } from "@/components/Notice";

const inputClass =
  "mt-2 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2.5 text-white placeholder:text-white/40";

function AccountField({
  label,
  id,
  children,
  onSubmit,
  busy,
}: {
  label: string;
  id: string;
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy: boolean;
}) {
  return (
    <form className="rounded-xl border border-white/10 bg-white/[0.05] p-5" onSubmit={onSubmit}>
      <label className="block text-sm font-semibold" htmlFor={id}>{label}</label>
      {children}
      <button
        className="mt-4 rounded-full border border-leaf/60 px-5 py-2 text-sm font-bold text-leaf transition hover:bg-leaf hover:text-forest"
        disabled={busy}
        type="submit"
      >
        {busy ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

export function AccountPage() {
  const { apiUrl, account, authenticated, authLoading, changeAccountInfo, deleteAccount, signOut } = useBlog();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function update(
    event: FormEvent<HTMLFormElement>,
    endpoint: string,
    payload: Record<string, string>,
    updatedValues: Record<string, string>,
    reset: () => void,
  ) {
    event.preventDefault();
    if (Object.values(payload).some((value) => !value.trim())) {
      setError("Please complete every field before saving.");
      setSuccess(null);
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await apiRequest<unknown>(apiUrl, endpoint, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      changeAccountInfo(updatedValues);
      reset();
      setSuccess("Your account was updated.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update your account.");
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteAccount() {
    if (!window.confirm("Permanently delete your account? This action cannot be undone.")) return;
    setBusy(true);
    setError(null);
    try {
      await deleteAccount();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete your account.");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) {
    return <div className="mx-auto w-full max-w-3xl"><Notice>Loading your account…</Notice></div>;
  }

  if (!authenticated || !account) {
    return (
      <section className="mx-auto w-full max-w-2xl space-y-5">
        <h1 className="font-display text-4xl font-bold">Your account</h1>
        <Notice>Sign in to view and manage your account information.</Notice>
        <Link className="inline-block rounded-full bg-leaf px-5 py-3 font-bold text-forest hover:bg-white" href="/signIn">
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-leaf">Account settings</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Hello, {account.displayName || account.username}</h1>
        </div>
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10" onClick={signOut} type="button">
          Sign out
        </button>
      </div>
      {error && <div className="mt-6"><Notice kind="error">{error}</Notice></div>}
      {success && <div className="mt-6"><Notice kind="success">{success}</Notice></div>}

      <div className="mt-7 grid gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm sm:grid-cols-2">
        <p><span className="text-white/55">User ID</span><br /><span className="break-all">{account.id}</span></p>
        <p><span className="text-white/55">Username</span><br />{account.username}</p>
        <p><span className="text-white/55">Role</span><br />{account.role}</p>
        <p><span className="text-white/55">Member since</span><br />{new Date(account.createdAt).toLocaleDateString("en-US", { timeZone: "UTC" })}</p>
        <p className="sm:col-span-2"><span className="text-white/55">Bio</span><br />{account.bio || "No bio added yet."}</p>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="font-display text-2xl font-bold">Update your details</h2>
        <AccountField
          busy={busy}
          id="new-display-name"
          label="Display name"
          onSubmit={(event) => void update(event, "/user/displayName", { newDisplayName: displayName }, { displayName }, () => setDisplayName(""))}
        >
          <input className={inputClass} id="new-display-name" onChange={(event) => setDisplayName(event.target.value)} value={displayName} />
        </AccountField>
        <AccountField
          busy={busy}
          id="new-bio"
          label="Bio"
          onSubmit={(event) => void update(event, "/user/bio", { newBio: bio }, { bio }, () => setBio(""))}
        >
          <textarea className={`${inputClass} min-h-24`} id="new-bio" onChange={(event) => setBio(event.target.value)} value={bio} />
        </AccountField>
        <AccountField
          busy={busy}
          id="new-username"
          label="Email address"
          onSubmit={(event) => void update(event, "/user/username", { newUsername: username }, { username }, () => setUsername(""))}
        >
          <input className={inputClass} id="new-username" onChange={(event) => setUsername(event.target.value)} required type="email" value={username} />
        </AccountField>
        <AccountField
          busy={busy}
          id="current-password"
          label="Change password"
          onSubmit={(event) => {
            if (passwords.newPassword !== passwords.confirmNewPassword) {
              event.preventDefault();
              setError("Your new passwords do not match.");
              setSuccess(null);
              return;
            }
            void update(event, "/user/password", passwords, {}, () =>
              setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" }),
            );
          }}
        >
          <div className="space-y-3">
            <input autoComplete="current-password" className={inputClass} id="current-password" onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} placeholder="Current password" type="password" value={passwords.currentPassword} />
            <input autoComplete="new-password" className={inputClass} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} placeholder="New password" type="password" value={passwords.newPassword} />
            <input autoComplete="new-password" className={inputClass} onChange={(event) => setPasswords({ ...passwords, confirmNewPassword: event.target.value })} placeholder="Confirm new password" type="password" value={passwords.confirmNewPassword} />
          </div>
        </AccountField>
      </div>

      <div className="mt-10 border-t border-red-300/20 pt-7">
        <h2 className="font-display text-2xl font-bold text-red-200">Delete account</h2>
        <p className="mt-2 text-sm leading-6 text-white/65">Deleting your account is permanent and cannot be undone.</p>
        <button
          className="mt-4 rounded-full border border-red-300/50 px-5 py-2.5 text-sm font-bold text-red-200 hover:bg-red-950/50"
          disabled={busy}
          onClick={() => void onDeleteAccount()}
          type="button"
        >
          Permanently delete account
        </button>
      </div>
    </section>
  );
}
