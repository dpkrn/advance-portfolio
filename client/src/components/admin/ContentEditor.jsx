import ArrayListEditor from './ArrayListEditor';
import JsonEditor from './JsonEditor';
import { CONTENT_LISTS, ACHIEVEMENT_LISTS } from './contentSchemas';
import { AdminField, AdminInput } from './AdminUi';

function NotebookCategories({ content, onChange }) {
  const cats = content.categories || [];
  return (
    <AdminField label="Categories (comma-separated)" hint="Used as filters in the notebook section">
      <AdminInput
        value={cats.join(', ')}
        onChange={(e) =>
          onChange({
            ...content,
            categories: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
          })
        }
        placeholder="Backend, React, DevOps"
      />
    </AdminField>
  );
}

export default function ContentEditor({ type, content, onChange }) {
  const listSchema = CONTENT_LISTS[type];

  if (type === 'achievements') {
    return (
      <div className="space-y-8">
        {ACHIEVEMENT_LISTS.map((schema) => (
          <ArrayListEditor
            key={schema.key}
            schema={{ ...schema, defaults: {} }}
            content={content}
            onChange={onChange}
          />
        ))}
      </div>
    );
  }

  if (listSchema) {
    return (
      <div className="space-y-6">
        {type === 'notebook' && (
          <NotebookCategories content={content} onChange={onChange} />
        )}
        <ArrayListEditor schema={listSchema} content={content} onChange={onChange} />
        {(type === 'github' || type === 'now') && (
          <JsonEditor
            value={content}
            onChange={onChange}
            label="Full content JSON (includes stats, graph, etc.)"
          />
        )}
      </div>
    );
  }

  if (type === 'contact' || type === 'hero') {
    return (
      <div className="space-y-4">
        {type === 'contact' && (
          <>
            <AdminField label="Availability">
              <AdminInput
                value={content.availability || ''}
                onChange={(e) => onChange({ ...content, availability: e.target.value })}
              />
            </AdminField>
            <AdminField label="Response Time">
              <AdminInput
                value={content.responseTime || ''}
                onChange={(e) => onChange({ ...content, responseTime: e.target.value })}
              />
            </AdminField>
          </>
        )}
        {type === 'hero' && (
          <AdminField label="Highlights (comma-separated)">
            <AdminInput
              value={(content.highlights || []).join(', ')}
              onChange={(e) =>
                onChange({
                  ...content,
                  highlights: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </AdminField>
        )}
        <JsonEditor value={content} onChange={onChange} />
      </div>
    );
  }

  return <JsonEditor value={content} onChange={onChange} />;
}
