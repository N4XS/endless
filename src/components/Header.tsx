import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'STARZZ', href: '/tentes' },
  { name: 'Location', href: '/location' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto container-padding">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/85aa829a-09be-4004-835a-f02019132e69.png" 
              alt="ENDLESS Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="font-display font-bold text-xl text-sapin">
              ENDLESS
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors focus-outdoor",
                  isActive(item.href)
                    ? "bg-muted text-sapin font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTAs desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/location">
              <Button variant="outline" size="sm" className="border-olive text-olive hover:bg-olive hover:text-olive-foreground">
                Louer une tente
              </Button>
            </Link>
            <Link to="/tentes">
              <Button size="sm" className="bg-sapin hover:bg-sapin/90 text-primary-foreground">
                Acheter une tente
              </Button>
            </Link>
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center p-0">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Auth buttons */}
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <User className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-outdoor"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile ouvert */}
        {isOpen && (
          <div className="md:hidden border-t border-border mt-2 pt-4 pb-4 space-y-2 animate-fade-in">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-muted text-sapin font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link to="/location" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full border-olive text-olive">
                  Louer une tente
                </Button>
              </Link>
              <Link to="/tentes" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-sapin hover:bg-sapin/90">
                  Acheter une tente
                </Button>
              </Link>
              <Link to="/cart" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Panier ({totalItems})
                </Button>
              </Link>
              
              {/* Auth mobile */}
              {user ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <User className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};