import { useEffect, useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { AdminButton, AdminCard, AdminField, AdminInput, AdminTextarea } from '../../components/admin/AdminUi';

function ListEditor({ label, items, onChange, fields }) {
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, '']))]);
  const update = (i, key, val) => {
    onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)));
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-foreground">{label}</h4>
        <button type="button" onClick={add} className="text-xs text-accent-light hover:text-accent">
          + Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start p-3 rounded-lg border border-surface-border bg-surface-overlay/50">
          <div className="flex-1 grid sm:grid-cols-2 gap-2">
            {fields.map((f) => (
              <AdminField key={f.key} label={f.label}>
                <AdminInput
                  value={item[f.key] || ''}
                  onChange={(e) => update(i, f.key, e.target.value)}
                />
              </AdminField>
            ))}
          </div>
          <button type="button" onClick={() => remove(i)} className="p-2 text-danger shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminApi
      .getProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  const update = (key, val) => setProfile((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { _id, __v, createdAt, updatedAt, ...data } = profile;
      const saved = await adminApi.updateProfile(data);
      setProfile(saved);
      setMsg('Profile saved!');
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-danger">Profile not found. Run npm run seed.</div>;

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Name, bio, social links, stats</p>
        </div>
        <AdminButton onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save'}
        </AdminButton>
      </div>

      {msg && <p className="text-success text-sm mb-4">{msg}</p>}

      <div className="space-y-6">
        <AdminCard title="Basic info">
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="Name" required>
              <AdminInput value={profile.name || ''} onChange={(e) => update('name', e.target.value)} />
            </AdminField>
            <AdminField label="Role" required>
              <AdminInput value={profile.role || ''} onChange={(e) => update('role', e.target.value)} />
            </AdminField>
            <AdminField label="Tagline" className="sm:col-span-2">
              <AdminInput value={profile.tagline || ''} onChange={(e) => update('tagline', e.target.value)} />
            </AdminField>
            <AdminField label="Summary" className="sm:col-span-2">
              <AdminTextarea value={profile.summary || ''} onChange={(e) => update('summary', e.target.value)} rows={4} />
            </AdminField>
            <AdminField label="Email">
              <AdminInput value={profile.email || ''} onChange={(e) => update('email', e.target.value)} />
            </AdminField>
            <AdminField label="Location">
              <AdminInput value={profile.location || ''} onChange={(e) => update('location', e.target.value)} />
            </AdminField>
            <AdminField label="Avatar URL">
              <AdminInput value={profile.avatar || ''} onChange={(e) => update('avatar', e.target.value)} />
            </AdminField>
            <AdminField label="Resume URL">
              <AdminInput value={profile.resumeUrl || ''} onChange={(e) => update('resumeUrl', e.target.value)} />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="Social links">
          <ListEditor
            label="Links"
            items={profile.socialLinks || []}
            onChange={(socialLinks) => update('socialLinks', socialLinks)}
            fields={[
              { key: 'platform', label: 'Platform' },
              { key: 'label', label: 'Label' },
              { key: 'url', label: 'URL' },
            ]}
          />
        </AdminCard>

        <AdminCard title="Quick stats">
          <ListEditor
            label="Stats"
            items={profile.quickStats || []}
            onChange={(quickStats) => update('quickStats', quickStats)}
            fields={[
              { key: 'label', label: 'Label' },
              { key: 'value', label: 'Value' },
              { key: 'icon', label: 'Icon' },
            ]}
          />
        </AdminCard>

        <AdminCard title="SEO">
          <div className="grid gap-4">
            <AdminField label="Page title">
              <AdminInput
                value={profile.seo?.title || ''}
                onChange={(e) => update('seo', { ...profile.seo, title: e.target.value })}
              />
            </AdminField>
            <AdminField label="Meta description">
              <AdminTextarea
                value={profile.seo?.description || ''}
                onChange={(e) => update('seo', { ...profile.seo, description: e.target.value })}
                rows={2}
              />
            </AdminField>
            <AdminField label="Keywords (comma-separated)">
              <AdminInput
                value={(profile.seo?.keywords || []).join(', ')}
                onChange={(e) =>
                  update('seo', {
                    ...profile.seo,
                    keywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </AdminField>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
