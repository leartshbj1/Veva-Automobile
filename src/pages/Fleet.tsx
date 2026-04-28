import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Calculator, CheckCircle2, MoveRight } from "lucide-react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import * as motion from "motion/react-client";

export default function Fleet() {
  const [vehicleCount, setVehicleCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dynamic pricing calculation
  const getEstimatedPrice = (count: number) => {
    let basePrice = 90; // Standard price "Moyenne"
    
    if (count >= 20) {
      basePrice = 65; 
    } else if (count >= 10) {
      basePrice = 75;
    } else if (count >= 5) {
      basePrice = 80;
    } else if (count >= 3) {
      basePrice = 85;
    }
    
    return {
      unitPrice: basePrice,
      totalPrice: basePrice * count
    };
  };

  const { unitPrice, totalPrice } = getEstimatedPrice(vehicleCount);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    
    const companyName = fd.get("companyName") as string;
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const notes = fd.get("message") as string;
    
    const messageContent = `[DEMANDE FLOTTE ENTREPRISE]
Entreprise: ${companyName}
Contact: ${name}
Nombre de véhicules: ${vehicleCount}
Prix unitaire estimé: ${unitPrice} CHF (Total: ${totalPrice} CHF)

Message: 
${notes}`;

    const data = {
      userId: auth.currentUser?.uid || "anonymous",
      name: name,
      email: email,
      message: messageContent,
      createdAt: new Date(),
    };

    try {
      // Re-using contactMessages as it accepts standard fields
      const newRef = doc(collection(db, "contactMessages"));
      await setDoc(newRef, data);
      setSuccess(true);
      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const createWhatsAppLink = () => {
    const msg = encodeURIComponent(`Bonjour Veva Automobile Genève,\nJe représente une entreprise et nous avons une flotte de ${vehicleCount} véhicules à laver.\nD'après votre simulateur, l'estimation est de ${totalPrice} CHF (${unitPrice} CHF/véhicule).\nPouvons-nous en discuter immédiatement ?`);
    return `https://wa.me/41797890190?text=${msg}`;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-zinc-950 py-16 sm:py-24 border-b border-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-300 font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#6bb315] animate-pulse" />
            Service pour professionnels
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-black tracking-tight sm:text-5xl italic text-white uppercase mb-6"
          >
            Lavage de Flotte <span className="text-[#6bb315]">Entreprise</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-zinc-400 font-light"
          >
            Un service sur-mesure pour votre parc automobile à Genève. Profitez de tarifs dégressifs et d'une prise en charge prioritaire pour vos véhicules professionnels.
          </motion.p>
        </div>
      </section>

      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Calculator Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-zinc-900/40 p-8 rounded-3xl sticky top-24 transition-colors hover:bg-zinc-900/60"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-[#6bb315]" />
              <h2 className="text-2xl font-medium text-white tracking-tight">Simulateur de Prix</h2>
            </div>
            
            <p className="text-zinc-400 mb-8 font-light">
              Discutez du prix immédiatement avec nous selon la taille de votre parc de véhicules. Les tarifs s'ajustent automatiquement.
            </p>

            <div className="space-y-10">
              <div>
                <label className="flex justify-between text-sm font-medium text-zinc-300 mb-6">
                  <span>Nombre de véhicules</span>
                  <span className="text-xl font-medium text-white">{vehicleCount}</span>
                </label>
                <input 
                  type="range" 
                  min="3" 
                  max="50" 
                  value={vehicleCount} 
                  onChange={(e) => setVehicleCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#6bb315]"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-4">
                  <span>3 minimum</span>
                  <span>50+</span>
                </div>
              </div>

              <div className="bg-black/40 p-8 rounded-2xl border border-zinc-800/30">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-zinc-800/50">
                  <span className="text-zinc-400 font-light">Tarif unitaire estimé</span>
                  <span className="text-2xl font-medium text-white">{unitPrice} <span className="text-sm font-light text-zinc-500">CHF</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300 font-medium">Total estimé</span>
                  <span className="text-4xl font-black italic text-[#6bb315]">{totalPrice} <span className="text-lg font-light not-italic text-zinc-500">CHF</span></span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full h-14 text-lg hidden sm:flex rounded-full">
                <a href={createWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  En discuter sur WhatsApp <MoveRight className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-medium text-white tracking-tight mb-6">Demande de rappel</h2>
            <p className="text-zinc-400 mb-10 font-light">
              Remplissez ce formulaire et notre équipe B2B vous contactera rapidement pour organiser le nettoyage de vos véhicules sur Genève.
            </p>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#6bb315]/10 border border-[#6bb315]/20 rounded-3xl p-8 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-[#6bb315] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Demande envoyée !</h3>
                <p className="text-zinc-400 font-light">Nous vous recontactons dans les plus brefs délais.</p>
                <Button className="mt-8 rounded-full" variant="outline" onClick={() => setSuccess(false)}>
                  Faire une autre demande
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium text-zinc-300">Nom de l'entreprise</label>
                  <Input id="companyName" name="companyName" required placeholder="Ex: Transports SA" className="rounded-xl h-12 bg-zinc-900/50" />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-300">Personne de contact</label>
                    <Input id="name" name="name" required placeholder="Jean Dupont" className="rounded-xl h-12 bg-zinc-900/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email professionnel</label>
                    <Input id="email" name="email" type="email" required placeholder="jean@entreprise.ch" className="rounded-xl h-12 bg-zinc-900/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-zinc-300">Détails supplémentaires</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="flex w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6bb315] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 resize-none transition-colors hover:bg-zinc-900"
                    placeholder="Lieu de stationnement, fréquence souhaitée, etc."
                  />
                </div>

                <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto mt-4 rounded-full">
                  {loading ? "Envoi..." : "Envoyer la demande"}
                </Button>
              </form>
            )}

            <div className="mt-16 space-y-6">
              <h4 className="font-medium text-white/90">Pourquoi choisir Veva Automobile ?</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#6bb315] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-400 font-light leading-relaxed">Flexibilité totale sur les horaires de lavage.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#6bb315] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-400 font-light leading-relaxed">Tarification transparente et dégressive.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#6bb315] flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-400 font-light leading-relaxed">Image de marque préservée avec des véhicules toujours impeccables.</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
        </div>
      </section>
    </div>
  );
}
