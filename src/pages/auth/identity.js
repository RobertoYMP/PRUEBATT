// src/pages/auth/identity.js
import { CognitoIdentityClient, GetIdCommand } from "@aws-sdk/client-cognito-identity";
import { getIdToken } from "./cognito"; // mismo folder "auth"

const REGION = import.meta.env.VITE_COG_REGION;
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;
const USER_POOL_ID = import.meta.env.VITE_COG_USER_POOL_ID;

const KEY = "hematec.identityId";

/**
 * Devuelve el identityId (PK de DynamoDB).
 * - Lee de localStorage si ya existe.
 * - Si no, lo solicita a Cognito Identity y lo cachea.
 */
export async function getIdentityId(force = false) {
  if (!force) {
    const cached = localStorage.getItem(KEY);
    if (cached) return cached;
  }

  const idToken = getIdToken();
  if (!REGION || !IDENTITY_POOL_ID || !USER_POOL_ID || !idToken) return null;

  const client = new CognitoIdentityClient({ region: REGION });
  const provider = `cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

  const out = await client.send(new GetIdCommand({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: { [provider]: idToken },
  }));

  const identityId = out.IdentityId || null;
  if (identityId) localStorage.setItem(KEY, identityId);
  return identityId;
}
