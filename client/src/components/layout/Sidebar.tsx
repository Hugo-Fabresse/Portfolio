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
    <nav className="md:w-64 md:fixed md:inset-y-0 md:left-0 border-r border-border bg-background z-50 p-10 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="mb-20">
          <div className="font-mono font-bold text-2xl tracking-tighter">SYS_ARCH</div>
          <div className="mono-label mt-1">v.2.0.26</div>
        </div>
        
        <ul className="space-y-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`}
                  className={`flex items-center group transition-none ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className={`text-xs font-mono uppercase tracking-[0.2em] ${isActive ? "font-bold" : ""}`}>
					  {isActive && <span className="mr-2">{">>"}</span>}
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mono-label opacity-30 space-y-1">
        <p>SEC_LAYER: ACTIVE</p>
        <p>ENCRYPTION: AES-256</p>
        <p>© 2026 ROOT_USR</p>
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
