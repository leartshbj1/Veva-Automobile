import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Fleet from "./pages/Fleet";
import Admin from "./pages/Admin";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import * as motion from "motion/react-client";

export default function App() {
  const [init, setInit] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setInit(false);
    });

    return () => unsubscribe();
  }, []);

  if (init) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <motion.img 
          src="/logo.png" 
          alt="Veva Automobile Logo" 
          className="h-16 w-auto object-contain mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <div className="w-8 h-8 border-4 border-[#6bb315] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="booking" element={<Booking />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="fleet" element={<Fleet />} />
        </Route>
        <Route path="/admin355leart" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
