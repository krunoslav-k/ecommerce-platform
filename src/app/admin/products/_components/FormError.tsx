type ErrorMessageProps = {
  error?: string[];
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error?.length) return null;

  return <p className="text-sm text-red-500">{error[0]}</p>;
}
