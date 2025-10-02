import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, User, MessageCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user);
    });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data: productData, error } = await (supabase as any)
        .from("products")
        .select(`
          *,
          profiles:seller_id (*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      if (productData) {
        setProduct(productData);
        setSeller(productData.profiles);
        
        // Increment view count
        await (supabase as any)
          .from("products")
          .update({ views_count: (productData.views_count || 0) + 1 })
          .eq("id", id);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const handleContactSeller = async () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact the seller",
      });
      navigate("/auth");
      return;
    }

    // Create or find conversation
    const { data: existingConv } = await (supabase as any)
      .from("conversations")
      .select("id")
      .eq("product_id", product.id)
      .eq("buyer_id", currentUser.id)
      .eq("seller_id", product.seller_id)
      .maybeSingle();

    if (existingConv?.id) {
      navigate(`/chat/${existingConv.id}`);
    } else {
      const { data: newConv, error } = await (supabase as any)
        .from("conversations")
        .insert({
          product_id: product.id,
          buyer_id: currentUser.id,
          seller_id: product.seller_id,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Could not start conversation",
          variant: "destructive",
        });
        return;
      }

      if (newConv?.id) {
        navigate(`/chat/${newConv.id}`);
      }
    }
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
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to listings
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
              <img
                src={product.images?.[0] || "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.title} ${i + 2}`}
                    className="aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              {product.is_verified && (
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  Verified ID
                </Badge>
              )}
              {product.is_popular && (
                <Badge className="bg-accent">POPULAR</Badge>
              )}
              {product.condition && (
                <Badge variant="outline">{product.condition}</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-4xl font-bold text-primary mb-4">
              ₦ {Number(product.price).toLocaleString()}
            </p>

            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="h-4 w-4" />
              <span>{product.location}</span>
            </div>

            <div className="border-t pt-6 mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description || "No description provided"}
              </p>
            </div>

            <div className="border-t pt-6 mb-6">
              <h2 className="text-xl font-semibold mb-3">Seller Information</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{seller?.full_name || "Anonymous"}</p>
                  <p className="text-sm text-muted-foreground">Member since {new Date(seller?.created_at).getFullYear()}</p>
                </div>
              </div>
              {seller?.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Phone className="h-4 w-4" />
                  <span>{seller.phone}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleContactSeller}
              className="w-full"
              size="lg"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
