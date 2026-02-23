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
      <SectionHeading title="System Components" index="01" />
      
      <div className="grid grid-cols-1 gap-12">
        {projects.map((project) => (
          <div key={project.title} className="border border-border bg-card p-8 group relative">
            <div className="absolute top-0 right-0 p-4 mono-label opacity-20">
              BLOCK_ID: {project.title.toUpperCase()}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <div className="mono-label text-primary mb-2">// {project.subtitle}</div>
                <h3 className="text-3xl font-bold mb-6">{project.title}</h3>
                
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                  {project.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border/50">
                  {project.techs.map((tech) => (
                    <div key={tech} className="flex flex-col">
                      <span className="mono-label text-[8px] opacity-40">DEPENDENCY</span>
                      <span className="font-mono text-xs">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
