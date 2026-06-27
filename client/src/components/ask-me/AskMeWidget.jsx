import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { openAskPanel, closeAskPanel } from '../../store/slices/uiSlice';
import AskMePanel from './AskMePanel';
import AskMeFab from './AskMeFab';

export default function AskMeWidget({ profileName, showFab = true, fabClassName = '' }) {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.askPanelOpen);

  return (
    <>
      {showFab && (
        <AskMeFab onClick={() => dispatch(openAskPanel())} className={fabClassName} />
      )}
      <AskMePanel
        open={open}
        onClose={() => dispatch(closeAskPanel())}
        profileName={profileName}
      />
    </>
  );
}

export { AskMePanel, AskMeFab };
