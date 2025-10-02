import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { User, MapPin, Calendar, Package, Star, UserPlus, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SellerProfile = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user);
    });
  }, []);

  useEffect(() => {
    const fetchSellerData = async () => {
      // Fetch seller profile
      const { data: profileData } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", sellerId)
        .single();

      if (!profileData) {
        toast({
          title: "Seller not found",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setSeller(profileData);

      // Fetch seller's products
      const { data: productsData } = await (supabase as any)
        .from("products")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      setProducts(productsData || []);
      setLoading(false);
    };

    if (sellerId) {
      fetchSellerData();
    }
  }, [sellerId, navigate, toast]);

  const handleFollow = async () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow sellers",
      });
      navigate("/auth");
      return;
    }

    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing ? "You unfollowed this seller" : "You are now following this seller",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Seller Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
                <AvatarImage src={seller?.avatar_url} alt={seller?.full_name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {seller?.full_name?.charAt(0)?.toUpperCase() || <User className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{seller?.full_name || "Anonymous Seller"}</h1>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {seller?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{seller.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(seller?.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{products.length} listings</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    size="lg"
                    className="shrink-0"
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                    4.8 Rating
                  </Badge>
                  <Badge variant="secondary">Verified Seller</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller's Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Listings from {seller?.full_name || "this seller"}</h2>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">This seller has no active listings</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
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
                sellerId={seller.id}
                sellerName={seller.full_name}
                sellerAvatar={seller.avatar_url}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerProfile;
