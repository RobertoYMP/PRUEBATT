// src/pages/patient/Upload/Upload.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faHandPointRight, faExclamation, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { getIdToken } from '../../auth/cognito';

// Helpers de entorno
const REGION = import.meta.env.VITE_COG_REGION;
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;
const UPLOADS_BUCKET = import.meta.env.VITE_UPLOADS_BUCKET;

// Decodifica el payload del JWT sin dependencias (para tomar iss)
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
  } catch { return null; }
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
      if (!file) return setError('Selecciona un archivo PDF');
      if (file.type && file.type !== 'application/pdf') {
        return setError('El archivo debe ser un PDF');
      }

      setLoading(true);

      // 1) ID token de Cognito (User Pools)
      const idToken = await getIdToken();
      if (!idToken) { setLoading(false); nav('/login'); return; }

      // 2) Credenciales federadas (Identity Pool)
      const payload  = parseJwt(idToken);
      const provider = payload?.iss?.replace('https://', ''); // ej: cognito-idp.us-east-2.amazonaws.com/POOL_ID
      if (!provider) { setLoading(false); return setError('No se pudo resolver el proveedor de identidad.'); }

      const credentials = fromCognitoIdentityPool({
        clientConfig: { region: REGION },
        identityPoolId: IDENTITY_POOL_ID,
        logins: { [provider]: idToken },
      });

      // 3) S3 client
      const s3 = new S3Client({ region: REGION, credentials });

      // 4) identityId resuelto por el provider
      const resolved   = await s3.config.credentials();
      const identityId = resolved.identityId;

      // 5) Key con prefijo/sufijo esperados por el trigger
      const safe    = (file.name || 'archivo.pdf').replace(/[^\w.\-]/g, '_');
      const withPdf = /\.pdf$/i.test(safe) ? safe : `${safe}.pdf`;
      const key     = `private/${identityId}/${Date.now()}-${withPdf}`;

      // ⬇️ 6) **Evitar streams**: convertir a bytes para que el SDK no llame getReader()
      const bodyBytes = new Uint8Array(await file.arrayBuffer());

      await s3.send(new PutObjectCommand({
        Bucket: UPLOADS_BUCKET,
        Key: key,
        Body: bodyBytes,                // <- aquí el cambio clave
        ContentType: 'application/pdf', // fuerza el tipo
      }));

      setLoading(false);
      nav('/app/results');
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err?.message || 'Ocurrió un error al subir el archivo.');
    }
  }

  return (
    <div className="upload-container">
      <h2>Subir archivo de Biometría Hemática</h2>
      <div className="upload-content">
        <div className="instructions-content">
          <div className="instructions-title">
            <h3><FontAwesomeIcon icon={faTriangleExclamation} className="upload-icon" /></h3>
            <h3>Instrucciones</h3>
          </div>
          <div className="text-content">
            Por favor, elige o arrastra aquí el archivo PDF…
            <br /><br />
            <FontAwesomeIcon icon={faHandPointRight} /> Debe ser el formato oficial de la clínica.
            <br /><br />
            <FontAwesomeIcon icon={faExclamation} /> <strong>Importante:</strong> Es un prediagnóstico automatizado.
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
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="file-input-hidden"
                />
                <label htmlFor="pdfInput" className="file-cta" aria-label="Selecciona un archivo PDF">
                  <span className="file-cta__icon" aria-hidden="true"><FontAwesomeIcon icon={faFilePdf} /></span>
                  <span className="file-cta__text">Selecciona archivo PDF</span>
                </label>
                <button type="submit" style={{ display: 'none' }} />
              </form>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="button-upload-container add-margin-top">
        <button className="button-secondary" onClick={() => nav(-1)}>Regresar</button>
        <button className="button-primary" form="uploadForm" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Subiendo…' : 'Realizar prediagnóstico'}
        </button>
      </div>

      {error && <div className="badge critico complete" style={{ marginTop: '1rem' }}>{error}</div>}
    </div>
  );
}
