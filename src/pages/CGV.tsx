import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const CGV = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto container-padding py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Conditions Générales de Vente
            </h1>
            <p className="text-muted-foreground text-lg">
              Dernière mise à jour : 10/09/2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">1. Objet</h2>
                <p className="text-foreground">
                  Les présentes CGV régissent les ventes, locations et prestations réalisées via <strong>endless-tents.com</strong> entre <strong>Endless</strong> (Alexandre Garcia, indépendant) et tout <strong>Client</strong> (consommateur ou professionnel).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">2. Produits & Services</h2>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li><strong>Produits</strong> : tentes de toit.</li>
                  <li><strong>Location</strong> : tentes de toit avec accessoires, barres de toit.</li>
                  <li><strong>Services</strong> : montage & démontage (sur rendez‑vous).</li>
                </ul>
                <p className="text-foreground mt-4">
                  Les photos sont non contractuelles. Les caractéristiques essentielles sont indiquées sur la fiche produit/devis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">3. Prix</h2>
                <p className="text-foreground mb-4">Les prix sont exprimés en <strong>EUR</strong>.</p>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li><strong>B2C</strong> : prix <strong>TTC</strong> (toutes taxes comprises).</li>
                  <li><strong>B2B</strong> : prix <strong>HT</strong> (TVA en sus si applicable).</li>
                </ul>
                <p className="text-foreground mt-4">
                  Les <strong>frais</strong> de livraison et/ou d'installation, ainsi que toute <strong>caution de location</strong> (le cas échéant), sont indiqués avant validation de la commande.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">4. Commande</h2>
                <p className="text-foreground">
                  Parcours : panier → coordonnées → livraison/exécution → paiement → confirmation. La validation vaut <strong>acceptation des CGV</strong>. <strong>Endless</strong> se réserve le droit de refuser une commande anormale ou de mauvaise foi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">5. Paiement</h2>
                <p className="text-foreground">
                  Paiement sécurisé via <strong>Stripe</strong> (<strong>carte bancaire/Bancontact</strong> selon disponibilité Stripe). La commande est ferme après <strong>autorisation d'encaissement</strong>. En cas d'échec de paiement, <strong>Endless</strong> peut suspendre ou annuler la commande.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">6. Livraison & Exécution</h2>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li><strong>Belgique uniquement</strong> : livraison <strong>sous 24-48h ouvrables si stock disponible</strong>.</li>
                  <li><strong>Prestations (montage/démontage)</strong> : intervention <strong>dans toute la Belgique</strong>, sur rendez-vous confirmé.</li>
                </ul>
                <p className="text-foreground mt-4">
                  Le <strong>transfert des risques</strong> intervient à la remise du produit au Client ou au transporteur selon l'option choisie.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">7. Rétractation (B2C)</h2>
                <p className="text-foreground mb-4">
                  Le consommateur dispose d'un <strong>délai de 14 jours</strong> à compter de la réception (produits) ou de la conclusion (services) pour exercer son droit de rétractation <strong>sans motif</strong>.
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li>Notification : par e‑mail à <a href="mailto:info@endless-tents.com" className="text-primary hover:underline">info@endless-tents.com</a>.</li>
                  <li>Retours : à <strong>Rue Adolphe Doneux 4, 5310 Bolinne</strong>, dans l'état d'origine avec tous accessoires.</li>
                  <li><strong>Frais de retour</strong> : <strong>à la charge du Client</strong>, sauf erreur d'<strong>Endless</strong> ou produit défectueux.</li>
                  <li>Remboursement : dans les <strong>14 jours</strong> suivant la réception du retour ou la preuve d'expédition.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">8. Garanties légales</h2>
                <p className="text-foreground mb-4">Application des garanties légales belges :</p>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li><strong>B2C</strong> : garantie de <strong>conformité</strong> (durée légale) et <strong>vices cachés</strong>.</li>
                  <li><strong>B2B</strong> : garanties selon droit commun.</li>
                </ul>
                <p className="text-foreground mt-4">
                  En cas de non‑conformité : réparation, remplacement ou remboursement selon conditions légales. Contact : <a href="mailto:info@endless-tents.com" className="text-primary hover:underline">info@endless-tents.com</a>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">9. Droit applicable & Litiges</h2>
                <p className="text-foreground mb-4">
                  En cas de litige, le consommateur peut recourir au <strong>Service de Médiation pour le Consommateur (Belgique)</strong> ou à la plateforme européenne de <strong>Règlement en Ligne des Litiges (RLL/ODR)</strong>.
                </p>
                <p className="text-foreground">
                  À défaut d'accord amiable, <strong>les tribunaux de Namur</strong> sont compétents, sous réserve des dispositions impératives protectrices du consommateur. <strong>Droit belge</strong> applicable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Formulaire de rétractation</h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground mb-4">
                    <strong>À l'attention d'ENDLESS — Rue Adolphe Doneux 4, 5310 Bolinne — <a href="mailto:info@endless-tents.com" className="text-primary hover:underline">info@endless-tents.com</a> :</strong>
                  </p>
                  <p className="text-foreground mb-4">
                    Je vous notifie ma rétractation du contrat portant sur <strong>[produit/service]</strong> commandé le <strong>[date]</strong> et reçu le <strong>[date]</strong>.
                  </p>
                  <p className="text-foreground">
                    Nom : <strong>[ ]</strong> — Adresse : <strong>[ ]</strong> — Signature : <strong>[ ]</strong> (si papier) — Date : <strong>[ ]</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Service client</h2>
                <p className="text-foreground">
                  Contact : <a href="mailto:info@endless-tents.com" className="text-primary hover:underline">info@endless-tents.com</a>, <a href="tel:+32497228743" className="text-primary hover:underline">+32 497 22 87 43</a>. <strong>Pas d'horaires d'ouverture</strong> (pas de magasin/showroom).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CGV;