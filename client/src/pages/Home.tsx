import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { HeroSection } from "@/components/sections/Hero";
import { ProjectsSection } from "@/components/sections/Projects";
import { EnvironmentSection } from "@/components/sections/Environment";
import { ExperienceSection } from "@/components/sections/Experience";
import { ExpertiseSection } from "@/components/sections/Expertise";
import { ContactSection } from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row selection:bg-primary/30 selection:text-primary">
      <MobileNav />
      <Sidebar />
      <main className="flex-1 md:ml-72 px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto w-full">
        <HeroSection />
        <ProjectsSection />
        <EnvironmentSection />
        <ExperienceSection />
        <ExpertiseSection />
        <ContactSection />
        
        <footer className="py-8 border-t border-border/50 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} SYS_DEV. Tous droits réservés.
          </span>
          <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 border border-primary/20">
            SYSTEM_HALT: FALSE
          </span>
        </footer>
      </main>
    </div>
  );
}
