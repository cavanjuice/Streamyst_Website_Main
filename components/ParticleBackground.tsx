
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
  const { mouse } = useThree();
  const count = 600; 
  
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const [positions, scales, randomness] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randomness = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Broad distribution
      positions[i3] = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;

      scales[i] = Math.random();
      
      randomness[i3] = Math.random();
      randomness[i3 + 1] = Math.random();
      randomness[i3 + 2] = Math.random();
    }
    
    return [positions, scales, randomness];
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#F97316') }, // Orange
    uColor2: { value: new THREE.Color('#8B5CF6') }, // Violet
    uColor3: { value: new THREE.Color('#EC4899') }, // Pink
    uMouse: { value: new THREE.Vector2(0, 0) },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 180.0 }
  }), []);

  useFrame((state) => {
    const { clock } = state;
    
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      // Smooth lerp for mouse interaction
      shaderRef.current.uniforms.uMouse.value.lerp(mouse, 0.05);
    }
    
    // Slow rotation of the galaxy
    if (pointsRef.current) {
        pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
        pointsRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.02;
    }
  });

  return (
    // @ts-ignore
    <points ref={pointsRef}>
      {/* @ts-ignore */}
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-aScale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-aRandomness"
          count={randomness.length / 3}
          array={randomness}
          itemSize={3}
        />
      {/* @ts-ignore */}
      </bufferGeometry>
      {/* @ts-ignore */}
      <shaderMaterial
        ref={shaderRef}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uPixelRatio;
          uniform float uSize;
          uniform vec2 uMouse;
          
          attribute float aScale;
          attribute vec3 aRandomness;
          
          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            // Floating animation
            float time = uTime * 0.3;
            float xOffset = sin(time + aRandomness.x * 5.0) * 0.3;
            float yOffset = cos(time * 0.7 + aRandomness.y * 5.0) * 0.3;
            
            modelPosition.x += xOffset;
            modelPosition.y += yOffset;
            
            // Mouse Interaction: Repel
            vec2 mouseWorld = uMouse * vec2(10.0, 6.0); 
            float dist = distance(modelPosition.xy, mouseWorld);
            float influence = smoothstep(4.0, 0.0, dist);
            vec3 dir = normalize(modelPosition.xyz - vec3(mouseWorld, 0.0));
            modelPosition.xyz += dir * influence * 2.0;

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            
            // Size attenuation
            gl_PointSize = uSize * aScale * uPixelRatio;
            gl_PointSize *= (1.0 / -viewPosition.z);
            
            // Color variation
            // Map randomness to a 0-1 gradient factor
            vColor = vec3(aRandomness.x); 
            
            // Fade particles at edges/depth
            vAlpha = smoothstep(20.0, 5.0, -viewPosition.z);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            // Soft glow particle
            float d = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.05 / d - 0.1;
            strength = clamp(strength, 0.0, 1.0);
            
            // Add a harder core
            strength += smoothstep(0.1, 0.0, d) * 0.5;

            // Color gradient mixing
            vec3 color = mix(uColor1, uColor2, vColor.x);
            // Occasionally add pink
            color = mix(color, uColor3, smoothstep(0.7, 1.0, vColor.y));

            gl_FragColor = vec4(color, strength * vAlpha);
          }
        `}
      />
    {/* @ts-ignore */}
    </points>
  );
};

const ParticleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
