import { ProductCard } from "./ProductCard";

const products = [
  {
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&q=80",
    price: "57,000,000",
    title: "Mercedes-Benz GLE43 3.0 AWD 2016 Gray",
    description: "Luxury SUV in excellent condition with low mileage",
    location: "Lagos, Ikeja",
    isPopular: true,
    condition: "Foreign Used",
    sellerId: "seller1",
    sellerName: "Auto Dealers Ltd",
    sellerAvatar: undefined
  },
  {
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&q=80",
    price: "60,000,000",
    title: "Lexus LX 570 2012 Black",
    description: "Premium luxury vehicle with full service history",
    location: "Lagos, Ajah",
    isVerified: true,
    condition: "Foreign Used",
    rating: 5,
    sellerId: "seller2",
    sellerName: "Premium Motors",
    sellerAvatar: undefined
  },
  {
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80",
    price: "156,000,000",
    title: "Lexus TX TX 350 AWD 2024 White",
    description: "Brand new 2024 model, latest features and technology",
    location: "Lagos, Lekki",
    isVerified: true,
    condition: "Brand New",
    sellerId: "seller3",
    sellerName: "Elite Autos",
    sellerAvatar: undefined
  },
  {
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80",
    price: "7,200,000",
    title: "Toyota Aygo 2010 Silver",
    description: "Fuel efficient compact car, perfect for city driving",
    location: "Abuja, Gwagwa",
    isPopular: true,
    condition: "Foreign Used",
    rating: 5,
    sellerId: "seller4",
    sellerName: "City Cars",
    sellerAvatar: undefined
  },
  {
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&q=80",
    price: "4,500,000",
    title: "Honda Accord 2015 Black",
    description: "Well maintained family sedan with excellent features",
    location: "Lagos, Ikoyi",
    isVerified: true,
    condition: "Nigerian Used",
    sellerId: "seller5",
    sellerName: "Family Autos",
    sellerAvatar: undefined
  },
  {
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80",
    price: "8,900,000",
    title: "Toyota Camry 2018 White",
    description: "Reliable and comfortable sedan in pristine condition",
    location: "Abuja, Asokoro",
    condition: "Foreign Used",
    rating: 4.5,
    sellerId: "seller6",
    sellerName: "Trust Motors",
    sellerAvatar: undefined
  },
  {
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
    price: "12,500,000",
    title: "BMW X5 2016 Gray",
    description: "Powerful luxury SUV with premium interior and tech",
    location: "Lagos, VI",
    isPopular: true,
    isVerified: true,
    condition: "Foreign Used",
    sellerId: "seller7",
    sellerName: "Luxury Wheels",
    sellerAvatar: undefined
  },
  {
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&q=80",
    price: "3,200,000",
    title: "Nissan Altima 2013 Red",
    description: "Affordable and reliable vehicle for daily use",
    location: "Kano, Nasarawa",
    condition: "Nigerian Used",
    sellerId: "seller8",
    sellerName: "Budget Cars",
    sellerAvatar: undefined
  }
];

export const TrendingAds = () => {
  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Trending Products</h2>
            <p className="text-muted-foreground">Discover the most popular items</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};
