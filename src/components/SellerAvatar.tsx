import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SellerAvatarProps {
  sellerId: string;
  sellerName?: string;
  sellerAvatar?: string;
  size?: "sm" | "md" | "lg";
  showOnClick?: boolean;
}

export const SellerAvatar = ({ 
  sellerId, 
  sellerName, 
  sellerAvatar,
  size = "md",
  showOnClick = true
}: SellerAvatarProps) => {
  const navigate = useNavigate();
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showOnClick) {
      navigate(`/seller/${sellerId}`);
    }
  };

  return (
    <Avatar 
      className={`${sizeClasses[size]} cursor-pointer border-2 border-white shadow-md hover:shadow-lg transition-shadow`}
      onClick={handleClick}
    >
      <AvatarImage src={sellerAvatar} alt={sellerName} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {sellerName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
};
