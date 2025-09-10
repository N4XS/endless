import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto container-padding py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Mentions légales
            </h1>
            <p className="text-muted-foreground text-lg">
              Informations légales concernant ENDLESS
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Éditeur du site
              </h2>
              <div className="bg-card p-6 rounded-lg border">
                <ul className="space-y-2 text-foreground">
                  <li><strong>Dénomination commerciale :</strong> ENDLESS</li>
                  <li><strong>Statut / forme :</strong> Indépendant (personne physique) — Belgique</li>
                  <li><strong>Titulaire :</strong> Alexandre Garcia</li>
                  <li><strong>N° d'entreprise (BCE) :</strong> 1023.197.471</li>
                  <li><strong>N° TVA intracommunautaire :</strong> BE1023.197.471</li>
                  <li><strong>Siège social :</strong> Rue Adolphe Doneux 4, 5310 Bolinne (Eghezée), Belgique</li>
                  <li><strong>Contact :</strong> <a href="mailto:info@endless-tents.com" className="text-primary hover:underline">info@endless-tents.com</a>, <a href="tel:+32497228743" className="text-primary hover:underline">+32 497 22 87 43</a></li>
                  <li><strong>Site :</strong> endless-tents.com</li>
                </ul>
              </div>
            </section>

            <Separator className="my-8" />

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Responsable de la publication
              </h2>
              <p className="text-foreground">
                <strong>Alexandre Garcia</strong> — Fondateur & dirigeant
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Hébergement
              </h2>
              <p className="text-foreground">
                <strong>Hostinger</strong> <em>(coordonnées disponibles sur leur site)</em>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Autorité de contrôle
              </h2>
              <p className="text-foreground">
                <strong>Autorité de protection des données (APD — Belgique)</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Propriété intellectuelle
              </h2>
              <p className="text-foreground">
                Tous les contenus présents sur <strong>endless-tents.com</strong> (textes, visuels, logos, marques, vidéos, etc.) sont protégés. Toute reproduction ou utilisation non autorisée est interdite sans accord écrit préalable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Données personnelles
              </h2>
              <p className="text-foreground">
                Le détail des traitements et de vos droits figure dans la <strong>Politique de confidentialité</strong>. Contact RGPD : <a href="mailto:info@endless-tents.com" className="text-primary hover:underline">info@endless-tents.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentionsLegales;