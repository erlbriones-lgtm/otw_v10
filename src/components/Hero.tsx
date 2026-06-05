import { motion } from "motion/react";

interface HeroProps {
  onSwitchToHeritage: () => void;
  onPlanVisit?: () => void;
  weatherDescription?: string;
  temperature?: number;
}

export default function Hero({ onSwitchToHeritage, onPlanVisit, weatherDescription, temperature }: HeroProps) {
  return (
    <section
      id="gateway-hero"
      className="relative min-h-[82vh] xl:min-h-[84vh] flex items-center justify-center bg-transparent px-6 sm:px-12 md:px-16 lg:px-24 pt-40 pb-20 select-none"
    >
      {/* 
        PREMIUM FULL-SCREEN SCROLLING BACKGROUND
        Replaced the living digital masonry columns with a rich, continuous visual backdrop
      */}
      <div 
        id="hero-background-media" 
        className="absolute inset-0 z-0 overflow-hidden bg-transparent"
      >
        {/* Full-bleed background image with temp/sdasdasd.png as requested */}
        <div className="absolute inset-0 select-none transition-opacity duration-1000">
          <img 
            src="/webp/newback.webp?v=3" 
            alt="Tagbilaran Heritage and Tourism Ecosystem" 
            className="w-full h-full object-cover filter saturate-[1.12] brightness-[0.75] contrast-[1.02]" 
          />
          {/* Deep environmental tint overlays for maximum readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#152614]/30 via-transparent to-[#152614]/45 pointer-events-none z-15" />
        </div>

        {/* 
          VIGNETTE & LUXURY GLASS/VIBRANT GREEN OVERLAY
          Provides custom-tailored readability: deep vibrant green left-side gradient for sharp white text reading, 
          and balanced forest blend, replacing the black masks with beautiful emerald-green hues.
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#32e875]/15 via-transparent to-[#32e875]/15 z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[#32e875]/2 z-20 pointer-events-none" />
        <div className="absolute inset-0 backdrop-blur-[1px] z-10 pointer-events-none" />

        {/* Soft edge gradients matching parent theme without concealing the masonry carousel */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#32e875]/25 to-transparent z-25 pointer-events-none" />
        
        {/* Floating atmospheric sunbeam of color to enrich scene */}
        <div className="absolute top-1/4 right-[25%] w-96 h-96 rounded-full bg-[#FFD54F]/5 blur-[120px] mix-blend-screen pointer-events-none z-15" />
      </div>

      {/* 
        PREMIUM DYNAMIC IMAGE SEPARATOR
        Uses temp/divider2.png as the separator,
        carefully styled to be perfectly proportioned and seamless.
      */}
      <img 
        src="/temp/divider2.png"
        alt="Heritage Separator Curve"
        className="absolute bottom-[-2px] left-0 w-full overflow-hidden pointer-events-none z-32 h-[11px] sm:h-[16px] md:h-[21px] lg:h-[28px] object-fill select-none"
        id="hero-bottom-artwork-separator"
      />


      {/* Downward transition blend overlaying the home page area directly to connect them seamlessly behind the curves */}
      {/* Removed to allow crisp transition to white background */}

      {/* FOREGROUND MAIN TEXT CONTENT */}
      <div className="relative z-40 w-full max-w-7xl flex flex-col items-center justify-center text-center mx-auto px-4" id="hero-main-content">
        {/* Primary Page Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-display text-[12.5vw] sm:text-[12.5vw] md:text-[12vw] lg:text-[12vw] xl:text-[11.5vw] 2xl:text-[15.5rem] font-black -tracking-[0.01em] text-white leading-none block uppercase text-center w-full whitespace-nowrap"
          id="hero-main-headline"
        >
          <span className="inline-block transform scale-y-[1.15] origin-center text-center w-full">
            TAGBILARAN
          </span>
        </motion.h1>

        {/* Subtitle with elegant Moderniz font inside hero */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="font-moderniz text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-medium tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#38B000] via-[#9EF01A] to-white max-w-3xl mx-auto mt-2 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.98)] text-center block w-full uppercase"
          id="hero-subtitle"
        >
          A HERITAGE CITY AWAKENS
        </motion.p>
      </div>
    </section>
  );
}
