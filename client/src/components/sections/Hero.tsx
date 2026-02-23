import { FadeIn } from "@/components/ui/fade-in";

export function HeroSection() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center py-20">
      <div className="mono-label mb-8">
        SYSTEM_STATUS: OPERATIONAL // KERNEL: 6.1.0-LTS
      </div>
      
      <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-[ -0.05em] leading-[0.85] mb-8 text-foreground">
        SYSTEM<br />ARCHITECT.
      </h1>
      
      <div className="tech-border-accent mb-12 max-w-xl">
        <p className="text-xl md:text-2xl font-mono text-muted-foreground leading-tight">
          C / LOW-LEVEL / SECURITY / ARCH
        </p>
      </div>
      
      <div className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed space-y-6 border-l border-border pl-8 ml-1">
        <p>
          Spécialisation en <span className="text-foreground font-mono bg-muted px-1">C</span>. 
          Focus structurel. Refus des abstractions inutiles.
        </p>
        <p>
          Environnement minimaliste (Hyprland, Neovim). Rigueur mathématique appliquée au code.
          Contrôle total sur l'exécution.
        </p>
      </div>
      
      <div className="mt-16 flex flex-wrap items-center gap-8">
        <a 
          href="#projects" 
          className="border border-primary text-primary px-8 py-4 font-mono text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-none"
        >
          EXEC ./PROJECTS
        </a>
        <a 
          href="#contact" 
          className="mono-label hover:text-foreground transition-none underline underline-offset-8"
        >
          CONNECT_API(CONTACT)
        </a>
      </div>
    </section>
  );
}
