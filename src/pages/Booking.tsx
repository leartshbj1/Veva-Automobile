import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { auth, db, rtdb } from "@/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, get, push, query, orderByChild, equalTo } from "firebase/database";
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

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") || "Moyenne";
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "+41",
    vehicleModel: "",
    service: preselectedService,
    date: "",
    time: ""
  });

  const [otp, setOtp] = useState("");

  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    } catch (error: any) {
      console.error("Failed to initialize recaptcha verifier", error);
      if (error?.code === 'auth/internal-error') {
        setRecaptchaError("Erreur d'initialisation de reCAPTCHA : Vous devez ajouter ce domaine dans les 'Authorized domains' de Firebase Authentication.");
      } else {
        setRecaptchaError("Erreur d'initialisation de reCAPTCHA.");
      }
    }

    return () => {
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }
      } catch (e) {
        console.error("Error clearing recaptcha", e);
      }
    };
  }, []);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check availability in RTDB
      const appointmentsRef = ref(rtdb, 'appointments');
      const snapshot = await get(appointmentsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const isTaken = Object.values(data).some(
          (apt: any) => apt.date === formData.date && apt.time === formData.time
        );
        if (isTaken) {
          alert("Désolé, ce créneau est déjà réservé. Veuillez choisir une autre date ou heure.");
          setLoading(false);
          return;
        }
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formData.customerPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
    } catch (error: any) {
      console.error("Error sending OTP", error);
      let errorMsg = "Erreur lors de l'envoi du SMS. Assurez-vous que le numéro contient l'indicatif (ex: +417...).";
      
      if (error?.code === 'auth/internal-error') {
        errorMsg = "Erreur interne Firebase (auth/internal-error).\n\nPour que l'envoi de SMS fonctionne, vous devez :\n1. Activer le fournisseur 'Téléphone' dans Firebase Console > Authentication > Sign-in method.\n2. Ajouter ce domaine (l'URL actuelle de l'application) dans Firebase Console > Authentication > Settings > Authorized domains.";
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      const payload = {
        userId: user.uid,
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const path = 'appointments';
      const newRef = doc(collection(db, path));
      await setDoc(newRef, payload);

      // Save to RTDB
      const appointmentsRef = ref(rtdb, 'appointments');
      await push(appointmentsRef, payload);

      setSuccess(true);
    } catch (error: any) {
      console.error("OTP Error", error);
      if (error?.code === 'auth/invalid-verification-code') {
        alert("Code de vérification invalide. Veuillez réessayer.");
      } else {
        alert("Une erreur est survenue lors de la création de la réservation.");
      }
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
      <div id="recaptcha-container"></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black tracking-tight mb-4 uppercase italic">
          Réservez votre <span className="text-[#6bb315]">Lavage</span> !
        </h1>
        <p className="text-zinc-400 mb-10 font-light text-lg">Rapide, simple & avec un sourire humain. Disponible 7J/7.</p>
        
        {recaptchaError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center">
            {recaptchaError}
          </div>
        )}
        
        {step === "form" ? (
          <form onSubmit={handleSendOtp} className="space-y-8 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 sm:p-10 shadow-2xl">
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
                <label htmlFor="time" className="text-sm font-medium text-zinc-300">Heure souhaitée</label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required className="rounded-xl h-12 bg-zinc-900/50 outline-none" />
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full h-14 text-lg mt-4" size="lg" disabled={loading}>
              {loading ? "Vérification..." : "Continuer"}
            </Button>
            <p className="text-xs text-center text-zinc-500 font-light mt-4">
              Un SMS de confirmation vous sera envoyé à l'étape suivante.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-white mb-2">Vérification par SMS</h3>
              <p className="text-sm text-zinc-400">Un code à 6 chiffres a été envoyé au <span className="text-white font-medium">{formData.customerPhone}</span>.</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-zinc-300">Code de vérification</label>
              <Input 
                id="otp" 
                name="otp" 
                maxLength={6}
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                placeholder="123456" 
                className="rounded-xl h-14 text-center tracking-[0.5em] text-2xl font-mono bg-zinc-900/50 outline-none" 
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="w-1/3 rounded-full h-14" onClick={() => setStep("form")} disabled={loading}>
                Retour
              </Button>
              <Button type="submit" className="w-2/3 rounded-full h-14 text-lg" disabled={loading || otp.length !== 6}>
                {loading ? "Validation..." : "Confirmer"}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
