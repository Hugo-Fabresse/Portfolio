interface SectionHeadingProps {
  title: string;
  index: string;
}

export function SectionHeading({ title, index }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-2 mb-16 relative">
      <div className="flex items-center gap-4">
        <span className="font-mono text-primary text-xs tracking-widest opacity-50">
          [{index}]
        </span>
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-foreground">
          {title}
        </h2>
      </div>
      <div className="h-[1px] w-full bg-border mt-2" />
    </div>
  );
}
