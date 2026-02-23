import { Terminal } from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";

const navItems = [
  { id: "hero", label: "Présentation", index: "00" },
  { id: "projects", label: "Projets", index: "01" },
  { id: "environment", label: "Environnement", index: "02" },
  { id: "experience", label: "Expérience", index: "03" },
  { id: "expertise", label: "Expertise", index: "04" },
  { id: "contact", label: "Contact", index: "05" },
];

export function Sidebar() {
  const activeSection = useActiveSection(navItems.map(item => item.id));

  return (
    <nav className="md:w-72 md:fixed md:inset-y-0 md:left-0 border-r border-border/50 bg-background/95 backdrop-blur z-50 p-8 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center gap-3 mb-16">
          <Terminal className="w-8 h-8 text-primary" />
          <span className="font-mono font-bold text-xl tracking-tight">SYS_DEV</span>
        </div>
        
        <ul className="space-y-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`}
                  className={`flex items-center group transition-all duration-300 ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-xs mr-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    {item.index}.
                  </span>
                  <span className={`text-sm tracking-widest uppercase ${isActive ? "tech-glow" : ""}`}>
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="font-mono text-xs text-muted-foreground/50">
        <p>STATUS: ONLINE</p>
        <p>SYSTEM: NOMINAL</p>
      </div>
    </nav>
  );
}

export function MobileNav() {
  return (
    <nav className="w-full sticky top-0 border-b border-border/50 bg-background/95 backdrop-blur z-50 p-4 flex justify-between items-center md:hidden">
      <div className="flex items-center gap-2">
        <Terminal className="w-6 h-6 text-primary" />
        <span className="font-mono font-bold text-lg">SYS_DEV</span>
      </div>
    </nav>
  );
}
