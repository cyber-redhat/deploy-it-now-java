
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { Cart } from "@/components/Cart";
import { CheckoutModal } from "@/components/CheckoutModal";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  // Sample products data
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Premium Laptop",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        description: "High-performance laptop for work and gaming",
        category: "electronics",
        inStock: true
      },
      {
        id: "2",
        name: "Wireless Headphones",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        description: "Premium wireless headphones with noise cancellation",
        category: "electronics",
        inStock: true
      },
      {
        id: "3",
        name: "Smart Watch",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        description: "Advanced fitness tracking and smart features",
        category: "electronics",
        inStock: true
      },
      {
        id: "4",
        name: "Coffee Maker",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        description: "Professional grade coffee maker for home",
        category: "home",
        inStock: true
      },
      {
        id: "5",
        name: "Reading Chair",
        price: 459.99,
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
        description: "Comfortable ergonomic reading chair",
        category: "furniture",
        inStock: true
      },
      {
        id: "6",
        name: "Desk Lamp",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
        description: "Modern LED desk lamp with adjustable brightness",
        category: "home",
        inStock: false
      }
    ];
    setProducts(sampleProducts);
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={getTotalItems()}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to TechStore
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover amazing products at unbeatable prices
          </p>
        </section>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md transition-colors capitalize ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={filteredProducts}
          onAddToCart={addToCart}
        />
      </main>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        totalPrice={getTotalPrice()}
        onOrderComplete={() => {
          setCartItems([]);
          setIsCheckoutOpen(false);
          toast({
            title: "Order placed successfully!",
            description: "Thank you for your purchase. You will receive a confirmation email shortly.",
          });
        }}
      />
    </div>
  );
};

export default Index;
