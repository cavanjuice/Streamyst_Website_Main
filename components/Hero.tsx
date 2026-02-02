
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, ChevronRight } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SupabaseImg } from './SupabaseImg';

// --- SHADERS ---

// STARS: Sharp, twinkling, moving in 3D
const starsVertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  attribute float aScale;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    
    float slowTime = uTime * 0.05 * aSpeed;
    pos.y += sin(slowTime + pos.x) * 0.02;
    
    float rotX = -uMouse.y * 0.5; 
    float rotY = uMouse.x * 0.5;
    
    float cx = cos(rotX); float sx = sin(rotX);
    float cy = cos(rotY); float sy = sin(rotY);
    
    mat3 rotateX = mat3(1.0, 0.0, 0.0, 0.0, cx, -sx, 0.0, sx, cx);
    mat3 rotateY = mat3(cy, 0.0, sy, 0.0, 1.0, 0.0, -sy, 0.0, cy);
    
    pos = rotateY * rotateX * pos;

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float twinkle = 1.0 + sin(uTime * 3.0 + pos.x * 10.0) * 0.5;
    gl_PointSize = aScale * uPixelRatio * twinkle;
    gl_PointSize *= (1.0 / -mvPosition.z);
    
    vAlpha = 0.8 + 0.2 * twinkle;
  }
`;

const starsFragmentShader = `
  varying float vAlpha;
  void main() {
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float dist = length(xy);
    if(dist > 0.5) discard;
    
    float core = 1.0 - (dist * 2.0);
    core = pow(core, 4.0);
    
    gl_FragColor = vec4(1.0, 1.0, 1.0, core * vAlpha);
  }
