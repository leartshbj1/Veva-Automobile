import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Phone, Mail, MapPin } from "lucide-react";
import * as motion from "motion/react-client";
import { Helmet } from "react-helmet-async";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const vehicle = fd.get("vehicle") as string;
    const message = fd.get("message") as string;

    const msg = `Bonjour Veva Automobile,

Nom: ${name}
Email: ${email}
Véhicule: ${vehicle}

Message: 
${message}`;

    const whatsappUrl = `https://wa.me/41797890190?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    
    setSuccess(true);
    e.currentTarget.reset();
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 sm:py-24">
      <Helmet>
        <title>Veva Automobile Genève - Nous Contacter</title>
        <meta name="description" content="Contactez Veva Automobile à Genève pour un lavage de voiture ou demander un devis. Prenez rendez-vous facilement par formulaire, email ou WhatsApp." />
        <link rel="canonical" href="https://www.vevaautomobile.ch/contact" />
      </Helmet>
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-black italic uppercase tracking-tight text-white mb-6">
            Contactez-<span className="text-[#6bb315]">nous</span>
          </h1>
          <p className="text-zinc-400 mb-12 max-w-md font-light leading-relaxed">
            Une question ou une demande spéciale ? N'hésitez pas à nous contacter. Nous vous répondrons dans les plus brefs délais avec le plus grand soin.
          </p>

          <div className="space-y-8">
            <a href="https://wa.me/41797890190" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group cursor-pointer">
              <div className="w-14 h-14 bg-zinc-900 group-hover:bg-[#6bb315]/20 rounded-2xl flex items-center justify-center text-[#6bb315] transition-colors shadow-lg">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-white group-hover:text-[#6bb315] transition-colors">Téléphone / WhatsApp</p>
                <p className="text-zinc-400 font-light">+41 79 789 01 90</p>
              </div>
            </a>
            
            <a href="mailto:info@veva-automobile.ch" className="flex items-center gap-6 group cursor-pointer">
              <div className="w-14 h-14 bg-zinc-900 group-hover:bg-[#6bb315]/20 rounded-2xl flex items-center justify-center text-[#6bb315] transition-colors shadow-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-white group-hover:text-[#6bb315] transition-colors">Email</p>
                <p className="text-zinc-400 font-light">info@veva-automobile.ch</p>
              </div>
            </a>

            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#6bb315] shadow-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-white">Zone d'intervention</p>
                <p className="text-zinc-400 font-light">Canton de Genève et alentours</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 sm:p-10 shadow-2xl"
        >
          {success ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-[#6bb315]/20 text-[#6bb315] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-medium text-white mb-2">Message Envoyé !</h3>
              <p className="text-zinc-400 font-light">Nous vous répondrons bientôt.</p>
              <Button className="mt-8 rounded-full" variant="outline" onClick={() => setSuccess(false)}>
                Nouveau message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-zinc-300">Nom complet</label>
                <Input id="name" name="name" required placeholder="Votre nom" className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-300">Adresse email</label>
                <Input id="email" name="email" type="email" required placeholder="vous@exemple.com" className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
              </div>
              <div className="space-y-2">
                <label htmlFor="vehicle" className="text-sm font-medium text-zinc-300">Marque et modèle du véhicule</label>
                <Input id="vehicle" name="vehicle" required placeholder="ex: Volkswagen Golf" className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="flex w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6bb315] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 resize-none transition-colors hover:bg-zinc-900"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>
              <Button type="submit" className="w-full rounded-full h-12 text-lg mt-4" size="lg" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer le message"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
