import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user);
    });
  }, []);

  useEffect(() => {
    const fetchConversation = async () => {
      const { data: convData, error } = await (supabase as any)
        .from("conversations")
        .select(`
          *,
          products (*),
          buyer:buyer_id (*),
          seller:seller_id (*)
        `)
        .eq("id", conversationId)
        .single();

      if (error || !convData) {
        toast({
          title: "Error",
          description: "Conversation not found",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setConversation(convData);
    };

    const fetchMessages = async () => {
      const { data: messagesData } = await (supabase as any)
        .from("messages")
        .select(`
          *,
          sender:sender_id (*)
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      setMessages(messagesData || []);
      scrollToBottom();
    };

    fetchConversation();
    fetchMessages();

    // Subscribe to new messages
    const channel = (supabase as any)
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload: any) => {
          const { data: newMsg } = await (supabase as any)
            .from("messages")
            .select(`*, sender:sender_id (*)`)
            .eq("id", payload.new.id)
            .single();

          if (newMsg) {
            setMessages((prev) => [...prev, newMsg]);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, navigate, toast]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const { error } = await (supabase as any).from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUser.id,
      content: newMessage.trim(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Could not send message",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
  };

  const otherUser = conversation?.buyer_id === currentUser?.id 
    ? conversation?.seller 
    : conversation?.buyer;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 py-4 flex-1 flex flex-col max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {conversation && (
            <Card className="mb-4 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{otherUser?.full_name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">
                    About: {conversation.products?.title}
                  </p>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ₦ {Number(conversation.products?.price).toLocaleString()}
                </p>
              </div>
            </Card>
          )}

          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender_id === currentUser?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Chat;
