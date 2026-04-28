import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Combien de temps dure un lavage complet ?",
    answer:
      "La durée varie selon la formule choisie et l'état de votre véhicule. En général, comptez entre 1h pour un entretien régulier et 2h30 pour un nettoyage en profondeur.",
  },
  {
    question: "Dois-je prendre rendez-vous à l'avance ?",
    answer:
      "Oui, nous fonctionnons uniquement sur rendez-vous pour vous garantir une prise en charge immédiate et le temps nécessaire pour un résultat impeccable.",
  },
  {
    question: "Quels produits utilisez-vous pour le nettoyage ?",
    answer:
      "Nous utilisons exclusivement des produits professionnels de haute qualité, respectueux de l'environnement et des matériaux de votre véhicule (cuir, alcantara, plastiques).",
  },
  {
    question: "Proposez-vous des tarifs pour les flottes d'entreprise ?",
    answer:
      "Absolument ! Nous avons des offres sur-mesure et dégressives pour les professionnels. N'hésitez pas à consulter notre page Entreprises pour faire une simulation et nous contacter.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold italic uppercase tracking-tight text-white mb-4">
            Questions <span className="text-[#6bb315]">fréquentes</span>
          </h2>
          <p className="text-zinc-400 font-light leading-relaxed">
            Tout ce que vous devez savoir sur nos services de nettoyage.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-medium text-white/90 text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-[#6bb315] transition-transform duration-300 flex-shrink-0",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-zinc-400 font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
