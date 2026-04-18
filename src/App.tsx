/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, useInView, animate, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ArrowUp,
  BarChart3, 
  Globe, 
  MessageSquare, 
  Zap, 
  Instagram,
  Twitter,
  Linkedin,
  TrendingUp,
  Award,
  Clock,
  X
} from "lucide-react";
import { useRef, useEffect, useState, type ReactNode, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const MangoOrb = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { x, y } = state.mouse;
    
    if (mesh.current) {
      // Base auto-movement
      const baseRotationX = Math.cos(time / 4) * 0.2;
      const baseRotationY = Math.sin(time / 4) * 0.2;
      const basePosY = Math.sin(time / 2) * 0.1;

      // Mouse influence (Lerp for smoothness)
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, baseRotationX + y * 0.5, 0.1);
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, baseRotationY + x * 0.5, 0.1);
      mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, x * 0.3, 0.1);
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, basePosY + (y * 0.3), 0.1);
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 100, 100]} scale={1.8} ref={mesh}>
        <MeshDistortMaterial
          color="#ff4d00"
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.5}
          roughness={0.2}
          emissive="#ff8a00"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
};

const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#ff0000" />
          <MangoOrb />
          <Environment preset="night" />
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4.5} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
};

const SectionWrapper = ({ children, className = "", id = "" }: { children: ReactNode; className?: string; id?: string }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 md:px-16 transition-all duration-500 ${
        scrolled 
          ? "py-4 bg-brand-bg/80 backdrop-blur-xl border-b border-brand-border" 
          : "py-6 bg-transparent"
      }`}
      id="navbar"
    >
      <div className="flex items-center">
        <span className="text-xl font-bold uppercase tracking-[0.2em]">OddMango</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10">
        {["Work", "Services", "About", "Contact"].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            className="text-[11px] font-bold text-brand-muted hover:text-white transition-colors uppercase tracking-[0.15em]"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center">
        <button className="text-[11px] font-bold text-white uppercase tracking-[0.15em] border-b border-white pb-1 hover:text-brand-muted hover:border-brand-muted transition-colors">
          Inquire
        </button>
      </div>
    </motion.nav>
  );
};

const Magnetic = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: any) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.04, y: y * 0.04 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className="magnetic"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center px-10 md:px-16 overflow-hidden"
      id="hero"
    >
      <ThreeBackground />
      {/* Theme Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] theme-glow pointer-events-none z-0 opacity-30" />
      
      {/* Decorative Line */}
      <div className="absolute left-10 md:left-16 bottom-[150px] w-[1px] h-[100px] bg-gradient-to-t from-brand-border to-transparent" />
      
      {/* Accent Box */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 border border-brand-border p-5 text-[9px] text-brand-muted uppercase accent-box z-10 hidden lg:block h-[300px] flex items-center justify-center">
        Global Strategy // 2026 Edition
      </div>

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          style={{ y, opacity }}
          className="lg:col-span-7"
        >
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[60px] md:text-[100px] font-semibold tracking-[-0.04em] leading-[0.9] mb-10"
          >
            Elevate Your <br />
            Brand <span className="text-brand-muted italic font-serif font-light">Vision.</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-lg text-brand-muted max-w-md mb-12 font-light leading-relaxed font-serif italic opacity-80"
          >
            We partner with visionary brands to design, build, and scale products that redefine industries. 
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="flex items-center gap-10"
          >
            <Magnetic>
              <button className="px-10 py-4 bg-white text-black rounded-none text-[13px] font-bold uppercase tracking-[0.1em] hover:opacity-80 transition-opacity">
                Inquire Now
              </button>
            </Magnetic>
            <Magnetic>
              <button className="text-[13px] font-bold text-white uppercase tracking-[0.1em] border-b border-white pb-1 hover:text-brand-muted hover:border-brand-muted transition-colors">
                View Work
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div 
          className="lg:col-span-5 relative hidden lg:block"
          style={{ y: imgY, opacity }}
        >
          <div className="relative aspect-[4/5] overflow-hidden border border-brand-border group">
            <img 
              src="https://picsum.photos/seed/architecture/800/1000?grayscale" 
              alt="Architectural vision" 
              className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            {/* Geometric Overlay */}
            <div className="absolute inset-0 border-[20px] border-brand-bg opacity-20 pointer-events-none" />
          </div>
          
          {/* Floating Label */}
          <div className="absolute -left-12 bottom-20 z-20 glass px-6 py-3 border border-brand-border">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white">Creative. Pure. Impact.</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-10 md:left-16 z-10 flex items-center gap-4"
      >
        <div className="w-[1px] h-12 bg-gradient-to-t from-white/40 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
          />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-muted">Scroll Down</span>
      </motion.div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "Revenue Generated", value: 450, suffix: "M+" },
    { label: "Partner Brands", value: 120, suffix: "" },
    { label: "Campaigns Run", value: 24, suffix: "K" },
    { label: "Retention Rate", value: 98, suffix: "%" }
  ];

  return (
    <SectionWrapper className="py-32 px-10 md:px-16 border-t border-brand-border">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted">{stat.label}</h4>
            <div className="text-4xl md:text-6xl font-bold tracking-tighter">
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

const Services = () => {
  const services = [
    {
      icon: <BarChart3 className="w-5 h-5 text-white" />,
      title: "Performance",
      description: "Data-driven strategies that scale your revenue and decrease CAC."
    },
    {
      icon: <Globe className="w-5 h-5 text-white" />,
      title: "Branding",
      description: "Visual identities that resonate with your audience and stand the test of time."
    },
    {
      icon: <Zap className="w-5 h-5 text-white" />,
      title: "Conversion",
      description: "High-performance landing pages optimized for maximum user engagement."
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-white" />,
      title: "Strategy",
      description: "End-to-end community management and viral growth frameworks."
    }
  ];

  return (
    <SectionWrapper className="py-32 px-10 md:px-16 border-t border-brand-border" id="services">
      <div className="max-w-7xl">
        <div className="mb-20">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-4 text-left">Expertise</h4>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Our Capabilities.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-brand-border flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest">{service.title}</h3>
              </div>
              <p className="text-brand-muted font-light leading-relaxed text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

const Portfolio = ({ onSelect }: { onSelect: (item: any) => void }) => {
  const projects = [
    { title: "Veloce Fashion", img: "https://picsum.photos/seed/dark1/1200/800?grayscale", type: "Luxury // 2026", ratio: "aspect-video" },
    { title: "Quasar Assets", img: "https://picsum.photos/seed/dark2/1200/800?grayscale", type: "Fintech // 2026", ratio: "aspect-video" }
  ];

  return (
    <SectionWrapper className="py-32 px-10 md:px-16 border-t border-brand-border" id="work">
      <div className="max-w-7xl">
        <div className="mb-20">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-4 text-left">Selected Works</h4>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Case Studies.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <button 
              key={idx}
              onClick={() => onSelect(project)}
              className="group relative overflow-hidden bg-brand-bg border border-brand-border aspect-[4/5] md:aspect-video text-left outline-none"
            >
               <img 
                 src={project.img} 
                 alt={project.title} 
                 className="w-full h-full object-cover transition duration-1000 group-hover:scale-110 opacity-60"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute bottom-10 left-10">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted block mb-2">{project.type}</span>
                 <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
               </div>
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

const FooterStrip = () => {
  return (
    <SectionWrapper className="grid grid-cols-2 md:grid-cols-4 gap-10 px-10 md:px-16 py-20 border-t border-brand-border">
      {[
        { label: "Selected Works", value: "Case Study: Noma 3.0" },
        { label: "Expertise", value: "Brand Architecture" },
        { label: "Location", value: "Los Angeles / Zurich" },
        { label: "Current Status", value: "Available for Q4" }
      ].map((item, idx) => (
        <div key={idx}>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-muted mb-4">{item.label}</h4>
          <p className="text-sm font-medium">{item.value}</p>
        </div>
      ))}
    </SectionWrapper>
  );
};

const Footer = () => {
  return (
    <footer className="px-10 md:px-16 py-10 border-t border-brand-border text-brand-muted flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-10">
        <span className="text-[9px] font-bold uppercase tracking-widest">© 2026 OddMango</span>
        <div className="flex gap-6">
          <a href="#" className="p-1 hover:text-white transition-colors"><Twitter className="w-3 h-3" /></a>
          <a href="#" className="p-1 hover:text-white transition-colors"><Linkedin className="w-3 h-3" /></a>
          <a href="#" className="p-1 hover:text-white transition-colors"><Instagram className="w-3 h-3" /></a>
        </div>
      </div>
      <div className="flex gap-10 text-[9px] font-bold uppercase tracking-widest">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
      </div>
    </footer>
  );
};

const ContentModal = ({ item, onClose }: { item: any; onClose: () => void }) => {
  if (!item) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-brand-bg/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-20"
    >
      <button 
        onClick={onClose}
        className="absolute top-10 right-10 z-[210] p-4 glass rounded-full hover:bg-white/10 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-brand-bg border border-brand-border overflow-hidden max-w-full max-h-full ${item.ratio || 'aspect-video'} shadow-2xl`}
        style={{ width: item.type === "Reel" ? "min(500px, 90vw)" : "min(1200px, 90vw)" }}
      >
        <img 
          src={item.img} 
          alt={item.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {item.type === "Reel" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-2" />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-brand-bg to-transparent">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2 block">{item.type || 'Showcase'}</span>
          <h3 className="text-2xl font-bold uppercase tracking-widest text-white">{item.title}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ContentShowcase = ({ onSelect }: { onSelect: (item: any) => void }) => {
  const content = [
    { type: "Reel", title: "Motion Identity", img: "https://picsum.photos/seed/reel1/600/1000?grayscale", width: "w-[300px]", ratio: "aspect-[9/16]" },
    { type: "Post", title: "Visual Language", img: "https://picsum.photos/seed/post1/800/800?grayscale", width: "w-[400px]", ratio: "aspect-square" },
    { type: "Post", title: "Grid Systems", img: "https://picsum.photos/seed/post2/800/800?grayscale", width: "w-[350px]", ratio: "aspect-[4/5]" },
    { type: "Reel", title: "Brand Narrative", img: "https://picsum.photos/seed/reel2/600/1000?grayscale", width: "w-[280px]", ratio: "aspect-[9/16]" },
    { type: "Post", title: "Type Focus", img: "https://picsum.photos/seed/post3/800/800?grayscale", width: "w-[450px]", ratio: "aspect-[16/9]" },
    { type: "Reel", title: "Social Impact", img: "https://picsum.photos/seed/reel3/600/1000?grayscale", width: "w-[320px]", ratio: "aspect-[9/16]" },
  ];

  // Duplicate for seamless loop
  const duplicatedContent = [...content, ...content];

  return (
    <SectionWrapper className="py-32 border-t border-brand-border overflow-hidden" id="content">
      <div className="px-10 md:px-16 mb-20">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-4 text-left">Social Identity</h4>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Content Showcase.</h2>
      </div>

      <div className="relative flex overflow-hidden group">
        <motion.div 
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {duplicatedContent.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => onSelect(item)}
              className={`relative overflow-hidden bg-brand-bg border border-brand-border flex-shrink-0 group/item text-left outline-none ${item.width} ${item.ratio}`}
            >
              <img 
                src={item.img} 
                alt={item.title}
                className="w-full h-full object-cover grayscale opacity-60 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-6 left-6">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-muted mb-1 block">{item.type}</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">{item.title}</h3>
                </div>
              </div>
              
              {item.type === "Reel" && (
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full glass border border-brand-border flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-1" />
                </div>
              )}
            </button>
          ))}
        </motion.div>
        
        {/* Gradient Masks for smooth film edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />
      </div>
    </SectionWrapper>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    let tempErrors = { name: "", email: "", message: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      }, 1500);
    }
  };

  return (
    <SectionWrapper className="py-32 px-10 md:px-16 border-t border-brand-border" id="contact">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-muted mb-4 text-left">Get in Touch</h4>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">Let's build something <br /> exceptional together.</h2>
          <p className="text-brand-muted text-lg font-light leading-relaxed mb-12">
            Ready to scale your impact? Tell us about your project, and our specialized squads will get back to you within 24 hours.
          </p>
          <div className="flex flex-col gap-6">
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-muted mb-2">Email</h5>
              <p className="text-sm font-medium">hello@oddmango.media</p>
            </div>
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-muted mb-2">Location</h5>
              <p className="text-sm font-medium">Los Angeles / Zurich</p>
            </div>
          </div>
        </div>

        <div className="relative">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-10 border border-brand-border bg-brand-bg/50 backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center mb-6">
                <ArrowRight className="w-6 h-6 rotate-[-45deg]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Message Sent.</h3>
              <p className="text-brand-muted font-light mb-8">Thank you for reaching out. We'll be in touch shortly.</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="text-[11px] font-bold text-white uppercase tracking-[0.15em] border-b border-white pb-1 hover:text-brand-muted hover:border-brand-muted transition-all"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2 group/input">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-muted group-focus-within/input:text-white transition-colors">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe" 
                  className={`bg-transparent border-b ${errors.name ? 'border-red-500' : 'border-brand-border'} py-4 focus:border-white outline-none transition-all font-light placeholder:text-zinc-800 focus:pl-4`}
                />
                {errors.name && <span className="text-[9px] text-red-500 uppercase tracking-widest">{errors.name}</span>}
              </div>
              <div className="flex flex-col gap-2 group/input">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-muted group-focus-within/input:text-white transition-colors">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com" 
                  className={`bg-transparent border-b ${errors.email ? 'border-red-500' : 'border-brand-border'} py-4 focus:border-white outline-none transition-all font-light placeholder:text-zinc-800 focus:pl-4`}
                />
                {errors.email && <span className="text-[9px] text-red-500 uppercase tracking-widest">{errors.email}</span>}
              </div>
              <div className="flex flex-col gap-2 group/input">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-muted group-focus-within/input:text-white transition-colors">Message</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project..." 
                  className={`bg-transparent border-b ${errors.message ? 'border-red-500' : 'border-brand-border'} py-4 focus:border-white outline-none transition-all font-light placeholder:text-zinc-800 resize-none focus:pl-4`}
                />
                {errors.message && <span className="text-[9px] text-red-500 uppercase tracking-widest">{errors.message}</span>}
              </div>
              <Magnetic>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.15em] text-[13px] transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Submit Inquiry"}
                </button>
              </Magnetic>
            </form>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.classList.contains("interactive") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div 
        className="custom-cursor hidden md:block"
        animate={{ x: position.x - 3, y: position.y - 3 }}
        transition={{ type: "spring", damping: 30, stiffness: 450, mass: 0.5 }}
      />
      <motion.div 
        className="custom-cursor-ring hidden md:block"
        animate={{ 
          x: position.x - (isHovering ? 20 : 16), 
          y: position.y - (isHovering ? 20 : 16),
          width: isHovering ? 40 : 32,
          height: isHovering ? 40 : 32,
          borderColor: isHovering ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
          backgroundColor: isHovering ? "rgba(255,255,255,0.05)" : "transparent"
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
      />
    </>
  );
};

const PageLoader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 2, ease: "easeInOut" }}
      onAnimationComplete={() => document.body.style.overflow = "auto"}
      className="fixed inset-0 z-[100] bg-brand-bg flex items-center justify-center pointer-events-none"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.span 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl font-bold uppercase tracking-[0.4em]"
        >
          OddMango
        </motion.span>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          className="h-[1px] bg-white opacity-30"
        />
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-[9px] uppercase tracking-[0.2em] text-brand-muted"
        >
          2026 Strategy
        </motion.span>
      </div>
    </motion.div>
  );
};

const BackToTop = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setVisible(latest > 500);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[150] p-4 glass rounded-full hover:bg-white/10 transition-colors group border border-brand-border"
        >
          <ArrowUp className="w-5 h-5 text-white group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [selectedContent, setSelectedContent] = useState<any>(null);

  useEffect(() => {
    if (selectedContent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedContent]);

  return (
    <div className="relative font-sans scroll-smooth bg-brand-bg text-brand-fg">
      <div className="noise-overlay" />
      <PageLoader />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <ContentShowcase onSelect={setSelectedContent} />
        <Portfolio onSelect={setSelectedContent} />
        <ContactForm />
        <FooterStrip />
      </main>
      <Footer />
      <BackToTop />

      <AnimatePresence>
        {selectedContent && (
          <ContentModal 
            item={selectedContent} 
            onClose={() => setSelectedContent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
