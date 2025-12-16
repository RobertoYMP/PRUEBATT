import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveDoctorRecommendations } from '../../../api/history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import './EditRecommendations.css'

export default function EditRecommendations({ pk: pkProp, sk: skProp, initialText, autoText, onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const pk = pkProp || params.get('pk') || '';
  const sk = skProp || params.get('sk') || '';

  const [text, setText] = useState(initialText || autoText || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!pk || !sk) {
      setError('Faltan identificadores del estudio.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await saveDoctorRecommendations(pk, sk, text || '');
      if (onBack) {
        onBack();
      } else {
        navigate(-1);
      }
    } catch (e) {
      setError(e?.message || 'Error al guardar las recomendaciones.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card results-card editrecommendations-container">
      <h2>Recomendaciones</h2>

      <div className="warning-container">
        <FontAwesomeIcon icon={faTriangleExclamation} />
        <div>
          <div>Aviso: Recomendaciones informativas, no diagnósticas</div>
          <p className="warning-text">
            La información mostrada es orientativa y puede ser ajustada por un médico. Aquí puedes
            editar el texto que verá el paciente.
          </p>
        </div>
      </div>

      {error && (
        <p style={{ color: '#b10808', marginBottom: '1rem' }}>
          {error}
        </p>
      )}

      <section className="results-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Recomendaciones principales</h3>
        <textarea
          style={{
            width: '100%',
            minHeight: '220px',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '1rem',
            resize: 'vertical'
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe o ajusta aquí las recomendaciones que recibirá el paciente…"
        />
      </section>

      <div className="button-recommendations-container" style={{ marginTop: '2rem' }}>
        <button
          className="button-secondary"
          type="button"
          onClick={onBack || (() => navigate(-1))}
        >
          Regresar
        </button>

        <button
          className="button-primary"
          type="button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Guardando…' : 'Guardar y notificar al paciente'}
        </button>

        <button
          className="button-secondary"
          type="button"
          onClick={onBack || (() => navigate(-1))}
        >
          No realizar cambios
        </button>
      </div>
    </div>
  );
}
