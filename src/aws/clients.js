import { CognitoIdentityClient, GetIdCommand } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = import.meta.env.VITE_COG_REGION;
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;

// Recibe idToken del User Pool (JWT)
export async function getAwsClients(idToken, userPoolId) {
  const logins = {
    [`cognito-idp.${REGION}.amazonaws.com/${userPoolId}`]: idToken
  };

  const idc = new CognitoIdentityClient({ region: REGION });
  const { IdentityId } = await idc.send(new GetIdCommand({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: logins
  }));

  const credentials = fromCognitoIdentityPool({
    client: idc,
    identityPoolId: IDENTITY_POOL_ID,
    logins
  });

  const s3  = new S3Client({ region: REGION, credentials });
  const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION, credentials }));

  return { s3, ddb, identityId: IdentityId };
}
