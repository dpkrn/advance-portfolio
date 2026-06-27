import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Trash2, Bot, User } from 'lucide-react';
import { useAskMe } from '../../hooks/useAskMe';
import { SUGGESTED_QUESTIONS, WELCOME_MESSAGE } from './constants';
import AskMessageContent from './AskMessageContent';

export default function AskMePanel({ open, onClose, profileName = 'me' }) {
  const { messages, loading, error, sendMessage, clearChat } = useAskMe();
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const showSuggestions = messages.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/30 dark:bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

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
                  <h2 className="font-semibold text-foreground text-sm truncate">
                    Ask anything about me
                  </h2>
                  <p className="text-xs text-muted-foreground truncate">
                    Projects, skills, experience & more
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {messages.length > 0 && (
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
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {WELCOME_MESSAGE(profileName)}
                  </p>
                </div>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 dark:bg-accent'
                        : 'icon-box'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-accent-light" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 dark:bg-accent text-white rounded-tr-md'
                        : 'glass-panel rounded-tl-md'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p>{msg.content}</p>
                    ) : (
                      <AskMessageContent content={msg.content} />
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg icon-box flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-accent-light" />
                  </div>
                  <div className="glass-panel px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-light animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-accent-light animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-accent-light animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-danger text-center px-4">{error}</p>
              )}
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div className="px-4 pb-3 flex flex-wrap gap-2 shrink-0">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-surface-border bg-surface-overlay text-muted-foreground hover:text-foreground hover:border-accent-light/30 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-4 border-t border-surface-border shrink-0"
            >
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
                  placeholder="Ask about projects, skills, experience..."
                  rows={1}
                  disabled={loading}
                  className="flex-1 resize-none px-4 py-3 rounded-xl bg-surface-overlay border border-surface-border text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-accent-light/50 transition-colors text-sm max-h-32"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-3 rounded-xl bg-indigo-600 dark:bg-accent text-white hover:bg-indigo-500 dark:hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Answers from portfolio data · LLM integration coming soon
              </p>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
