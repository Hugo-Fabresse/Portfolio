import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

const experiences = [
  {
    role: "Chef de Projet, Scrum Master & Lead Developer",
    organization: "Projets Techniques Avancés",
    type: "Leadership",
    desc: "Pilotage d'équipes de développement sur des projets d'envergure. Vision stratégique, anticipation proactive des bloqueurs techniques et prise de décision critique sous contrainte de temps.",
  },
  {
    role: "Manager & Superviseur",
    organization: "Coding Club Epitech Montpellier",
    type: "Encadrement",
    desc: "1 an d'expérience en tant que Superviseur suivi d'une année comme Manager. Responsable de l'organisation des sessions, de la transmission des connaissances et de la gestion de l'équipe pédagogique.",
  },
  {
    role: "Accompagnateur Étudiant (AER)",
    organization: "Epitech",
    type: "Pédagogie",
    desc: "2 ans d'implication directe dans le soutien technique. Pédagogie axée sur la déconstruction et l'explication claire de concepts complexes (algorithmique, gestion mémoire, architecture système).",
  }
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24">
      <FadeIn>
        <SectionHeading title="Expérience & Leadership" index="03" />
      </FadeIn>
      
      <div className="relative border-l border-border/50 ml-4 md:ml-6 space-y-16 pb-8">
        {experiences.map((exp, i) => (
          <FadeIn key={i} delay={i * 0.15} direction="left">
            <div className="relative pl-8 md:pl-12">
              <span className="absolute -left-1.5 top-2 w-3 h-3 bg-background border border-primary" />
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-3">
                <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                <span className="hidden md:block text-border">/</span>
                <span className="font-mono text-sm text-primary">{exp.organization}</span>
              </div>
              <span className="inline-block font-mono text-xs px-2 py-1 bg-muted text-muted-foreground mb-4 border border-border/50">
                TYPE: {exp.type.toUpperCase()}
              </span>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {exp.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
