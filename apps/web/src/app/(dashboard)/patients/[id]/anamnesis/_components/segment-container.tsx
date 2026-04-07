interface SegmentContainerProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SegmentContainer({ id, title, description, children }: SegmentContainerProps) {
  return (
    <section id={id} className="scroll-mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-sm hover:border-secondary/30 transition-all">
        <div className="mb-8">
          <h2 className="text-lg font-black uppercase tracking-widest text-primary flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(var(--secondary),0.5)]" />
            {title}
          </h2>
          {description && <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-tight">{description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </div>
      </div>
    </section>
  );
}