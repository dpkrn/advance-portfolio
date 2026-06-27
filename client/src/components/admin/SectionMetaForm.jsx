import { SECTION_TYPES, NAV_ICONS } from './contentSchemas';
import { AdminField, AdminInput, AdminTextarea, AdminSelect } from './AdminUi';

export default function SectionMetaForm({ meta, onChange, isNew = false }) {
  const update = (key, val) => onChange({ ...meta, [key]: val });

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <AdminField label="Title" required>
        <AdminInput value={meta.title || ''} onChange={(e) => update('title', e.target.value)} />
      </AdminField>

      <AdminField label="Slug" required hint={isNew ? 'URL-safe identifier, cannot change easily after create' : ''}>
        <AdminInput
          value={meta.slug || ''}
          onChange={(e) => update('slug', e.target.value.toLowerCase())}
          disabled={!isNew}
        />
      </AdminField>

      <AdminField label="Type" required>
        <AdminSelect
          value={meta.type || ''}
          onChange={(e) => update('type', e.target.value)}
          disabled={!isNew}
        >
          <option value="">Select type...</option>
          {SECTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label="Nav Label">
        <AdminInput value={meta.navLabel || ''} onChange={(e) => update('navLabel', e.target.value)} placeholder="Sidebar label" />
      </AdminField>

      <AdminField label="Icon">
        <AdminSelect value={meta.icon || ''} onChange={(e) => update('icon', e.target.value)}>
          <option value="">None</option>
          {NAV_ICONS.map((icon) => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label="Order" hint={isNew ? 'Initial position' : 'Change order with ↑ ↓ on the Sections dashboard'}>
        <AdminInput
          type="number"
          value={meta.order ?? 0}
          onChange={(e) => update('order', Number(e.target.value))}
          disabled={!isNew}
          className={!isNew ? 'opacity-60 cursor-not-allowed' : ''}
        />
      </AdminField>

      <AdminField label="Subtitle" className="sm:col-span-2">
        <AdminInput value={meta.subtitle || ''} onChange={(e) => update('subtitle', e.target.value)} />
      </AdminField>

      <AdminField label="Description" className="sm:col-span-2">
        <AdminTextarea value={meta.description || ''} onChange={(e) => update('description', e.target.value)} rows={2} />
      </AdminField>

      <div className="sm:col-span-2 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={meta.visible !== false}
            onChange={(e) => update('visible', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-foreground">Visible on portfolio</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!meta.featured}
            onChange={(e) => update('featured', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-foreground">Featured</span>
        </label>
      </div>
    </div>
  );
}
