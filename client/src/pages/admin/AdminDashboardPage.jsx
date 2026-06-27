import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, EyeOff, Pencil, Trash2, GripVertical } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { SECTION_TYPES } from '../../components/admin/contentSchemas';
import { AdminButton, AdminCard } from '../../components/admin/AdminUi';

function sortSections(sections) {
  return [...sections].sort((a, b) => {
    const diff = (a.order ?? 0) - (b.order ?? 0);
    if (diff !== 0) return diff;
    return (a.slug || '').localeCompare(b.slug || '');
  });
}

export default function AdminDashboardPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getSections()
      .then((data) => setSections(sortSections(data)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  // Refetch when returning to this tab (e.g. after editing a section elsewhere)
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') load();
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [load]);

  const typeLabel = (type) => SECTION_TYPES.find((t) => t.value === type)?.label || type;

  const flashStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const toggleVisibility = async (slug) => {
    setBusy(slug);
    try {
      await adminApi.toggleVisibility(slug);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  const deleteSection = async (slug, title) => {
    if (!window.confirm(`Delete section "${title}"? This cannot be undone.`)) return;
    setBusy(slug);
    try {
      await adminApi.deleteSection(slug);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  const moveSection = async (index, direction) => {
    if (reordering) return;

    const section = sections[index];
    if (!section?.slug) return;

    const apiDirection = direction < 0 ? 'up' : 'down';

    setReordering(true);
    setError('');

    try {
      const updated = await adminApi.moveSection(section.slug, apiDirection);
      setSections(sortSections(updated));
      localStorage.setItem('sectionsOrderVersion', String(Date.now()));
      flashStatus('Order saved');
    } catch (e) {
      setError(e.message);
      load();
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sections</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Use ↑ ↓ to reorder — changes apply to the portfolio sidebar and page layout
          </p>
        </div>
        <Link to="/admin/sections/new">
          <AdminButton>
            <Plus className="w-4 h-4" />
            New section
          </AdminButton>
        </Link>
      </div>

      {statusMsg && (
        <p className="text-sm text-success mb-4">{statusMsg}</p>
      )}
      {loading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-danger mb-4">{error}</p>}

      {!loading && (
        <AdminCard title={`${sections.length} sections${reordering ? ' · saving…' : ''}`}>
          <div className="divide-y divide-surface-border -mx-5 -my-5">
            {sections.map((section, index) => (
              <div
                key={section.slug}
                className="flex items-center gap-3 px-5 py-4 hover:bg-surface-overlay/50 transition-colors"
              >
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0 || reordering}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs px-1"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <GripVertical className="w-4 h-4 text-muted-foreground/40" />
                  <button
                    type="button"
                    onClick={() => moveSection(index, 1)}
                    disabled={index === sections.length - 1 || reordering}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs px-1"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{section.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-overlay text-muted-foreground border border-surface-border">
                      {typeLabel(section.type)}
                    </span>
                    {!section.visible && (
                      <span className="text-xs text-warning">Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    #{index + 1} · {section.slug} · order {section.order}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleVisibility(section.slug)}
                    disabled={busy === section.slug || reordering}
                    title={section.visible ? 'Hide' : 'Show'}
                  >
                    {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/sections/${section.slug}`)}
                    disabled={reordering}
                  >
                    <Pencil className="w-4 h-4" />
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSection(section.slug, section.title)}
                    disabled={busy === section.slug || reordering}
                    className="text-danger hover:text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </div>
  );
}
