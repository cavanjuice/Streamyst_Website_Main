
// @ts-nocheck
import React, { useState, Suspense, useMemo, useRef, Component, ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls, Center, Resize, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2, Eye, Zap, Sun, MousePointer2 } from 'lucide-react';
import { supabase, getAssetUrl } from '../utils/supabaseClient';

// --- Error Boundary for 3D Model ---
class ModelErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("3D Model failed to load:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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
  const lights = [
      { color: "#facc15", position: [2.5, 2, 2.5] },    // Yellow (JOY)
      { color: "#ec4899", position: [-2.5, 2, 2.5] },   // Pink (LOVY)
      { color: "#f97316", position: [2.5, -2, 2.5] },   // Orange (Fyre)
      { color: "#6366f1", position: [-2.5, -2, 2.5] }   // Indigo (Vybe)
  ];

  return (
    <group ref={groupRef}>
        {lights.map((l, i) => (
            <group key={i} position={l.position as any}>
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

// Fallback component if model fails to load
const FallbackModel = ({ activeFeature }: { activeFeature: number | null }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if(meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group>
            <Center>
                <mesh ref={meshRef}>
                    <capsuleGeometry args={[1, 3, 4, 16]} />
                    <meshStandardMaterial 
                        color="#2a2a2a" 
                        roughness={0.3} 
                        metalness={0.8} 
                        emissive={activeFeature === 1 ? "#fbbf24" : "#000000"}
                        emissiveIntensity={activeFeature === 1 ? 0.5 : 0}
                    />
                </mesh>
            </Center>
            {activeFeature === 0 && <SentimentLights />}
            {activeFeature === 2 && <HapticRings />}
            {activeFeature !== 0 && <MovingHighlight color={null} />}
        </group>
    )
}

// SHARED MATERIAL LOGIC
const applyMaterials = (object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
         // High quality dark metallic material
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
            shader.uniforms.uEmissiveIntensity = { value: 0 }; 
            
            mat.userData.shader = shader;
            mat.userData.gradientStrength = 0;

            shader.vertexShader = `
                varying vec3 vWorldPos;
                ${shader.vertexShader}
            `.replace(
                '#include <worldpos_vertex>',
                `#include <worldpos_vertex>
                 vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`
            );

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
                vec3 colBot = vec3(0.60, 0.20, 0.07); // Dark Burnt Orange
                vec3 colTop = vec3(0.98, 0.75, 0.14); // Vibrant Amber/Gold
                float h = vWorldPos.y * 0.3 + 0.5 + sin(uTime * 1.0) * 0.05;
                vec3 grad = mix(colBot, colTop, smoothstep(0.2, 0.8, h));

                if (uGradientStrength > 0.01) {
                    vec3 gradientEmissive = grad * uEmissiveIntensity;
                    totalEmissiveRadiance = mix(totalEmissiveRadiance, gradientEmissive, uGradientStrength);
                }
                `
            );
         };

         child.material = mat;
         child.castShadow = true;
         child.receiveShadow = true;
         // Store reference to material for updates
         child.userData.materialRef = mat;
      }
    });
};

// SHARED ANIMATION LOOP
const useModelAnimation = (scene: THREE.Group | THREE.Object3D, activeFeature: number | null, meshRef: React.RefObject<THREE.Group>) => {
    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (meshRef.current) {
            let rotY = Math.sin(t * 0.5) * 0.15;
            let scale = 1;

            if (activeFeature === 2) {
                 const pulseSpeed = 15; 
                 scale = 1 + Math.max(0, Math.sin(t * pulseSpeed)) * 0.03;
            }

            meshRef.current.rotation.y = rotY;
            meshRef.current.scale.set(scale, scale, scale);
            meshRef.current.position.set(0, 0, 0);
        }

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.userData.materialRef) {
                const mat = child.userData.materialRef;
                let targetColor = new THREE.Color(0, 0, 0);
                let targetIntensity = 0;
                let targetGradientStrength = 0;

                if (activeFeature === 1) {
                    targetColor = new THREE.Color('#ffffff'); 
                    targetIntensity = 0.05 + (Math.sin(t * 2.5) + 1) * 0.2; 
                    targetGradientStrength = 1;
                }

                const lerpSpeed = activeFeature === 2 ? 0.5 : 0.1;
                mat.emissive.lerp(targetColor, lerpSpeed);
                mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, lerpSpeed);

                if (mat.userData.shader) {
                    mat.userData.shader.uniforms.uTime.value = t;
                    if (typeof mat.userData.gradientStrength === 'undefined') mat.userData.gradientStrength = 0;
                    mat.userData.gradientStrength = THREE.MathUtils.lerp(
                        mat.userData.gradientStrength, 
                        targetGradientStrength, 
                        0.1
                    );
                    mat.userData.shader.uniforms.uGradientStrength.value = mat.userData.gradientStrength;
                    mat.userData.shader.uniforms.uEmissiveIntensity.value = mat.emissiveIntensity;
                }
            }
        });
    });
};

// --- LOADER FOR OBJ FILES ---
const OBJModel = ({ url, activeFeature }: { url: string, activeFeature: number | null }) => {
    const obj = useLoader(OBJLoader, url);
    const meshRef = useRef<THREE.Group>(null);
    
    useMemo(() => applyMaterials(obj), [obj]);
    useModelAnimation(obj, activeFeature, meshRef);

    return (
        <group ref={meshRef}>
            <Resize scale={4}>
                <primitive object={obj} rotation={[Math.PI / 2, 0, 0]} />
            </Resize>
        </group>
    );
}

// --- LOADER FOR GLB FILES (With Draco Support) ---
const GLBModel = ({ url, activeFeature }: { url: string, activeFeature: number | null }) => {
    // Enable Draco with default decoder (from CDN)
    const { scene } = useGLTF(url, true);
    const meshRef = useRef<THREE.Group>(null);

    useMemo(() => applyMaterials(scene), [scene]);
    useModelAnimation(scene, activeFeature, meshRef);

    return (
        <group ref={meshRef}>
            <Resize scale={4}>
                <primitive object={scene} rotation={[Math.PI / 2, 0, 0]} />
            </Resize>
        </group>
    );
}

// --- MAIN WRAPPER COMPONENT ---
const LoadedVybeModel = ({ url, activeFeature }: { url: string, activeFeature: number | null }) => {
    // Determine type based on extension
    const isGLB = url.toLowerCase().includes('.glb') || url.toLowerCase().includes('.gltf');

    return (
        <group>
            <Center>
                {isGLB ? (
                    <GLBModel url={url} activeFeature={activeFeature} />
                ) : (
                    <OBJModel url={url} activeFeature={activeFeature} />
                )}
            </Center>
            
            {activeFeature === 0 && <SentimentLights />}
            {activeFeature === 2 && <HapticRings />}
            {activeFeature !== 0 && <MovingHighlight color={null} />}
        </group>
    );
};

const VybeModel = ({ activeFeature }: { activeFeature: number | null }) => {
    // Reverted to 'assets' as per original file structure indicating where the file lives.
    // Removed HEAD check to prevent potential CORS/Network blocking of pre-flight checks.
    const FILENAME = 'Assembly vybe 3.obj'; 
    const { data } = supabase.storage.from('assets').getPublicUrl(FILENAME);
    
    return <LoadedVybeModel url={data.publicUrl} activeFeature={activeFeature} />;
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

  const handleActivateFeature = (index: number) => {
    setActiveFeature(index);
  };

  return (
    <section id="product" className="relative z-10 min-h-screen flex items-center py-12 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="text-center mb-16 lg:mb-20 max-w-4xl mx-auto">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ delay: 0.1 }}
             className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight"
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

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[320px] md:h-[450px] lg:h-[500px] flex items-center justify-center group w-full"
          >
            <div className="absolute w-[120%] h-[120%] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing">
                 <Suspense fallback={
                    <div className="flex items-center justify-center h-full w-full flex-col gap-4">
                        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                        <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase">SYSCALL: LOADING MODEL</span>
                    </div>
                 }>
                    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 40 }} gl={{ preserveDrawingBuffer: true, alpha: true }}>
                        <Environment preset="city" />
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        
                        <ModelErrorBoundary fallback={<FallbackModel activeFeature={activeFeature} />}>
                            <VybeModel activeFeature={activeFeature} />
                        </ModelErrorBoundary>
                        
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

                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-violet-300/50 text-[10px] font-mono tracking-[0.2em] pointer-events-none uppercase w-full justify-center">
                    <MousePointer2 size={12} className="animate-bounce" />
                    <span>Interactive Model • Explore Features</span>
                 </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
             initial={{ opacity: 0, x: 40 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
             className="relative z-20 w-full"
          >
            <div className="mb-4 lg:mb-8">
                <h2 className="font-display font-bold text-2xl lg:text-4xl mb-2 lg:mb-4 tracking-tight">THE <span className="text-violet-400">VYBE</span> CORE</h2>
                <p className="text-sm lg:text-base text-gray-400 font-light leading-relaxed max-w-xl">
                    Wearable emotional intelligence. A direct line to your community's heartbeat, translated into visible and physical feedback.
                </p>
            </div>

            <motion.div 
                className="space-y-3 lg:space-y-4 mb-6 lg:mb-8"
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
                        className={`
                            relative p-4 lg:p-5 rounded-xl border transition-all duration-300 cursor-pointer group flex justify-between items-center overflow-hidden
                            ${activeFeature === i 
                                ? 'bg-white/10 border-white/30 shadow-[0_0_30px_rgba(139,92,246,0.2)]' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }
                        `}
                        onClick={() => handleActivateFeature(i)}
                        onMouseEnter={() => handleActivateFeature(i)}
                        onMouseLeave={() => setActiveFeature(null)}
                        role="button"
                        tabIndex={0}
                    >
                        {/* Hover highlight background */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent opacity-0 transition-opacity duration-500 ${activeFeature === i ? 'opacity-100' : 'group-hover:opacity-100'}`} />

                        <div className="relative z-10 flex flex-col flex-1 mr-4">
                            <div className="flex items-center gap-3 mb-1.5">
                                <span className={`text-[10px] font-mono font-bold transition-colors ${activeFeature === i ? item.accentColor : 'text-gray-500 group-hover:text-gray-400'}`}>0{i + 1}</span>
                                <h3 className={`text-base md:text-lg font-bold font-display transition-colors ${activeFeature === i ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                    {item.title}
                                </h3>
                            </div>
                            <p className={`text-[11px] lg:text-xs leading-relaxed transition-colors duration-300 ${activeFeature === i ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                {item.description}
                            </p>
                        </div>
                        
                        <div className="relative z-10 flex items-center gap-4">
                            <div className={`transition-all duration-500 ${activeFeature === i ? item.accentColor + ' scale-110 drop-shadow-[0_0_10px_currentColor]' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                {item.icon}
                            </div>
                        </div>

                        {/* Animated bottom bar for active state */}
                        <motion.div 
                            className={`absolute left-0 bottom-0 h-[2px] w-full ${item.accentColor.replace('text-', 'bg-')}`}
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: activeFeature === i ? 1 : 0 }}
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
