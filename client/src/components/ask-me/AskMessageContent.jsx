import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

// ── Code block with copy button ────────────────────────────────────────────
function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2 rounded-lg overflow-hidden border border-surface-border bg-[#0d0d14]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-surface-border">
        <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-wider">
          {lang || 'code'}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied
            ? <><Check className="w-3 h-3 text-success-fg" /> Copied</>
            : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <pre className="px-3 py-3 overflow-x-auto text-xs font-mono text-foreground/85 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Split raw content into text segments and fenced code blocks ────────────
function parseSegments(content) {
  const segments = [];
  const fence = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0;
  let match;

  while ((match = fence.exec(content)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', content: content.slice(last, match.index) });
    }
    segments.push({ type: 'code', lang: match[1] || '', code: match[2].trimEnd() });
    last = fence.lastIndex;
  }

  if (last < content.length) {
    segments.push({ type: 'text', content: content.slice(last) });
  }

  return segments;
}

// ── Render a text segment line by line ────────────────────────────────────
function TextSegment({ content }) {
  const lines = content.split('\n');

  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Skip empty lines (render spacing via space-y instead)
        if (!trimmed) return <div key={i} className="h-1" />;

        // Setext-style heading underlines (===… or ---…) → horizontal rule
        if (/^[=]{3,}$/.test(trimmed) || /^[-]{3,}$/.test(trimmed)) {
          return <hr key={i} className="border-surface-border my-1" />;
        }

        // ATX headings: # H1 / ## H2 / ### H3
        const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2];
          const cls = level === 1
            ? 'text-base font-bold text-foreground mt-1'
            : level === 2
              ? 'text-sm font-semibold text-foreground mt-1'
              : 'text-sm font-medium text-foreground/90 mt-0.5';
          return <p key={i} className={cls}>{renderInline(text)}</p>;
        }

        // Bullet list items
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const text = trimmed.slice(2);
          return (
            <p key={i} className="flex gap-2 text-foreground/90 break-words">
              <span className="text-accent shrink-0 mt-0.5">•</span>
              <span className="min-w-0 break-words">{renderInline(text)}</span>
            </p>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (numMatch) {
          return (
            <p key={i} className="flex gap-2 text-foreground/90 break-words">
              <span className="text-accent shrink-0 tabular-nums">{numMatch[1]}.</span>
              <span className="min-w-0 break-words">{renderInline(numMatch[2])}</span>
            </p>
          );
        }

        // Italic label (_text_)
        if (trimmed.startsWith('_') && trimmed.endsWith('_') && trimmed.length > 2) {
          return (
            <p key={i} className="text-xs text-muted-foreground italic break-words">
              {trimmed.slice(1, -1)}
            </p>
          );
        }

        // Default paragraph
        return (
          <p key={i} className="text-foreground/90 break-words">
            {renderInline(line)}
          </p>
        );
      })}
    </>
  );
}

// ── Inline markdown: **bold**, [link](url), `inline code` ─────────────────
function renderInline(text) {
  const parts = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1 py-0.5 rounded text-[11px] font-mono bg-surface text-accent-light border border-surface-border">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-light underline underline-offset-2 hover:opacity-80"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}

// ── Main export ────────────────────────────────────────────────────────────
export default function AskMessageContent({ content }) {
  const segments = parseSegments(content);

  return (
    <div className="space-y-1 text-sm leading-relaxed min-w-0">
      {segments.map((seg, i) =>
        seg.type === 'code'
          ? <CodeBlock key={i} lang={seg.lang} code={seg.code} />
          : <TextSegment key={i} content={seg.content} />
      )}
    </div>
  );
}
