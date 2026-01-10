
import React, { useState, Suspense, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Stage, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2, Eye, Zap, Wifi, Battery } from 'lucide-react';

const MovingHighlight = ({ color }: { color: string | null }) => {
  const lightRef = useRef<THREE.SpotLight>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (lightRef.current) {
        // Move the light in a figure-8 pattern across the front of the object
        // This creates the "Chase" effect on the metallic surface
        lightRef.current.position.x = Math.sin(t * 1.5) * 4;
        lightRef.current.position.y = Math.cos(t * 1) * 2;
        lightRef.current.position.z = 6 + Math.sin(t * 2) * 1;

        // Smooth Intensity Transition
        const targetIntensity = color ? 300 : 0; 
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.05);
        
        // Smooth Color Transition
        if (color) {
            lightRef.current.color.lerp(new THREE.Color(color), 0.05);
        }
    }
  });

  return (
    <spotLight 
        ref={lightRef} 
        position={[0, 0, 5]} 
        angle={0.6} 
        penumbra={0.5} 
        distance={15} 
        castShadow 
    />
  );
};

const VybeModel = ({ activeColor }: { activeColor: string | null }) => {
  const obj = useLoader(OBJLoader, 'https://raw.githubusercontent.com/cavanjuice/assets/main/Assembly%20vybe%203.obj');
  const meshRef = useRef<THREE.Group>(null);
  // Store references to materials to animate them without re-traversing
  const materialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);

  useMemo(() => {
    materialsRef.current = [];
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
         // High quality dark metallic material
         const mat = new THREE.MeshPhysicalMaterial({
             color: '#1a1a1a', // Dark Grey Base (allows light to show better than pure black)
             metalness: 0.8,
             roughness: 0.4,   // Slightly rougher to catch the chase light better over the surface
             clearcoat: 1,
             clearcoatRoughness: 0.2,
             emissive: '#000000',
             emissiveIntensity: 0
         });
         child.material = mat;
         child.castShadow = true;
         child.receiveShadow = true;
         materialsRef.current.push(mat);
      }
    });
  }, [obj]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // 1. Idle Rotation Animation (Applied to the container Group)
    if (meshRef.current) {
        // Base rotation 0 (Front Facing) + gentle sine wave sway
        const sway = Math.sin(t * 0.5) * 0.15;
        meshRef.current.rotation.y = 0 + sway;
    }

    // 2. Material "Gradient Chase" Effect (Emissive Pulse)
    // We lerp the emissive color to create a subtle glow that matches the active feature
    const targetColor = activeColor ? new THREE.Color(activeColor) : new THREE.Color(0,0,0);
    const targetIntensity = activeColor ? 0.25 : 0; // Subtle intensity

    materialsRef.current.forEach((mat) => {
        // Smoothly interpolate color
        mat.emissive.lerp(targetColor, 0.05);
        // Smoothly interpolate intensity
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, 0.05);
    });
  });

  return (
    <group>
        {/* Container Group handles the Y-axis sway animation */}
        <group ref={meshRef}>
            {/* Primitive handles the static 90-degree X-axis flip */}
            <primitive object={obj} rotation={[Math.PI / 2, 0, 0]} />
        </group>
        <MovingHighlight color={activeColor} />
    </group>
  );
};

const ProductShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features = [
    { 
      title: "Sentiment Mapping", 
      description: "Real-time emotional translation engine.", 
      hex: "#f97316", // Orange
      icon: <Eye className="w-5 h-5" />, 
      accentColor: "text-orange-500" 
    },
    { 
      title: "Haptic Luminance", 
      description: "Visible on camera, physical sensation in room.", 
      hex: "#ec4899", // Pink
      icon: <Zap className="w-5 h-5" />, 
      accentColor: "text-pink-500" 
    },
    { 
      title: "Zero-Latency Link", 
      description: "Sub-10ms connection via proprietary protocol.", 
      hex: "#22c55e", // Green
      icon: <Wifi className="w-5 h-5" />, 
      accentColor: "text-green-500" 
    },
    { 
      title: "Marathon Cell", 
      description: "12-hour continuous broadcasting capacity.", 
      hex: "#eab308", // Yellow
      icon: <Battery className="w-5 h-5" />, 
      accentColor: "text-yellow-500" 
    }
  ];

  return (
    <section id="product" className="relative z-10 min-h-screen flex items-center py-12 md:py-0 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Title Section */}
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
          
          {/* Product Visual */}
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
                         <Stage 
                            environment="city" 
                            intensity={0.5} 
                            shadows={false}
                            adjustCamera={1.2} // Ensures full product visibility without clipping
                         >
                            <VybeModel activeColor={activeFeature !== null ? features[activeFeature].hex : null} />
                         </Stage>
                         <OrbitControls 
                            makeDefault 
                            enableZoom={false} 
                            enablePan={false}
                            enableDamping={true}
                            dampingFactor={0.05}
                            minPolarAngle={0}
                            maxPolarAngle={Math.PI}
                         />
                    </Canvas>
                 </Suspense>

                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/10 text-[9px] font-mono tracking-[0.3em] pointer-events-none uppercase w-full text-center">
                    Interactive Model • Drag to Rotate
                 </div>
            </div>
          </motion.div>

          {/* Content */}
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
