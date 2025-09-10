import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { products } from '@/data/products';
import { Product, FilterState } from '@/types';

const Tentes = () => {
  const [filters, setFilters] = useState<FilterState>({
    sleeping: [],
    shell: [],
    weight: [],
    price: [0, 3000],
  });
  
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Filtre les tentes uniquement
  const tents = products.filter(product => product.category === 'tent');

  // Applique les filtres
  const filteredProducts = tents.filter(product => {
    if (filters.sleeping && filters.sleeping.length > 0 && !filters.sleeping.includes(product.specs.sleeping)) {
      return false;
    }
    if (filters.shell && filters.shell.length > 0 && !filters.shell.includes(product.specs.shell)) {
      return false;
    }
    if (filters.price && (product.price < filters.price[0] || product.price > filters.price[1])) {
      return false;
    }
    return true;
  });

  // Trie les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'weight':
        return a.specs.weightKg - b.specs.weightKg;
      case 'sleeping':
        return b.specs.sleeping - a.specs.sleeping;
      default:
        return 0;
    }
  });

  const handleFilterChange = (type: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      sleeping: [],
      shell: [],
      weight: [],
      price: [0, 3000],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto container-padding py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-display text-sapin mb-4">Tentes de Toit</h1>
          <p className="text-large text-muted-foreground">
            Découvrez notre gamme complète de tentes de toit hard-shell et soft-shell
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filtres latéraux */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 space-y-6`}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Filtres</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Effacer
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nombre de couchages */}
                <div>
                  <h3 className="font-semibold mb-3">Couchages</h3>
                  <div className="space-y-2">
                    {[2, 3, 4].map(num => (
                      <div key={num} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sleeping-${num}`}
                          checked={filters.sleeping?.includes(num)}
                          onCheckedChange={(checked) => {
                            const current = filters.sleeping || [];
                            if (checked) {
                              handleFilterChange('sleeping', [...current, num]);
                            } else {
                              handleFilterChange('sleeping', current.filter(n => n !== num));
                            }
                          }}
                        />
                        <label htmlFor={`sleeping-${num}`} className="text-sm">
                          {num} personnes
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type d'ouverture */}
                <div>
                  <h3 className="font-semibold mb-3">Type d'ouverture</h3>
                  <div className="space-y-2">
                    {['hard', 'soft'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`shell-${type}`}
                          checked={filters.shell?.includes(type)}
                          onCheckedChange={(checked) => {
                            const current = filters.shell || [];
                            if (checked) {
                              handleFilterChange('shell', [...current, type]);
                            } else {
                              handleFilterChange('shell', current.filter(t => t !== type));
                            }
                          }}
                        />
                        <label htmlFor={`shell-${type}`} className="text-sm capitalize">
                          {type === 'hard' ? 'Hard-shell' : 'Soft-shell'}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <h3 className="font-semibold mb-3">Prix</h3>
                  <div className="px-2">
                    <Slider
                      value={filters.price || [0, 3000]}
                      onValueChange={(value) => handleFilterChange('price', value)}
                      max={3000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>{filters.price?.[0] || 0}€</span>
                      <span>{filters.price?.[1] || 3000}€</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre de tri */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
                <span className="text-sm text-muted-foreground">
                  {sortedProducts.length} tente{sortedProducts.length > 1 ? 's' : ''} trouvée{sortedProducts.length > 1 ? 's' : ''}
                </span>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Pertinence</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="weight">Poids</SelectItem>
                  <SelectItem value="sleeping">Couchages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grille de produits */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Message si aucun résultat */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏕️</div>
                <h3 className="text-xl font-semibold mb-2">Aucune tente trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez d'ajuster vos filtres ou explorez toute notre gamme
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tentes;