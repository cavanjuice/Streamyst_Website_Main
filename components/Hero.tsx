
import React, { useRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, ChevronRight } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- SHADERS ---

// GLSL Noise Function (Standard Simplex 3D)
const noiseFunction = `
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }
`;

const nebulaVertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  
  attribute float aScale;
  attribute vec3 aRandomness;
  attribute float aSpeed;
  
  varying vec3 vColor;
  varying float vAlpha;

  ${noiseFunction}

  void main() {
    vec3 pos = position;
    
    // 1. Fluid Smoke Motion
    float noiseVal = snoise(vec3(pos.x * 0.25, pos.y * 0.25, uTime * 0.1));
    
    pos.x += noiseVal * 0.3;
    pos.y += noiseVal * 0.15;

    // 2. Parallax Rotation
    float rotX = -uMouse.y * 0.5; 
    float rotY = uMouse.x * 0.5;
    
    float cx = cos(rotX); float sx = sin(rotX);
    float cy = cos(rotY); float sy = sin(rotY);
    
    mat3 rotateX = mat3(1.0, 0.0, 0.0, 0.0, cx, -sx, 0.0, sx, cx);
    mat3 rotateY = mat3(cy, 0.0, sy, 0.0, 1.0, 0.0, -sy, 0.0, cy);
    
    pos = rotateY * rotateX * pos;

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 3. Size Attenuation
    gl_PointSize = aScale * uPixelRatio * (1.0 + noiseVal * 0.2); 
    gl_PointSize *= (1.0 / -mvPosition.z);

    // 4. Volumetric Coloring
    // Palette: Deep Purple -> Electric Violet/Blue
    vec3 deepPurple = vec3(0.2, 0.0, 0.4);   // Darker base
    vec3 electricViolet = vec3(0.6, 0.3, 1.0); // Bright violet
    vec3 mistWhite = vec3(0.9, 0.95, 1.0);   // Highlights
    
    // Mix colors based on position in the cloud
    float colorMix = smoothstep(-3.0, 3.0, pos.x + aRandomness.y);
    vec3 baseColor = mix(electricViolet, deepPurple, colorMix);
    
    // Add highlights based on noise (turbulence)
    float highlight = smoothstep(0.3, 0.8, noiseVal);
    vColor = mix(baseColor, mistWhite, highlight * 0.5);
    
    // 5. Alpha
    vAlpha = 0.05 + (highlight * 0.05); 
  }
`;

const nebulaFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float r = length(xy);
    if(r > 0.5) discard;
    
    float strength = pow(1.0 - (r * 2.0), 3.0);
    
    gl_FragColor = vec4(vColor, strength * vAlpha);
  }
`;

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

const NebulaLayer = ({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) => {
  const count = 200; 
  const mesh = useRef<THREE.Points>(null);
  
  const [positions, scales, randomness, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    const rnd = new Float32Array(count * 3);
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

        sca[i] = 100.0 + Math.random() * 150.0;
        rnd[i * 3] = Math.random();
        rnd[i * 3 + 1] = Math.random();
        rnd[i * 3 + 2] = Math.random();
        spd[i] = 0.5 + Math.random();
    }
    return [pos, sca, rnd, spd];
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
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aScale" count={count} array={scales} itemSize={1} />
        <bufferAttribute attach="attributes-aRandomness" count={count} array={randomness} itemSize={3} />
        <bufferAttribute attach="attributes-aSpeed" count={count} array={speeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={false}
        uniforms={uniforms}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        transparent={true}
      />
    </points>
  );
};

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
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-aScale" count={count} array={scales} itemSize={1} />
          <bufferAttribute attach="attributes-aSpeed" count={count} array={speeds} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={starsVertexShader}
          fragmentShader={starsFragmentShader}
          transparent={true}
        />
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
        <group position={[0, -0.5, 0]}>
            <NebulaLayer mouse={mouse} />
            <StarsLayer mouse={mouse} />
        </group>
    )
}

// --- MAIN HERO COMPONENT ---

interface HeroProps {
  onOpenVideo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenVideo }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen" />
             {/* Changed back to indigo/violet family to avoid red clash in hero background */}
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="text-left order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    >
                        <Sparkles className="w-3 h-3 text-violet-400 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-violet-100 uppercase">The Next Evolution of Livestreaming</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 tracking-tight"
                    >
                        Feel Your Audience. <br />
                        {/* Changed gradient to remove orange/red mixture, keeping it purple/white/cyan */}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-300 to-indigo-400 text-glow">
                            In Real-Time.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="font-body text-base md:text-lg text-gray-400 max-w-lg mb-10 leading-relaxed font-light"
                    >
                        STREAMYST transforms emotional reactions into physical sensations through XR wearable technology. Don't just read the chat—<span className="text-white font-medium">feel the room</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <button
                            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-8 py-3.5 bg-white text-cosmic-950 font-bold text-base rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] w-full sm:w-auto overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:translate-x-1 transition-transform">
                                Get Early Access <ChevronRight className="w-4 h-4" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        <button
                            onClick={onOpenVideo}
                            className="relative px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-base rounded-full transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto group backdrop-blur-sm"
                        >
                             <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20 group-hover:border-violet-400 transition-colors">
                                <span className="absolute w-full h-full rounded-full bg-violet-500/30 animate-ping opacity-0 group-hover:opacity-100" />
                                <Play className="w-2.5 h-2.5 fill-white relative z-10 ml-0.5" />
                             </div>
                            <span>Watch Demo</span>
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4, ease: "circOut" }}
                    className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    {/* ASSET CONTAINER */}
                    <div className="relative z-10 w-full max-w-[420px] lg:max-w-[640px] animate-float drop-shadow-[0_20px_60px_rgba(139,92,246,0.2)]">
                         
                         {/* 3D PARTICLE OVERLAY CANVAS */}
                         <div 
                             className="absolute inset-0 z-20 pointer-events-auto"
                             style={{
                                 maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                 WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                             }}
                         >
                            <Canvas
                                camera={{ position: [0, 0, 10], fov: 45 }}
                                gl={{ antialias: true, alpha: true }}
                                dpr={[1, 2]}
                            >
                                <HolographicField />
                            </Canvas>
                         </div>

                         {/* THE BASE IMAGE */}
                         <img 
                           src="https://raw.githubusercontent.com/cavanjuice/assets/main/DSC006262.png"
                           alt="Streamyst Wearable Tech"
                           className="relative z-10 w-full h-auto"
                           style={{
                               maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                               WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                           }}
                         />
                         
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
  );
};

export default Hero;
