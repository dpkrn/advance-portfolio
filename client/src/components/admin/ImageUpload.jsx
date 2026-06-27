import { useRef, useState, useEffect } from 'react';
import { Upload, X, ImageIcon, RefreshCw } from 'lucide-react';
import adminApi from '../../services/adminApi';

export default function ImageUpload({ value, onChange, folder = 'portfolio', label = 'Image', className = '' }) {
  const inputRef = useRef(null);

  // Internal src keeps the preview snappy — updated immediately on upload,
  // and synced when the parent changes value (e.g. on load or remove).
  const [src, setSrc]         = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    setSrc(value || '');
  }, [value]);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files allowed'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('File must be under 5 MB');   return; }
    setError('');
    setUploading(true);
    try {
      const result = await adminApi.uploadImage(file, folder);
      const url = result?.url || result;
      setSrc(url);
      onChange(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => upload(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    upload(e.dataTransfer.files[0]);
  };

  const handleRemove = () => {
    setSrc('');
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-medium text-muted-foreground">{label}</label>}

      {src ? (
        <div className="relative group w-full rounded-xl overflow-hidden border border-surface-border bg-surface-overlay">
          <img
            src={src}
            alt="preview"
            className="w-full h-40 object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/70 hover:bg-red-500/90 text-white text-xs font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors
            ${dragOver
              ? 'border-accent-light bg-accent/10'
              : 'border-surface-border hover:border-accent-light/50 hover:bg-surface-overlay/50'
            }
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          {uploading ? (
            <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-7 h-7 text-muted-foreground" />
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">Click or drag to upload</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WebP · max 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-danger-fg font-mono">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
