import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Weight, 
  Shield, 
  Clock, 
  Users, 
  Snowflake, 
  Bed, 
  Droplets, 
  Timer, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  CheckCircle, 
  Tent, 
  Calendar, 
  Camera,
  Wrench,
  Phone,
  Mail
} from 'lucide-react';

const FAQ = () => {
  const faqSections = [
    {
      id: 'installation',
      title: 'Installation et compatibilité',
      icon: Wrench,
      faqs: [
        {
          icon: Car,
          question: 'Que faut-il prévoir pour pouvoir installer la tente de toit STARZZ sur mon véhicule ?',
          answer: (
            <div>
              <p className="mb-3">La seule chose dont vous avez besoin est une paire de barres de toit (disponible en location). Nous vous recommandons des barres de toit ayant une charge dynamique minimale de 75kg mais 65kg est suffisant.</p>
              <p className="mb-3">La distance minimale entre les fixations de vos barres de toit doit être de 75cm.</p>
              <p>N'hésitez pas à nous envoyer un e-mail si vous souhaitez des informations spécifiques concernant votre véhicule.</p>
            </div>
          )
        },
        {
          icon: Weight,
          question: 'Concrètement, mon toit de voiture va-t-il résister ?',
          answer: (
            <div>
              <p className="mb-3">Oui, le toit de la voiture est assez solide pour une tente de toit. Il faut faire la distinction entre la charge dynamique et la charge statique. La charge dynamique correspond à la charge autorisée pour un véhicule en mouvement. La charge statique correspond à la charge autorisée pour un véhicule à l'arrêt.</p>
              <p className="mb-3">La charge dynamique est souvent située entre 50 et 100kg. Nos tentes pèsent 65 kg. Il faut donc vous assurer que votre toit a une charge dynamique de 65kg minimum.</p>
              <p>Il faut savoir qu'à l'arrêt, la structure du toit supporte le poids de la voiture renversée.</p>
            </div>
          )
        },
        {
          icon: Car,
          question: 'Quels types de véhicules sont compatibles avec les tentes ENDLESS ?',
          answer: (
            <div>
              <p className="mb-3">Nos tentes de toit sont compatibles avec la plupart des véhicules équipés de barres de toit, notamment :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li><strong>Véhicules équipés de rails longitudinaux</strong> (ouverts ou fermés)</li>
                <li><strong>Véhicules avec points de fixation intégrés</strong> (nécessitant des pieds spécifiques)</li>
                <li><strong>Véhicules sans points de fixation</strong> (nécessitant des barres de toit à fixation sur l'encadrement des portes)</li>
              </ul>
              <p>Nos tentes sont particulièrement adaptées aux SUV, 4x4, breaks et monospaces, mais peuvent également être installées sur des berlines et des citadines, à condition que les barres de toit respectent les spécifications de charge.</p>
            </div>
          )
        },
        {
          icon: Wrench,
          question: 'Comment installer ma tente de toit ENDLESS ?',
          answer: (
            <div>
              <p className="mb-3">L'installation de votre tente de toit ENDLESS est simple et rapide :</p>
              <ol className="list-decimal list-inside space-y-2 mb-3">
                <li>Placez la tente sur les barres de toit de votre véhicule</li>
                <li>Alignez les rails de fixation de la tente avec vos barres de toit</li>
                <li>Insérez les boulons en U autour des barres de toit et à travers les rails de fixation</li>
                <li>Fixez les écrous sur les boulons en U et serrez-les fermement</li>
                <li>Vérifiez que la tente est solidement fixée avant de prendre la route</li>
              </ol>
              <p>Nous fournissons un manuel d'installation détaillé avec chaque tente.</p>
            </div>
          )
        }
      ]
    },
    {
      id: 'utilisation',
      title: 'Utilisation et fonctionnalités',
      icon: Tent,
      faqs: [
        {
          icon: Clock,
          question: 'Combien de temps faut-il pour ouvrir et fermer la tente ?',
          answer: (
            <div>
              <p className="mb-3">L'un des grands avantages de nos tentes de toit ENDLESS est leur rapidité d'installation :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li><strong>Ouverture</strong> : Environ 1 minute pour déplier la tente et déployer l'échelle</li>
                <li><strong>Fermeture</strong> : Environ 2-3 minutes pour replier la tente et sécuriser la housse</li>
              </ul>
              <p>Avec un peu d'habitude, ces temps peuvent être encore réduits. C'est beaucoup plus rapide qu'une tente traditionnelle !</p>
            </div>
          )
        },
        {
          icon: Users,
          question: 'Combien de personnes peuvent dormir dans une tente ENDLESS ?',
          answer: (
            <div>
              <p className="mb-3">La capacité dépend du modèle de tente que vous choisissez :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li><strong>STARZZ</strong> : Conçue pour 2-3 adultes</li>
              </ul>
              <p>Les dimensions intérieures des matelas sont de 140x200 cm pour le modèle STARZZ.</p>
            </div>
          )
        },
        {
          icon: Snowflake,
          question: 'Les tentes ENDLESS sont-elles adaptées à toutes les saisons ?',
          answer: (
            <div>
              <p className="mb-3">Nos tentes de toit sont conçues pour être utilisées dans diverses conditions météorologiques :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li><strong>Printemps/Été/Automne</strong> : Parfaitement adaptées avec une excellente ventilation et une protection contre la pluie</li>
                <li><strong>Hiver doux</strong> : Utilisables avec un sac de couchage adapté aux basses températures</li>
                <li><strong>Conditions extrêmes</strong> : Non recommandées en cas de neige abondante ou de vents très forts (&gt;70 km/h)</li>
              </ul>
              <p>La toile est imperméable avec une résistance à une colonne d'eau de 3000 mm, ce qui offre une excellente protection contre la pluie.</p>
            </div>
          )
        },
        {
          icon: Bed,
          question: 'Quel est le niveau de confort du matelas ?',
          answer: (
            <div>
              <p className="mb-3">Toutes nos tentes ENDLESS sont équipées d'un matelas haute densité de 8 cm d'épaisseur, offrant un excellent compromis entre confort et compacité.</p>
              <p className="mb-3">Le matelas est fabriqué en mousse à cellules fermées qui offre :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Une bonne isolation thermique contre le froid</li>
                <li>Une résistance à l'humidité</li>
                <li>Une durabilité exceptionnelle</li>
              </ul>
              <p>De nombreux utilisateurs rapportent un meilleur confort que dans une tente traditionnelle au sol, notamment grâce à la surface plane et l'absence de pierres ou racines.</p>
            </div>
          )
        }
      ]
    },
    {
      id: 'entretien',
      title: 'Entretien et durabilité',
      icon: Shield,
      faqs: [
        {
          icon: Droplets,
          question: 'Comment entretenir ma tente de toit ENDLESS ?',
          answer: (
            <div>
              <p className="mb-3">Pour prolonger la durée de vie de votre tente ENDLESS, nous recommandons :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li><strong>Nettoyage</strong> : Utilisez uniquement de l'eau claire et une éponge douce pour nettoyer la toile. Évitez les détergents qui pourraient endommager les traitements imperméabilisants.</li>
                <li><strong>Séchage</strong> : Assurez-vous que la tente est complètement sèche avant de la replier pour éviter la formation de moisissures.</li>
                <li><strong>Stockage</strong> : Si vous n'utilisez pas la tente pendant une longue période, stockez-la dans un endroit sec et aéré.</li>
                <li><strong>Fermetures éclair</strong> : Nettoyez-les régulièrement et appliquez un lubrifiant spécifique pour fermetures éclair une fois par an.</li>
              </ul>
              <p>Un entretien régulier garantira des années d'utilisation sans problème.</p>
            </div>
          )
        },
        {
          icon: Timer,
          question: 'Quelle est la durée de vie d\'une tente ENDLESS ?',
          answer: (
            <div>
              <p className="mb-3">Avec un entretien approprié, nos tentes de toit ENDLESS sont conçues pour durer de nombreuses années :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>La <strong>structure en aluminium</strong> est résistante à la corrosion et conçue pour supporter des milliers de cycles d'ouverture/fermeture.</li>
                <li>La <strong>toile</strong> est fabriquée en polycoton de haute qualité (280g/m²) avec un traitement anti-UV et imperméabilisant qui lui confère une excellente résistance aux éléments.</li>
                <li>Les <strong>fermetures éclair</strong> sont de qualité marine, spécialement conçues pour résister à l'eau salée et aux conditions difficiles.</li>
              </ul>
              <p>Nous offrons une garantie de 2 ans sur tous nos produits, mais avec un entretien approprié, votre tente ENDLESS peut facilement durer 5 à 10 ans, voire plus.</p>
            </div>
          )
        }
      ]
    },
    {
      id: 'achat',
      title: 'Achat et livraison',
      icon: Truck,
      faqs: [
        {
          icon: Truck,
          question: 'Quels sont les délais et frais de livraison ?',
          answer: (
            <div>
              <p className="mb-3">Nous proposons plusieurs options de livraison :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li><strong>Livraison Belgique</strong> : Gratuit , 24 - 48h ouvrables</li>
                <li><strong>Retrait en entrepôt</strong> : Gratuit, disponible sous 24h après confirmation</li>
                <li><strong>Livraison Europe</strong> : Personnalisée, temps de livraison variable.</li>
              </ul>
              <p>Nous livrons dans le monde entier. Les délais et les tarifs peuvent varier selon la destination.</p>
            </div>
          )
        },
        {
          icon: CreditCard,
          question: 'Quels sont les modes de paiement acceptés ?',
          answer: (
            <div>
              <p className="mb-3">Nous acceptons plusieurs méthodes de paiement pour vous offrir un maximum de flexibilité :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Carte bancaire (Visa, Mastercard, American Express)</li>
                <li>PayPal</li>
                <li>Virement bancaire</li>
                <li>Paiement en 3 ou 4 fois sans frais (pour les commandes supérieures à 300€)</li>
              </ul>
              <p>Nous acceptons ce que Stripe accepte. Tous les paiements sont sécurisés et nous ne stockons pas vos informations de carte bancaire.</p>
            </div>
          )
        },
        {
          icon: RotateCcw,
          question: 'Quelle est votre politique de retour ?',
          answer: (
            <div>
              <p className="mb-3">Nous voulons que vous soyez entièrement satisfait de votre achat :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Vous disposez de <strong>14 jours</strong> à compter de la réception pour retourner votre produit</li>
                <li>Le produit doit être retourné dans son emballage d'origine et ne pas avoir été utilisé</li>
                <li>Les frais de retour sont à votre charge</li>
                <li>Le remboursement est effectué dans les 14 jours suivant la réception du produit retourné</li>
              </ul>
              <p>Pour initier un retour, contactez notre équipe qui vous guidera à travers le processus.</p>
            </div>
          )
        },
        {
          icon: CheckCircle,
          question: 'Quelle garantie offrez-vous sur vos produits ?',
          answer: (
            <div>
              <p className="mb-3">Tous nos produits ENDLESS bénéficient d'une <strong>garantie de 2 ans</strong> contre les défauts de fabrication.</p>
              <p className="mb-3">Cette garantie couvre :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Les défauts structurels (cadre, charnières, supports)</li>
                <li>Les problèmes d'étanchéité de la toile</li>
                <li>Les défauts des fermetures éclair et des fixations</li>
              </ul>
              <p className="mb-3">La garantie ne couvre pas l'usure normale, les dommages dus à une mauvaise utilisation ou à des conditions météorologiques extrêmes.</p>
              <p>Pour faire une réclamation sous garantie, contactez notre équipe avec une description du problème et des photos.</p>
            </div>
          )
        }
      ]
    },
    {
      id: 'location',
      title: 'Location',
      icon: Calendar,
      faqs: [
        {
          icon: Tent,
          question: 'Comment fonctionne la location de tentes ENDLESS ?',
          answer: (
            <div>
              <p className="mb-3">Notre service de location est simple et flexible :</p>
              <ol className="list-decimal list-inside space-y-2 mb-3">
                <li><strong>Réservation</strong> : Choisissez votre modèle et vos dates sur notre page de location</li>
                <li><strong>Confirmation</strong> : Recevez une confirmation par email avec les détails de votre réservation</li>
                <li><strong>Retrait</strong> : Venez chercher votre tente à notre entrepôt ou optez pour la livraison (avec supplément, uniquement en Belgique)</li>
                <li><strong>Utilisation</strong> : Profitez de votre aventure avec votre tente ENDLESS</li>
                <li><strong>Retour</strong> : Ramenez la tente propre et sèche à la date convenue</li>
              </ol>
              <p>Une caution sera demandée lors de la prise en charge et vous sera restituée au retour si la tente est en bon état.</p>
            </div>
          )
        },
        {
          icon: Calendar,
          question: 'Quelle est la durée minimale et maximale de location ?',
          answer: (
            <div>
              <p className="mb-3">Nous proposons des options flexibles pour répondre à vos besoins :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li><strong>Durée minimale</strong> : 2 jours (week-end)</li>
                <li><strong>Durée maximale standard</strong> : 30 jours</li>
                <li><strong>Locations longue durée</strong> : Pour les locations de plus de 30 jours, contactez-nous pour un tarif personnalisé</li>
              </ul>
              <p>Les tarifs sont dégressifs : plus vous louez longtemps, plus le tarif journalier est avantageux.</p>
            </div>
          )
        },
        {
          icon: Camera,
          question: 'Que se passe-t-il en cas de dommage pendant la location ?',
          answer: (
            <div>
              <p className="mb-3">En cas de dommage pendant votre période de location :</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li><strong>Dommages mineurs</strong> (petites taches, rayures légères) : Généralement couverts par l'usure normale, sans frais supplémentaires</li>
                <li><strong>Dommages modérés</strong> (petites déchirures réparables, composants cassés) : Une partie de la caution pourra être retenue pour couvrir les réparations</li>
                <li><strong>Dommages majeurs</strong> (toile gravement déchirée, structure déformée) : La caution complète pourra être retenue</li>
              </ul>
              <p>Nous évaluons chaque situation au cas par cas et de manière équitable. Nous vous recommandons de prendre des photos de tout dommage préexistant lors de la prise en charge.</p>
            </div>
          )
        },
        {
          icon: Shield,
          question: 'La location inclut-elle une assurance ?',
          answer: (
            <div>
              <p className="mb-3">Notre tarif de location standard n'inclut pas d'assurance spécifique, mais nous proposons une option tranquillité (+8€/jour) : Couvre les dommages accidentels mineurs et modérés</p>
              <p className="mb-3">Cette option réduis considérablement le montant de la caution et vous permet de profiter de votre aventure l'esprit tranquille.</p>
              <p>Vérifiez également si votre assurance habitation ou carte bancaire offre une couverture pour les équipements de loisirs loués.</p>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto container-padding text-center">
          <h1 className="text-hero mb-4">FAQ</h1>
          <p className="text-large max-w-3xl mx-auto opacity-90">
            Vous trouverez ci-dessous les réponses aux questions les plus fréquemment posées concernant nos tentes de toit ENDLESS. Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter directement.
          </p>
        </div>
      </section>

      <main className="container mx-auto container-padding py-12">
        {/* Table des matières */}
        <div className="mb-12">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-center">Sommaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {faqSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-sunset flex items-center justify-center">
                      <section.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-foreground group-hover:text-primary">
                      {section.title}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sections FAQ */}
        <div className="space-y-16">
          {faqSections.map((section) => (
            <section key={section.id} id={section.id}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-sunset flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-display text-primary">{section.title}</h2>
              </div>

              <div className="grid gap-6">
                {section.faqs.map((faq, index) => (
                  <Card key={index} className="shadow-card hover:shadow-hero transition-shadow">
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible>
                        <AccordionItem value={`faq-${section.id}-${index}`} className="border-none">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                             <div className="flex items-center gap-4 text-left">
                               <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                 <faq.icon className="w-5 h-5 text-primary" />
                               </div>
                               <div className="font-medium text-foreground">
                                 {faq.question}
                               </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="ml-14 text-muted-foreground">
                              {faq.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <section className="mt-16">
          <Card className="bg-gradient-nature shadow-card">
            <CardContent className="p-8 text-center">
              <h2 className="text-title text-primary mb-4">Vous n'avez pas trouvé la réponse à votre question ?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Notre équipe est là pour vous aider. N'hésitez pas à nous contacter directement pour obtenir des conseils personnalisés.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <a href="tel:+32497228743" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    +32 497 22 87 43
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <a href="mailto:info@endless-tents.be" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    info@endless-tents.be
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;