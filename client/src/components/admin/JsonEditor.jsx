import { useState, useEffect } from 'react';
import { AdminField, AdminTextarea } from './AdminUi';

export default function JsonEditor({ value, onChange, label = 'Content (JSON)' }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setText(JSON.stringify(value ?? {}, null, 2));
    setError(null);
  }, [value]);

  const handleChange = (raw) => {
    setText(raw);
    try {
      const parsed = JSON.parse(raw);
      setError(null);
      onChange(parsed);
    } catch {
      setError('Invalid JSON — fix syntax before saving');
    }
  };

  return (
    <AdminField label={label} hint={error || 'Edit raw JSON for advanced fields (GitHub graph, stats, etc.)'}>
      <AdminTextarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={20}
        className={`font-mono text-xs ${error ? 'border-danger/50' : ''}`}
        spellCheck={false}
      />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </AdminField>
  );
}
