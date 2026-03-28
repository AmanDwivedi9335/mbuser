import { OAuth2Client, TokenPayload } from "google-auth-library";

const FIREBASE_CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const googleClient = new OAuth2Client();

type FirebaseToken = TokenPayload & {
  uid: string;
  firebase?: {
    sign_in_provider?: string;
  };
};

function assertProjectId() {
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is required for token verification.");
  }
}

export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseToken> {
  assertProjectId();

  const certsResponse = await fetch(FIREBASE_CERTS_URL, { cache: "no-store" });
  if (!certsResponse.ok) {
    throw new Error("Unable to fetch Firebase signing certificates.");
  }

  const certs = (await certsResponse.json().catch(() => null)) as Record<string, string> | null;
  if (!certs || Object.keys(certs).length === 0) {
    throw new Error("Firebase signing certificates are unavailable.");
  }

  const ticket = await googleClient.verifySignedJwtWithCertsAsync(
    idToken,
    certs,
    projectId,
    ["https://securetoken.google.com/" + projectId],
    0,
  );

  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid Firebase ID token payload.");
  }

  return {
    ...payload,
    uid: payload.sub,
  };
}

export function getFirebasePublicKeysUrl() {
  return FIREBASE_CERTS_URL;
}
