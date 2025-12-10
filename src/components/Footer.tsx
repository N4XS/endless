import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto container-padding">
        {/* Main content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img 
                src="/lovable-uploads/85aa829a-09be-4004-835a-f02019132e69.png" 
                alt="ENDLESS" 
                className="w-8 h-8 object-contain brightness-0 invert"
              />
              <span className="font-display font-semibold text-lg">
                ENDLESS
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm max-w-xs leading-relaxed">
              Tentes de toit premium conçues en Belgique pour les aventuriers modernes.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/endless.tents/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-primary-foreground/60 hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61579226801441" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-primary-foreground/60 hover:text-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@endless.tents" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-primary-foreground/60 hover:text-secondary transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">Produits</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/tentes" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    STARZZ 140
                  </Link>
                </li>
                <li>
                  <Link to="/location" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    Location
                  </Link>
                </li>
                <li>
                  <Link to="/garantie" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    Garantie
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">Support</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/faq" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/50">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Namur, Belgique</span>
              </div>
              <a href="tel:+32497228743" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>+32 497 22 87 43</span>
              </a>
              <a href="mailto:info@endless-tents.com" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>info@endless-tents.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
            <div className="flex items-center gap-4">
              <span>© {currentYear} ENDLESS</span>
              <span className="hidden sm:inline">•</span>
              <span>TVA BE1023.197.471</span>
            </div>
            <div className="flex gap-4">
              <Link to="/mentions-legales" className="hover:text-primary-foreground transition-colors">
                Mentions légales
              </Link>
              <Link to="/politique-confidentialite" className="hover:text-primary-foreground transition-colors">
                Confidentialité
              </Link>
              <Link to="/cgv" className="hover:text-primary-foreground transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
