/** Simple markdown-lite renderer for assistant messages */
export default function AskMessageContent({ content }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;

        if (line.startsWith('• ') || line.startsWith('- ')) {
          const text = line.slice(2);
          return (
            <p key={i} className="flex gap-2 text-foreground/90">
              <span className="text-accent shrink-0">•</span>
              <span>{renderInline(text)}</span>
            </p>
          );
        }

        if (line.startsWith('_') && line.endsWith('_')) {
          return (
            <p key={i} className="text-xs text-muted-foreground italic">
              {line.slice(1, -1)}
            </p>
          );
        }

        return (
          <p key={i} className="text-foreground/90">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**')) {
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
            className="link-accent underline underline-offset-2"
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
