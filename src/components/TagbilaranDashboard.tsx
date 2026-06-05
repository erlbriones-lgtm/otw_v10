import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Compass,
  ArrowLeft,
  MapPin
} from "lucide-react";
import { tagbilaranBarangays } from "../data";

// Explicit visual mapping matching real local scenic assets
const barangayImages: Record<string, string> = {
  "Barangay Bool": "/temp/Blood Compact Shrine (2).webp",
  "Barangay Booy": "/temp/Taloto to Manga Coastline (6).webp",
  "Barangay Cabawan": "/temp/Balili Heritage House (4).webp",
  "Barangay Cogon": "/temp/City Lights of Tagbilaran (1).webp",
  "Barangay Dampas": "/temp/Bohol Blades (1).webp",
  "Barangay Dao": "/temp/City Lights of Tagbilaran (11).webp",
  "Barangay Manga": "/temp/Taloto to Manga Coastline (1).webp",
  "Barangay Mansasa": "/temp/Taloto to Manga Coastline (6).webp",
  "Barangay Poblacion I": "/temp/Poblacion 1, Tagbilaran City (2).webp",
  "Barangay Poblacion II": "/temp/Poblacion 1, Tagbilaran City (1).webp",
  "Barangay Poblacion III": "/temp/Old House in Poblacion 1 (3).webp",
  "Barangay San Isidro": "/temp/Balili Heritage House (4).webp",
  "Barangay Taloto": "/temp/Tubig Dako in Taloto (1).webp",
  "Barangay Tiptip": "/temp/City Lights of Tagbilaran (7).webp",
  "Barangay Ubujan": "/temp/Capt. Salazar Monument (1).webp"
};

// High-accuracy localized landmark names of each Barangay to pin Google Maps in the exact correct area
const barangayMapQueries: Record<string, string> = {
  "Barangay Bool": "Sandugo Blood Compact Monument, Bool, Tagbilaran City, Bohol, Philippines",
  "Barangay Booy": "Booy Barangay Hall, Booy, Tagbilaran City, Bohol, Philippines",
  "Barangay Cabawan": "Cabawan Barangay Hall, Cabawan, Tagbilaran City, Bohol, Philippines",
  "Barangay Cogon": "Cogon Barangay Hall, Cogon, Tagbilaran City, Bohol, Philippines",
  "Barangay Dampas": "Dampas Barangay Hall, Dampas, Tagbilaran City, Bohol, Philippines",
  "Barangay Dao": "Bohol Integrated Bus Terminal, Dao, Tagbilaran City, Bohol, Philippines",
  "Barangay Manga": "Manga Barangay Hall, Manga, Tagbilaran City, Bohol, Philippines",
  "Barangay Mansasa": "Mansasa Barangay Hall, Mansasa, Tagbilaran City, Bohol, Philippines",
  "Barangay Poblacion I": "Saint Joseph Cathedral, Poblacion I, Tagbilaran City, Bohol, Philippines",
  "Barangay Poblacion II": "Bohol National Museum, Poblacion II, Tagbilaran City, Bohol, Philippines",
  "Barangay Poblacion III": "Tagbilaran City Tourist Port, Poblacion III, Tagbilaran City, Bohol, Philippines",
  "Barangay San Isidro": "San Isidro Barangay Hall, San Isidro, Tagbilaran City, Bohol, Philippines",
  "Barangay Taloto": "Taloto Barangay Hall, Taloto, Tagbilaran City, Bohol, Philippines",
  "Barangay Tiptip": "Tiptip Barangay Hall, Tiptip, Tagbilaran City, Bohol, Philippines",
  "Barangay Ubujan": "Ubujan Barangay Hall, Ubujan, Tagbilaran City, Bohol, Philippines"
};

