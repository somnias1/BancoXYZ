import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';
import { Button } from '../button';
import type { DialogProps } from './types';

const Dialog = forwardRef<HTMLDialogElement, Readonly<DialogProps>>(
  function Dialog(
    { title, description, open, onClose, children, ...props },
    ref,
  ) {
    const internalRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLDialogElement);

    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
      const dialog = internalRef.current;
      if (!dialog) return;
      if (open) {
        if (!dialog.open) dialog.showModal();
      } else {
        if (dialog.open) dialog.close();
      }
    }, [open]);

    function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
      if (e.target === e.currentTarget) onClose?.();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
      if (e.key === 'Escape') onClose?.();
    }

    return (
      <dialog
        ref={internalRef}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        onClose={onClose}
        className="w-full max-w-md rounded-xl p-0 shadow-xl backdrop:bg-black/50 open:flex open:flex-col self-center justify-self-center"
        {...props}
      >
        <div className="flex flex-col gap-4 p-6">
          {title && (
            <div className="flex justify-between gap-4 items-center">
              <h2 id={titleId} className="text-lg font-bold text-primary">
                {title}
              </h2>
              <Button
                aria-label="Close dialog"
                variant="ghost"
                onClick={onClose}
              >
                X
              </Button>
            </div>
          )}
          {description && (
            <p id={descriptionId} className="text-sm text-gray-500">
              {description}
            </p>
          )}
          {children && <>{children}</>}
        </div>
      </dialog>
    );
  },
);

export default Dialog;
