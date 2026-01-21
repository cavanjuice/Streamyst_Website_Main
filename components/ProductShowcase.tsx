
// @ts-nocheck
import React, { useState, Suspense, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls, Center, Resize, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2, Eye, Zap, Sun } from 'lucide-react';

const MovingHighlight = ({ color }: { color: string | null }) => {
  const lightRef = useRef<THREE.SpotLight>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (lightRef.current) {
        // Move the light in a figure-8 pattern across the front of the object
        lightRef.current.position.x = Math.sin(t * 1.5) * 4;
        lightRef.current.position.y = Math.cos(t * 1) * 2;
        lightRef.current.position.z = 6 + Math.sin(t * 2) * 1;

        // Standard idle intensity
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 200, 0.05);
        lightRef.current.color.lerp(new THREE.Color('#ffffff'), 0.05);
    }
  });

  return (
    <spotLight 
        ref={lightRef} 
        position={[0, 0, 5]} 
        angle={0.6} 
        penumbra={0.5} 
        distance={20} 
        castShadow 
    />
  );
};

// New Component: Visible floating light orbs for Sentiment Mapping
const SentimentLights = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
      if (groupRef.current) {
          // Faster rotation for more dynamic play of light
          groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
          // Gentle wobble
          groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      }
  });

  // Positioned tightly around a size-4 model
  // Colors mapped to emotions: JOY (Yellow), LOVY (Pink), Fyre (Orange), Vybe (Indigo)
  const lights = [
      { color: "#facc15", position: [2.5, 2, 2.5] },    // Yellow (JOY) - Replaced Green
      { color: "#ec4899", position: [-2.5, 2, 2.5] },   // Pink (LOVY)
      { color: "#f97316", position: [2.5, -2, 2.5] },   // Orange (Fyre)
      { color: "#6366f1", position: [-2.5, -2, 2.5] }   // Indigo (Vybe)
  ];

  return (
    <group ref={groupRef}>
        {lights.map((l, i) => (
            <group key={i} position={l.position as any}>
                {/* Visual Orbs removed so only the light effect remains */}
                <pointLight 
                    color={l.color} 
                    intensity={1500} 
                    distance={8} 
                    decay={1} 
                />
            </group>
        ))}
    </group>
  );
};

// New Component: Expanding rings for Haptic Feedback
const PulseRing = ({ delay, color }: { delay: number, color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
      if (ref.current) {
          const t = state.clock.elapsedTime + delay;
          const duration = 3.0; // Slower, more elegant
          const progress = (t % duration) / duration;
          
          // Cubic ease-out for expansion
          const ease = 1 - Math.pow(1 - progress, 3);
          
          // Expand from close to model (scale 1) outwards to 1.5x
          const scale = 1 + ease * 0.5; 
          ref.current.scale.set(scale, scale, scale);
          
          // Opacity curve: Fade in fast, fade out slow
          let opacity = 0;
          if (progress < 0.1) {
             // 0 to 1 over first 10%
             opacity = progress * 10;
          } else {
             // 1 to 0 over remaining 90%
             opacity = 1 - ((progress - 0.1) / 0.9);
          }
          // Max opacity 0.5 for subtlety
          (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5;
      }
  });

  return (
    <mesh ref={ref}>
        {/* Finer ring: Thinner geometry for refined look (thickness ~0.015) */}
        <ringGeometry args={[2.3, 2.315, 128]} /> 
        <meshBasicMaterial color={color} transparent side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
    </mesh>
  );
};

const HapticRings = () => {
    return (
        <group>
            {/* Spaced out timing */}
            <PulseRing delay={0} color="#06b6d4" />
            <PulseRing delay={1.0} color="#06b6d4" />
            <PulseRing delay={2.0} color="#06b6d4" />
        </group>
    )
}

