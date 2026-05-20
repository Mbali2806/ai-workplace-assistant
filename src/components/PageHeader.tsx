interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm md:text-base text-muted-foreground mt-1.5 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
