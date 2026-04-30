import { CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/Button";
import { Link } from "react-router-dom";
import * as motion from "motion/react-client";
import { Helmet } from "react-helmet-async";

const plans = [
  {
    name: "Citadine",
    price: "80.-",
    description: "Idéal pour un entretien régulier !",
    features: [
      "Aspiration complète",
      "Nettoyage plastiques",
      "Vitres intérieures",
      "Lavage carrosserie au gant doux",
      "Séchage chiffon microfibre",
      "Nettoyage jantes"
    ]
  },
  {
    name: "Moyenne",
    price: "90.-",
    description: "Propre à fond, dedans comme dehors !",
    isPopular: true,
    features: [
      "Aspiration complète",
      "Nettoyage plastiques",
      "Vitres intérieures",
      "Lavage carrosserie au gant doux",
      "Séchage chiffon microfibre",
      "Nettoyage jantes"
    ]
  },
  {
    name: "Grande",
    price: "100.-",
    description: "Le meilleur soin pour votre véhicule !",
    features: [
      "Aspiration complète",
      "Nettoyage plastiques",
      "Vitres intérieures",
      "Lavage carrosserie au gant doux",
      "Séchage chiffon microfibre",
      "Nettoyage jantes"
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function Services() {
  return (
    <div className="py-20 sm:py-24 bg-black min-h-screen">
      <Helmet>
        <title>Veva Automobile Genève - Nos Formules de Lavage</title>
        <meta name="description" content="Découvrez nos formules de lavage de voiture sur Genève. Nettoyage intérieur, extérieur complet, prestations premium." />
        <link rel="canonical" href="https://www.vevaautomobile.ch/services" />
        {/* Services / Offers JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Car Wash / Nettoyage Automobile",
            "provider": {
              "@type": "AutoWash",
              "name": "Veva Automobile",
              "url": "https://www.vevaautomobile.ch"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Genève"
              }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Formules de lavage auto",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Lavage Citadine - Intérieur & Extérieur"
                  },
                  "price": "80.00",
                  "priceCurrency": "CHF"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Lavage Moyenne - Intérieur & Extérieur"
                  },
                  "price": "90.00",
                  "priceCurrency": "CHF"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Lavage Grande - Intérieur & Extérieur"
                  },
                  "price": "100.00",
                  "priceCurrency": "CHF"
                }
              ]
            }
          })}
        </script>
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-black italic uppercase tracking-tight text-white sm:text-5xl">
            Nos <span className="text-[#6bb315]">Formules</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 font-light max-w-2xl mx-auto">
            Chaque véhicule reçoit un soin particulier et fait à la main, pour un rendu impeccable à l'intérieur comme à l'extérieur.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-8 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.div
              variants={itemVariants}
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border transition-transform hover:-translate-y-1 duration-300 ${
                plan.isPopular ? "border-[#6bb315] bg-zinc-900/80 shadow-2xl shadow-[#6bb315]/10" : "border-zinc-800/50 bg-zinc-900/30"
              } p-8`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6bb315] text-black text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Le plus demandé
                </div>
              )}
              <h3 className="text-2xl font-medium tracking-wide text-center text-zinc-100">
                {plan.name}
              </h3>
              <div className="mt-8 flex justify-center items-baseline text-6xl font-black italic text-[#6bb315]">
                {plan.price}
              </div>
              <p className="mt-4 text-sm text-center text-zinc-400 font-light uppercase tracking-widest">
                Intérieur & Extérieur
              </p>
              
              <ul className="mt-10 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="h-5 w-5 text-[#6bb315] opacity-80 flex-shrink-0" />
                    <span className="font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-8 border-t border-zinc-800/50 text-center text-sm font-light text-zinc-400 italic">
                "{plan.description}"
              </div>

              <Button className="mt-8 w-full rounded-full" size="lg" asChild>
                <Link to="/contact">
                  Nous contacter pour {plan.name}
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 flex items-start sm:items-center gap-4 text-zinc-300 max-w-3xl mx-auto"
        >
          <Info className="w-8 h-8 text-[#6bb315] flex-shrink-0" />
          <div className="font-light text-sm sm:text-base leading-relaxed">
            <span className="font-medium text-white block sm:inline">À noter :</span> 
            {" "}Si le véhicule est particulièrement sale (poils d'animaux, boue importante), un supplément pourra être appliqué pour le temps supplémentaire de nettoyage nécessaire.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
