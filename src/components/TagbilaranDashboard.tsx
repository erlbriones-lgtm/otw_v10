import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
} from "lucide-react";
import { tagbilaranBarangays } from "../data";

// Explicit visual mapping matching real local scenic assets (3 distinct images per Barangay)
const barangayImageTrios: Record<string, string[]> = {
  "Barangay Bool": [
    "/temp/Blood Compact Shrine (2).webp",
    "/temp/Blood Compact Shrine (28).webp",
    "/temp/Blood Compact Shrine (31).webp"
  ],
  "Barangay Booy": [
    "/temp/Taloto to Manga Coastline (6).webp",
    "/temp/Taloto to Manga Coastline (1).webp",
    "/temp/Tubig Dako in Taloto (1).webp"
  ],
  "Barangay Cabawan": [
    "/temp/Balili Heritage House (4).webp",
    "/temp/Poblacion 1, Tagbilaran City (2).webp",
    "/temp/Old House in Poblacion 1 (3).webp"
  ],
  "Barangay Cogon": [
    "/temp/City Lights of Tagbilaran (1).webp",
    "/temp/City Lights of Tagbilaran (11).webp",
    "/temp/City Lights of Tagbilaran (7).webp"
  ],
  "Barangay Dampas": [
    "/temp/Bohol Blades (1).webp",
    "/temp/Bohol Blades (4).webp",
    "/temp/Poblacion 1, Tagbilaran City (1).webp"
  ],
  "Barangay Dao": [
    "/temp/City Lights of Tagbilaran (11).webp",
    "/temp/City Lights of Tagbilaran (9).webp",
    "/temp/City Lights of Tagbilaran (7).webp"
  ],
  "Barangay Manga": [
    "/temp/Taloto to Manga Coastline (1).webp",
    "/temp/Taloto to Manga Coastline (6).webp",
    "/temp/Tubig Dako in Taloto (1).webp"
  ],
  "Barangay Mansasa": [
    "/temp/Taloto to Manga Coastline (6).webp",
    "/temp/City Lights of Tagbilaran (11).webp",
    "/temp/Taloto to Manga Coastline (1).webp"
  ],
  "Barangay Poblacion I": [
    "/temp/Poblacion 1, Tagbilaran City (2).webp",
    "/temp/Old House in Poblacion 1 (3).webp",
    "/temp/Old House in Poblacion 1 (1).webp"
  ],
  "Barangay Poblacion II": [
    "/temp/Poblacion 1, Tagbilaran City (1).webp",
    "/temp/Old House in Poblacion 1 (1).webp",
    "/temp/Old House in Poblacion 1 (5).webp"
  ],
  "Barangay Poblacion III": [
    "/temp/Old House in Poblacion 1 (3).webp",
    "/temp/Old House in Poblacion 1 (7).webp",
    "/temp/Poblacion 1, Tagbilaran City (2).webp"
  ],
  "Barangay San Isidro": [
    "/temp/Balili Heritage House (4).webp",
    "/temp/Old House in Poblacion 1 (5).webp",
    "/temp/Poblacion 1, Tagbilaran City (1).webp"
  ],
  "Barangay Taloto": [
    "/temp/Tubig Dako in Taloto (1).webp",
    "/temp/Taloto to Manga Coastline (1).webp",
    "/temp/Taloto to Manga Coastline (6).webp"
  ],
  "Barangay Tiptip": [
    "/temp/City Lights of Tagbilaran (7).webp",
    "/temp/City Lights of Tagbilaran (8).webp",
    "/temp/City Lights of Tagbilaran (9).webp"
  ],
  "Barangay Ubujan": [
    "/temp/Capt. Salazar Monument (1).webp",
    "/temp/Old House in Poblacion 1 (7).webp",
    "/temp/Poblacion 1, Tagbilaran City (2).webp"
  ]
};

const getTriosForBarangay = (name: string): string[] => {
  return barangayImageTrios[name] || [
    "/temp/Poblacion 1, Tagbilaran City (2).webp",
    "/temp/Poblacion 1, Tagbilaran City (1).webp",
    "/temp/Old House in Poblacion 1 (3).webp"
  ];
};

