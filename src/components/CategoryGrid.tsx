import { Car, Home, Smartphone, Laptop, Sofa, Shirt, Sparkles, Wrench, Briefcase, Hammer, Box, Baby, Apple, Bone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Vehicles", icon: Car, count: "333,956 ads", color: "bg-blue-50 hover:bg-blue-100" },
  { name: "Property", icon: Home, count: "113,923 ads", color: "bg-purple-50 hover:bg-purple-100" },
  { name: "Mobile Phones & Tablets", icon: Smartphone, count: "97,442 ads", color: "bg-green-50 hover:bg-green-100" },
  { name: "Electronics", icon: Laptop, count: "277,931 ads", color: "bg-orange-50 hover:bg-orange-100" },
  { name: "Home, Furniture & Appliances", icon: Sofa, count: "571,145 ads", color: "bg-red-50 hover:bg-red-100" },
  { name: "Fashion", icon: Shirt, count: "169,112 ads", color: "bg-pink-50 hover:bg-pink-100" },
  { name: "Beauty & Personal Care", icon: Sparkles, count: "77,197 ads", color: "bg-yellow-50 hover:bg-yellow-100" },
  { name: "Services", icon: Briefcase, count: "92,658 ads", color: "bg-teal-50 hover:bg-teal-100" },
  { name: "Repair & Construction", icon: Hammer, count: "369,054 ads", color: "bg-gray-50 hover:bg-gray-100" },
  { name: "Commercial Equipment", icon: Box, count: "172,953 ads", color: "bg-indigo-50 hover:bg-indigo-100" },
  { name: "Babies & Kids", icon: Baby, count: "29,254 ads", color: "bg-rose-50 hover:bg-rose-100" },
  { name: "Food & Agriculture", icon: Apple, count: "31,855 ads", color: "bg-lime-50 hover:bg-lime-100" },
  { name: "Animals & Pets", icon: Bone, count: "11,878 ads", color: "bg-amber-50 hover:bg-amber-100" },
  { name: "Other", icon: Wrench, count: "45,321 ads", color: "bg-cyan-50 hover:bg-cyan-100" },
];

export const CategoryGrid = () => {
  return (
    <section className="py-6 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-4">Browse Categories</h2>
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory">
            {categories.map((category) => (
              <button
                key={category.name}
                className="flex-shrink-0 snap-start group"
              >
                <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-300 min-w-[100px] shadow-sm hover:shadow-md border border-border hover:border-primary">
                  <category.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-xs text-center line-clamp-2 leading-tight">
                    {category.name}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {category.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
