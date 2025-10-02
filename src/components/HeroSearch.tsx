import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const HeroSearch = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-purple-700 text-primary-foreground py-20 px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-3xl text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Find Anything You Need
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Discover amazing deals from trusted sellers
        </p>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-48 bg-input text-foreground">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Nigeria</SelectItem>
              <SelectItem value="lagos">Lagos</SelectItem>
              <SelectItem value="abuja">Abuja</SelectItem>
              <SelectItem value="kano">Kano</SelectItem>
              <SelectItem value="ibadan">Ibadan</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative flex-1">
            <Input 
              placeholder="I am looking for..." 
              className="pr-12 bg-input text-foreground"
            />
            <Button 
              size="icon" 
              className="absolute right-1 top-1 bg-transparent hover:bg-muted"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
