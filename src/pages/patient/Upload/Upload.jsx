// src/pages/patient/Upload/Upload.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faHandPointRight, faExclamation, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { Link } from 'react-router-dom';
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
      if (!idToken) { setLoading(false); return nav('/login'); }

      // 2) Resolver proveedor del User Pool para usar LOGINS en el Identity Pool
      const payload  = parseJwt(idToken);
      const provider = payload?.iss?.replace(/^https?:\/\//, ''); // p.ej. cognito-idp.us-east-2.amazonaws.com/us-east-2_XXXX
      if (!provider) { setLoading(false); return setError('No se pudo resolver el proveedor de identidad.'); }

      // 3) Credenciales del Identity Pool AUTENTICADAS (clave para evitar "Unauthenticated access...")
      const credentials = fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: IDENTITY_POOL_ID,
        logins: { [provider]: idToken },
      });

      // 4) S3 client con dichas credenciales
      const s3 = new S3Client({ region: REGION, credentials });

      // 5) Obtén el IdentityId resuelto (PK de Dynamo y prefijo S3)
      const resolved   = await s3.config.credentials();
      const identityId = resolved.identityId;
      if (!identityId) throw new Error('No se pudo resolver tu IdentityId');

      // 6) Key esperada por el trigger: private/{identityId}/... .pdf
      const safe    = (file.name || 'archivo.pdf').replace(/[^\w.\-]/g, '_');
      const withPdf = /\.pdf$/i.test(safe) ? safe : `${safe}.pdf`;
      const key     = `private/${identityId}/${Date.now()}-${withPdf}`;

      // 7) Evitar streams (algunos navegadores llaman getReader); mejor bytes puros
      const bodyBytes = new Uint8Array(await file.arrayBuffer());

      await s3.send(new PutObjectCommand({
        Bucket: UPLOADS_BUCKET,
        Key: key,
        Body: bodyBytes,
        ContentType: 'application/pdf',
      }));

      // Guardar para que la vista de resultados/historial pueda inferir PK/SK
      localStorage.setItem('hematec.identityId', identityId);
      localStorage.setItem('hematec.lastUploadKey', key);
      localStorage.setItem('hematec.lastUploadAt', String(Date.now()));

      setLoading(false);
      nav('/app/results');
    } catch (err) {
      console.error(err);
      setLoading(false);
      // Mensaje más claro para el caso típico de identity pool
      if (String(err?.message || '').includes('Unauthenticated access is not supported')) {
        setError('Tu sesión no está autenticada con el Identity Pool. Vuelve a iniciar sesión e inténtalo de nuevo.');
      } else {
        setError(err?.message || 'Ocurrió un error al subir el archivo.');
      }
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
            Por favor selecciona o arrastra a esta área el archivo PDF correspondiente.
            <br /><br />
            <FontAwesomeIcon 
              icon={faHandPointRight} 
              style={{ color: 'var(--color-primary)' }}
            />{" "}
            El documento debe corresponder al formato oficial emitido por la clínica.
            <br /><br />
            <FontAwesomeIcon 
              icon={faExclamation} 
              style={{ color: '#d9534f' }}
            />{" "}
            <strong>Importante:</strong> El resultado generado es un prediagnóstico automatizado y no sustituye la evaluación médica profesional.
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

                <label
                  htmlFor="pdfInput"
                  className="file-cta"
                  aria-label="Selecciona un archivo PDF"
                >
                  <span className="file-cta__icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faFilePdf} />
                  </span>
                  <span className="file-cta__text">
                    {file ? 'Cambiar archivo PDF' : 'Selecciona archivo PDF'}
                  </span>
                </label>

                {/* Nombre del archivo seleccionado */}
                {file && (
                  <div className="file-selected-name" aria-live="polite">
                    <span className="file-selected-label">Archivo seleccionado:</span>
                    <span className="file-selected-value">{file.name}</span>
                  </div>
                )}

                <button type="submit" style={{ display: 'none' }} />
              </form>
            </div>
          </div>
        </div>

      </div>

      <hr />
      
      <div className="button-upload-container">
        <div className="button-upload-secondary-group">
          <button className="button-secondary" onClick={() => nav(-1)}>
            Regresar
          </button>

          <Link className="button-secondary" to="/app/manual">
            Capturar valores manualmente
          </Link>
        </div>

        <button 
          className="button-primary button-upload-primary"
          form="uploadForm"
          type="submit"
          disabled={loading}
          aria-busy={loading}
          style={{ minWidth: '260px' }}
        >
          {loading ? 'Subiendo…' : 'Realizar prediagnóstico'}
        </button>
      </div>

      {error && <div className="badge critico complete" style={{ marginTop: '1rem' }}>{error}</div>}
    </div>
  );
}
