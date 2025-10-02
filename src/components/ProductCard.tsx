import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id?: string;
  image: string;
  price: string;
  title: string;
  location: string;
  isVerified?: boolean;
  isPopular?: boolean;
  condition?: string;
  rating?: number;
}

export const ProductCard = ({
  id,
  image,
  price,
  title,
  location,
  isVerified = false,
  isPopular = false,
  condition,
  rating
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border hover:shadow-lg transition-all"
      onClick={() => id && navigate(`/product/${id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isVerified && (
            <Badge variant="secondary" className="bg-blue-500 text-white text-xs">
              Verified ID
            </Badge>
          )}
          {isPopular && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">
              POPULAR
            </Badge>
          )}
        </div>
        {rating && (
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded flex items-center gap-1">
            <span className="text-xs font-semibold">{rating}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-primary mb-1">₦ {price}</h3>
        <p className="text-sm font-medium mb-2 line-clamp-2 min-h-[2.5rem]">{title}</p>
        
        <div className="flex items-start justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span>{location}</span>
          </div>
          {condition && (
            <Badge variant="outline" className="text-xs">
              {condition}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
