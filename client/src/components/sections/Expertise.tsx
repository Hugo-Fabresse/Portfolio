import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Check } from "lucide-react";

const skills = [
  "C (Axe de développement principal)",
  "C++",
  "Assembly (Architecture bas niveau)",
  "Manipulation avancée des structures mémoire",
  "Interaction système profonde",
  "Sécurité offensive / Pentest / Red Team"
];

const philosophy = [
  "Minimalisme structurel et conceptuel",
  "Rejet de la complexité inutile et des abstractions coûteuses",
  "Philosophie du 'Build tools, not dependencies'",
  "Vision stratégique et anticipation des failles",
];

export function ExpertiseSection() {
  return (
    <section id="expertise" className="py-24">
      <FadeIn>
        <SectionHeading title="Expertise & Philosophie" index="04" />
      </FadeIn>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
        <div>
          <FadeIn delay={0.1}>
            <div className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
              <span className="text-primary">#</span> Domaines d'expertise
            </div>
            <ul className="space-y-4">
              {skills.map((skill, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{skill}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <div>
          <FadeIn delay={0.2}>
            <div className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
              <span className="text-primary">#</span> Méthodologie
            </div>
            <div className="tech-border bg-card/30 p-6 lg:p-8">
              <ul className="space-y-6">
                {philosophy.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="font-mono text-primary text-sm opacity-70">{(i + 1).toString().padStart(2, '0')}</span>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
