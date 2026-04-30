import { useState, useEffect } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

interface GalleryImage {
  id: string;
  type: "avant" | "apres";
  url: string;
}

interface GalleryModel {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  images: GalleryImage[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Gallery() {
  const [galleryModels, setGalleryModels] = useState<GalleryModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<GalleryModel | null>(null);
  const [activeTab, setActiveTab] = useState<"avant" | "apres">("avant");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(db, "galleryProjects"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const projects = snap.docs.map(d => ({ id: d.id, ...d.data(), images: [] })) as GalleryModel[];
        setGalleryModels(projects);
      } catch (e) {
        console.error("Error fetching gallery:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    if (selectedModel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedModel]);

  const openModel = async (model: GalleryModel) => {
    setSelectedModel(model);
    setActiveTab("avant");
    
    // Fetch images for this model if not already fetched
    if (model.images.length === 0) {
      try {
        const q = query(collection(db, "galleryProjects", model.id, "images"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const images = snap.docs.map(d => ({ id: d.id, ...d.data() })) as GalleryImage[];
        
        setGalleryModels(prev => prev.map(p => p.id === model.id ? { ...p, images } : p));
        setSelectedModel(prev => prev ? { ...prev, images } : null);
      } catch (e) {
        console.error("Error fetching images:", e);
      }
    }
  };

  return (
    <div className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-black uppercase italic tracking-tight text-white mb-6">
          Notre <span className="text-[#6bb315]">Galerie</span>
        </h1>
        <p className="text-zinc-400 font-light text-lg max-w-2xl mx-auto">
          Découvrez nos réalisations au travers de nos modèles. Un travail de passionné avec le souci du détail, illustré par nos "Avant / Après".
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-[#6bb315] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : galleryModels.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          Aucun projet dans la galerie pour le moment.
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {galleryModels.map((model) => (
            <motion.div
              variants={itemVariants}
              key={model.id}
              onClick={() => openModel(model)}
              className="aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/50 group relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img 
                src={model.coverImage} 
                alt={model.name} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-2xl font-black text-white italic tracking-tight">{model.name}</h3>
                <p className="text-zinc-300 text-sm mt-2 line-clamp-2">{model.description}</p>
                <div className="mt-4 inline-flex items-center text-[#6bb315] text-sm font-semibold uppercase tracking-wider group-hover:text-white transition-colors">
                  Voir Avant / Après <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal / Dialog for Before/After */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedModel(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header and Tabs */}
              <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-zinc-800/50 gap-4 sm:gap-0">
                <div>
                  <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                    <h2 className="text-xl sm:text-2xl font-black text-white italic">{selectedModel.name}</h2>
                    <button 
                      onClick={() => setSelectedModel(null)}
                      className="sm:hidden p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 ms-4"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex gap-2 sm:gap-3 mt-3 w-full sm:w-auto">
                    <button
                      onClick={() => setActiveTab("avant")}
                      className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                        activeTab === "avant" 
                          ? "bg-zinc-800 text-white shadow-inner" 
                          : "text-zinc-500 hover:text-white bg-zinc-900 border border-zinc-800/50 hover:bg-zinc-800/50"
                      }`}
                    >
                      Photos Avant
                    </button>
                    <button
                      onClick={() => setActiveTab("apres")}
                      className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                        activeTab === "apres" 
                          ? "bg-[#6bb315] text-white shadow-[0_0_15px_rgba(107,179,21,0.3)]" 
                          : "text-zinc-500 hover:text-white bg-zinc-900 border border-zinc-800/50 hover:bg-zinc-800/50"
                      }`}
                    >
                      Photos Après
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedModel(null)}
                  className="hidden sm:block p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Grid Content */}
              <div className="p-2 sm:p-6 bg-zinc-950/50 flex-1 overflow-y-auto custom-scrollbar overscroll-contain">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-6 pb-4">
                  {selectedModel.images.filter(img => img.type === activeTab).length === 0 ? (
                    <div className="col-span-1 border border-zinc-800/50 border-dashed rounded-xl sm:col-span-2 py-12 text-center text-zinc-500">
                      Aucune photo {activeTab} pour ce projet.
                    </div>
                  ) : (
                    selectedModel.images.filter(img => img.type === activeTab).map((img, idx) => (
                      <motion.div 
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="flex flex-col gap-3"
                      >
                        <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/50 shadow-xl flex items-center justify-center p-2 sm:p-4 group">
                          <img 
                            src={img.url} 
                            alt={`Photo ${activeTab}`} 
                            className="w-full h-full object-contain rounded-lg sm:rounded-xl transition-transform duration-500 group-hover:scale-[1.02]" 
                            draggable={false}
                          />
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
