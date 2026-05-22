export type DialogProps = React.DialogHTMLAttributes<HTMLDialogElement> & {
  title?: string;
  description?: string;
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
};