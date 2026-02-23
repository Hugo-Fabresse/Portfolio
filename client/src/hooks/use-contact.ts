import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { ContactMessageInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useContactMessage() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: ContactMessageInput) => {
      const res = await fetch(api.contact.create.path, {
        method: api.contact.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let errorMsg = "Échec de l'envoi du message.";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          // Fallback if parsing fails
        }
        throw new Error(errorMsg);
      }

      return api.contact.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Transmission réussie",
        description: "Votre message a été enregistré dans le système.",
        className: "border-primary/50 bg-card text-foreground font-mono",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur système",
        description: error.message,
        className: "font-mono",
      });
    }
  });
}
