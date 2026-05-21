type ErrorMessageProps = {
  error?: string[];
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error?.length) return null;

  return <p className="ml-2 text-xs text-red-500">{error[0]}</p>;
}
