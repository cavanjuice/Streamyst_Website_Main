
import React, { useState, Suspense, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Stage, PresentationControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2, Eye, Zap, Wifi, Battery } from 'lucide-react';

const VybeModel = ({ activeColor }: { activeColor: string | null }) => {
  const obj = useLoader(OBJLoader, 'https://raw.githubusercontent.com/cavanjuice/assets/main/Assembly%20vybe%203.obj');
  const meshRef = useRef<THREE.Group>(null);

  useMemo(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
         child.material = new THREE.MeshPhysicalMaterial({
             color: activeColor ? activeColor : '#25252b',
             metalness: 0.8,
             roughness: 0.25,
             clearcoat: 1,
             clearcoatRoughness: 0.1,
             emissive: activeColor ? activeColor : '#8B5CF6',
             emissiveIntensity: activeColor ? 0.6 : 0.15,
         });
         child.castShadow = false;
         child.receiveShadow = false;
      }
    });
  }, [obj, activeColor]);

  // Gentle rotation if idle
  useFrame((state) => {
    if (meshRef.current && !activeColor) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return <primitive object={obj} ref={meshRef} />;
};

const ProductShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features = [
    { 
      title: "Sentiment Mapping", 
      description: "Real-time emotional translation engine.", 
      hex: "#f97316", // Orange (Fyre)
      icon: <Eye className="w-5 h-5" />, 
      accentColor: "text-orange-500" 
    },
    { 
      title: "Haptic Luminance", 
      description: "Visible on camera, physical sensation in room.", 
      hex: "#ec4899", // Pink (Love)
      icon: <Zap className="w-5 h-5" />, 
      accentColor: "text-pink-500" 
    },
    { 
      title: "Zero-Latency Link", 
      description: "Sub-10ms connection via proprietary protocol.", 
      hex: "#22c55e", // Green (Happy)
      icon: <Wifi className="w-5 h-5" />, 
      accentColor: "text-green-500" 
    },
    { 
      title: "Marathon Cell", 
      description: "12-hour continuous broadcasting capacity.", 
      hex: "#eab308", // Yellow (Clap/Neutral)
      icon: <Battery className="w-5 h-5" />, 
      accentColor: "text-yellow-500" 
    }
  ];

  return (
    <section id="product" className="relative z-10 min-h-screen flex items-center py-12 md:py-0 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Title Section - Tightened */}
        <div className="text-center mb-10 md:mb-12">
           <motion.h2 
             initial={{ opacity: 0, y: 15 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="font-display font-bold text-3xl md:text-5xl lg:text-6xl mb-3 tracking-tighter"
           >
             UPGRADE YOUR EXPERIENCE
           </motion.h2>
           <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: '60px' }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 mx-auto rounded-full" 
           />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Product Visual - Scaled for Viewport */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[400px] md:h-[550px] lg:h-[650px] flex items-center justify-center group"
          >
             {/* Background Atmosphere */}
            <div className="absolute w-[120%] h-[120%] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing">
                 <Suspense fallback={
                    <div className="flex items-center justify-center h-full w-full flex-col gap-4">
                        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                        <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase">SYSCALL: LOADING MODEL</span>
                    </div>
                 }>
                    <Canvas dpr={[1, 2]} camera={{ fov: 40 }} gl={{ preserveDrawingBuffer: true, alpha: true }}>
                         <PresentationControls 
                            speed={1.2} 
                            global 
                            zoom={0.8} 
                            polar={[-Math.PI / 2, Math.PI / 2]} // Full vertical rotation freedom
                            azimuth={[-Infinity, Infinity]} // Full horizontal rotation freedom
                            rotation={[Math.PI / 3, Math.PI - 0.4, 0]} // 60 degree angle for better 3D depth/front visibility
                         >
                             <Stage 
                                environment="city" 
                                intensity={0.5} 
                                shadows={false}
                             >
                                <VybeModel activeColor={activeFeature !== null ? features[activeFeature].hex : null} />
                             </Stage>
                         </PresentationControls>
                    </Canvas>
                 </Suspense>

                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/10 text-[9px] font-mono tracking-[0.3em] pointer-events-none uppercase">
                    Tactile Manipulation Active
                 </div>
            </div>
          </motion.div>

          {/* Content - Optimized Hierarchy */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="relative z-20"
          >
            <div className="mb-8">
                <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4 tracking-tight">THE <span className="text-violet-400">VYBE</span> CORE</h2>
                <p className="text-base lg:text-lg text-gray-400 font-light leading-relaxed max-w-xl">
                    Wearable emotional intelligence. A direct line to your community's heartbeat, translated into visible and physical feedback.
                </p>
            </div>

            <div className="space-y-3 mb-8">
                {features.map((item, i) => (
                    <motion.div 
                        key={i} 
                        className={`relative p-5 lg:p-6 rounded-2xl border transition-all duration-500 cursor-pointer group flex justify-between items-center overflow-hidden ${activeFeature === i ? 'bg-white/5 border-white/20 shadow-2xl shadow-violet-500/10' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                        onMouseEnter={() => setActiveFeature(i)}
                        onMouseLeave={() => setActiveFeature(null)}
                    >
                        <div className="relative z-10 flex flex-col">
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`text-[10px] font-mono font-bold transition-colors ${activeFeature === i ? item.accentColor : 'text-gray-700'}`}>0{i + 1}</span>
                                <h3 className={`text-lg md:text-xl font-bold font-display transition-colors ${activeFeature === i ? 'text-white' : 'text-gray-400'}`}>
                                    {item.title}
                                </h3>
                            </div>
                            <p className={`text-[11px] lg:text-xs transition-colors duration-500 ${activeFeature === i ? 'text-gray-300' : 'text-gray-600'}`}>
                                {item.description}
                            </p>
                        </div>
                        
                        <div className={`transition-all duration-700 relative z-10 ${activeFeature === i ? item.accentColor + ' opacity-100 scale-110 drop-shadow-[0_0_10px_currentColor]' : 'text-gray-800 opacity-20'}`}>
                            {item.icon}
                        </div>

                        {/* Animated background bar for active state */}
                        <motion.div 
                            className={`absolute left-0 bottom-0 h-full w-[2px] ${item.accentColor.replace('text-', 'bg-')}`}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: activeFeature === i ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                ))}
            </div>
            
            <div className="flex items-center gap-6">
                <span className="text-[11px] font-bold font-mono tracking-widest text-gray-500 uppercase">
                    Coming Soon
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
