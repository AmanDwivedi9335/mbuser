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

  const certs = await googleClient.getFederatedSignonCertsAsync();
  const ticket = await googleClient.verifySignedJwtWithCertsAsync(
    idToken,
    certs.certs,
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
