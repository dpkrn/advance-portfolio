import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import { AdminButton, AdminCard, AdminSelect } from './AdminUi';
import ImageUpload from './ImageUpload';

const STRIP = new Set(['_id', '__v', 'createdAt', 'updatedAt']);

function stripInternal(item) {
  return Object.fromEntries(Object.entries(item).filter(([k]) => !STRIP.has(k)));
}

function itemLabel(item, labelKey) {
  if (labelKey && item[labelKey]) return item[labelKey];
  return item.name || item.title || item.slug || item.platformId || 'Item';
}

function Toast({ toast }) {
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div className={`px-4 py-3 rounded-lg text-sm font-medium border ${isSuccess ? 'bg-success-bg text-success-fg border-success-border' : 'bg-danger-bg text-danger-fg border-danger-border'}`}>
      {toast.msg}
    </div>
  );
}

export default function AdminCollectionPage({ config }) {
  const {
    title,
    icon: Icon,
    fetchAll,
    create,
    update,
    remove,
    idKey,
    labelKey,
    template,
    imageFields = [], // [{ key: 'thumbnail', label: 'Thumbnail', folder: 'portfolio/projects' }]
  } = config;

  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [json, setJson]         = useState(JSON.stringify(template, null, 2));
  const [parseError, setParseError] = useState('');
  const [busy, setBusy]         = useState(false);
  const [toast, setToast]       = useState(null);

  const flash = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const getId = (item) => item[idKey] ?? item._id;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      flash('error', e.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  useEffect(() => { load(); }, [load]);

  const selectItem = (val) => {
    setParseError('');
    setToast(null);
    if (!val) {
      setSelectedId(null);
      setJson(JSON.stringify(template, null, 2));
      return;
    }
    const item = items.find(i => String(getId(i)) === val);
    if (item) {
      setSelectedId(getId(item));
      setJson(JSON.stringify(stripInternal(item), null, 2));
    }
  };

  const handleFormat = () => {
    try {
      setJson(JSON.stringify(JSON.parse(json), null, 2));
      setParseError('');
    } catch (e) {
      setParseError(e.message);
    }
  };

  const setImageField = (key, url) => {
    try {
      const parsed = JSON.parse(json);
      parsed[key] = url;
      setJson(JSON.stringify(parsed, null, 2));
      setParseError('');
    } catch {
      // json not currently parseable — just append at end won't work, show nothing
    }
  };

  const getImageFieldValue = (key) => {
    try { return JSON.parse(json)[key] || ''; } catch { return ''; }
  };

  const handleSave = async () => {
    let data;
    try {
      data = JSON.parse(json);
      setParseError('');
    } catch (e) {
      setParseError(e.message);
      return;
    }
    setBusy(true);
    try {
      if (selectedId !== null) {
        await update(selectedId, data);
        flash('success', 'Saved successfully');
      } else {
        const created = await create(data);
        flash('success', 'Created successfully');
        const newId = created?.[idKey] ?? created?._id;
        if (newId) setSelectedId(newId);
      }
      await load();
    } catch (e) {
      flash('error', e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (selectedId === null) return;
    const found = items.find(i => String(getId(i)) === String(selectedId));
    const label = found ? itemLabel(found, labelKey) : 'this item';
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await remove(selectedId);
      flash('success', 'Deleted');
      setSelectedId(null);
      setJson(JSON.stringify(template, null, 2));
      await load();
    } catch (e) {
      flash('error', e.message);
    } finally {
      setBusy(false);
    }
  };

  const isEditing = selectedId !== null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-accent-light" />}
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
        </div>
        <AdminButton variant="secondary" size="sm" onClick={() => selectItem('')}>
          <Plus className="w-3.5 h-3.5" />
          New Item
        </AdminButton>
      </div>

      <Toast toast={toast} />

      <AdminCard>
        <div className="space-y-5">
          {/* Selector */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Select item to edit
              </label>
              <AdminSelect
                value={isEditing ? String(selectedId) : ''}
                onChange={e => selectItem(e.target.value)}
              >
                <option value="">— New item —</option>
                {items.map(item => {
                  const id = getId(item);
                  return (
                    <option key={String(id)} value={String(id)}>
                      {itemLabel(item, labelKey)}
                    </option>
                  );
                })}
              </AdminSelect>
            </div>
            <span className={`mb-0.5 text-xs px-2.5 py-1.5 rounded-full font-medium whitespace-nowrap ${isEditing ? 'bg-accent/10 text-accent-light border border-accent/20' : 'bg-surface-overlay text-muted-foreground border border-surface-border'}`}>
              {isEditing ? 'Editing' : 'New'}
            </span>
          </div>

          {/* Image upload fields */}
          {imageFields.length > 0 && (
            <div className={`grid gap-4 ${imageFields.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {imageFields.map((f) => (
                <ImageUpload
                  key={f.key}
                  label={f.label}
                  folder={f.folder || 'portfolio'}
                  value={getImageFieldValue(f.key)}
                  onChange={(url) => setImageField(f.key, url)}
                />
              ))}
            </div>
          )}

          {/* JSON editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                JSON {isEditing ? '(edit fields and save)' : '(fill in and create)'}
              </label>
              <button
                type="button"
                onClick={handleFormat}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Format
              </button>
            </div>
            <textarea
              value={json}
              onChange={e => { setJson(e.target.value); setParseError(''); }}
              rows={24}
              spellCheck={false}
              className={`w-full px-4 py-3 rounded-lg bg-surface-overlay border text-foreground text-sm font-mono focus:outline-none focus:border-accent-light/50 transition-colors resize-y leading-relaxed ${parseError ? 'border-danger' : 'border-surface-border'}`}
            />
            {parseError && (
              <p className="mt-1.5 text-xs text-danger-fg font-mono">{parseError}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1 border-t border-surface-border">
            <div>
              {isEditing && (
                <AdminButton variant="danger" size="sm" onClick={handleDelete} disabled={busy}>
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </AdminButton>
              )}
            </div>
            <AdminButton variant="primary" onClick={handleSave} disabled={busy}>
              {busy
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <Save className="w-4 h-4" />
              }
              {isEditing ? 'Save Changes' : 'Create Item'}
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {!loading && (
        <p className="text-xs text-muted-foreground text-right">
          {items.length} item{items.length !== 1 ? 's' : ''} in collection
        </p>
      )}
    </div>
  );
}
