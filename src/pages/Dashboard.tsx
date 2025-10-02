import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, MessageSquare, User as UserIcon, LogOut, Sparkles, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";

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
          {/* Header with Stats */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
                <p className="text-muted-foreground">Manage your store and grow your business</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => navigate("/ai-assistant")} variant="outline" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Assistant
                </Button>
                <Button onClick={handleSignOut} variant="outline" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Listings</p>
                      <p className="text-3xl font-bold">{myProducts.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Messages</p>
                      <p className="text-3xl font-bold">{conversations.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                      <p className="text-3xl font-bold">{myProducts.reduce((acc, p) => acc + (p.views_count || 0), 0)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">My Listings</span>
                <span className="sm:hidden">Listings</span>
                <Badge variant="secondary" className="ml-2">{myProducts.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Chat</span>
                {conversations.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{conversations.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Me</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-2xl">My Listings</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Manage your products and track performance</p>
                  </div>
                  <Button onClick={() => navigate("/sell")} size="lg" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Post New Ad</span>
                    <span className="sm:hidden">Post</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  {myProducts.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                      <p className="text-muted-foreground mb-6">Start selling by creating your first product listing</p>
                      <Button onClick={() => navigate("/sell")} size="lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Listing
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myProducts.map((product: any) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          image={product.images?.[0] || "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&q=80"}
                          price={product.price}
                          title={product.title}
                          description={product.description}
                          location={product.location}
                          isVerified={product.is_verified}
                          isPopular={product.is_popular}
                          condition={product.condition}
                          sellerId={user?.id}
                          sellerName={profile?.full_name}
                          sellerAvatar={profile?.avatar_url}
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
