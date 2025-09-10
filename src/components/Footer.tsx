import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charbon text-os">
      <div className="container mx-auto container-padding">
        {/* Contenu principal */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">E</span>
              </div>
              <span className="font-display font-bold text-xl text-ambre">
                ENDLESS
              </span>
            </Link>
            <p className="text-os/80 leading-relaxed">
              Fournisseur de rêves étoilés
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-os/60 hover:text-ambre transition-colors focus-outdoor p-2 -m-2"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-os/60 hover:text-ambre transition-colors focus-outdoor p-2 -m-2"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-os/60 hover:text-ambre transition-colors focus-outdoor p-2 -m-2"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Produits */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-ambre">Nos Produits</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tentes?filter=hard-shell" className="text-os/80 hover:text-os transition-colors">
                  Tente STARZZ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-ambre">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/installation" className="text-os/80 hover:text-os transition-colors">
                  Installation
                </Link>
              </li>
              <li>
                <Link to="/maintenance" className="text-os/80 hover:text-os transition-colors">
                  Maintenance
                </Link>
              </li>
              <li>
                <Link to="/location" className="text-os/80 hover:text-os transition-colors">
                  Location
                </Link>
              </li>
              <li>
                <Link to="/garantie" className="text-os/80 hover:text-os transition-colors">
                  Garantie 3 ans
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-os/80 hover:text-os transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-os/80 hover:text-os transition-colors">
                  Blog & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-ambre">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-ambre flex-shrink-0" />
                <div className="text-os/80 text-sm">
                  Rue de l'Aventure 42<br />
                  1000 Bruxelles
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-ambre flex-shrink-0" />
                <a 
                  href="tel:+32497228743" 
                  className="text-os/80 hover:text-os transition-colors"
                >
                  +32 497 22 87 43
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-ambre flex-shrink-0" />
                <a 
                  href="mailto:info@endless-tents.be" 
                  className="text-os/80 hover:text-os transition-colors"
                >
                  info@endless-tents.be
                </a>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-os/60">
                Showroom ouvert :<br />
                Lun-Ven 9h-18h • Sam 9h-17h
              </p>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="border-t border-os/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-os/60">
              <p>&copy; {currentYear} ENDLESS. Tous droits réservés.</p>
              <div className="flex gap-4">
                <Link to="/mentions-legales" className="hover:text-os transition-colors">
                  Mentions légales
                </Link>
                <Link to="/politique-confidentialite" className="hover:text-os transition-colors">
                  Confidentialité
                </Link>
                <Link to="/cgv" className="hover:text-os transition-colors">
                  CGV
                </Link>
              </div>
            </div>
            <div className="text-sm text-os/60">
              🇧🇪 Entreprise belge • TVA BE 0123.456.789
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};