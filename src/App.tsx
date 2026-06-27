import { useState, useEffect } from "react";
import { ArrowUpRight, Award, Crown, X, Sliders, Sparkles, Copy, Check, Info, FileText, LayoutGrid, HelpCircle } from "lucide-react";

interface Project {
  title: string;
  tag: string;
  year: string;
  story: string;
}

interface Stat {
  value: string;
  label: string;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"name" | "style" | "ai">("name");
  
  // Custom brand states
  const [brandName, setBrandName] = useState("EPOCH");
  const [customTagline, setCustomTagline] = useState("World-Class Digital Collective");
  const [word1, setWord1] = useState("Design.");
  const [word2, setWord2] = useState("Disrupt.");
  const [word3, setWord3] = useState("Conquer.");
  
  const [fontMode, setFontMode] = useState<"podium" | "serif" | "mono" | "sans">("podium");
  const [accentColor, setAccentColor] = useState<"gold" | "cyan" | "white" | "neon">("gold");
  const [vibe, setVibe] = useState("high-fashion luxury");

  // Gemini state and generation
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const [subtext, setSubtext] = useState(
    "We build fierce brand identities that don't just turn heads -- they lead."
  );

  // Stats and Projects lists
  const [stats, setStats] = useState<Stat[]>([
    { value: "250+", label: "Brands Transformed" },
    { value: "95%", label: "Client Retention" },
    { value: "10+", label: "Years in the Game" },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      title: "PROJECT: KRONOS x EPOCH",
      tag: "Luxury Wearable Architecture",
      year: "2026",
      story: "Crafting a bespoke high-fashion spatial accessory interface. Absolute precision, infinite luxury."
    },
    {
      title: "PROJECT: AETHER by EPOCH",
      tag: "Decentralized Lifestyle Identity",
      year: "2025",
      story: "Constructing physical-digital design worlds that unify architecture, media, and technology."
    },
    {
      title: "PROJECT: HELIOS x EPOCH",
      tag: "Bespoke Carbon Vessel Design",
      year: "2026",
      story: "Aerodynamic branding concepts for cutting-edge racing hardware designed for planetary speed."
    }
  ]);

  // Modal views for "Our Projects / Work" & "Capabilities" & "About Studio"
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [guideCopied, setGuideCopied] = useState(false);

  // Handle dynamic defaults when brand name changes
  useEffect(() => {
    if (!loading) {
      // Keep projects brand title in sync when user is manually typing brand name
      setProjects((prev) =>
        prev.map((p, idx) => {
          const suffix = brandName.toUpperCase();
          if (idx === 0) return { ...p, title: `PROJECT: KRONOS x ${suffix}` };
          if (idx === 1) return { ...p, title: `PROJECT: AETHER by ${suffix}` };
          return { ...p, title: `PROJECT: HELIOS x ${suffix}` };
        })
      );
    }
  }, [brandName]);

  // Handle live branding strategy generation using backend Gemini API
  const generateBrandingStrategy = async () => {
    setLoading(true);
    setErrorInfo(null);
    try {
      const response = await fetch("/api/gemini/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, vibe }),
      });

      if (!response.ok) {
        throw new Error("Failed to draw inspiration from the Gemini studio matrix.");
      }

      const data = await response.json();
      
      if (data.tagline) setCustomTagline(data.tagline);
      if (data.powerVerbs && data.powerVerbs.length >= 3) {
        setWord1(data.powerVerbs[0]);
        setWord2(data.powerVerbs[1]);
        setWord3(data.powerVerbs[2]);
      }
      if (data.aboutText) setSubtext(data.aboutText);
      if (data.mockProjects) setProjects(data.mockProjects);
      if (data.stats) setStats(data.stats);
      
      // Auto-switch font preset to suit the vibe
      if (vibe.includes("luxury") || vibe.includes("fashion")) {
        setFontMode("serif");
      } else if (vibe.includes("retro") || vibe.includes("brutalist")) {
        setFontMode("mono");
      } else if (vibe.includes("space") || vibe.includes("tech")) {
        setFontMode("podium");
      } else {
        setFontMode("sans");
      }
    } catch (err: any) {
      console.error(err);
      setErrorInfo(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Helper styles based on chosen state
  const getFontClass = () => {
    switch (fontMode) {
      case "podium":
        return "font-podium tracking-tighter";
      case "serif":
        return "font-serif italic tracking-wide";
      case "mono":
        return "font-mono tracking-widest uppercase text-xs sm:text-base";
      case "sans":
        return "font-sans font-bold tracking-tight";
    }
  };

  const getAccentColorClass = () => {
    switch (accentColor) {
      case "gold":
        return "text-amber-400 border-amber-400/40 hover:bg-amber-400/10";
      case "cyan":
        return "text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10";
      case "neon":
        return "text-lime-400 border-lime-400/40 hover:bg-lime-400/10";
      case "white":
        return "text-white border-white/30 hover:bg-white/10";
    }
  };

  const getGlowShadow = () => {
    switch (accentColor) {
      case "gold":
        return "shadow-[0_0_20px_rgba(251,191,36,0.15)] border-amber-400/20";
      case "cyan":
        return "shadow-[0_0_20px_rgba(34,211,238,0.15)] border-cyan-400/20";
      case "neon":
        return "shadow-[0_0_20px_rgba(163,230,53,0.15)] border-lime-400/20";
      case "white":
        return "shadow-none border-white/10";
    }
  };

  // Generate markdown brief content for dynamic exporter
  const getMarkdownBrief = () => {
    return `# BRAND INITIALIZATION BRIEF: ${brandName.toUpperCase()}
--------------------------------------------------------------------------------
Vibe Aesthetic    : ${vibe.toUpperCase()}
Primary Typeface  : ${fontMode.toUpperCase()}
Brand Tagline     : "${customTagline}"
Core Values       : ${word1} // ${word2} // ${word3}

Brand Statement:
"${subtext}"

CORE METRICS & STATISTICS:
- ${stats[0]?.value} — ${stats[0]?.label}
- ${stats[1]?.value} — ${stats[1]?.label}
- ${stats[2]?.value} — ${stats[2]?.label}

INITIAL PORTFOLIO & MASTERS:
1. ${projects[0]?.title} (${projects[0]?.year})
   * ${projects[0]?.tag}
   * ${projects[0]?.story}

2. ${projects[1]?.title} (${projects[1]?.year})
   * ${projects[1]?.tag}
   * ${projects[1]?.story}

3. ${projects[2]?.title} (${projects[2]?.year})
   * ${projects[2]?.tag}
   * ${projects[2]?.story}

--------------------------------------------------------------------------------
Generated securely via Epoch Identity Studio.`;
  };

  const copyBriefToClipboard = () => {
    const text = getMarkdownBrief();
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setGuideCopied(true);
          setTimeout(() => setGuideCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Clipboard API failed, using fallback:", err);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (successful) {
        setGuideCopied(true);
        setTimeout(() => setGuideCopied(false), 2000);
      } else {
        throw new Error("execCommand returned false");
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      // Fail gracefully without crashing
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white select-none">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4"
      />

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/30 z-10 pointer-events-none" />

      {/* Primary Layout Container */}
      <div className="relative z-20 h-full w-full flex flex-col justify-between">
        
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 lg:py-7 flex-shrink-0">
          
          {/* Logo & custom dynamic studio tag */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setStudioOpen(true)}
              className="group font-podium text-white font-bold uppercase text-2xl sm:text-3xl tracking-wider select-none cursor-pointer flex items-center gap-3 active:scale-95 transition-transform"
            >
              <span className={`transition-all duration-500 ${accentColor === "gold" ? "hover:text-amber-300" : accentColor === "cyan" ? "hover:text-cyan-300" : accentColor === "neon" ? "hover:text-lime-300" : "hover:text-neutral-300"}`}>
                {brandName}
              </span>
            </button>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[8px] tracking-[0.2em] font-mono border border-white/20 uppercase text-white/50 rounded-full animate-pulse">
              Identity: {fontMode}
            </span>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <button
              onClick={() => setProjectsModalOpen(true)}
              className="font-inter text-xs tracking-[0.2em] text-white/80 hover:text-white uppercase transition-colors pointer-events-auto cursor-pointer"
            >
              Projects
            </button>
            <button
              onClick={() => setStudioOpen(true)}
              className="font-inter text-xs tracking-[0.2em] text-white/80 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Studio Lab
            </button>
            <button
              onClick={() => setBriefModalOpen(true)}
              className="font-inter text-xs tracking-[0.2em] text-white/80 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Export Guidelines
            </button>
            <a
              href="#inquire"
              onClick={(e) => { e.preventDefault(); setStudioOpen(true); }}
              className="font-inter text-xs tracking-[0.2em] text-white/80 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Inquire
            </a>
          </div>

          {/* Right Bordered CTA (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setStudioOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 border border-white/20 hover:border-white/40 text-[9px] tracking-[0.15em] font-mono uppercase bg-black/40 backdrop-blur-md rounded transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              Tune Brand
            </button>

            <a
              href="#inquire"
              onClick={(e) => { e.preventDefault(); setStudioOpen(true); }}
              className={`group flex items-center gap-2 px-6 py-3 border text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${getAccentColorClass()}`}
            >
              Get in Touch
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </div>

          {/* Mobile Hamburg menu with dynamic notification badge */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setStudioOpen(true)}
              className="p-2 border border-white/10 rounded bg-black/40 text-white/70 hover:text-white focus:outline-none cursor-pointer"
              title="Identity Lab"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-col justify-center items-end space-y-1.5 focus:outline-none group p-2 cursor-pointer"
              aria-label="Open Menu"
            >
              <div className="w-6 h-0.5 bg-white transition-all group-hover:w-5"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-4 h-0.5 bg-white transition-all group-hover:w-6"></div>
            </button>
          </div>
        </nav>

        {/* Hero Main Content Area */}
        <div className="flex-grow flex flex-col justify-center px-10 lg:px-16 py-6 max-h-full">
          <div className="max-w-4xl">
            
            {/* 1. Dynamic Tagline with Crown */}
            <div className="animate-fade-up mb-6 flex items-center gap-3">
              <Crown className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs sm:text-sm font-inter tracking-[0.3em] uppercase">
                {customTagline}
              </span>
            </div>

            {/* 2. Custom Configured Branding Title */}
            <div className="animate-fade-up-delay-1 flex flex-col space-y-0 uppercase mb-8 select-none">
              <h1 className={`text-[clamp(2.5rem,8.5vw,7.5rem)] leading-[0.85] tracking-tighter ${getFontClass()}`}>
                {word1}
              </h1>
              <h1 className={`text-[clamp(2.5rem,8.5vw,7.5rem)] leading-[0.85] tracking-tighter ${getFontClass()}`}>
                {word2}
              </h1>
              <h1 className={`text-[clamp(2.5rem,8.5vw,7.5rem)] leading-[0.85] tracking-tighter ${getFontClass()}`}>
                {word3}
              </h1>
            </div>

            {/* 3. Subtext Paragraph */}
            <p className="animate-fade-up-delay-2 max-w-md text-white/60 text-sm sm:text-base font-inter leading-relaxed mb-10">
              {subtext.includes("turn heads") ? (
                <>
                  We build fierce brand identities for <span className="font-semibold text-white">{brandName}</span> that don't just <br /> turn heads —{" "}
                  <span className={`font-semibold underline decoration-2 underline-offset-4 ${accentColor === "gold" ? "text-amber-300" : accentColor === "cyan" ? "text-cyan-300" : accentColor === "neon" ? "text-lime-300" : "text-white"}`}>they lead.</span>
                </>
              ) : (
                subtext
              )}
            </p>

            {/* 4. CTA Row */}
            <div className="animate-fade-up-delay-3 flex flex-wrap items-center gap-8 mb-16">
              <button
                className="group flex items-center gap-3 bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-all font-inter cursor-pointer shadow-lg active:scale-95"
                onClick={() => setProjectsModalOpen(true)}
              >
                See Our Work
                <ArrowUpRight className="w-4 h-4 text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Dynamic Interactive custom studio quick activator */}
              <button
                onClick={() => setStudioOpen(true)}
                className="flex sm:hidden items-center gap-2 border border-white/20 px-6 py-3 text-xs tracking-wider font-inter text-white hover:bg-neutral-900 cursor-pointer"
              >
                <Sliders className="w-4 h-4" /> Customize Brand Name
              </button>

              <div className="hidden sm:flex items-center gap-4">
                <Award className={`w-8 h-8 flex-shrink-0 transition-colors duration-500 ${accentColor === "gold" ? "text-amber-400" : accentColor === "cyan" ? "text-cyan-400" : accentColor === "neon" ? "text-lime-400" : "text-white"}`} />
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.1em] text-white/50 uppercase leading-none font-inter">
                    Top-Rated
                  </span>
                  <span className="text-[10px] tracking-[0.1em] text-white/50 uppercase mt-1 leading-none font-inter font-semibold">
                    Brand Studio
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Stats Row */}
            <div className="animate-fade-up-delay-4 flex flex-wrap gap-12 lg:gap-20 border-t border-white/10 pt-10">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-inter text-white text-3xl lg:text-4xl font-bold tracking-tighter">
                    {stat.value}
                  </span>
                  <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-2 font-inter">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Desktop footer for structural harmony */}
        <div className="hidden lg:flex items-center justify-between px-16 py-8 text-[10px] text-white/30 tracking-widest uppercase font-inter flex-shrink-0 relative">
          <span>LATITUDE // 40.7128° N, 74.0060° W</span>
          <span>© 2026 {brandName.toUpperCase()} COLLECTIVE. ALL RIGHTS RESERVED.</span>
        </div>
      </div>

      {/* Floating Exploration Indicator */}
      <div className="hidden lg:flex absolute bottom-8 right-10 z-30 items-center gap-6 pointer-events-none">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-white/30 tracking-widest uppercase font-inter">EPOCH LAB V2.5</span>
          <div className="w-12 h-[1px] bg-white/20 mt-2"></div>
        </div>
      </div>

      {/* 🔮 SIDE BAR WORKSPACE: THE EPOCH IDENTITY LAB */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-neutral-950/95 border-l border-white/10 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          studioOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span className="font-podium text-lg tracking-wider text-white">IDENTITY STUDIO LAB</span>
              </div>
              <button
                onClick={() => setStudioOpen(false)}
                className="p-2 -mr-2 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Notice */}
            <div className="mb-6 p-4 bg-neutral-900/60 border border-white/10 rounded-lg text-xs leading-relaxed text-white/70">
              <p>Welcome! Design the corporate layout according to your vision. Enter any custom <strong className="text-white">Brand Name</strong>, style definitions, and watch the landing page transform instantly.</p>
            </div>

            {/* TAB SELECTORS */}
            <div className="flex gap-2 border-b border-white/10 mb-6 pb-2">
              <button
                onClick={() => setActiveTab("name")}
                className={`flex-1 pb-2 text-[10px] tracking-widest uppercase font-mono transition-colors text-center cursor-pointer ${
                  activeTab === "name" ? "text-amber-300 border-b-2 border-amber-400" : "text-white/40 hover:text-white"
                }`}
              >
                1. Naming
              </button>
              <button
                onClick={() => setActiveTab("style")}
                className={`flex-1 pb-2 text-[10px] tracking-widest uppercase font-mono transition-colors text-center cursor-pointer ${
                  activeTab === "style" ? "text-amber-300 border-b-2 border-amber-400" : "text-white/40 hover:text-white"
                }`}
              >
                2. Theme & Fonts
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 pb-2 text-[10px] tracking-widest uppercase font-mono transition-colors text-center cursor-pointer ${
                  activeTab === "ai" ? "text-amber-300 border-b-2 border-amber-400" : "text-white/40 hover:text-white"
                }`}
              >
                3. AI Strategy
              </button>
            </div>

            {/* TAB CONTAINER: 1. NAMING & STATEMENT */}
            {activeTab === "name" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5">
                    Agency Display Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="E.g., NEXUS, GENESIS, EPOCH"
                    className="w-full bg-neutral-900 border border-white/20 p-3 text-sm text-white focus:outline-none focus:border-white tracking-widest uppercase font-mono rounded"
                  />
                  <span className="text-[9px] text-white/30 block mt-1 hover:text-white/50">
                    * Modifies navigation, main title, custom products, and copyrights.
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5">
                    Core Power Manifestos (Words 1-3)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={word1}
                      onChange={(e) => setWord1(e.target.value)}
                      placeholder="Word 1"
                      className="bg-neutral-900 border border-white/20 p-2.5 text-xs text-white uppercase text-center rounded focus:outline-none"
                    />
                    <input
                      type="text"
                      value={word2}
                      onChange={(e) => setWord2(e.target.value)}
                      placeholder="Word 2"
                      className="bg-neutral-900 border border-white/20 p-2.5 text-xs text-white uppercase text-center rounded focus:outline-none"
                    />
                    <input
                      type="text"
                      value={word3}
                      onChange={(e) => setWord3(e.target.value)}
                      placeholder="Word 3"
                      className="bg-neutral-900 border border-white/20 p-2.5 text-xs text-white uppercase text-center rounded focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5">
                    Bespoke Tagline
                  </label>
                  <input
                    type="text"
                    value={customTagline}
                    onChange={(e) => setCustomTagline(e.target.value)}
                    placeholder="WORLD-CLASS DIGITAL COLLECTIVE"
                    className="w-full bg-neutral-900 border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white uppercase tracking-widest rounded"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTAINER: 2. THEME & TYPEFACES */}
            {activeTab === "style" && (
              <div className="space-y-6">
                {/* Typeface choices */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-2">
                    Select Identity Typeface (Real-time Preview)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFontMode("podium")}
                      className={`p-3 text-xs border uppercase tracking-wider text-center transition-all cursor-pointer rounded ${
                        fontMode === "podium" ? "border-amber-400 bg-amber-400/10 text-white font-bold" : "border-white/10 hover:bg-neutral-900 text-white/70"
                      }`}
                    >
                      <span className="font-podium block text-sm">PODIUM</span>
                      <span className="text-[8px] font-mono block text-white/40 mt-1">Condensed Tall</span>
                    </button>

                    <button
                      onClick={() => setFontMode("serif")}
                      className={`p-3 text-xs border uppercase tracking-wider text-center transition-all cursor-pointer rounded ${
                        fontMode === "serif" ? "border-amber-400 bg-amber-400/10 text-white font-bold" : "border-white/10 hover:bg-neutral-900 text-white/70"
                      }`}
                    >
                      <span className="font-serif block text-sm">Playfair</span>
                      <span className="text-[8px] font-mono block text-white/40 mt-1">Editorial Serif</span>
                    </button>

                    <button
                      onClick={() => setFontMode("mono")}
                      className={`p-3 text-xs border uppercase tracking-wider text-center transition-all cursor-pointer rounded ${
                        fontMode === "mono" ? "border-amber-400 bg-amber-400/10 text-white font-bold" : "border-white/10 hover:bg-neutral-900 text-white/70"
                      }`}
                    >
                      <span className="font-mono block text-[10px]">MONOSPACE</span>
                      <span className="text-[8px] font-mono block text-white/40 mt-1">Tech Brutalist</span>
                    </button>

                    <button
                      onClick={() => setFontMode("sans")}
                      className={`p-3 text-xs border uppercase tracking-wider text-center transition-all cursor-pointer rounded ${
                        fontMode === "sans" ? "border-amber-400 bg-amber-400/10 text-white font-bold" : "border-white/10 hover:bg-neutral-900 text-white/70"
                      }`}
                    >
                      <span className="font-sans block text-xs font-bold">Inter</span>
                      <span className="text-[8px] font-mono block text-white/40 mt-1">Clean Minimal</span>
                    </button>
                  </div>
                </div>

                {/* Color Schemes */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-2">
                    Design Ambient Accent Glow
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setAccentColor("gold")}
                      className={`p-2 border text-[10px] font-mono text-center rounded transition-all cursor-pointer ${
                        accentColor === "gold" ? "border-amber-400 text-amber-300 bg-amber-400/5" : "border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      <div className="w-4 h-4 bg-amber-400 mx-auto rounded-full mb-1"></div>
                      GOLD
                    </button>

                    <button
                      onClick={() => setAccentColor("cyan")}
                      className={`p-2 border text-[10px] font-mono text-center rounded transition-all cursor-pointer ${
                        accentColor === "cyan" ? "border-cyan-400 text-cyan-300 bg-cyan-400/5" : "border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      <div className="w-4 h-4 bg-cyan-400 mx-auto rounded-full mb-1"></div>
                      CYAN
                    </button>

                    <button
                      onClick={() => setAccentColor("neon")}
                      className={`p-2 border text-[10px] font-mono text-center rounded transition-all cursor-pointer ${
                        accentColor === "neon" ? "border-lime-400 text-lime-300 bg-lime-400/5" : "border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      <div className="w-4 h-4 bg-lime-400 mx-auto rounded-full mb-1"></div>
                      NEON
                    </button>

                    <button
                      onClick={() => setAccentColor("white")}
                      className={`p-2 border text-[10px] font-mono text-center rounded transition-all cursor-pointer ${
                        accentColor === "white" ? "border-white text-white bg-white/5" : "border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white mx-auto rounded-full mb-1 border border-neutral-700"></div>
                      WHITE
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTAINER: 3. GEMINI AI STRATEGY ENGINE */}
            {activeTab === "ai" && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3.5 bg-neutral-900 border border-white/5 rounded text-xs text-white/70 space-y-2">
                  <p className="flex items-center gap-1.5 font-mono text-amber-300 uppercase text-[10px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Elite Campaign Engine
                  </p>
                  <p>Incorporate premium, tailored content block structures. Our integration uses server-side <strong className="text-white">Gemini 3.5 AI</strong> to instantly generate cohesive taglines, power statements, brand philosophies, and full portfolios custom tailored to your target vibe & brand name.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1.5">
                    Configure Creative Vibe
                  </label>
                  <select
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-white rounded font-mono uppercase"
                  >
                    <option value="high-fashion luxury couture">high-fashion luxury couture</option>
                    <option value="hyper-tech cyberpunk aerospace">hyper-tech cyberpunk aerospace</option>
                    <option value="organic minimalism & raw concrete architecture">organic minimalism & raw concrete</option>
                    <option value="distorted retro post-punk brutalism">distorted retro post-punk brutalism</option>
                    <option value="galactic deep-sea experimental collective">galactic experimental collective</option>
                  </select>
                </div>

                <button
                  onClick={generateBrandingStrategy}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest py-4 hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Aligning Constellations...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      Rewrite Brand Strategy
                    </>
                  )}
                </button>

                {errorInfo && (
                  <div className="p-3 bg-red-950/50 border border-red-500/20 text-red-100 text-xs rounded">
                    Error: {errorInfo}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions Container & Exporters */}
          <div className="pt-6 border-t border-white/10 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setProjectsModalOpen(true)}
                className="flex items-center justify-center gap-2 border border-white/10 p-3 text-[10px] tracking-wider uppercase font-mono text-white/80 hover:text-white hover:bg-white/5 rounded cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                View Gallery
              </button>
              <button
                onClick={() => setBriefModalOpen(true)}
                className="flex items-center justify-center gap-2 border border-white/10 p-3 text-[10px] tracking-wider uppercase font-mono text-white/80 hover:text-white hover:bg-white/5 rounded cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Export Brief
              </button>
            </div>

            <button
              onClick={() => {
                setBrandName("EPOCH");
                setWord1("Design.");
                setWord2("Disrupt.");
                setWord3("Conquer.");
                setCustomTagline("World-Class Digital Collective");
                setSubtext("We build fierce brand identities that don't just turn heads -- they lead.");
                setAccentColor("gold");
                setFontMode("podium");
                setStats([
                  { value: "250+", label: "Brands Transformed" },
                  { value: "95%", label: "Client Retention" },
                  { value: "10+", label: "Years in the Game" },
                ]);
              }}
              className="w-full text-center text-[9px] font-mono tracking-widest uppercase text-white/40 hover:text-white cursor-pointer py-2 hover:bg-neutral-900 transition-colors block"
            >
              Reset to Factory Preset
            </button>
          </div>
        </div>
      </div>

      {/* 📂 INTERACTIVE FULL-SCREEN SYSTEM ARCHIVE: WORK & PROJECTS GALLERY */}
      <div
        className={`fixed inset-0 bg-black/98 z-50 transition-all duration-500 flex flex-col justify-between ${
          projectsModalOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6 border-b border-white/15">
          <div className="flex items-center gap-3">
            <span className="font-podium text-xl tracking-widest text-white uppercase">{brandName} MASTERS GALLERY</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[8px] tracking-[0.2em] font-mono border border-cyan-400/20 text-cyan-300 rounded uppercase">
              COUTURE GRID
            </span>
          </div>

          <button
            onClick={() => setProjectsModalOpen(false)}
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 px-5 py-2.5 text-xs font-mono tracking-widest uppercase hover:bg-white/10 transition-colors cursor-pointer"
          >
            Close ARCHIVE <X className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Content Bento Grid */}
        <div className="flex-grow overflow-y-auto px-6 sm:px-10 lg:px-16 py-12">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-center text-xs tracking-[0.3em] uppercase text-white/40 mb-12">
              // ACTIVE SHOWCASE ARCHIVE / {brandName.toUpperCase()} DESIGN HOUSE
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  className={`group bg-neutral-900/40 hover:bg-neutral-900/80 border border-white/10 p-6 sm:p-8 rounded-lg transition-all duration-500 flex flex-col justify-between hover:border-white/30 text-left ${getGlowShadow()}`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                        {project.year}
                      </span>
                      <span className="text-white/30 font-mono text-[9px]">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-podium text-xl sm:text-2xl text-white tracking-wide leading-tight group-hover:text-amber-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs font-mono tracking-wider italic text-cyan-300/85">
                      {project.tag}
                    </p>

                    <p className="text-xs text-white/60 leading-relaxed font-inter">
                      {project.story}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-wider text-white/30 uppercase group-hover:text-white transition-colors">
                      Explore Case Study
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Brand philosophy row to feel completely complete */}
            <div className="mt-12 p-8 border border-white/10 rounded bg-neutral-950/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left max-w-xl">
                <h4 className="font-podium text-lg tracking-wider text-white uppercase mb-2">Bespoke Design, Absolute Execution</h4>
                <p className="text-xs text-white/50 leading-relaxed font-inter">Every project we initiate is backed by elite branding intelligence. Zero templates, zero pre-conceived formulas. Just pure aesthetic warfare aimed at establishing structural dominance.</p>
              </div>

              <button 
                onClick={() => { setProjectsModalOpen(false); setStudioOpen(true); }}
                className="w-full md:w-auto px-6 py-3 bg-white text-black text-xs font-bold font-inter tracking-widest uppercase transition-colors hover:bg-neutral-200 cursor-pointer"
              >
                Initiate New Masterpiece
              </button>
            </div>
          </div>
        </div>

        {/* Footer info for complete aesthetic closure */}
        <div className="py-8 text-center text-[10px] text-white/30 tracking-widest font-mono border-t border-white/10">
          SECURE SECURE SYSTEM PROTOCOL // ALL BRAND ASSETS REGISTERED TO {brandName.toUpperCase()}
        </div>
      </div>

      {/* 📝 BRAND BRIEF EXPORTER MODAL (MARKDOWN PREVIEW & COPY) */}
      <div
        className={`fixed inset-0 bg-black/98 z-50 transition-all duration-500 flex flex-col justify-between ${
          briefModalOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6 border-b border-white/15">
          <div className="flex items-center gap-3">
            <span className="font-podium text-xl tracking-widest text-white uppercase">{brandName} DIGITAL BRIEF EXPORTER</span>
          </div>

          <button
            onClick={() => setBriefModalOpen(false)}
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 px-5 py-2.5 text-xs font-mono tracking-widest uppercase hover:bg-white/10 transition-colors cursor-pointer"
          >
            Close Exporter <X className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Export Body */}
        <div className="flex-grow overflow-y-auto px-6 sm:px-10 lg:px-16 py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h3 className="font-podium text-lg uppercase text-white tracking-widest">Aesthetic Guideline Matrix</h3>
                <p className="text-xs text-white/50 font-inter">Your custom branding values and curated portfolio elements formatted in portable raw markdown.</p>
              </div>

              <button
                onClick={copyBriefToClipboard}
                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded text-xs font-mono font-semibold hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
              >
                {guideCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" /> COPIED!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-black" /> Copy Raw Markdown
                  </>
                )}
              </button>
            </div>

            {/* Markdown Codeblock render field */}
            <div className="bg-neutral-900 border border-white/15 p-6 rounded-lg text-left font-mono text-xs sm:text-sm text-white/80 overflow-x-auto whitespace-pre leading-relaxed select-text select-all">
              {getMarkdownBrief()}
            </div>

            <p className="text-[10px] text-white/30 font-mono text-center">
              * Click the button above to capture this complete brand structure. You can paste it into any editor for reference.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 text-center text-[10px] text-white/30 tracking-widest font-mono border-t border-white/10">
          EXPORT METADATA // CREATED AT {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-500 ease-in-out md:hidden flex flex-col justify-between ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Menu Header Row */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          <div className="font-podium text-white font-bold uppercase text-2xl sm:text-3xl tracking-wider">
            {brandName}
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 -mr-2 text-white focus:outline-none transition-transform duration-300 hover:rotate-90 cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Centered Navigation List */}
        <div className="flex-grow flex flex-col justify-center items-center gap-8 px-6">
          <button
            onClick={() => { setMenuOpen(false); setProjectsModalOpen(true); }}
            className="font-podium text-4xl sm:text-5xl text-white uppercase tracking-wider hover:text-white/60 transition-all duration-500 block cursor-pointer"
          >
            Projects
          </button>
          <button
            onClick={() => { setMenuOpen(false); setStudioOpen(true); }}
            className="font-podium text-4xl sm:text-5xl text-white uppercase tracking-wider hover:text-white/60 transition-all duration-500 block cursor-pointer"
          >
            Studio Lab
          </button>
          <button
            onClick={() => { setMenuOpen(false); setBriefModalOpen(true); }}
            className="font-podium text-4xl sm:text-5xl text-white uppercase tracking-wider hover:text-white/60 transition-all duration-500 block cursor-pointer"
          >
            Export Brief
          </button>
          <button
            onClick={() => { setMenuOpen(false); setStudioOpen(true); }}
            className="font-podium text-4xl sm:text-5xl text-white uppercase tracking-wider hover:text-white/60 transition-all duration-500 block cursor-pointer"
          >
            Inquire
          </button>

          {/* GET IN TOUCH with delay index 4 */}
          <button
            onClick={() => { setMenuOpen(false); setStudioOpen(true); }}
            className="border border-white/30 hover:border-white/60 px-8 py-3.5 text-xs tracking-widest uppercase hover:bg-white/10 text-white transition-all duration-500 flex items-center gap-2 mt-4 cursor-pointer"
          >
            GET IN TOUCH <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu bottom text */}
        <div className="py-8 text-center text-[10px] text-white/30 tracking-widest uppercase font-inter">
          © 2026 {brandName.toUpperCase()} COLLECTIVE
        </div>
      </div>
    </div>
  );
}
