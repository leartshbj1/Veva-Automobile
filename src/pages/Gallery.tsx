import * as motion from "motion/react-client";

const images = [
  "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550346580-c1eb3df4b4d7?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518982367176-8051a8ba9a7d?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80"
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export default function Gallery() {
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
          Découvrez quelques-unes de nos réalisations. Un travail de passionné avec le souci du détail.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {images.map((src, idx) => (
          <motion.div
            variants={itemVariants}
            key={idx}
            className="aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/50 group relative"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img 
              src={src} 
              alt={`Réalisation Veva Automobile ${idx + 1}`} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
