import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Sparkles } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-primary text-primary-foreground py-3 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8 cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-3xl font-bold tracking-tight">Sela</h1>
          <p className="hidden md:block text-sm uppercase tracking-wide opacity-90">
            Your Modern Marketplace
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                className="text-primary-foreground hover:bg-primary-foreground/10 hidden md:inline-flex"
                onClick={() => navigate("/ai-assistant")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button 
                variant="ghost" 
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-6 shadow-lg"
                onClick={() => navigate("/sell")}
              >
                SELL
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-primary-foreground hover:bg-primary-foreground/10 hidden md:inline-flex"
                onClick={() => navigate("/auth")}
              >
                Sign in
              </Button>
              <Button 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-6 shadow-lg"
                onClick={() => navigate("/auth")}
              >
                SELL
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
