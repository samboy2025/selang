import { ProductCard } from "./ProductCard";

const products = [
  {
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&q=80",
    price: "57,000,000",
    title: "Mercedes-Benz GLE43 3.0 AWD 2016 Gray",
    location: "Lagos, Ikeja",
    isPopular: true,
    condition: "Foreign Used"
  },
  {
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&q=80",
    price: "60,000,000",
    title: "Lexus LX 570 2012 Black",
    location: "Lagos, Ajah",
    isVerified: true,
    condition: "Foreign Used",
    rating: 5
  },
  {
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80",
    price: "156,000,000",
    title: "Lexus TX TX 350 AWD 2024 White",
    location: "Lagos, Lekki",
    isVerified: true,
    condition: "Brand New"
  },
  {
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80",
    price: "7,200,000",
    title: "Toyota Aygo 2010 Silver",
    location: "Abuja, Gwagwa",
    isPopular: true,
    condition: "Foreign Used",
    rating: 5
  },
  {
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80",
    price: "4,500,000",
    title: "Honda Accord 2015 Black",
    location: "Lagos, Ikoyi",
    isVerified: true,
    condition: "Nigerian Used"
  },
  {
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80",
    price: "8,900,000",
    title: "Toyota Camry 2018 White",
    location: "Abuja, Asokoro",
    condition: "Foreign Used",
    rating: 4.5
  },
  {
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
    price: "12,500,000",
    title: "BMW X5 2016 Gray",
    location: "Lagos, VI",
    isPopular: true,
    isVerified: true,
    condition: "Foreign Used"
  },
  {
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&q=80",
    price: "3,200,000",
    title: "Nissan Altima 2013 Red",
    location: "Kano, Nasarawa",
    condition: "Nigerian Used"
  }
];

export const TrendingAds = () => {
  return (
    <section className="py-8 px-4 bg-background">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending ads</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};
