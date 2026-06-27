import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { openAskPanel, closeAskPanel } from '../../store/slices/uiSlice';
import AskMePanel from './AskMePanel';
import AskMeFab from './AskMeFab';
import ReviewFormModal from '../reviews/ReviewFormModal';

export default function AskMeWidget({ profileName, showFab = true, fabClassName = '' }) {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.askPanelOpen);
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <>
      {showFab && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {/* Review FAB */}
          <motion.button
            type="button"
            onClick={() => setReviewOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-raised border border-surface-border text-foreground shadow-card hover:border-accent-border hover:text-accent-light transition-colors"
            aria-label="Leave a review"
          >
            <MessageSquarePlus className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium hidden sm:inline">Leave a review</span>
          </motion.button>

          {/* Ask FAB */}
          <AskMeFab
            onClick={() => dispatch(openAskPanel())}
            className={fabClassName}
            static
          />
        </div>
      )}

      <AskMePanel
        open={open}
        onClose={() => dispatch(closeAskPanel())}
        profileName={profileName}
      />

      <ReviewFormModal open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </>
  );
}

export { AskMePanel, AskMeFab };
