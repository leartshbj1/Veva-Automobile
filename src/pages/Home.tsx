import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { CheckCircle2, Droplets, Sparkles } from "lucide-react";
import * as motion from "motion/react-client";
import { Faq } from "@/components/Faq";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center uppercase">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl font-black tracking-tight sm:text-6xl italic text-white"
          >
            Lavage Auto <span className="text-[#6bb315]">Genève</span> <br />
            <span className="text-2xl sm:text-4xl font-medium tracking-normal">Propre à fond, dedans comme dehors !</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300 normal-case mb-10 font-light"
          >
            Veva Automobile est votre spécialiste du nettoyage automobile intérieur et extérieur à Genève. Un soin minutieux de la main de l'homme, des produits professionnels, et un véhicule comme neuf.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button size="lg" className="rounded-full shadow-lg shadow-[#6bb315]/20" asChild>
              <Link to="/contact">Nous contacter</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <Link to="/services">Voir les formules</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services SEO Content */}
      <section className="py-24 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold italic uppercase tracking-tight text-white sm:text-4xl mb-4">
              Le meilleur nettoyage de voiture à <span className="text-[#6bb315]">Genève</span>
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed">
              Nous offrons un service premium de car wash à la main pour les particuliers et les entreprises dans tout le canton de Genève. L'exigence humaine du détail.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-zinc-900/40 p-8 rounded-3xl transition-colors hover:bg-zinc-900/60"
            >
              <div className="flex items-center gap-4 mb-6">
                <Sparkles className="w-8 h-8 text-[#6bb315]" />
                <h3 className="text-2xl font-medium text-white">Nettoyage Intérieur</h3>
              </div>
              <p className="text-zinc-400 mb-8 font-light leading-relaxed">
                Aspiration complète de l'habitacle, nettoyage en profondeur des sièges et moquettes, dépoussiérage et soin des plastiques, nettoyage des vitres intérieures. Nous redonnons à votre intérieur son aspect d'origine.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-zinc-300 gap-3"><CheckCircle2 className="w-5 h-5 text-[#6bb315]" /> <span className="font-light">Aspiration moquettes & sièges</span></li>
                <li className="flex items-center text-zinc-300 gap-3"><CheckCircle2 className="w-5 h-5 text-[#6bb315]" /> <span className="font-light">Soin des plastiques & cuirs</span></li>
                <li className="flex items-center text-zinc-300 gap-3"><CheckCircle2 className="w-5 h-5 text-[#6bb315]" /> <span className="font-light">Vitres sans traces</span></li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-zinc-900/40 p-8 rounded-3xl transition-colors hover:bg-zinc-900/60"
            >
              <div className="flex items-center gap-4 mb-6">
                <Droplets className="w-8 h-8 text-[#6bb315]" />
                <h3 className="text-2xl font-medium text-white">Lavage Extérieur</h3>
              </div>
              <p className="text-zinc-400 mb-8 font-light leading-relaxed">
                Lavage de carrosserie à la main avec shampoing professionnel, décontamination, nettoyage approfondi des jantes, brillant pneu et séchage microfibre pour un fini parfait.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-zinc-300 gap-3"><CheckCircle2 className="w-5 h-5 text-[#6bb315]" /> <span className="font-light">Lavage carrosserie lustrant</span></li>
                <li className="flex items-center text-zinc-300 gap-3"><CheckCircle2 className="w-5 h-5 text-[#6bb315]" /> <span className="font-light">Nettoyage jantes & pneus</span></li>
                <li className="flex items-center text-zinc-300 gap-3"><CheckCircle2 className="w-5 h-5 text-[#6bb315]" /> <span className="font-light">Séchage minutieux au chiffon doux</span></li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <Faq />

      {/* Features */}
      <section className="py-20 bg-black border-t border-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              "Nettoyage en profondeur",
              "Résultat impeccable",
              "Produits respectueux",
              "Service humain & chaleureux"
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors"
              >
                <CheckCircle2 className="h-8 w-8 text-[#6bb315] mb-4 opacity-80" />
                <h3 className="font-medium text-white/90">{feature}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
