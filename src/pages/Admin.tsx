import { useEffect, useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, addDoc, doc, deleteDoc, serverTimestamp, query, orderBy, getDoc, setDoc } from "firebase/firestore";
import { X, Plus, Trash2, LogOut, UploadCloud } from "lucide-react";
import * as motion from "motion/react-client";

// Image compression utility
function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = height * (MAX_WIDTH / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function handleFirestoreError(error: unknown, operationType: string, path: string | null) {
  console.error('Firestore Error:', { error, operationType, path });
  alert("Une erreur est survenue avec Firestore. " + (error instanceof Error ? error.message : String(error)));
}

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);

  // New Project Form
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectCover, setNewProjectCover] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (
        u &&
        [
          "leartshabija@gmail.com",
          "valdrinmiftari130@gmail.com",
          "endi.0101gashi@gmail.com",
          "valdrinv938@gmail.com",
          "aldionfrangu@gmail.com"
        ].includes(u.email)
      ) {
        fetchProjects();
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
      alert("Erreur de connexion");
    }
  };

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, "galleryProjects"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      handleFirestoreError(e, "list", "galleryProjects");
    }
  };

  const fetchImages = async (projectId: string) => {
    try {
      const q = query(collection(db, "galleryProjects", projectId, "images"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      handleFirestoreError(e, "list", `galleryProjects/${projectId}/images`);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newProjectCover) return alert("Nom et image de couverture requis");
    
    try {
      const coverBase64 = await compressImage(newProjectCover);
      await addDoc(collection(db, "galleryProjects"), {
        name: newProjectName,
        description: newProjectDesc,
        coverImage: coverBase64,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewProjectName("");
      setNewProjectDesc("");
      setNewProjectCover(null);
      fetchProjects();
    } catch (e) {
      handleFirestoreError(e, "create", "galleryProjects");
    }
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "galleryProjects", id));
      fetchProjects();
      if (selectedProject?.id === id) setSelectedProject(null);
    } catch (e) {
      handleFirestoreError(e, "delete", `galleryProjects/${id}`);
    }
  };

  const uploadImages = async (files: FileList | null, type: "avant" | "apres") => {
    if (!files || !selectedProject) return;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await compressImage(file);
        await addDoc(collection(db, "galleryProjects", selectedProject.id, "images"), {
          type,
          url: base64,
          createdAt: serverTimestamp()
        });
      }
      fetchImages(selectedProject.id);
    } catch (e) {
      handleFirestoreError(e, "create", `galleryProjects/${selectedProject.id}/images`);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!selectedProject) return;
    try {
      await deleteDoc(doc(db, "galleryProjects", selectedProject.id, "images", imageId));
      fetchImages(selectedProject.id);
    } catch (e) {
      handleFirestoreError(e, "delete", `galleryProjects/${selectedProject.id}/images/${imageId}`);
    }
  };

  if (
    !user ||
    ![
      "leartshabija@gmail.com",
      "valdrinmiftari130@gmail.com",
      "endi.0101gashi@gmail.com",
      "valdrinv938@gmail.com",
      "aldionfrangu@gmail.com"
    ].includes(user.email)
  ) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 absolute inset-0 z-[-1]" />
        <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 text-center max-w-md w-full">
          <h1 className="text-2xl font-black text-white mb-2">Panel Admin</h1>
          <p className="text-zinc-400 mb-8">Connectez-vous avec un compte autorisé pour accéder.</p>
          <button 
            onClick={login}
            className="w-full bg-[#6bb315] hover:bg-[#5a9c11] text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Connexion Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white p-4 sm:p-6 overflow-y-auto w-full max-w-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Topbar */}
        <div className="flex justify-between items-center bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
          <h1 className="text-xl sm:text-2xl font-black italic">Admin Gallery</h1>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm hidden sm:block">{user.email}</span>
            <button onClick={() => signOut(auth)} className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!selectedProject ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create form */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl lg:h-fit">
              <h2 className="text-lg font-bold mb-4">Nouveau Projet</h2>
              <form onSubmit={createProject} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Nom (ex: PORSCHE MACAN T)" 
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl focus:border-[#6bb315] outline-none"
                />
                <textarea 
                  placeholder="Description..." 
                  value={newProjectDesc}
                  onChange={e => setNewProjectDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl focus:border-[#6bb315] outline-none min-h-[100px]"
                />
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Image de couverture</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setNewProjectCover(e.target.files?.[0] || null)}
                    className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6bb315] file:text-white hover:file:bg-[#5a9c11] cursor-pointer"
                  />
                </div>
                <button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-bold py-3 rounded-xl mt-2 flex items-center justify-center gap-2 transition-colors">
                  <Plus className="w-5 h-5" />
                  Créer
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {projects.map(proj => (
                <div 
                  key={proj.id} 
                  onClick={() => { setSelectedProject(proj); fetchImages(proj.id); }}
                  className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-colors"
                >
                  <img src={proj.coverImage} className="w-20 h-20 sm:w-32 sm:h-24 object-cover rounded-xl" alt="cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{proj.name}</h3>
                    <p className="text-zinc-500 text-sm line-clamp-1">{proj.description}</p>
                  </div>
                  <button onClick={(e) => deleteProject(proj.id, e)} className="p-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors"
              >
                ← Retour
              </button>
              <h2 className="text-xl sm:text-2xl font-bold">{selectedProject.name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {/* Avant Section */}
              <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Photos Avant</h3>
                  <label className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-2 rounded-full transition-colors flex items-center justify-center text-zinc-300">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => uploadImages(e.target.files, "avant")} />
                    <Plus className="w-5 h-5" />
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.filter(img => img.type === "avant").map(img => (
                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={img.url} className="w-full h-full object-cover" alt="avant" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteImage(img.id); }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 pointer-events-none" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-zinc-500 hover:text-zinc-400">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => uploadImages(e.target.files, "avant")} />
                    <UploadCloud className="w-6 h-6" />
                    <span className="text-xs sm:text-sm font-medium">Ajouter</span>
                  </label>
                </div>
              </div>

              {/* Après Section */}
              <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#6bb315]">Photos Après</h3>
                  <label className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-2 rounded-full transition-colors flex items-center justify-center text-[#6bb315]">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => uploadImages(e.target.files, "apres")} />
                    <Plus className="w-5 h-5" />
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.filter(img => img.type === "apres").map(img => (
                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={img.url} className="w-full h-full object-cover" alt="apres" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteImage(img.id); }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-red-600 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 pointer-events-none" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-zinc-500 hover:text-[#6bb315]">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => uploadImages(e.target.files, "apres")} />
                    <UploadCloud className="w-6 h-6" />
                    <span className="text-xs sm:text-sm font-medium">Ajouter</span>
                  </label>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
