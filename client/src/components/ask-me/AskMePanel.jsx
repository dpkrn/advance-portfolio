import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Trash2, Bot, User } from 'lucide-react';
import { useAskMe } from '../../hooks/useAskMe';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { SUGGESTED_QUESTIONS, WELCOME_MESSAGE } from './constants';
import AskMessageContent from './AskMessageContent';

// Wave dots shown while waiting for the first token
function WaveDots() {
  return (
    <div className="flex items-center gap-1.5 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-accent-light block"
          animate={{ y: [0, -7, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// Blinking caret shown at the end of a streaming response
function StreamingCursor() {
  return (
    <span
      className="inline-block w-[2px] h-[0.9em] bg-current align-middle ml-0.5 animate-blink"
      aria-hidden="true"
    />
  );
}

// Smoothly types out streamed content char-by-char; snaps to full text when done.
function AssistantContent({ content, streaming }) {
  const displayed = useTypingEffect(content, streaming);
  const text = streaming ? displayed : content;

  if (streaming) {
    return (
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 break-words min-w-0">
        {text || <WaveDots />}
        {text && <StreamingCursor />}
      </p>
    );
  }
  return <AskMessageContent content={content} />;
}

export default function AskMePanel({ open, onClose, profileName = 'me' }) {
  const { messages, loading, isBusy, error, sendMessage, clearChat } = useAskMe();
  const [input, setInput] = useState('');
  const inputRef  = useRef(null);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Scroll to bottom on every new message and on every streaming chunk
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isBusy) return;
    sendMessage(input.trim());
    setInput('');
  };

  const showSuggestions = messages.length === 0 && !loading;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full sm:w-[420px] flex flex-col bg-surface-raised border-l border-surface-border shadow-2xl"
            role="dialog"
            aria-label="Ask anything about me"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-surface-border shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-accent-light" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-foreground text-sm">Ask me anything</h2>
                  <p className="text-xs text-muted-foreground">Projects · Skills · Experience · Professional Life </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {messages.length > 0 && !isBusy && (
                  <button
                    type="button"
                    onClick={clearChat}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                    aria-label="Clear chat"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Welcome */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg icon-box flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-accent-light" />
                </div>
                <div className="glass-panel px-4 py-3 flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {WELCOME_MESSAGE(profileName)}
                  </p>
                </div>
              </div>

              {/* Chat messages */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === 'user' ? 'bg-accent' : 'icon-box'
                    }`}
                  >
                    {msg.role === 'user'
                      ? <User className="w-3.5 h-3.5 text-white" />
                      : <Bot  className="w-3.5 h-3.5 text-accent-light" />}
                  </div>
                  <div
                    className={`max-w-[85%] min-w-0 px-4 py-3 rounded-2xl text-sm leading-relaxed overflow-hidden ${
                      msg.role === 'user'
                        ? 'bg-accent text-white rounded-tr-md'
                        : 'glass-panel rounded-tl-md'
                    }`}
                  >
                    {msg.role === 'user'
                      ? <p>{msg.content}</p>
                      : <AssistantContent content={msg.content} streaming={msg.streaming} />}
                  </div>
                </div>
              ))}

              {/* Waiting dots — only shown before first token arrives */}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg icon-box flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-accent-light" />
                  </div>
                  <div className="glass-panel px-4 py-3">
                    <WaveDots />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-danger-fg bg-danger-bg border border-danger-border rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              {/* Invisible anchor to scroll to */}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div className="px-4 pb-3 flex flex-wrap gap-2 shrink-0">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => { sendMessage(q); }}
                    disabled={isBusy}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-surface-border bg-surface-overlay text-muted-foreground hover:text-foreground hover:border-accent-border transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-4 border-t border-surface-border shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={isBusy ? 'Waiting for response…' : 'Ask about projects, skills, experience…'}
                  rows={1}
                  disabled={isBusy}
                  className="flex-1 resize-none input-base text-sm max-h-32 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isBusy || !input.trim()}
                  className="p-3 rounded-xl bg-accent hover:bg-accent/90 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
                Powered by AI · Answers based on portfolio data
              </p>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
