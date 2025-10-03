import { Header } from "@/components/Header";
import { HeroSearch } from "@/components/HeroSearch";
import { CategoryGrid } from "@/components/CategoryGrid";
import { TrendingAds } from "@/components/TrendingAds";
import { AISidebar } from "@/components/AISidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSearch />
      <CategoryGrid />
      <TrendingAds />
      <AISidebar />
    </div>
  );
};

export default Index;
