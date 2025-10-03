import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Sparkles, ShieldCheck } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data: roles } = await (supabase as any).from("user_roles").select("role").eq("user_id", userId);
    const hasAdminRole = roles?.some((r: any) => r.role === "admin");
    setIsAdmin(hasAdminRole || false);
  };

  return (
    <header className="bg-primary text-primary-foreground py-3 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8 cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-3xl font-bold tracking-tight">Sela</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* AI Assistant - Public Access */}
          <Button 
            variant="ghost" 
            className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
            onClick={() => navigate("/ai-assistant")}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </Button>

          {user ? (
            <>
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
                  onClick={() => navigate("/admin")}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden lg:inline">Admin</span>
                </Button>
              )}
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
