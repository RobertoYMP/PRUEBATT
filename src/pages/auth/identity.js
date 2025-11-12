// src/pages/auth/identity.js
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const REGION = import.meta.env.VITE_COG_REGION;
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;
const USER_POOL_ID = import.meta.env.VITE_USER_POOL_ID; // agrega esto en .env

export async function getIdentityId() {
  const raw = localStorage.getItem('hematec.session');
  if (!raw) throw new Error('Sesión no encontrada');
  const { idToken } = JSON.parse(raw);

  const credProvider = fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    identityPoolId: IDENTITY_POOL_ID,
    logins: {
      [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken
    }
  });

  const creds = await credProvider();        // fuerza el exchange
  const id = creds.identityId;               // us-east-2:xxxx-…
  localStorage.setItem('hematec.identityId', id);
  return id;
}
