import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { auth, db } from "@/firebase";
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import * as motion from "motion/react-client";
import { Helmet } from "react-helmet-async";

const ALL_SLOTS = ["08:30", "10:00", "11:30", "13:30", "15:00", "16:30", "18:00"];

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") || "Moyenne";
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "+41",
    vehicleModel: "",
    service: preselectedService,
    date: "",
    time: ""
  });

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formData.date) {
        setBookedSlots([]);
        return;
      }
      setCheckingAvailability(true);
      try {
        const q = query(collection(db, 'appointments'), where('date', '==', formData.date));
        const querySnapshot = await getDocs(q);
        const booked = querySnapshot.docs.map(doc => doc.data().time as string);
        setBookedSlots(booked);
        
        if (formData.time && booked.includes(formData.time)) {
          setFormData(prev => ({ ...prev, time: "" }));
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setCheckingAvailability(false);
      }
    };
    fetchAvailability();
  }, [formData.date]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.time) {
      alert("Veuillez sélectionner une heure.");
      return;
    }

    setLoading(true);
    
    try {
      // Final check before booking
      const q = query(
        collection(db, 'appointments'), 
        where('date', '==', formData.date),
        where('time', '==', formData.time)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        alert("Désolé, ce créneau vient d'être réservé. Veuillez en choisir un autre.");
        setBookedSlots(prev => [...prev, formData.time]);
        setFormData(prev => ({...prev, time: ""}));
        setLoading(false);
        return;
      }

      const payload = {
        userId: "guest_" + Math.random().toString(36).substring(2, 9),
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const path = 'appointments';
      const newRef = doc(collection(db, path));
      await setDoc(newRef, payload);

      setSuccess(true);
    } catch (error: any) {
      console.error("Booking Error", error);
      alert("Une erreur est survenue lors de la création de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (success) {
    return (
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
      >
        <div className="w-20 h-20 bg-[#6bb315]/20 text-[#6bb315] rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-medium tracking-tight mb-4">Réservation Confirmée !</h2>
        <p className="text-zinc-400 mb-10 max-w-md text-balance font-light leading-relaxed">
          Merci pour votre réservation. Votre compte a été vérifié et nous vous contacterons très bientôt pour l'horaire exact.
        </p>
        <Button asChild className="rounded-full px-8" size="lg">
          <a href="/">Retour à l'accueil</a>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 relative">
      <Helmet>
        <title>Veva Automobile Genève - Réservation en Ligne</title>
        <meta name="description" content="Réservez en ligne votre lavage auto à Genève. Choisissez votre formule, votre date et votre horaire pour un nettoyage de voiture sur-mesure." />
        <link rel="canonical" href="https://www.vevaautomobile.ch/booking" />
      </Helmet>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black tracking-tight mb-4 uppercase italic">
          Réservez votre <span className="text-[#6bb315]">Lavage</span> !
        </h1>
        <p className="text-zinc-400 mb-10 font-light text-lg">Rapide, simple & avec un sourire humain. Disponible 7J/7.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="customerName" className="text-sm font-medium text-zinc-300">Nom & Prénom</label>
                <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="Jean Dupont" className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
              </div>
              <div className="space-y-2">
                <label htmlFor="customerPhone" className="text-sm font-medium text-zinc-300">Téléphone (avec l'indicatif)</label>
                <Input id="customerPhone" name="customerPhone" type="tel" value={formData.customerPhone} onChange={handleChange} required placeholder="+41790000000" className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="vehicleModel" className="text-sm font-medium text-zinc-300">Modèle du véhicule</label>
              <Input id="vehicleModel" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} required placeholder="VW Golf 8" className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
            </div>

            <div className="space-y-2">
              <label htmlFor="service" className="text-sm font-medium text-zinc-300">Formule Choisie</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="flex h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6bb315] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition-colors hover:bg-zinc-900"
              >
                <option value="Citadine">Citadine (80.-)</option>
                <option value="Moyenne">Moyenne (90.-)</option>
                <option value="Grande">Grande (100.-)</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-zinc-300">Date souhaitée</label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Heure souhaitée (1h30)</label>
                {!formData.date ? (
                  <div className="flex h-12 items-center px-4 rounded-xl border border-zinc-800 bg-zinc-900/30 text-sm text-zinc-500">
                    Sélectionnez d'abord une date
                  </div>
                ) : checkingAvailability ? (
                  <div className="flex h-12 items-center px-4 rounded-xl border border-zinc-800 bg-zinc-900/30 text-sm text-zinc-500">
                    Vérification des disponibilités...
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {ALL_SLOTS.map((timeSlot) => {
                      const isBooked = bookedSlots.includes(timeSlot);
                      const isSelected = formData.time === timeSlot;
                      
                      return (
                        <button
                          key={timeSlot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setFormData(prev => ({ ...prev, time: timeSlot }))}
                          className={`
                            h-10 text-sm rounded-lg transition-all border
                            ${isBooked 
                              ? 'bg-red-500/10 border-red-500/20 text-red-400 cursor-not-allowed opacity-50' 
                              : isSelected
                                ? 'bg-[#6bb315] border-[#6bb315] text-white font-medium shadow-[0_0_15px_rgba(107,179,21,0.3)]'
                                : 'bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800'
                            }
                          `}
                        >
                          {timeSlot}
                        </button>
                      );
                    })}
                  </div>
                )}
                {formData.date && !checkingAvailability && bookedSlots.length >= ALL_SLOTS.length && (
                  <p className="text-sm text-red-400 mt-2">Ce jour est complet. Veuillez choisir une autre date.</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full h-14 text-lg mt-4" size="lg" disabled={loading}>
              {loading ? "Enregistrement..." : "Confirmer la réservation"}
            </Button>
          </form>
      </motion.div>
    </div>
  );
}
