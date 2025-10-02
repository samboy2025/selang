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
    <section className="bg-primary text-primary-foreground py-16 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          What are you looking for?
        </h2>
        
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
