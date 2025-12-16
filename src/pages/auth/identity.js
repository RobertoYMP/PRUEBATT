import { CognitoIdentityClient, GetIdCommand } from "@aws-sdk/client-cognito-identity";

const REGION = import.meta.env.VITE_COG_REGION || "us-east-2";
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;

function parseJwt(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getIdTokenFromStorage() {
  const raw = localStorage.getItem('hematec.session');
  if (!raw) throw new Error('No hay sesión (hematec.session)');
  const obj = JSON.parse(raw);
  if (!obj.idToken) throw new Error('No hay idToken en hematec.session');
  return obj.idToken;
}

function providerFromIdToken(idToken) {
  const payload = parseJwt(idToken);
  const issuer = payload?.iss?.replace(/^https?:\/\//, '');
  if (!issuer) throw new Error('No se pudo resolver issuer');
  return issuer;
}

export async function getIdentityId() {
  const idToken = getIdTokenFromStorage();
  const payload = parseJwt(idToken);
  const sub = payload?.sub;
  if (!sub) throw new Error('No se pudo resolver sub');

  try {
    const raw = localStorage.getItem('hematec.identity');
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached.sub === sub && cached.identityId) {
        return cached.identityId;
      }
    }
  } catch {}

  const provider = providerFromIdToken(idToken);
  const client = new CognitoIdentityClient({ region: REGION });
  const out = await client.send(new GetIdCommand({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: { [provider]: idToken }
  }));
  if (!out.IdentityId) throw new Error('Cognito Identity no devolvió IdentityId');

  try {
    localStorage.setItem('hematec.identity', JSON.stringify({
      sub,
      identityId: out.IdentityId
    }));
  } catch {}

  return out.IdentityId;
}