`;

// --- 3D COMPONENTS ---

const StarsLayer = ({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) => {
    const count = 180; 
    const mesh = useRef<THREE.Points>(null);
    
    const [positions, scales, speeds] = useMemo(() => {
      const pos = new Float32Array(count * 3);
      const sca = new Float32Array(count);
      const spd = new Float32Array(count);
  
      for (let i = 0; i < count; i++) {
        let x, y, z, valid = false;
        while (!valid) {
            x = (Math.random() - 0.5) * 6.0; 
            y = (Math.random() - 0.5) * 4.0 + 0.5; 
            z = (Math.random() - 0.5) * 2.0; 
            if ((x*x)/(2.8*2.8) + ((y-0.5)*(y-0.5))/(1.8*1.8) + (z*z)/(1.0*1.0) <= 1.0) {
                valid = true;
            }
        }
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        sca[i] = 10.0 + Math.random() * 30.0; 
        spd[i] = 0.2 + Math.random() * 0.8;
      }
      return [pos, sca, spd];
    }, []);
  
    const uniforms = useMemo(() => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMouse: { value: new THREE.Vector2(0, 0) }
    }), []);
  
    useFrame((state) => {
      if (mesh.current) {
          (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
          (mesh.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.lerp(mouse.current, 0.05);
      }
    });
  
    return (
      // @ts-ignore
      <points ref={mesh}>
        {/* @ts-ignore */}
        <bufferGeometry>
          {/* @ts-ignore */}
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          {/* @ts-ignore */}
          <bufferAttribute attach="attributes-aScale" count={count} array={scales} itemSize={1} />
          {/* @ts-ignore */}
          <bufferAttribute attach="attributes-aSpeed" count={count} array={speeds} itemSize={1} />
        {/* @ts-ignore */}
        </bufferGeometry>
        {/* @ts-ignore */}
        <shaderMaterial
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={starsVertexShader}
          fragmentShader={starsFragmentShader}
          transparent={true}
        />
      {/* @ts-ignore */}
      </points>
    );
};

const HolographicField = () => {
    const mouse = useRef(new THREE.Vector2(0, 0));
    const { viewport } = useThree();
    
    useFrame((state) => {
        mouse.current.x = (state.mouse.x * Math.PI) / 6; 
        mouse.current.y = (state.mouse.y * Math.PI) / 6;
    });

    return (
        // @ts-ignore
        <group position={[0, -0.5, 0]}>
            <StarsLayer mouse={mouse} />
        {/* @ts-ignore */}
        </group>
    )
}

// --- MAIN HERO COMPONENT ---

interface HeroProps {
  onOpenVideo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenVideo }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Updated: Poster layout for mobile (Image Top, Text Bottom Overlay), Grid for Desktop
    <section className="relative h-[100dvh] w-full overflow-hidden flex flex-col">
        {/* Clean background - No Gradients */}

        <div className="container mx-auto px-0 lg:px-12 relative z-10 h-full max-w-7xl">
            <div className="relative h-full w-full lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
                
                {/* --- IMAGE SECTION --- */}
                {/* Mobile: Absolute Top. Reduced pt and height adjusted to pull image up closing the gap. */}
                {/* Desktop: Removed pt-24 to align vertically center with text */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="absolute top-0 left-0 w-full h-[65%] lg:static lg:h-auto lg:order-2 flex items-center justify-center z-0 lg:z-10 pt-20 lg:pt-0"
                >
                    <div className="relative w-full h-full flex items-center justify-center lg:justify-end">
                         {/* Asset Wrapper: Reduced max-width on desktop to 400px (was 480px) to decrease scale */}
                         {/* APPLIED MASK TO CONTAINER FOR CLEANER FADE */}
                         <div 
                             className="relative z-10 w-full h-full max-h-[600px] lg:max-h-[75vh] lg:max-w-[400px] flex items-center justify-center"
                             style={{
                                 // Adjusted mask to start fading lower (80%) for smoother blend without cutting body too early
                                 maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                 WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                             }}
                         >
                             
                             {/* 3D Canvas */}
                             <div className="absolute inset-0 z-20 pointer-events-auto opacity-100">
                                <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                                    <HolographicField />
                                </Canvas>
                             </div>

                             <SupabaseImg 
                               filename="DSC006262.png"
                               alt="Streamyst Wearable Tech"
                               className="relative z-10 h-full w-auto object-contain lg:w-full lg:h-auto animate-float"
                             />
                         </div>
                    </div>
                </motion.div>

                {/* --- TEXT SECTION --- */}
                {/* Mobile: Absolute Bottom Overlay. Increased pb to push buttons up away from scroll indicator. */}
                {/* Desktop: Removed padding to allow grid centering to work perfectly */}
                <div className="absolute bottom-0 left-0 w-full lg:static lg:w-auto z-20 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left pb-24 pt-12 px-6 lg:py-0 lg:px-0 bg-gradient-to-t from-[#030205] via-[#030205]/60 to-transparent lg:bg-none">
                    
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-3 lg:mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    >
                        <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                        <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-violet-100 uppercase">The Next Evolution of Livestreaming</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-display font-bold text-4xl sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.1] mb-3 lg:mb-6 tracking-tight"
                    >
                        Connect to your audience. <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-300 to-indigo-400 text-glow">
                            In Real-Time.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="font-body text-sm sm:text-base lg:text-lg text-gray-400 max-w-lg mb-6 lg:mb-10 leading-relaxed font-light"
                    >
                        STREAMYST transforms emotional reactions into physical sensations. Don't just read the chat, <span className="text-white font-medium">feel the room</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-row items-center gap-3 w-full justify-center lg:justify-start"
                    >
                        <button
                            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-6 py-3 bg-white text-cosmic-950 font-bold text-xs sm:text-base rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:translate-x-1 transition-transform">
                                Join the Waitlist <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        <button
                            onClick={onOpenVideo}
                            className="relative px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs sm:text-base rounded-full transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-sm"
                        >
                             <div className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 border border-white/20 group-hover:border-violet-400 transition-colors">
                                <span className="absolute w-full h-full rounded-full bg-violet-500/30 animate-ping opacity-0 group-hover:opacity-100" />
                                <Play className="w-1.5 h-1.5 sm:w-2 sm:h-2 fill-white relative z-10 ml-0.5" />
                             </div>
                            <span>Watch Demo</span>
                        </button>
                    </motion.div>
                </div>

            </div>
        </div>

        {/* Scroll Hint (Desktop) */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hasScrolled ? 0 : 1 }}
            transition={{ delay: hasScrolled ? 0 : 1.5, duration: hasScrolled ? 0.3 : 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2 pointer-events-none"
        >
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium">Scroll</span>
            <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
                <motion.div 
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-violet-400 to-transparent"
                />
            </div>
        </motion.div>

        {/* Scroll Hint (Mobile) */}
        <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: hasScrolled ? 0 : 1 }}
             transition={{ delay: hasScrolled ? 0 : 1.5, duration: hasScrolled ? 0.3 : 1 }}
             className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 md:hidden flex flex-col items-center pointer-events-none"
        >
             <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1.5 backdrop-blur-sm">
                 <motion.div 
                     animate={{ y: [0, 8, 0] }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                     className="w-1 h-1 bg-white rounded-full"
                 />
             </div>
        </motion.div>

    </section>
  );
};

export default Hero;
