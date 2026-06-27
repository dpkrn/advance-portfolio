import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-danger-bg flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-danger-fg" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          {message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
