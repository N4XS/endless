import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { User, ShoppingBag, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const navigationItems = [
    {
      name: 'Tableau de bord',
      href: '/mon-compte',
      icon: User
    },
    {
      name: 'Mes commandes',
      href: '/mon-compte/commandes',
      icon: ShoppingBag
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-foreground">Bienvenue</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === '/mon-compte'}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};