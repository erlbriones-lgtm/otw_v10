import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { tagbilaranBarangays } from "../data";
import { ArrowLeft, ArrowRight, Compass, Eye, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

// Explicit visual mapping matching real local scenic assets (each Barangay has 3 high quality local photos)
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

const getImagesForBarangay = (name: string): string[] => {
  return barangayImageTrios[name] || [
    "/temp/Poblacion 1, Tagbilaran City (2).webp",
    "/temp/Poblacion 1, Tagbilaran City (1).webp",
    "/temp/Old House in Poblacion 1 (3).webp"
  ];
};

export const TagbilaranDashboard: React.FC = () => {
  const [selectedBarangay, setSelectedBarangay] = useState("Barangay Bool");
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startRotation, setStartRotation] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const activeImages = getImagesForBarangay(selectedBarangay);
  const numItems = activeImages.length; // 3
  const angleStep = 360 / numItems; // 120 degrees

  // Detect mobile width dynamically to provide optimal 3D metrics
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset rotation when selected barangay transitions to avoid sudden jumps
  useEffect(() => {
    setRotation(0);
  }, [selectedBarangay]);

  // Determine active photo index nearest to camera (0, 1, or 2)
  let activeIndex = Math.round(-rotation / angleStep) % numItems;
  if (activeIndex < 0) {
    activeIndex += numItems;
  }

  // Snapping logic: snaps to the nearest photograph after idle
  useEffect(() => {
    if (isDragging) return;

    const snapTimeout = setTimeout(() => {
      const snapped = Math.round(rotation / angleStep) * angleStep;
      if (snapped !== rotation) {
        setRotation(snapped);
      }
    }, 400);

    return () => clearTimeout(snapTimeout);
  }, [rotation, isDragging, angleStep]);

  // Preloading all pictures for 60FPS instant rendering
  useEffect(() => {
    const idlePreload = setTimeout(() => {
      Object.keys(barangayImageTrios).forEach((bName) => {
        getImagesForBarangay(bName).forEach((url) => {
          const img = new Image();
          img.src = url;
        });
      });
    }, 1200);
    return () => clearTimeout(idlePreload);
  }, []);

  // Responsive perspective dimensions for 3 items (made significantly larger!)
  const cardWidth = isMobile ? 320 : 640;
  const cardHeight = isMobile ? 220 : 420;
  const cylinderRadius = isMobile ? 125 : 240; // Ideal spreading for equilateral triangle 3D formation

  // Drag interaction handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartRotation(rotation);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    const dragSensitivity = isMobile ? 0.35 : 0.22;
    setRotation(startRotation + deltaX * dragSensitivity);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  // Scroll wheel rotation proxy
  const handleWheel = (e: React.WheelEvent) => {
    const scrollSensitivity = 0.06;
    setRotation((prev) => prev - e.deltaY * scrollSensitivity);
  };

  // Spin active cylinder slot controllers
  const spinNext = () => {
    setRotation((prev) => prev - angleStep);
  };

  const spinPrev = () => {
    setRotation((prev) => prev + angleStep);
  };

  const selectNextBarangay = () => {
    const currentIndex = tagbilaranBarangays.findIndex((b) => b.name === selectedBarangay);
    const nextIndex = (currentIndex + 1) % tagbilaranBarangays.length;
    setSelectedBarangay(tagbilaranBarangays[nextIndex].name);
  };

  const selectPrevBarangay = () => {
    const currentIndex = tagbilaranBarangays.findIndex((b) => b.name === selectedBarangay);
    const prevIndex = (currentIndex - 1 + tagbilaranBarangays.length) % tagbilaranBarangays.length;
    setSelectedBarangay(tagbilaranBarangays[prevIndex].name);
  };

  const activeBarangayData = tagbilaranBarangays.find((b) => b.name === selectedBarangay) || tagbilaranBarangays[0];

  return (
    <div className="w-full relative flex flex-col items-center bg-[#fff] py-2 overflow-visible select-none text-[#05461a]">

      {/* BARANGAY MASTER LOGO HEADER */}
      <div className="text-center mb-4 flex flex-col justify-center items-center" id="active-barangay-title-section">
        <h3 className="font-serif font-[900] text-3.5xl sm:text-5xl md:text-6xl text-[#05461a] tracking-widest uppercase transition-all duration-300">
          {activeBarangayData.name.replace("Barangay ", "")}
        </h3>
        <p className="font-jakarta text-[9px] sm:text-xs text-[#05461a]/50 tracking-[0.2em] uppercase font-extrabold mt-2.5">
          {activeBarangayData.heritage}
        </p>
      </div>

      {/* 3D PERSPECTIVE CYLINDER PLATFORM WORKSPACE */}
      <div 
        className="relative w-full max-w-full h-[290px] sm:h-[480px] md:h-[510px] flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onWheel={handleWheel}
        style={{
          perspective: isMobile ? "800px" : "1300px",
          perspectiveOrigin: "50% 50%"
        }}
        id="carousel-3d-perspective-stage"
      >
        
        {/* REVOLVING CYLINDRICAL TRIANGULAR RING CONTAINER */}
        <div 
          className="relative flex items-center justify-center pointer-events-auto"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          id="cylindrical-rotating-ring"
        >
          {activeImages.map((imgUrl, i) => {
            const cardRotation = i * angleStep;
            
            // Depth-of-Field physics modeling: relative angle calculation
            let relativeAngle = (cardRotation + rotation) % 360;
            if (relativeAngle > 180) relativeAngle -= 360;
            if (relativeAngle < -180) relativeAngle += 360;
            
            const absAngle = Math.abs(relativeAngle);
            const frontWeight = Math.max(0, 1 - absAngle / 180);
            
            // Scale and fade items nicely as they orbit behind
            const opacity = 0.35 + 0.65 * Math.pow(frontWeight, 2);
            const scale = 0.88 + 0.12 * frontWeight;
            const zIndex = Math.round(frontWeight * 100);
            const blurPx = `${(1 - frontWeight) * 4}px`;

            return (
              <div
                key={`${selectedBarangay}-image-slot-${i}`}
                className="absolute inset-0 select-none pb-4"
                style={{
                  transform: `rotateY(${cardRotation}deg) translateZ(${cylinderRadius}px) scale(${scale})`,
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  opacity: opacity,
                  filter: `blur(${blurPx})`,
                  zIndex: zIndex,
                  backfaceVisibility: "hidden",
                  pointerEvents: frontWeight > 0.45 ? "auto" : "none",
                  transition: "opacity 0.35s, filter 0.35s"
                }}
                id={`cylinder-ring-slot-${i}`}
              >
                
                {/* PICTURE DISPLAY SHIELD: BORDERLESS HIGH CONTRAST */}
                <div 
                  className="w-full h-full bg-white border border-neutral-150 rounded-[20px] shadow-2xl p-1 pointer-events-auto flex flex-col justify-between overflow-hidden transform transition-all duration-300 hover:scale-[1.03] group relative cursor-pointer"
                  onClick={() => {
                    const shortestAngle = -cardRotation;
                    setRotation(shortestAngle);
                  }}
                >
                  <div className="w-full h-full rounded-[16px] overflow-hidden relative bg-neutral-100 flex items-center justify-center">
                    <img 
                      src={imgUrl} 
                      alt={`${selectedBarangay} local spot ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Minimalist image indicator watermark */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/45 backdrop-blur-md rounded-md font-sans text-[8px] uppercase tracking-widest text-[#fff] font-bold inline-flex items-center gap-1.5 select-none pointer-events-none">
                      <ImageIcon className="w-3 h-3 text-emerald-300" /> Spot {i + 1}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* RUSTIC COMPASS FLING CONTROLS */}
      <div className="flex flex-col items-center gap-2 mt-2 select-none" id="carousel-navigation-dock">
        <div className="flex items-center gap-4">
          <button
            onClick={spinPrev}
            title="Rotate Left"
            className="w-11 h-11 rounded-full border border-[#05461a]/15 bg-emerald-50/40 text-[#05461a] flex items-center justify-center hover:bg-[#05461a] hover:text-white transition-all cursor-pointer select-none active:scale-90"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          {/* Active Image Indicator Dots */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#05461a]/5 rounded-full border border-[#05461a]/10">
            {activeImages.map((_, dotIdx) => {
              const worksAsActive = dotIdx === activeIndex;
              return (
                <div 
                  key={`dot-${dotIdx}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    worksAsActive ? "w-4 bg-[#05461a]" : "w-1.5 bg-[#05461a]/20"
                  }`}
                />
              );
            })}
          </div>

          <button
            onClick={spinNext}
            title="Rotate Right"
            className="w-11 h-11 rounded-full border border-[#05461a]/15 bg-emerald-50/40 text-[#05461a] flex items-center justify-center hover:bg-[#05461a] hover:text-white transition-all cursor-pointer select-none active:scale-90"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
