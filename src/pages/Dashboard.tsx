import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, MessageSquare, User as UserIcon, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ProductCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(profileData);

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", session.user.id)
        .order("created_at", { ascending: false });
      setMyProducts(productsData || []);

      const { data: convsData } = await supabase
        .from("conversations")
        .select(`
          *,
          products (*),
          buyer:buyer_id (*),
          seller:seller_id (*)
        `)
        .or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
        .order("updated_at", { ascending: false });
      setConversations(convsData || []);
    };

    fetchData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">
                <Package className="h-4 w-4 mr-2" />
                My Listings
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="profile">
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Listings</CardTitle>
                  <Button onClick={() => navigate("/sell")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Ad
                  </Button>
                </CardHeader>
                <CardContent>
                  {myProducts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>You haven't posted any ads yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {myProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          image={product.images?.[0] || "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&q=80"}
                          price={product.price}
                          title={product.title}
                          location={product.location}
                          isVerified={product.is_verified}
                          isPopular={product.is_popular}
                          condition={product.condition}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  {conversations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conversations.map((conv) => {
                        const otherUser = conv.buyer_id === user?.id ? conv.seller : conv.buyer;
                        return (
                          <div
                            key={conv.id}
                            onClick={() => navigate(`/chat/${conv.id}`)}
                            className="p-4 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold">{otherUser?.full_name || "User"}</p>
                                <p className="text-sm text-muted-foreground">
                                  {conv.products?.title}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(conv.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Full Name</p>
                      <p className="text-muted-foreground">{profile?.full_name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Email</p>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Phone</p>
                      <p className="text-muted-foreground">{profile?.phone || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Location</p>
                      <p className="text-muted-foreground">{profile?.location || "Not set"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