export const TagbilaranDashboard: React.FC = () => {
  const [selectedBarangay, setSelectedBarangay] = useState<string>("Barangay Bool");
  const [topCardIdx, setTopCardIdx] = useState<number>(0);

  useEffect(() => {
    setTopCardIdx(0);

    // Predictive Background Image Preloader
    // Preloads the active, next, and previous barangay pictures immediately so they are hot in the browser cache.
    const activeIndex = tagbilaranBarangays.findIndex(b => b.name === selectedBarangay);
    if (activeIndex !== -1) {
      const adjacentIndices = [
        activeIndex,
        (activeIndex + 1) % tagbilaranBarangays.length,
        (activeIndex - 1 + tagbilaranBarangays.length) % tagbilaranBarangays.length
      ];

      adjacentIndices.forEach(idx => {
        const bName = tagbilaranBarangays[idx]?.name;
        if (bName) {
          getTriosForBarangay(bName).forEach(url => {
            const img = new Image();
            img.src = url;
          });
        }
      });
    }

    // Sequentially preload all other barangay pictures after a subtle delay to keep initial rendering thread unblocked.
    const idlePreload = setTimeout(() => {
      Object.keys(barangayImageTrios).forEach(bName => {
        if (bName !== selectedBarangay) {
          getTriosForBarangay(bName).forEach(url => {
            const img = new Image();
            img.src = url;
          });
        }
      });
    }, 1200);

    return () => clearTimeout(idlePreload);
  }, [selectedBarangay]);

  const currentIndex = tagbilaranBarangays.findIndex(b => b.name === selectedBarangay);
  const activeBarangay = tagbilaranBarangays[currentIndex] || tagbilaranBarangays[0];

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

  // Stagger variants for smooth photo reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 90,
        damping: 14,
      }
    }
  };

  return (
    <div className="w-full relative" id="barangay-interactive-showcase">
      {/* Hide scrollbars style component for swipe gallery responsiveness */}
      <style>{`
        #barangay-swipe-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <motion.div
        key="carousel-view"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl mx-auto flex flex-col items-center pt-2 pb-6 select-none text-[#2A7221]"
      >
        {/* Elegant Dynamic Header showing current Barangay name */}
        <div className="w-full max-w-3xl mx-auto mb-3 text-center animate-fade-in" id="barangay-title-header">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBarangay.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h3 className="font-serif font-black text-5xl sm:text-7xl lg:text-8xl text-[#2A7221] tracking-widest uppercase">
                {activeBarangay.name.replace("Barangay ", "")}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 1. Playing Cards Pile - 3 Overlapping cards with smooth fan and responsive interactive swipe */}
        <div 
          className="relative w-full max-w-[94%] sm:max-w-[85%] md:max-w-4xl lg:max-w-5xl h-[280px] sm:h-[360px] md:h-[440px] lg:h-[480px] flex items-center justify-center my-6 overflow-visible"
          id="barangay-playing-cards-stack"
        >
          <AnimatePresence mode="popLayout">
            {getTriosForBarangay(activeBarangay.name).map((imgUrl, idx) => {
              // Calculate relative order in stacking based on topCardIdx
              const order = (idx - topCardIdx + 3) % 3;
              const isTop = order === 0;

              // Design spatial offsets mimicking beautifully handheld overlapping cards
              let xOffset = 0;
              let yOffset = 0;
              let rotation = 0;
              let scale = 1;
              let zIndex = 30;

              if (order === 0) {
                // Top, active card in focus
                zIndex = 30;
                scale = 1;
                rotation = -1.2;
                xOffset = 0;
                yOffset = 0;
              } else if (order === 1) {
                // Second card peeking to the right
                zIndex = 20;
                scale = 0.96;
                rotation = 4.5;
                xOffset = 55; // visually peeking more
                yOffset = 6;  // slight tilt down
              } else if (order === 2) {
                // Third card peeking to the left
                zIndex = 10;
                scale = 0.93;
                rotation = -6;
                xOffset = -55; // visually peeking more
                yOffset = 10;  // slight tilt down
              }

              return (
                <motion.div
                  key={`${activeBarangay.name}-card-${idx}`}
                  style={{
                    zIndex: zIndex,
                    willChange: "transform, opacity",
                  }}
                  animate={{
                    x: xOffset,
                    y: yOffset,
                    rotate: rotation,
                    scale: scale,
                  }}
                  whileHover={!isTop ? {
                    x: order === 1 ? 85 : -85,
                    rotate: order === 1 ? 6 : -8,
                    scale: 0.98,
                    transition: { duration: 0.25, ease: "easeOut" }
                  } : {
                    scale: 1.01,
                    transition: { duration: 0.25, ease: "easeOut" }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 18,
                    mass: 0.8
                  }}
                  drag={isTop ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  whileDrag={{ scale: 1.03, rotate: 0, zIndex: 50 }}
                  onDragEnd={(event, info) => {
                    const threshold = 80;
                    if (info.offset.x > threshold || info.offset.x < -threshold) {
                      setTopCardIdx((prev) => (prev + 1) % 3);
                    }
                  }}
                  onTap={() => {
                    if (!isTop) {
                      setTopCardIdx(idx);
                    }
                  }}
                  onClick={() => {
                    if (!isTop) {
                      setTopCardIdx(idx);
                    }
                  }}
                  className={`absolute w-[88vw] sm:w-[84vw] md:w-[74vw] lg:w-[780px] xl:w-[860px] h-[220px] sm:h-[300px] md:h-[380px] lg:h-[420px] bg-white border border-neutral-100/90 rounded-[20px] sm:rounded-[24px] shadow-2xl p-1 sm:p-1.5 select-none cursor-${isTop ? "grab" : "pointer"} flex flex-col active:cursor-grabbing transition-all duration-300 hover:shadow-emerald-900/5`}
                >
                  {/* Pristine Inner Photo Framing with Delicate Borders - thinned border space inside */}
                  <div className="w-full h-full rounded-[16px] sm:rounded-[20px] overflow-hidden relative bg-neutral-100">
                    <img 
                      src={imgUrl} 
                      alt={`${activeBarangay.name} historic heritage sight`}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Tactile Chevron Navigation Controls */}
        <div 
          className="w-full flex items-center justify-center gap-6 sm:gap-8 z-30 mb-2 py-1" 
          id="barangay-nav-arrows-container"
        >
          {/* Left Cycle Button */}
          <motion.button
            onClick={handlePrev}
            whileHover={{ scale: 1.15, x: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-white border-2 border-[#9DC09D] hover:border-[#2A7221] text-[#2A7221] shadow-lg flex items-center justify-center cursor-pointer select-none transition-all duration-300"
            title="Previous Barangay"
            id="cycle-prev-wave"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Right Cycle Button */}
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.15, x: 2 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-white border-2 border-[#9DC09D] hover:border-[#2A7221] text-[#2A7221] shadow-lg flex items-center justify-center cursor-pointer select-none transition-all duration-300"
            title="Next Barangay"
            id="cycle-next-wave"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* 2. Horizontal Separator */}
        <div 
          className="w-full relative flex items-center justify-center my-4 sm:my-5 h-12"
          id="barangay-navigator-separator"
        >
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
            <p className="font-sans text-lg sm:text-2xl text-[#2E7D32] leading-relaxed italic font-medium tracking-wide">
              "{activeBarangay.desc}"
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
