import { useEffect, useState, useCallback } from 'react';
import { Bot, User, ChevronDown, ChevronRight, Clock, MessageSquare, Layers } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { AdminCard } from '../../components/admin/AdminUi';

function MessageThread({ messages }) {
  return (
    <div className="mt-3 space-y-2 pl-3 border-l-2 border-surface-border">
      {messages.map((m, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className={`mt-0.5 shrink-0 ${m.role === 'user' ? 'text-accent-light' : 'text-muted-foreground'}`}>
            {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
          </span>
          <p className={`leading-relaxed ${m.role === 'user' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            {m.content}
          </p>
        </div>
      ))}
    </div>
  );
}

function SessionRow({ session }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-5 border-b border-surface-border last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 text-left hover:opacity-80 transition-opacity"
      >
        <span className="mt-0.5 text-muted-foreground shrink-0">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground truncate max-w-[180px]">
              {session.sessionId}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-overlay border border-surface-border text-muted-foreground">
              {session.messageCount} msg{session.messageCount !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {new Date(session.createdAt).toLocaleDateString('en-US', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
          {session.messages?.[0]?.content && (
            <p className="text-sm text-foreground truncate">
              {session.messages[0].content}
            </p>
          )}
        </div>
      </button>

      {expanded && <MessageThread messages={session.messages} />}
    </div>
  );
}

export default function AdminAskSessionsPage() {
  const [data, setData] = useState({ sessions: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback((p = 1) => {
    setLoading(true);
    adminApi.getAskSessions(p, 20)
      .then((d) => { setData(d); setPage(p); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(1); }, [load]);

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Ask Me — Sessions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Every visitor conversation stored for analysis. {data.total > 0 && `${data.total} total sessions.`}
        </p>
      </div>

      {/* Stats bar */}
      {data.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { icon: Layers, label: 'Total sessions', value: data.total },
            {
              icon: MessageSquare,
              label: 'Total messages',
              value: data.sessions.reduce((s, r) => s + r.messageCount, 0),
            },
            {
              icon: Bot,
              label: 'Avg messages',
              value: data.sessions.length
                ? (data.sessions.reduce((s, r) => s + r.messageCount, 0) / data.sessions.length).toFixed(1)
                : 0,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-4 rounded-xl border border-surface-border bg-surface-raised flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-bg border border-accent-border flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-accent-light" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-danger-fg text-sm mb-4">{error}</p>}
      {loading && <p className="text-muted-foreground text-sm">Loading sessions…</p>}

      {!loading && (
        <>
          <AdminCard title={`${data.sessions.length} sessions (page ${page} of ${data.pages})`}>
            {data.sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center -mx-5 -my-5">
                <div className="w-12 h-12 rounded-2xl bg-surface-overlay flex items-center justify-center">
                  <Bot className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No sessions yet.</p>
              </div>
            ) : (
              <div className="-mx-5 -my-5">
                {data.sessions.map((s) => (
                  <SessionRow key={s.sessionId} session={s} />
                ))}
              </div>
            )}
          </AdminCard>

          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                className="px-3 py-1.5 rounded-lg text-sm border border-surface-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">{page} / {data.pages}</span>
              <button
                type="button"
                disabled={page >= data.pages}
                onClick={() => load(page + 1)}
                className="px-3 py-1.5 rounded-lg text-sm border border-surface-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
