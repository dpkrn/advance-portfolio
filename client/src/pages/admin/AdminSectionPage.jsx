import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import adminApi from '../../services/adminApi';
import SectionMetaForm from '../../components/admin/SectionMetaForm';
import ContentEditor from '../../components/admin/ContentEditor';
import { DEFAULT_CONTENT, slugify } from '../../components/admin/contentSchemas';
import { AdminButton, AdminCard } from '../../components/admin/AdminUi';

export default function AdminSectionPage() {
  const { slug } = useParams();
  const isNew = slug === 'new';
  const navigate = useNavigate();

  const [meta, setMeta] = useState({
    slug: '',
    type: 'projects',
    title: '',
    subtitle: '',
    navLabel: '',
    icon: 'folder-kanban',
    order: 0,
    visible: true,
    featured: false,
  });
  const [content, setContent] = useState(DEFAULT_CONTENT.projects);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    adminApi
      .getSection(slug)
      .then((section) => {
        setMeta({
          slug: section.slug,
          type: section.type,
          title: section.title,
          subtitle: section.subtitle || '',
          description: section.description || '',
          navLabel: section.navLabel || '',
          icon: section.icon || '',
          order: section.order ?? 0,
          visible: section.visible !== false,
          featured: !!section.featured,
        });
        setContent(section.content || {});
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, isNew]);

  useEffect(() => {
    if (isNew && meta.type && DEFAULT_CONTENT[meta.type]) {
      setContent(DEFAULT_CONTENT[meta.type]);
    }
  }, [isNew, meta.type]);

  useEffect(() => {
    if (isNew && meta.title && !meta.slug) {
      setMeta((m) => ({ ...m, slug: slugify(meta.title) }));
    }
  }, [isNew, meta.title, meta.slug]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    setError('');
    try {
      const payload = { ...meta, content };
      // Order is managed from the dashboard — don't overwrite on content saves
      if (!isNew) {
        delete payload.order;
      }

      if (isNew) {
        const created = await adminApi.createSection(payload);
        navigate(`/admin/sections/${created.slug}`, { replace: true });
        setSaveMsg('Section created!');
      } else {
        await adminApi.updateSection(slug, payload);
        setSaveMsg('Saved successfully!');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading section...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sections
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {isNew ? 'New Section' : `Edit: ${meta.title}`}
        </h1>
        <AdminButton onClick={handleSave} disabled={saving || !meta.title || !meta.slug}>
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save'}
        </AdminButton>
      </div>

      {error && <p className="text-danger mb-4">{error}</p>}
      {saveMsg && <p className="text-success mb-4 text-sm">{saveMsg}</p>}

      <div className="space-y-6">
        <AdminCard title="Section settings">
          <SectionMetaForm meta={meta} onChange={setMeta} isNew={isNew} />
        </AdminCard>

        <AdminCard title="Content">
          {meta.type ? (
            <ContentEditor type={meta.type} content={content} onChange={setContent} />
          ) : (
            <p className="text-muted-foreground text-sm">Select a section type first.</p>
          )}
        </AdminCard>
      </div>

      <div className="mt-6 flex justify-end">
        <AdminButton onClick={handleSave} disabled={saving || !meta.title || !meta.slug}>
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save changes'}
        </AdminButton>
      </div>
    </div>
  );
}
