export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    loading?: boolean;
};