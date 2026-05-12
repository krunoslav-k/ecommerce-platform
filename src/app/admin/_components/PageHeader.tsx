type PageHeaderProps = {
  title: string;
  number?: number | string;
  subtitle: string;
};

export default function PageHeader({
  title,
  number,
  subtitle,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex w-full flex-col">
      <h1 className="text-2xl font-bold">
        {title} <span className={`${number ? '' : 'hidden'}`}>({number})</span>
      </h1>
      <p className="text-sm text-gray-700">{subtitle}</p>
    </div>
  );
}
