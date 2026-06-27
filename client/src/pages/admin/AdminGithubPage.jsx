import { useState, useEffect, useCallback } from 'react';
import { Save, RefreshCw, Github, RotateCcw, Settings } from 'lucide-react';
import { AdminButton, AdminCard } from '../../components/admin/AdminUi';
import adminApi from '../../services/adminApi';

const STRIP = new Set(['_id', '__v', 'createdAt', 'updatedAt', 'config']);

function stripInternal(data) {
  return Object.fromEntries(Object.entries(data).filter(([k]) => !STRIP.has(k)));
}

const DEFAULT_CONFIG = {
  pinnedRepos: ['devtunnel', 'gotunnel', 'nodetunnel', 'Allin1url'],
  repoDisplayCount: 10,
  activityDisplayCount: 10,
};

export default function AdminGithubPage() {
  const [json, setJson]             = useState('{}');
  const [parseError, setParseError] = useState('');
  const [loading, setLoading]       = useState(true);
  const [busy, setBusy]             = useState(false);
  const [syncing, setSyncing]       = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [toast, setToast]           = useState(null);

  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [pinnedInput, setPinnedInput] = useState('');

  const flash = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const load = useCallback(() => {
    setLoading(true);
    adminApi.getGithubData()
      .then(data => {
        setJson(JSON.stringify(stripInternal(data), null, 2));
        const cfg = { ...DEFAULT_CONFIG, ...(data.config || {}) };
        setConfig(cfg);
        setPinnedInput((cfg.pinnedRepos || []).join(', '));
      })
      .catch(e => flash('error', e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFormat = () => {
    try {
      setJson(JSON.stringify(JSON.parse(json), null, 2));
      setParseError('');
    } catch (e) {
      setParseError(e.message);
    }
  };

  const handleSaveData = async () => {
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
      await adminApi.updateGithubData(data);
      flash('success', 'GitHub data saved');
    } catch (e) {
      flash('error', e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSaveConfig = async () => {
    const pinnedRepos = pinnedInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const next = { ...config, pinnedRepos };
    setSavingConfig(true);
    try {
      await adminApi.saveGithubConfig(next);
      setConfig(next);
      flash('success', 'Sync settings saved');
    } catch (e) {
      flash('error', e.message);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const data = await adminApi.syncGithubData();
      setJson(JSON.stringify(stripInternal(data), null, 2));
      setParseError('');
      flash('success', `Synced — ${data.stats?.contributionsThisYear ?? 0} contributions, ${data.repositories?.length ?? 0} repos`);
    } catch (e) {
      flash('error', `Sync failed: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Github className="w-5 h-5 text-accent-light" />
          <h1 className="text-xl font-semibold text-foreground">GitHub Data</h1>
          {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
        </div>
        <AdminButton variant="secondary" onClick={handleSync} disabled={syncing || loading}>
          {syncing
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <RotateCcw className="w-4 h-4" />
          }
          {syncing ? 'Syncing…' : 'Sync from GitHub'}
        </AdminButton>
      </div>

      {toast && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium border ${toast.type === 'success' ? 'bg-success-bg text-success-fg border-success-border' : 'bg-danger-bg text-danger-fg border-danger-border'}`}>
          {toast.msg}
        </div>
      )}

      {/* Sync Settings */}
      <AdminCard>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-accent-light" />
            <h2 className="text-sm font-semibold text-foreground">Sync Settings</h2>
            <span className="text-xs text-muted-foreground ml-1">— applied when you click "Sync from GitHub"</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Pinned Repositories
                <span className="ml-1 font-normal">(comma-separated, shown first)</span>
              </label>
              <input
                type="text"
                value={pinnedInput}
                onChange={e => setPinnedInput(e.target.value)}
                placeholder="devtunnel, gotunnel, nodetunnel, Allin1url"
                className="w-full px-3 py-2 rounded-lg bg-surface-overlay border border-surface-border text-foreground text-sm font-mono focus:outline-none focus:border-accent-light/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Repositories to display
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={config.repoDisplayCount}
                onChange={e => setConfig(c => ({ ...c, repoDisplayCount: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg bg-surface-overlay border border-surface-border text-foreground text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Recent activity entries
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={config.activityDisplayCount}
                onChange={e => setConfig(c => ({ ...c, activityDisplayCount: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg bg-surface-overlay border border-surface-border text-foreground text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1 border-t border-surface-border">
            <AdminButton variant="secondary" onClick={handleSaveConfig} disabled={savingConfig || loading}>
              {savingConfig ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Settings
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Raw JSON editor */}
      <AdminCard>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              JSON — edit manually or use "Sync from GitHub" to pull live data
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
            rows={28}
            spellCheck={false}
            className={`w-full px-4 py-3 rounded-lg bg-surface-overlay border text-foreground text-sm font-mono focus:outline-none focus:border-accent-light/50 transition-colors resize-y leading-relaxed ${parseError ? 'border-danger' : 'border-surface-border'}`}
          />
          {parseError && (
            <p className="text-xs text-danger-fg font-mono">{parseError}</p>
          )}
          <div className="flex justify-end pt-1 border-t border-surface-border">
            <AdminButton variant="primary" onClick={handleSaveData} disabled={busy || loading}>
              {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </AdminButton>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
