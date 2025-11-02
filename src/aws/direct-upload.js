import { PutObjectCommand } from "@aws-sdk/client-s3";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getAwsClients } from "./clients";

const BUCKET = import.meta.env.VITE_UPLOADS_BUCKET;
const TABLE  = import.meta.env.VITE_HISTORY_TABLE;

// userPoolId lo necesitas para armar el "logins" (puedes importarlo de tu cognito.js)
export async function uploadAndSave({ idToken, userPoolId, file }) {
  const { s3, ddb, identityId } = await getAwsClients(idToken, userPoolId);

  const key = `private/${identityId}/${Date.now()}-${file.name}`;

  // 1) S3
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file,
    ContentType: file.type || "application/octet-stream"
  }));

  // 2) DynamoDB (tu tabla usa PK/SK en mayúsculas)
  await ddb.send(new PutCommand({
    TableName: TABLE,
    Item: {
      PK: identityId,                                   // ← LeadingKeys = IdentityId
      SK: `HIST#${new Date().toISOString()}`,           // ordenado por fecha
      fileKey: key,
      fileName: file.name,
      size: file.size,
      contentType: file.type || "application/octet-stream",
      status: "UPLOADED"
    }
  }));

  return { key };
}
