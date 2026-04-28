import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { auth, db, googleProvider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import * as motion from "motion/react-client";

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

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      userId: auth.currentUser.uid,
      service: fd.get("service") as string,
      date: fd.get("date") as string,
      time: fd.get("time") as string,
      customerName: fd.get("customerName") as string,
      customerPhone: fd.get("customerPhone") as string,
      vehicleModel: fd.get("vehicleModel") as string,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const path = 'appointments';
    try {
      const newRef = doc(collection(db, path));
      await setDoc(newRef, data);
      setSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  if (!auth.currentUser) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
      >
        <h2 className="text-3xl font-medium tracking-tight mb-4">Connectez-vous pour réserver</h2>
        <p className="text-zinc-400 mb-8 max-w-md text-balance font-light leading-relaxed">
          Veuillez vous connecter avec votre compte Google afin que nous puissions confirmer votre rendez-vous.
        </p>
        <Button onClick={loginWithGoogle} size="lg" className="rounded-full px-8">
          Se connecter avec Google
        </Button>
      </motion.div>
    );
  }

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
        <h2 className="text-3xl font-medium tracking-tight mb-4">Demande Envoyée !</h2>
        <p className="text-zinc-400 mb-10 max-w-md text-balance font-light leading-relaxed">
          Merci pour votre réservation. Nous vous contacterons très bientôt pour confirmer l'horaire exact.
        </p>
        <Button asChild className="rounded-full px-8" size="lg">
          <a href="/">Retour à l'accueil</a>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
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
              <Input id="customerName" name="customerName" required placeholder="Jean Dupont" className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="customerPhone" className="text-sm font-medium text-zinc-300">Téléphone</label>
              <Input id="customerPhone" name="customerPhone" required placeholder="079 000 00 00" className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="vehicleModel" className="text-sm font-medium text-zinc-300">Modèle du véhicule</label>
            <Input id="vehicleModel" name="vehicleModel" required placeholder="VW Golf 8" className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
          </div>

          <div className="space-y-2">
            <label htmlFor="service" className="text-sm font-medium text-zinc-300">Formule Choisie</label>
            <select
              id="service"
              name="service"
              defaultValue={preselectedService}
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
              <Input id="date" name="date" type="date" required min={new Date().toISOString().split('T')[0]} className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium text-zinc-300">Heure souhaitée</label>
              <Input id="time" name="time" type="time" required className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full h-14 text-lg mt-4" size="lg" disabled={loading}>
            {loading ? "Envoi en cours..." : "Confirmer la Réservation"}
          </Button>

          <p className="text-xs text-center text-zinc-500 font-light mt-4">
            Un supplément peut être appliqué si le véhicule est très sale.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
