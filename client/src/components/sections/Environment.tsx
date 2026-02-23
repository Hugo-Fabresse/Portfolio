import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Terminal, Cpu, Layout, Code2 } from "lucide-react";

const envTools = [
  { 
    category: "OS", 
    name: "Arch Linux", 
    desc: "Contrôle absolu sur le système, pas d'installations superflues.",
    icon: Terminal 
  },
  { 
    category: "Kernel", 
    name: "LTS Kernel", 
    desc: "Stabilité et prédictibilité pour le développement bas niveau.",
    icon: Cpu 
  },
  { 
    category: "Editor", 
    name: "Neovim", 
    desc: "Configuration manuelle exclusive, hautement optimisée pour le développement C.",
    icon: Code2 
  },
  { 
    category: "WM", 
    name: "Hyprland", 
    desc: "Gestionnaire de fenêtres minimaliste, efficacité au clavier maximale.",
    icon: Layout 
  }
];

export function EnvironmentSection() {
  return (
    <section id="environment" className="py-24">
      <FadeIn>
        <SectionHeading title="Environnement Technique" index="02" />
      </FadeIn>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {envTools.map((tool, i) => (
          <FadeIn key={tool.name} delay={i * 0.1} direction="up">
            <div className="tech-border bg-card/30 p-6 flex items-start gap-4 h-full group">
              <div className="mt-1">
                <tool.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{tool.name}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 bg-muted text-primary">
                    {tool.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
