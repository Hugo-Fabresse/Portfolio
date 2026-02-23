import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema } from "@shared/schema";
import type { InsertContactMessage } from "@shared/schema";
import { useContactMessage } from "@/hooks/use-contact";

import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TerminalSquare } from "lucide-react";

export function ContactSection() {
  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: { name: "", email: "", message: "" }
  });

  const contactMutation = useContactMessage();

  function onSubmit(data: InsertContactMessage) {
    contactMutation.mutate(data, {
      onSuccess: () => form.reset()
    });
  }

  return (
    <section id="contact" className="py-24 mb-24">
      <FadeIn>
        <SectionHeading title="Transmission" index="05" />
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <FadeIn delay={0.1}>
          <div>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              Pour toute proposition technique, discussion autour de l'architecture bas niveau ou opportunité nécessitant rigueur et expertise C.
            </p>
            <div className="font-mono text-sm space-y-4 text-muted-foreground/70">
              <div className="flex items-center gap-3">
                <TerminalSquare className="w-4 h-4 text-primary" />
                <span>Format attendu: Protocole standard</span>
              </div>
              <p>STATUS: Prêt à recevoir</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="tech-border bg-card/20 p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs uppercase text-muted-foreground">Identifiant / Nom</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          className="bg-background/50 border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary font-mono px-0 transition-colors" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="font-mono text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs uppercase text-muted-foreground">Canal de retour (Email)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="john@example.com" 
                          type="email"
                          className="bg-background/50 border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary font-mono px-0 transition-colors" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="font-mono text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs uppercase text-muted-foreground">Payload (Message)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Saisissez votre message..." 
                          className="bg-background/50 border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary min-h-[120px] resize-none font-sans px-0 transition-colors" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="font-mono text-xs" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full rounded-none border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground font-mono uppercase tracking-widest transition-all duration-300"
                >
                  {contactMutation.isPending ? "EXECUTION..." : "TRANSMETTRE"}
                </Button>
              </form>
            </Form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