const VybeModel = ({ activeFeature }: { activeFeature: number | null }) => {
  const obj = useLoader(OBJLoader, 'https://raw.githubusercontent.com/cavanjuice/assets/main/Assembly%20vybe%203.obj');
  const meshRef = useRef<THREE.Group>(null);
  
  // Store references to materials mapped by object name for O(1) access
  const materialsMap = useRef<Map<string, THREE.MeshPhysicalMaterial>>(new Map());

  useMemo(() => {
    materialsMap.current.clear();
    
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
         // High quality dark metallic material
         // Extremely low roughness for mirror-like reflections of the colored lights
         const mat = new THREE.MeshPhysicalMaterial({
             color: '#1a1a1a', 
             metalness: 0.95,
             roughness: 0.15, 
             clearcoat: 1,
             clearcoatRoughness: 0.1,
             emissive: '#000000',
             emissiveIntensity: 0
         });
         
         // INJECT CUSTOM SHADER FOR GRADIENT EFFECT
         mat.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = { value: 0 };
            shader.uniforms.uGradientStrength = { value: 0 };
            shader.uniforms.uEmissiveIntensity = { value: 0 }; // Explicitly pass intensity
            
            // Store shader reference on the material userData for easy access in useFrame
            mat.userData.shader = shader;
            mat.userData.gradientStrength = 0; // Initialize state

            // 1. Pass World Position to Fragment Shader
            shader.vertexShader = `
                varying vec3 vWorldPos;
                ${shader.vertexShader}
            `.replace(
                '#include <worldpos_vertex>',
                `#include <worldpos_vertex>
                 vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`
            );

            // 2. Implement Gradient Logic in Fragment Shader
            shader.fragmentShader = `
                uniform float uTime;
                uniform float uGradientStrength;
                uniform float uEmissiveIntensity; 
                varying vec3 vWorldPos;
                ${shader.fragmentShader}
            `.replace(
                '#include <emissivemap_fragment>',
                `
                #include <emissivemap_fragment>

                // Define 2 DISTINCT Colors (Dark Orange Gradient)
                vec3 colBot = vec3(0.60, 0.20, 0.07); // Dark Burnt Orange (#9a3412)
                vec3 colTop = vec3(0.98, 0.75, 0.14); // Vibrant Amber/Gold (#fbbf24)
                
                // Calculate height factor (model is roughly -2 to 2 in Y)
                // We add gentle time movement to make the gradient "breathe" slightly
                float h = vWorldPos.y * 0.3 + 0.5 + sin(uTime * 1.0) * 0.05;
                
                // Simple 2-color mix
                vec3 grad = mix(colBot, colTop, smoothstep(0.2, 0.8, h));

                // If uGradientStrength is active (close to 1), we override the emissive color
                // We use 'uEmissiveIntensity' (which is controlled by JS) to scale the brightness
                if (uGradientStrength > 0.01) {
                    // Mix between standard emissive (e.g. Gold for feature 3) and Gradient
                    // Note: totalEmissiveRadiance is the internal variable in MeshPhysicalMaterial
                    vec3 gradientEmissive = grad * uEmissiveIntensity;
                    totalEmissiveRadiance = mix(totalEmissiveRadiance, gradientEmissive, uGradientStrength);
                }
                `
            );
         };

         child.material = mat;
         child.castShadow = true;
         child.receiveShadow = true;
         
         // Store ref using the object name (e.g. "Object.1")
         materialsMap.current.set(child.name, mat);
      }
    });
  }, [obj]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
        // Base Rotation
        let rotY = Math.sin(t * 0.5) * 0.15; // Idle Sway
        let scale = 1;

        // --- EFFECT 3: TACTILE FEEDBACK (Index 2) ---
        // Visual "Sonar" Pulse Scale Throb
        if (activeFeature === 2) {
             const pulseSpeed = 15; 
             scale = 1 + Math.max(0, Math.sin(t * pulseSpeed)) * 0.03;
        }

        meshRef.current.rotation.y = rotY;
        meshRef.current.scale.set(scale, scale, scale);
        meshRef.current.position.set(0, 0, 0);
    }

    // Material Effects Loop
    materialsMap.current.forEach((mat) => {
        let targetColor = new THREE.Color(0, 0, 0);
        let targetIntensity = 0;
        let targetGradientStrength = 0;

        // --- EFFECT 2: REACTIVE LUMINANCE (Index 1) ---
        if (activeFeature === 1) {
            // We use White here as a neutral base for brightness, 
            // but the SHADER will override the color with the Gradient.
            targetColor = new THREE.Color('#ffffff'); 
            // "Breathing" intensity
            // Reduced max intensity and min intensity for a darker look
            targetIntensity = 0.05 + (Math.sin(t * 2.5) + 1) * 0.2; 
            // Activate the shader gradient
            targetGradientStrength = 1;
        }

        // --- EFFECT 3: TACTILE FEEDBACK (Index 2) ---
        // Physical only, no color change

        // Apply smooth transition to JS properties
        const lerpSpeed = activeFeature === 2 ? 0.5 : 0.1;
        mat.emissive.lerp(targetColor, lerpSpeed);
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, lerpSpeed);

        // Update Shader Uniforms
        if (mat.userData.shader) {
            mat.userData.shader.uniforms.uTime.value = t;
            
            // Lerp the gradient strength for smooth transition in/out of gradient mode
            // We store current strength in userData to persist between frames
            if (typeof mat.userData.gradientStrength === 'undefined') mat.userData.gradientStrength = 0;
            
            mat.userData.gradientStrength = THREE.MathUtils.lerp(
                mat.userData.gradientStrength, 
                targetGradientStrength, 
                0.1 // Transition speed
            );
            
            mat.userData.shader.uniforms.uGradientStrength.value = mat.userData.gradientStrength;
            
            // Explicitly sync intensity to avoid 'undeclared identifier' shader errors
            mat.userData.shader.uniforms.uEmissiveIntensity.value = mat.emissiveIntensity;
        }
    });
  });

  return (
    <group>
        <Center>
            {/* Wrap Resize in the manipulated group */}
            <group ref={meshRef}>
                <Resize scale={4}>
                    <primitive object={obj} rotation={[Math.PI / 2, 0, 0]} />
                </Resize>
            </group>
        </Center>
        
        {/* --- EFFECT 1: SENTIMENT MAPPING (Index 0) --- */}
        {activeFeature === 0 && (
            <SentimentLights />
        )}

        {/* --- EFFECT 3: TACTILE FEEDBACK (Index 2) --- */}
        {activeFeature === 2 && (
            <HapticRings />
        )}

        {/* Standard Light */}
        {activeFeature !== 0 && (
             <MovingHighlight color={null} />
        )}
    </group>
  );
};

const ProductShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features = [
    { 
      title: "Sentiment Mapping", 
      description: "Real-time translation of chat into ambient light fields.", 
      hex: "#f97316", // Orange
      icon: <Eye className="w-5 h-5" />, 
      accentColor: "text-orange-500",
    },
    { 
      title: "Reactive Luminance", 
      description: "Internal diffusion core that breathes with stream activity.", 
      hex: "#ec4899", // Pink
      icon: <Sun className="w-5 h-5" />, 
      accentColor: "text-pink-500",
    },
    { 
      title: "Tactile Feedback", 
      description: "High-fidelity vibration motor for physical immersion.", 
      hex: "#06b6d4", // Cyan
      icon: <Zap className="w-5 h-5" />, 
      accentColor: "text-cyan-500",
    }
  ];

  const handleToggleFeature = (index: number) => {
    // If clicking the active feature, deactivate it. Otherwise, activate the new one.
    setActiveFeature(prev => prev === index ? null : index);
  };

  return (
    <section id="product" className="relative z-10 min-h-screen flex items-center py-12 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Unified Title Style */}
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ delay: 0.1 }}
             className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight"
           >
             UPGRADE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">EXPERIENCE</span>
           </motion.h2>
           <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: '60px' }}
             viewport={{ once: true }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 mx-auto rounded-full" 
           />
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          
          {/* Product Visual - Compact on Mobile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[280px] md:h-[550px] lg:h-[650px] flex items-center justify-center group w-full"
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
                    {/* Position Camera at a fixed distance that works with Scale=4 */}
                    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 40 }} gl={{ preserveDrawingBuffer: true, alpha: true }}>
                         <Environment preset="city" />
                         
                         <VybeModel 
                            activeFeature={activeFeature}
                         />
                         
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
                    Interactive Model • Tap Features to Preview
                 </div>
            </div>
          </motion.div>

          {/* Content - Compact on Mobile */}
          <motion.div
             initial={{ opacity: 0, x: 40 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
             className="relative z-20 w-full"
          >
            <div className="mb-4 lg:mb-8">
                <h2 className="font-display font-bold text-2xl lg:text-5xl mb-2 lg:mb-4 tracking-tight">THE <span className="text-violet-400">VYBE</span> CORE</h2>
                <p className="text-sm lg:text-lg text-gray-400 font-light leading-relaxed max-w-xl">
                    Wearable emotional intelligence. A direct line to your community's heartbeat, translated into visible and physical feedback.
                </p>
            </div>

            <motion.div 
                className="space-y-2 lg:space-y-3 mb-6 lg:mb-8"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {features.map((item, i) => (
                    <motion.div 
                        key={i}
                        variants={{
                            hidden: { opacity: 0, x: 20 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                        }}
                        className={`relative p-3 lg:p-6 rounded-xl lg:rounded-2xl border transition-all duration-500 cursor-pointer group flex justify-between items-center overflow-hidden ${activeFeature === i ? 'bg-white/5 border-white/20 shadow-2xl shadow-violet-500/10' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                        onClick={() => handleToggleFeature(i)}
                        onMouseEnter={() => setActiveFeature(i)}
                        onMouseLeave={() => setActiveFeature(null)}
                    >
                        <div className="relative z-10 flex flex-col">
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`text-[10px] font-mono font-bold transition-colors ${activeFeature === i ? item.accentColor : 'text-gray-700'}`}>0{i + 1}</span>
                                <h3 className={`text-sm md:text-xl font-bold font-display transition-colors ${activeFeature === i ? 'text-white' : 'text-gray-400'}`}>
                                    {item.title}
                                </h3>
                            </div>
                            <p className={`text-[10px] lg:text-xs transition-colors duration-500 ${activeFeature === i ? 'text-gray-300' : 'text-gray-600'}`}>
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
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6"
            >
                <span className="text-[11px] font-bold font-mono tracking-widest text-gray-500 uppercase">
                    Coming Soon
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
