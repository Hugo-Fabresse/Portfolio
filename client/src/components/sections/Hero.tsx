import { FadeIn } from "@/components/ui/fade-in";

export function HeroSection() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-20 pb-32">
      <FadeIn delay={0.1}>
        <div className="font-mono text-primary mb-6 flex items-center gap-3 text-sm md:text-base">
          <span className="animate-pulse">_</span>
          <span>init_sequence()</span>
        </div>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 text-foreground">
          System Developer.
        </h1>
      </FadeIn>
      
      <FadeIn delay={0.3}>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-mono text-muted-foreground mb-10 border-l-2 border-primary pl-4">
          Low-Level Specialization.
        </h2>
      </FadeIn>
      
      <FadeIn delay={0.4}>
        <div className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed space-y-6">
          <p>
            Spécialisation progressive en <span className="text-foreground font-mono bg-muted px-1.5 py-0.5">C</span>. 
            Développement orienté compréhension structurelle profonde des systèmes.
          </p>
          <p>
            Environnement de travail minimaliste et maîtrisé. Refus catégorique des abstractions inutiles et 
            des dépendances superflues. Focus exclusif sur la rigueur, le contrôle, l'architecture et 
            l'autonomie technique.
          </p>
        </div>
      </FadeIn>
      
      <FadeIn delay={0.5}>
        <div className="mt-12 flex items-center gap-6">
          <a 
            href="#projects" 
            className="border border-primary text-primary px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Voir_Les_Projets()
          </a>
          <a 
            href="#contact" 
            className="text-muted-foreground hover:text-foreground font-mono text-sm underline underline-offset-4 transition-colors"
          >
            /api/contact
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
