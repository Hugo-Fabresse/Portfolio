import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Box } from "lucide-react";

const projects = [
  {
    title: "JUST",
    subtitle: "Version Control System",
    description: "VCS développé intégralement en C from scratch. Implémentation d'un système d'objets complet (blobs, trees, commits). Gestion de mémoire rigoureuse et compilation stricte. Manipulation avancée de pointeurs.",
    icon: GitBranch,
    techs: ["C", "Makefile", "Memory Management", "Data Structures"],
  },
  {
    title: "GOAT",
    subtitle: "Minimalist Git",
    description: "Reproduction des primitives essentielles de Git. Approche expérimentale visant à comprendre les mécanismes internes profonds de l'outil. Parfaite complémentarité architecturale avec le développement de JUST.",
    icon: Box,
    techs: ["C", "System Calls", "File I/O", "Reverse Engineering"],
  }
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24">
      <FadeIn>
        <SectionHeading title="Projets Principaux" index="01" />
      </FadeIn>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <FadeIn key={project.title} delay={i * 0.2}>
            <Card className="tech-border bg-card/40 rounded-none h-full flex flex-col group">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-muted group-hover:bg-primary/10 transition-colors">
                    <project.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">./{project.title.toLowerCase()}</span>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">{project.title}</CardTitle>
                <CardDescription className="font-mono text-primary mt-1">{project.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.techs.map((tech) => (
                    <span key={tech} className="text-xs font-mono px-2 py-1 bg-muted text-muted-foreground border border-border/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
