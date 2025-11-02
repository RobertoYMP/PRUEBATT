import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faHandPointRight, faExclamation, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import { getIdToken } from '../auth/cognito';

// Helpers de entorno
const REGION = import.meta.env.VITE_COG_REGION;
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;
const UPLOADS_BUCKET = import.meta.env.VITE_UPLOADS_BUCKET;
const HISTORY_TABLE = import.meta.env.VITE_HISTORY_TABLE;

// Decodifica el payload del JWT sin dependencias (para tomar iss/sub)
function parseJwt(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function Upload() {
  const nav = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      if (!file) {
        setError('Selecciona un archivo PDF');
        return;
      }
      if (file.type !== 'application/pdf') {
        setError('El archivo debe ser un PDF');
        return;
      }

      setLoading(true);

      // 1) ID token actual de Cognito User Pools
      const idToken = await getIdToken();
      if (!idToken) {
        setLoading(false);
        setError('Tu sesión ha expirado. Inicia sesión de nuevo.');
        return nav('/login');
      }

      // 2) Provider para Federated Identities (Identity Pool)
      const payload = parseJwt(idToken);
      // p.ej. "cognito-idp.us-east-2.amazonaws.com/us-east-2_XXXX"
      const provider = payload?.iss?.replace('https://', '');
      if (!provider) {
        setLoading(false);
        setError('No se pudo resolver el proveedor de identidad de Cognito.');
        return;
      }

      // 3) Credenciales temporales del Identity Pool (autenticado con tu idToken)
      const credentialProvider = fromCognitoIdentityPool({
        clientConfig: { region: REGION },
        identityPoolId: IDENTITY_POOL_ID,
        logins: { [provider]: idToken },
      });

      // 4) Clientes AWS
      const s3 = new S3Client({ region: REGION, credentials: credentialProvider });
      const ddbDoc = DynamoDBDocumentClient.from(
        new DynamoDBClient({ region: REGION, credentials: credentialProvider })
      );

      // 5) Tomamos el identityId (queda resuelto al pedir credentials)
      const resolved = await s3.config.credentials();
      const identityId = resolved.identityId || payload?.sub || 'unknown';

      // 6) Clave final en S3 (aislada por usuario)
      const key = `private/${identityId}/${Date.now()}-${file.name}`;

      // 7) Subir a S3
      await s3.send(
        new PutObjectCommand({
          Bucket: UPLOADS_BUCKET,
          Key: key,
          Body: file,
          ContentType: file.type || 'application/pdf',
        })
      );

      // 8) Guardar registro en DynamoDB (tabla hematec1-History)
      await ddbDoc.send(
        new PutCommand({
          TableName: HISTORY_TABLE,
          Item: {
            PK: identityId,            // Debe coincidir con tu política de acceso
            SK: key,                   // Usamos la clave del objeto como sort key
            filename: file.name,
            uploadedAt: new Date().toISOString(),
            contentType: file.type || 'application/pdf',
            size: file.size,
            status: 'UPLOADED',        // puedes actualizar luego con TEXTRACT, etc.
          },
        })
      );

      setLoading(false);
      // Redirige a resultados (puedes pasar la key por query si la necesitas)
      nav('/app/results');
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(
        err?.message ||
          'Ocurrió un error al subir el archivo. Inténtalo nuevamente.'
      );
    }
  }

  return (
    <div className="upload-container">
      <h2>Subir archivo de Biometría Hemática</h2>
      <div className="upload-content">
        <div className="instructions-content">
          <div className="instructions-title">
            <h3>
              <FontAwesomeIcon icon={faTriangleExclamation} className="upload-icon" />
            </h3>
            <h3>Instrucciones</h3>
          </div>
          <div className="text-content">
            Por favor, elige o arrastra aquí el archivo PDF que contiene los
            resultados de tu biometría hemática.
            <br />
            <br />
            <FontAwesomeIcon icon={faHandPointRight} /> El archivo debe tener el
            formato oficial de la clínica Salud Digna para poder ser analizado
            correctamente.
            <br />
            <br />
            <FontAwesomeIcon icon={faExclamation} /> <strong>Importante: </strong>
            Los resultados mostrados a continuación serán un prediagnóstico
            automatizado. Este análisis no sustituye la valoración médica
            profesional. Siempre es recomendable acudir con un médico para una
            interpretación completa y un seguimiento adecuado.
          </div>
          <div className="upload-line"></div>
        </div>

        <div className="upload-file">
          <div className="blue-content">
            <div className="dashed-container">
              <form id="uploadForm" onSubmit={onSubmit} className="stack">
                <input
                  id="pdfInput"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="file-input-hidden"
                />
                <label
                  htmlFor="pdfInput"
                  className="file-cta"
                  aria-label="Selecciona un archivo PDF"
                >
                  <span className="file-cta__icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faFilePdf} />
                  </span>
                  <span className="file-cta__text">Selecciona archivo PDF</span>
                </label>
                {/* Botón invisible para permitir form="uploadForm" abajo */}
                <button type="submit" style={{ display: 'none' }} />
              </form>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="button-upload-container add-margin-top">
        <button className="button-secondary" onClick={() => nav(-1)}>
          Regresar
        </button>
        <button
          className="button-primary"
          form="uploadForm"
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Subiendo...' : 'Realizar prediagnóstico'}
        </button>
      </div>

      {error && (
        <div className="badge critico complete" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}
    </div>
  );
}
