// src/pages/auth/identity.js
import { CognitoIdentityClient, GetIdCommand } from "@aws-sdk/client-cognito-identity";

const REGION = import.meta.env.VITE_COG_REGION || "us-east-2";
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;

// Toma el idToken desde tu sesión guardada
function getIdTokenFromStorage() {
  const raw = localStorage.getItem('hematec.session');
  if (!raw) throw new Error('No hay sesión (hematec.session)');
  const obj = JSON.parse(raw);
  if (!obj.idToken) throw new Error('No hay idToken en hematec.session');
  return obj.idToken;
}

// Construye el issuer del User Pool: cognito-idp.{region}.amazonaws.com/{userPoolId}
function providerFromIdToken(idToken) {
  const payloadB64 = idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(decodeURIComponent(escape(atob(payloadB64))));
  // payload.iss = "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_xxxxxx"
  const issuer = payload.iss.replace(/^https?:\/\//, '');
  // issuer ya viene como "cognito-idp.us-east-2.amazonaws.com/us-east-2_xxxxxx"
  return issuer;
}

// Obtiene (y cachea) el IdentityId del Identity Pool usando el idToken (LOGINS)
export async function getIdentityId() {
  const cached = localStorage.getItem('hematec.identityId');
  if (cached) return cached;

  const idToken = getIdTokenFromStorage();
  const provider = providerFromIdToken(idToken);

  const client = new CognitoIdentityClient({ region: REGION });
  const out = await client.send(new GetIdCommand({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: { [provider]: idToken },   // <-- IMPORTANTE: autenticado
  }));
  if (!out.IdentityId) throw new Error('Cognito Identity no devolvió IdentityId');
  localStorage.setItem('hematec.identityId', out.IdentityId);
  return out.IdentityId;
}
