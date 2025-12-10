import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const { user } = useAuth();
  const { totalItems } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto container-padding">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img 
              src="/lovable-uploads/85aa829a-09be-4004-835a-f02019132e69.png" 
              alt="ENDLESS" 
              className="w-9 h-9 object-contain"
            />
            <span className="font-display font-semibold text-lg text-foreground tracking-tight">
              ENDLESS
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive(item.href)
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/tentes">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                Découvrir
              </Button>
            </Link>
            
            <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] w-5 h-5 flex items-center justify-center p-0 font-semibold">
                  {totalItems}
                </Badge>
              )}
            </Link>
            
            <Link 
              to={user ? "/mon-compte" : "/auth"} 
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Menu mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] w-5 h-5 flex items-center justify-center p-0 font-semibold">
                  {totalItems}
                </Badge>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden border-t border-border/50 py-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-3 py-2.5 text-sm font-medium transition-colors rounded-md",
                      isActive(item.href)
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-2">
                <Link to="/tentes" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Découvrir STARZZ
                  </Button>
                </Link>
                <Link to={user ? "/mon-compte" : "/auth"} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    {user ? "Mon compte" : "Connexion"}
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
