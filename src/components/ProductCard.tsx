import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SellerAvatar } from "./SellerAvatar";

interface ProductCardProps {
  id?: string;
  image: string;
  price: string;
  title: string;
  description?: string;
  location: string;
  isVerified?: boolean;
  isPopular?: boolean;
  condition?: string;
  rating?: number;
  sellerId?: string;
  sellerName?: string;
  sellerAvatar?: string;
}

export const ProductCard = ({
  id,
  image,
  price,
  title,
  description,
  location,
  isVerified = false,
  isPopular = false,
  condition,
  rating,
  sellerId,
  sellerName,
  sellerAvatar
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 hover:shadow-xl transition-all duration-300 rounded-xl bg-card"
      onClick={() => id && navigate(`/product/${id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Seller Avatar - Top Left */}
        {sellerId && (
          <div className="absolute top-3 left-3 z-10">
            <SellerAvatar 
              sellerId={sellerId}
              sellerName={sellerName}
              sellerAvatar={sellerAvatar}
              size="sm"
            />
          </div>
        )}
        
        {/* Badges - Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {isVerified && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs shadow-lg">
              Verified
            </Badge>
          )}
          {isPopular && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs shadow-lg">
              Popular
            </Badge>
          )}
        </div>
        
        {/* Rating - Bottom Right */}
        {rating && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-foreground">{rating}</span>
          </div>
        )}
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-2xl font-bold text-primary">₦{price}</h3>
          {condition && (
            <Badge variant="outline" className="text-xs shrink-0">
              {condition}
            </Badge>
          )}
        </div>
        
        <h4 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] text-foreground">
          {title}
        </h4>
        
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </CardContent>
    </Card>
  );
};
