import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Droplets } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import Lenis from "lenis";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Scroll to top immediately on route change via lenis
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
    };
  }, [location.pathname]);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Entreprises", href: "/fleet" },
    { name: "Galerie", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-[#6bb315] selection:text-white flex flex-col overflow-x-hidden w-full relative">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Veva Automobile Logo" 
              className="h-10 w-auto object-contain" 
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#6bb315]",
                  location.pathname === item.href ? "text-[#6bb315]" : "text-zinc-400"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-zinc-900 bg-black">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    location.pathname === item.href
                      ? "bg-zinc-900 text-[#6bb315]"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-zinc-900 bg-black py-12 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Droplets className="h-5 w-5 text-[#6bb315]" />
              <span className="text-xl font-bold tracking-tight text-white uppercase italic">
                Veva <span className="text-[#6bb315]">Automobile</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 mb-1">
              Spécialiste du nettoyage automobile intérieur et extérieur.
            </p>
            <address className="not-italic text-sm text-zinc-500">
              Genève, Suisse<br />
              <a href="tel:+41797890190" className="hover:text-[#6bb315] transition-colors">+41 79 789 01 90</a>
            </address>
          </div>
          <div className="text-sm text-zinc-500">
            <p className="mb-2">
              © {new Date().getFullYear()} Veva Automobile Genève. Tous droits réservés.
            </p>
            <p className="text-xs text-zinc-600">
              Propre à fond, dedans comme dehors! Un lavage complet pour une voiture impeccable.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/41797890190"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
