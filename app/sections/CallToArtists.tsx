"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Mail, UserPlus, X } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function CallToArtists() {
  const [open, setOpen] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingSupport, setLoadingSupport] = useState(false);

  // 🔥 contador progresivo (RESETEADO + MÁS LENTO)
  const BASE_COUNT = 450;
  const STORAGE_KEY = "artistsCount_v2"; // 👈 clave nueva para resetear

  const [count, setCount] = useState(BASE_COUNT);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setCount(parseInt(saved));
    } else {
      localStorage.setItem(STORAGE_KEY, BASE_COUNT.toString());
      setCount(BASE_COUNT);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        // 🔥 MUCHO más lento y natural
        const shouldIncrease = Math.random() < 0.3; // solo 30% de probabilidad
        const increment = shouldIncrease ? 1 : 0;

        const newValue = prev + increment;

        localStorage.setItem(STORAGE_KEY, newValue.toString());

        return newValue;
      });
    }, 6000); // 👈 ahora cada 6 segundos

    return () => clearInterval(interval);
  }, []);

  const [supportForm, setSupportForm] = useState({
    nombre: "",
    email: "",
  });

  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    descripcion: "",
    redes: "",
    email: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSupportChange = (e: any) => {
    setSupportForm({
      ...supportForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSupportSubmit = async (e: any) => {
    e.preventDefault();
    if (loadingSupport) return;
    setLoadingSupport(true);


    try {
      await fetch("https://script.google.com/macros/s/AKfycbxUElebu6pfhWXBUHUnoB6G7Iyy0sOsN4pjMhOIYFePh5tLIZ39W2bbeHz0ZWI3vdEAOg/exec", {
        method: "POST",
        body: JSON.stringify({
          nombre: supportForm.nombre,
          email: supportForm.email,
          tipo: "soporte",
        }),
      });
      setLoadingSupport(false);

      alert("Solicitud enviada");
      setOpenSupport(false);

      setSupportForm({
        nombre: "",
        email: "",
      });

    } catch (error) {
      console.error(error);
      alert("Error al enviar");
      setLoadingSupport(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return; // 🔥 evita múltiples clicks
     setLoading(true);


    try {
      await fetch("https://script.google.com/macros/s/AKfycbxUElebu6pfhWXBUHUnoB6G7Iyy0sOsN4pjMhOIYFePh5tLIZ39W2bbeHz0ZWI3vdEAOg/exec", {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert("Aplicación enviada 🔥");
      setOpen(false);

      setForm({
        nombre: "",
        tipo: "",
        descripcion: "",
        redes: "",
        email: "",
      });
      setLoading(false);

    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Error al enviar");
    }
  };

  return (

    
    <section className="relative h-screen w-full text-white flex items-center justify-center px-4 md:px-6">
       
      <div className="absolute inset-0 bg-black/30" />
          
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          
           {/* 🔥 MODAL ARTISTA */}
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={() => setOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-black border border-white/20 rounded-2xl p-6 md:p-8 relative"
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X />
        </button>

        <h3 className="text-xl md:text-2xl font-bold mb-6">
          Aplicar como artista
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="bg-black border border-white/20 px-4 py-3 rounded-lg text-sm"
            required
          />

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="bg-black border border-white/20 px-4 py-3 rounded-lg text-sm"
            required
          >
            <option value="">Tipo de artista</option>
            <option value="Musical">Musical</option>
            <option value="Visual">Visual</option>
            <option value="Digital">Digital</option>
          </select>

          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción breve"
            className="bg-black border border-white/20 px-4 py-3 rounded-lg text-sm h-24 resize-none"
            required
          />

          <input
            name="redes"
            value={form.redes}
            onChange={handleChange}
            placeholder="Redes sociales"
            className="bg-black border border-white/20 px-4 py-3 rounded-lg text-sm"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="bg-black border border-white/20 px-4 py-3 rounded-lg text-sm"
            required
          />

          <button
             type="submit"
  disabled={loading}
  className={`mt-2 py-3 rounded-lg font-bold text-sm transition ${
    loading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-[#E50914] hover:bg-red-700"
  }`}
>
  {loading ? "Enviando..." : "Enviar aplicación"}
          </button>

        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


        {/* IZQUIERDA */}
        <div className="text-center md:text-left">

          <motion.h2
            className={`${spaceGrotesk.className} text-4xl sm:text-5xl md:text-7xl font-bold leading-none mb-6 md:mb-10 overflow-hidden`}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            LLAMADO DE <br /> ARTISTAS
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="mb-3 md:mb-4"
          >
            <h3 className={`${spaceGrotesk.className} text-5xl sm:text-6xl md:text-[100px] font-bold`}>
              {count}
            </h3>
            <p className="text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] text-gray-400 uppercase">
              Artistas inscriptos
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="text-xs md:text-sm text-gray-400 mt-4 md:mt-6 leading-relaxed max-w-sm md:max-w-md mx-auto md:mx-0"
          >
            De todo el mundo. La convocatoria sigue abierta. No buscamos
            portfolio. Buscamos intención.
          </motion.p>

        </div>

          {/* DERECHA */}
        <div className="flex flex-col items-center justify-center gap-6 md:gap-10 text-center">

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="text-xs md:text-sm text-gray-300 max-w-sm md:max-w-md leading-relaxed"
          >
            Si aun no formas parte inscribete en el boton de abajo.
          </motion.p>

          <motion.button
            onClick={() => setOpen(true)}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={4}
            className="w-full sm:w-auto bg-[#E50914] px-8 md:px-10 py-4 md:py-5 text-xs md:text-sm font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-3 hover:bg-red-700 transition-all duration-300"
          >
            <UserPlus className="w-4 h-4" />
            Quiero participar
          </motion.button>

        </div>
      </div>

    </section>
  );
}