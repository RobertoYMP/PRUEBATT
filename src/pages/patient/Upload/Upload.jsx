// src/pages/patient/Upload/Upload.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Upload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faHandPointRight, faExclamation, faFilePdf, faFlask, faFileImage } from '@fortawesome/free-solid-svg-icons';

import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { getIdToken, getSession, getAuthHeader } from '../../auth/cognito';
import { Popup } from '../../../components/Popup/Popup';

const REGION = import.meta.env.VITE_COG_REGION;
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;
const UPLOADS_BUCKET = import.meta.env.VITE_UPLOADS_BUCKET;
const API_BASE = import.meta.env.VITE_API_URL;

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
        setError('Selecciona un PDF o una imagen JPEG/PNG');
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (file.type && !allowedTypes.includes(file.type)) {
        setError('El archivo debe ser un PDF o una imagen (JPG/PNG)');
        return;
      }

      setLoading(true);

      const idToken = await getIdToken();
      if (!idToken) {
        setLoading(false);
        nav('/login');
        return;
      }

      const payload = parseJwt(idToken);
      const provider = payload?.iss?.replace(/^https?:\/\//, '');
      if (!provider) {
        setLoading(false);
        setError('No se pudo resolver el proveedor de identidad.');
        return;
      }

      const credentials = fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: IDENTITY_POOL_ID,
        logins: { [provider]: idToken },
      });

      const s3 = new S3Client({ region: REGION, credentials });

      const resolved = await s3.config.credentials();
      const identityId = resolved.identityId;
      if (!identityId) throw new Error('No se pudo resolver tu IdentityId');

      const safe = (file.name || 'archivo.pdf').replace(/[^\w.\-]/g, '_');
      const withPdf = /\.pdf$/i.test(safe) ? safe : `${safe}.pdf`;
      const key = `private/${identityId}/${Date.now()}-${withPdf}`;

      const bodyBytes = new Uint8Array(await file.arrayBuffer());

      await s3.send(
        new PutObjectCommand({
          Bucket: UPLOADS_BUCKET,
          Key: key,
          Body: bodyBytes,
          ContentType: file.type || 'application/pdf',
        })
      );

      const session = getSession() || {};
      const claims = session.claims || {};
      const displayName =
        claims.name ||
        [claims.given_name, claims.family_name].filter(Boolean).join(' ') ||
        claims.email ||
        'Paciente';
      const userEmail = claims.email || null;

      if (API_BASE) {
        await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            bucket: UPLOADS_BUCKET,
            key,
            patientName: displayName,
            userEmail,
          }),
        });
      }

      localStorage.setItem('hematec.identityId', identityId);
      localStorage.setItem('hematec.lastUploadKey', key);
      localStorage.setItem('hematec.lastUploadAt', String(Date.now()));

      setLoading(false);
      nav('/app/results');
    } catch (err) {
      console.error(err);
      setLoading(false);
      if (String(err?.message || '').includes('Unauthenticated access is not supported')) {
        setError(
          'Tu sesión no está autenticada con el Identity Pool. Vuelve a iniciar sesión e inténtalo de nuevo.'
        );
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
            <h3>
              <FontAwesomeIcon icon={faTriangleExclamation} className="upload-icon" />
            </h3>
            <h3>Instrucciones</h3>
          </div>
          <div className="text-content">
            Por favor selecciona o arrastra a esta área el archivo de Biometría Hemática en formato{' '}
            <strong>PDF</strong> (recomendado) o una imagen clara en formato
            <strong> JPEG/PNG</strong>.
            <br />
            <br />
            <FontAwesomeIcon icon={faHandPointRight} style={{ color: 'var(--color-primary)' }} />{' '}
            El documento o imagen debe corresponder al formato oficial emitido por la clínica y ser
            completamente legible.
            <br />
            <br />
            <FontAwesomeIcon icon={faExclamation} style={{ color: '#d9534f' }} />{' '}
            <strong>Importante:</strong> El resultado generado es un prediagnóstico automatizado y no
            sustituye la evaluación médica profesional.
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
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="file-input-hidden"
                />
                <label
                  htmlFor="pdfInput"
                  className="file-cta"
                  aria-label="Selecciona un archivo PDF (o una imagen JPEG/PNG)"
                >
                  <span className="file-cta__icon" aria-hidden="true">
                    <FontAwesomeIcon
                      icon={file && file.type !== 'application/pdf' ? faFileImage : faFilePdf}
                    />
                  </span>
                  <span className="file-cta__text">
                    {file ? 'Cambiar archivo PDF o imagen' : 'Selecciona un archivo PDF o una imagen'}
                  </span>
                </label>

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

      {error && (
        <div className="badge critico complete" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}
      <Popup
        isVisible={loading}
        onClose={() => {}}
        type="action"
        icon={faFlask}
        width="32rem"
        tittle="Realizando prediagnóstico"
        message="uploading_prediagnosis"
        showButton={false}
        closable={false}
      />
    </div>
  );
}
