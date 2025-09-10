import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto container-padding py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Politique de confidentialité
            </h1>
            <p className="text-muted-foreground text-lg">
              RGPD - Dernière mise à jour : 10/09/2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">1. Responsable du traitement</h2>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li><strong>ENDLESS</strong> — Alexandre Garcia (indépendant, personne physique)</li>
                  <li>Siège : Rue Adolphe Doneux 4, 5310 Bolinne (Eghezée), Belgique</li>
                  <li>N° d'entreprise (BCE) : <strong>1023.197.471</strong> — TVA : <strong>BE1023.197.471</strong></li>
                  <li>Contact : <a href="mailto:info@endless-tents.com" className="text-primary hover:underline">info@endless-tents.com</a>, <a href="tel:+32497228743" className="text-primary hover:underline">+32 497 22 87 43</a></li>
                  <li>Délégué à la protection des données (DPO) : <strong>non désigné</strong></li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">2. Données collectées</h2>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li><strong>Commande/compte</strong> : identité, coordonnées, adresses, infos de paiement <strong>(traitées par Stripe)</strong>.</li>
                  <li><strong>Navigation</strong> : identifiants techniques, journaux, cookies/traceurs <strong>(limités au fonctionnement et au paiement)</strong>.</li>
                  <li><strong>Support/marketing</strong> : contenus échangés par e‑mail.</li>
                  <li><strong>B2B</strong> : fonction, société, TVA.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">3. Finalités & bases légales</h2>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li><strong>Exécution du contrat</strong> : gestion des commandes/locations/prestations, facturation, livraison, support. <em>(Base : contrat)</em></li>
                  <li><strong>Sécurité & prévention fraude</strong> : protection du site et des paiements. <em>(Intérêt légitime)</em></li>
                  <li><strong>Obligations légales</strong> : comptabilité, fiscalité, réponse aux autorités. <em>(Obligation légale)</em></li>
                  <li><strong>Marketing</strong> : <strong>[non pratiqué à ce jour / newsletters sur consentement si mis en place]</strong>.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">4. Durées de conservation</h2>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li>Prospects (si newsletters) : <strong>3 ans</strong> après le dernier contact.</li>
                  <li>Clients & factures : <strong>10 ans</strong> (obligations comptables/fiscales).</li>
                  <li>Cookies techniques/paiement : <strong>durée technique stricte</strong> (voir cookie‑banner).</li>
                  <li>Journaux techniques : <strong>12 mois</strong>.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">5. Destinataires & sous‑traitants</h2>
                <p className="text-foreground mb-4">Accès limité aux personnels habilités. <strong>Sous‑traitants</strong> :</p>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li><strong>Stripe</strong> (paiement).</li>
                  <li><strong>Hébergeur : Hostinger</strong>.</li>
                </ul>
                <p className="text-foreground mt-4">
                  Aucun autre outil d'<strong>analytics</strong> ni de <strong>publicité</strong> n'est utilisé <strong>à ce jour</strong>. En cas d'ajout ultérieur (ex. GA4, Meta Ads), la présente politique et la bannière cookies seront mises à jour.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">6. Transferts hors UE/EEE</h2>
                <p className="text-foreground">
                  Lorsque nécessaire (ex. traitement de paiement par <strong>Stripe</strong>), les transferts reposent sur des <strong>clauses contractuelles types</strong> et des <strong>mesures complémentaires</strong> (chiffrement, pseudonymisation) lorsque requis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">7. Sécurité</h2>
                <p className="text-foreground">
                  Mesures techniques et organisationnelles proportionnées : <strong>TLS</strong>, contrôle des accès, politique de mots de passe, sauvegardes, journalisation, minimisation des données.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">8. Vos droits</h2>
                <p className="text-foreground mb-4">
                  Vous disposez des droits <strong>d'accès, rectification, effacement, limitation, portabilité, opposition</strong>, et retrait du consentement (si applicable).
                </p>
                <p className="text-foreground">
                  Exercice : <a href="mailto:info@endless-tents.com" className="text-primary hover:underline">info@endless-tents.com</a>. Vous pouvez introduire une plainte auprès de l'<strong>APD (Belgique)</strong>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">9. Cookies & traceurs</h2>
                <ul className="list-disc list-inside space-y-2 text-foreground mb-4">
                  <li><strong>Essentiels</strong> : nécessaires au fonctionnement du site et au paiement (<strong>Stripe</strong>).</li>
                  <li><strong>Mesure d'audience/Marketing</strong> : <strong>non utilisés</strong> à ce jour.</li>
                  <li><strong>Consentement</strong> : seuls les cookies essentiels sont déposés sans consentement.</li>
                </ul>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left font-semibold">Catégorie</th>
                        <th className="border border-border p-3 text-left font-semibold">Outil/Prestataire</th>
                        <th className="border border-border p-3 text-left font-semibold">Finalité</th>
                        <th className="border border-border p-3 text-left font-semibold">Durée</th>
                        <th className="border border-border p-3 text-left font-semibold">Base légale</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3">Essentiel</td>
                        <td className="border border-border p-3">Cookie de session</td>
                        <td className="border border-border p-3">Maintien de la session</td>
                        <td className="border border-border p-3">Durée de session</td>
                        <td className="border border-border p-3">Intérêt légitime</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">Essentiel</td>
                        <td className="border border-border p-3">Stripe (paiement)</td>
                        <td className="border border-border p-3">Sécuriser et traiter le paiement</td>
                        <td className="border border-border p-3">Selon Stripe</td>
                        <td className="border border-border p-3">Intérêt légitime</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">10. Modifications</h2>
                <p className="text-foreground">
                  La version applicable est celle publiée sur <strong>endless-tents.com</strong> à la date de consultation.
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

export default PolitiqueConfidentialite;