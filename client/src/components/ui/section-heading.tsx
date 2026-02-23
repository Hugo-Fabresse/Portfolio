interface SectionHeadingProps {
  title: string;
  index: string;
}

export function SectionHeading({ title, index }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <span className="font-mono text-primary text-lg md:text-xl font-medium">
        {index}.
      </span>
      <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-foreground/90">
        {title}
      </h2>
      <div className="h-px bg-border flex-1 ml-4 lg:ml-8" />
    </div>
  );
}
