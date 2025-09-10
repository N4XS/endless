import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "Quelle tente de toit choisir pour débuter ?",
      answer: "Pour débuter, nous recommandons la STARZZ qui offre le meilleur rapport qualité-prix. Elle est facile à monter et convient à la plupart des véhicules. L'installation est comprise dans le tarif ainsi qu'une démonstration complète pour vous assurer une expérience sans souci."
    },
    {
      question: "Mon véhicule peut-il supporter une tente de toit ?",
      answer: "La plupart des véhicules avec barres de toit peuvent accueillir une tente STARZZ. Vérifiez que la charge dynamique autorisée est d'au moins 65kg. La tente s'adapte même aux petits véhicules. Nous proposons un service de vérification gratuit."
    },
    {
      question: "Comment fonctionne la location ?",
      answer: "Location simple : choisissez vos dates, payez en ligne avec caution. Récupération dans notre showroom près de Bruxelles ou livraison possible. Tente livrée montée sur votre véhicule avec briefing complet."
    },
    {
      question: "Quelle garantie sur les tentes de toit ?",
      answer: "Toutes nos tentes bénéficient d'une garantie 'Satisfait ou remboursé' de 30 jours. Service après-vente assuré par notre équipe belge. Pièces détachées disponibles et réparations possibles."
    },
    {
      question: "Livraison et montage, comment ça marche ?",
      answer: "Livraison sous 3-5 jours ouvrables. Installation comprise dans le tarif avec démonstration complète. Formation montage offerte avec chaque achat pour vous assurer une utilisation optimale."
    },
    {
      question: "Quels sont les avantages de la tente STARZZ ?",
      answer: "La STARZZ offre une liberté sans compromis, un confort exceptionnel avec matelas haute densité, une qualité supérieure avec des matériaux durables, et une installation rapide en moins de 3 minutes."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto container-padding py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-hero text-sapin mb-4">Questions Fréquentes</h1>
            <p className="text-large text-muted-foreground">
              Trouvez les réponses à vos questions sur nos tentes de toit ENDLESS
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <div className="bg-gradient-nature rounded-lg p-8">
              <h2 className="text-title text-sapin mb-4">Besoin d'un conseil personnalisé ?</h2>
              <p className="text-muted-foreground mb-6">
                Notre équipe est là pour vous accompagner dans votre choix
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+32497228743" className="btn-hero">
                  Appelez-nous
                </a>
                <a href="mailto:info@endless-tents.be" className="btn-secondary">
                  Écrivez-nous
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;