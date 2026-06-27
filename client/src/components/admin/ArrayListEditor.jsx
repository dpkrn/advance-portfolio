import { getNestedValue, setNestedValue } from './contentSchemas';
import { AdminField, AdminInput, AdminTextarea, AdminSelect } from './AdminUi';

function tagsToString(val) {
  if (Array.isArray(val)) return val.join(', ');
  return val || '';
}

function linesToString(val) {
  if (Array.isArray(val)) return val.join('\n');
  return val || '';
}

function parseTags(str) {
  if (!str?.trim()) return [];
  return str.split(',').map((s) => s.trim()).filter(Boolean);
}

function parseLines(str) {
  if (!str?.trim()) return [];
  return str.split('\n').map((s) => s.trim()).filter(Boolean);
}

function SchemaField({ field, item, onChange }) {
  const raw = getNestedValue(item, field.key);
  const value = raw ?? '';

  const update = (val) => onChange(setNestedValue(item, field.key, val));

  if (field.type === 'checkbox') {
    return (
      <AdminField label={field.label}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!raw}
            onChange={(e) => update(e.target.checked)}
            className="rounded border-surface-border"
          />
          <span className="text-sm text-muted-foreground">Enabled</span>
        </label>
      </AdminField>
    );
  }

  if (field.type === 'select') {
    return (
      <AdminField label={field.label} required={field.required}>
        <AdminSelect value={value} onChange={(e) => update(e.target.value)}>
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </AdminSelect>
      </AdminField>
    );
  }

  if (field.type === 'textarea') {
    return (
      <AdminField label={field.label} required={field.required}>
        <AdminTextarea value={value} onChange={(e) => update(e.target.value)} />
      </AdminField>
    );
  }

  if (field.type === 'tags') {
    return (
      <AdminField label={field.label}>
        <AdminInput
          value={tagsToString(raw)}
          onChange={(e) => update(parseTags(e.target.value))}
          placeholder="React, Node.js, MongoDB"
        />
      </AdminField>
    );
  }

  if (field.type === 'lines') {
    return (
      <AdminField label={field.label}>
        <AdminTextarea
          value={linesToString(raw)}
          onChange={(e) => update(parseLines(e.target.value))}
          rows={4}
        />
      </AdminField>
    );
  }

  if (field.type === 'number') {
    return (
      <AdminField label={field.label} required={field.required}>
        <AdminInput
          type="number"
          value={value}
          onChange={(e) => update(Number(e.target.value) || '')}
        />
      </AdminField>
    );
  }

  return (
    <AdminField label={field.label} required={field.required}>
      <AdminInput
        type={field.type || 'text'}
        value={value}
        onChange={(e) => update(e.target.value)}
      />
    </AdminField>
  );
}

export default function ArrayListEditor({ schema, content, onChange }) {
  const items = content[schema.key] || [];

  const updateItems = (next) => {
    onChange({ ...content, [schema.key]: next });
  };

  const addItem = () => {
    const id = `${schema.key.slice(0, 2)}-${Date.now()}`;
    updateItems([...items, { id, ...schema.defaults }]);
  };

  const updateItem = (index, updated) => {
    updateItems(items.map((item, i) => (i === index ? updated : item)));
  };

  const removeItem = (index) => {
    updateItems(items.filter((_, i) => i !== index));
  };

  const moveItem = (index, dir) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateItems(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">{schema.label}</h4>
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-accent-light hover:text-accent font-medium"
        >
          + Add {schema.label.replace(/s$/, '')}
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-surface-border rounded-xl">
          No items yet. Click add to create one.
        </p>
      )}

      {items.map((item, index) => (
        <details
          key={item.id || index}
          className="group border border-surface-border rounded-xl bg-surface-overlay/50 open:bg-surface-overlay"
          open={items.length <= 3}
        >
          <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none">
            <span className="font-medium text-sm text-foreground truncate">
              {schema.itemLabel(item)}
            </span>
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.preventDefault()}>
              <button type="button" onClick={() => moveItem(index, -1)} className="p-1 text-muted-foreground hover:text-foreground text-xs" disabled={index === 0}>↑</button>
              <button type="button" onClick={() => moveItem(index, 1)} className="p-1 text-muted-foreground hover:text-foreground text-xs" disabled={index === items.length - 1}>↓</button>
              <button type="button" onClick={() => removeItem(index)} className="p-1 text-danger text-xs ml-1">Remove</button>
            </div>
          </summary>
          <div className="px-4 pb-4 grid sm:grid-cols-2 gap-4 border-t border-surface-border pt-4">
            {schema.fields.map((field) => (
              <SchemaField
                key={field.key}
                field={field}
                item={item}
                onChange={(updated) => updateItem(index, updated)}
              />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
