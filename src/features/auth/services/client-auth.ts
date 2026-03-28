"use client";

import {
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { getFirebaseClientAuth } from "@/lib/firebase/client";

async function createBackendSession(credential: UserCredential) {
  const token = await credential.user.getIdToken();

  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Failed to establish session.");
  }
}

export async function signupWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(getFirebaseClientAuth(), email, password);
  await createBackendSession(credential);
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(getFirebaseClientAuth(), email, password);
  await createBackendSession(credential);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(getFirebaseClientAuth(), provider);
  await createBackendSession(credential);
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(getFirebaseClientAuth(), email);
}

export async function loginAsGuest() {
  const response = await fetch("/api/auth/guest-session", {
    method: "POST",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Failed to start guest session.");
  }
}