export const TagbilaranDashboard: React.FC = () => {
  const [selectedBarangay, setSelectedBarangay] = useState<string>("Barangay Bool");
  const [showMap, setShowMap] = useState<boolean>(false);

  const currentIndex = tagbilaranBarangays.findIndex(b => b.name === selectedBarangay);
  const activeBarangay = tagbilaranBarangays[currentIndex] || tagbilaranBarangays[0];

  // Cycles forward and backward through the barangays
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const prevIdx = (currentIndex - 1 + tagbilaranBarangays.length) % tagbilaranBarangays.length;
    setSelectedBarangay(tagbilaranBarangays[prevIdx].name);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextIdx = (currentIndex + 1) % tagbilaranBarangays.length;
    setSelectedBarangay(tagbilaranBarangays[nextIdx].name);
  };

  return (
    <div className="w-full relative" id="barangay-interactive-showcase">
      <AnimatePresence mode="wait">
        {!showMap ? (
          <motion.div
            key="carousel-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-6xl mx-auto flex flex-col items-center py-6 select-none text-[#2A7221]"
          >
            {/* Elegant Header and Interactive Layout */}
            <div className="w-full max-w-3xl mx-auto mb-10 text-center animate-fade-in" id="about-districts-exclusive">
              <h3 className="font-display font-black text-3xl sm:text-5xl text-[#2A7221] tracking-wide text-center uppercase">
                Barangay Cultural Hub
              </h3>
              <p className="text-[#2A7221]/80 text-xs sm:text-sm mt-3 leading-relaxed font-sans font-medium text-center">
                Cycle through the 15 unique historic districts of Tagbilaran City. Interact with our custom-crafted picker badge to choose and dive deep into standard-setting local preservation characteristics.
              </p>
            </div>

            {/* 1. 3-Card Interactive Horizontal Carousel Track - Non-clipping */}
            <div 
              className="relative w-full h-[360px] sm:h-[480px] md:h-[530px] overflow-visible flex items-center justify-center pt-4 pb-12" 
              id="barangay-image-placeholder-frame"
            >
              {tagbilaranBarangays.map((barangay, index) => {
                let diff = index - currentIndex;
                const len = tagbilaranBarangays.length;
                if (diff > len / 2) diff -= len;
                if (diff < -len / 2) diff += len;

                const isActive = diff === 0;
                const isLeft = diff === -1;
                const isRight = diff === 1;

                let tx = "0%";
                let scale = 1;
                let opacity = 0;
                let zIndex = 10;
                let pointerEvents: "auto" | "none" = "none";

                if (isActive) {
                  tx = "0%";
                  scale = 1.05;
                  opacity = 1;
                  zIndex = 30;
                  pointerEvents = "auto";
                } else if (isLeft) {
                  tx = "-80%";
                  scale = 0.9;
                  opacity = 0.5;
                  zIndex = 20;
                  pointerEvents = "auto";
                } else if (isRight) {
                  tx = "80%";
                  scale = 0.9;
                  opacity = 0.5;
                  zIndex = 20;
                  pointerEvents = "auto";
                } else {
                  tx = diff < 0 ? "-150%" : "150%";
                  scale = 0.8;
                  opacity = 0;
                  zIndex = 10;
                  pointerEvents = "none";
                }

                return (
                  <div
                    key={barangay.name}
                    onClick={() => {
                      if (diff !== 0) {
                        setSelectedBarangay(barangay.name);
                      } else {
                        setShowMap(true);
                      }
                    }}
                    style={{
                      left: "50%",
                      zIndex: zIndex,
                      pointerEvents: pointerEvents,
                      transform: `translateX(calc(-50% + ${tx})) scale(${scale})`,
                      opacity: opacity,
                      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      willChange: "transform, opacity"
                    }}
                    className="absolute top-4 w-[75%] sm:w-[460px] md:w-[580px] h-[85%] rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-2xl border-4 border-[#2A7221]/15 bg-neutral-100 flex flex-col justify-end group cursor-pointer"
                  >
                    <img 
                      src={barangayImages[barangay.name] || "/temp/Poblacion 1, Tagbilaran City (2).webp"} 
                      alt={`${barangay.name} Scenic Photography`}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    />
                    
                    {/* Elegant darkened ambient gradient overlay inside the image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none z-10" />

                    {/* Click to Explore Map pill badge visible on hover of the active card */}
                    {isActive && (
                      <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[9px] sm:text-xs font-sans font-extrabold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>View Map Address</span>
                      </div>
                    )}

                    {/* Dynamic Photo Information overlaid gracefully inside the active image banner */}
                    <div 
                      className="relative z-20 p-6 sm:p-9 text-left text-white select-none transition-all duration-500 ease-out"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "translateY(0)" : "translateY(16px)"
                      }}
                    >
                      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-white tracking-widest drop-shadow-md leading-none uppercase">
                        {barangay.name.replace("Barangay ", "")}
                      </h2>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Navigation Controls placed exactly where the slider was, just above the separator */}
            <div 
              className="w-full flex items-center justify-center gap-6 sm:gap-8 z-30 mb-2 py-2" 
              id="barangay-nav-arrows-container"
            >
              {/* Left Cycle Button */}
              <motion.button
                onClick={handlePrev}
                whileHover={{ scale: 1.15, x: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-white border-2 border-[#9DC09D] hover:border-[#2A7221] text-[#2A7221] shadow-lg flex items-center justify-center cursor-pointer select-none transition-all duration-300"
                title="Previous Barangay"
                id="cycle-prev-wave"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              {/* Right Cycle Button */}
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.15, x: 3 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-white border-2 border-[#9DC09D] hover:border-[#2A7221] text-[#2A7221] shadow-lg flex items-center justify-center cursor-pointer select-none transition-all duration-300"
                title="Next Barangay"
                id="cycle-next-wave"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>

            {/* 2. Horizontal Separator */}
            <div 
              className="w-full relative flex items-center justify-center my-4 sm:my-6 h-12"
              id="barangay-navigator-separator"
            >
              {/* The horizontal line stretching across the background - replaced with hand-sketched temp/divider2.png */}
              <img 
                src="/temp/divider2.png" 
                alt="Separator Decor" 
                className="absolute left-0 right-0 w-full h-10 sm:h-12 object-contain pointer-events-none opacity-90 z-20" 
                id="hand-drawn-rustic-divider"
              />
            </div>

            {/* 3. Centered Description of the Barangay */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedBarangay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="text-center px-4 sm:px-12 py-2 max-w-3xl space-y-4"
                id="barangay-description-frame"
              >
                {/* Classy centered Block Quote styled following the hand-sketch specifications */}
                <p className="font-sans text-lg sm:text-2xl text-[#2E7D32] leading-relaxed italic font-medium tracking-wide">
                  "{activeBarangay.desc}"
                </p>
                
                <div className="pt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-mono text-[#2A7221]/80 justify-center">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <Compass className="w-4 h-4 text-amber-500 animate-[spin_10s_linear_infinite]" /> Insider Rec:
                  </span>
                  <span className="font-sans font-bold text-zinc-700 bg-amber-50 border border-amber-200/50 px-3 py-1 rounded-full shadow-sm text-center">
                    Explore {activeBarangay.tip}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="map-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto flex flex-col items-center py-6 px-4 text-[#2A7221]"
            id="barangay-map-view"
          >
            {/* Back Button */}
            <motion.button
              onClick={() => setShowMap(false)}
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="mb-6 px-6 py-3 rounded-full bg-white border-2 border-[#2A7221] text-[#2A7221] font-sans text-xs sm:text-sm font-black tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-50 cursor-pointer self-start transition-all duration-300"
              id="back-to-website-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO WEBSITE</span>
            </motion.button>

            {/* Map Header */}
            <div className="w-full text-left mb-6">
              <h2 className="font-serif text-3xl sm:text-5xl text-[#2A7221] tracking-widest uppercase mt-4">
                {activeBarangay.name.replace("Barangay ", "")}
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#2E7D32]/85 leading-relaxed italic mt-2">
                "{activeBarangay.desc}"
              </p>
            </div>

            {/* Map Canvas Frame */}
            <div 
              className="w-full h-[380px] sm:h-[480px] md:h-[520px] rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-2xl border-4 border-[#2A7221]/15 bg-neutral-100 relative"
              id="barangay-google-maps-frame"
            >
              <iframe
                title={`Google Maps location of ${activeBarangay.name}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(barangayMapQueries[activeBarangay.name] || activeBarangay.name + ", Tagbilaran City, Bohol, Philippines")}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 rounded-2xl animate-fade-in"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info panel at bottom */}
            <div className="w-full mt-6 bg-emerald-50/45 border border-emerald-100/50 rounded-2xl p-4 sm:p-6 text-center">
              <p className="font-sans text-xs sm:text-sm font-semibold text-[#2A7221]">
                📍 Recommendation: <span className="text-zinc-700">{activeBarangay.tip}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
