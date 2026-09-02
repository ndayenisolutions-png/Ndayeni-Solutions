"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sphere,
  Torus,
  Octahedron,
  Icosahedron,
  TorusKnot,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

/* Detect mobile once on mount to tune particle/shape counts */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function FloatingShape({
  position,
  color,
  shape,
  speed = 1,
  scale = 1,
  emissiveIntensity = 0.18,
  opacity = 0.2,
}: {
  position: [number, number, number];
  color: string;
  shape: "torus" | "octahedron" | "icosahedron" | "knot";
  speed?: number;
  scale?: number;
  emissiveIntensity?: number;
  opacity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.x = Math.sin(t * speed * 0.3) * 0.35;
      meshRef.current.rotation.y = t * speed * 0.18;
      meshRef.current.rotation.z += 0.0025 * speed;
    }
  });

  const ShapeComponent = {
    torus: Torus,
    octahedron: Octahedron,
    icosahedron: Icosahedron,
    knot: TorusKnot,
  }[shape];

  return (
    <Float speed={speed * 1.1} rotationIntensity={0.35} floatIntensity={1.1}>
      <ShapeComponent
        ref={meshRef}
        position={position}
        scale={scale}
        args={
          shape === "torus"
            ? [1, 0.32, 24, 64]
            : shape === "knot"
            ? [0.7, 0.24, 128, 24]
            : [1, 0]
        }
      >
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
          distort={0.18}
          speed={1.6}
          roughness={0.3}
          metalness={0.5}
        />
      </ShapeComponent>
    </Float>
  );
}

function CoreGlow({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const s = scale + Math.sin(state.clock.elapsedTime * 1) * 0.05;
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[1, 32, 32]} scale={scale}>
      <MeshWobbleMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        transparent
        opacity={0.08}
        factor={0.3}
        speed={0.9}
        roughness={0.1}
        metalness={0.7}
      />
    </Sphere>
  );
}

function Particles({ count = 55 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      const t = state.clock.elapsedTime;
      points.current.rotation.y = Math.sin(t * 0.05) * 0.12;
      points.current.rotation.x = Math.sin(t * 0.03) * 0.06;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#7fdfff"
        transparent
        opacity={0.22}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 5]} intensity={0.55} color="#4fb0ff" />
      <pointLight position={[-7, -3, 4]} intensity={0.7} color="#2dd4bf" />
      <pointLight position={[0, 7, -3]} intensity={0.55} color="#1e90ff" />
      {!isMobile && <pointLight position={[7, 3, 3]} intensity={0.4} color="#7fdfff" />}

      {/* Hero centerpiece: torus knot on the RIGHT (desktop only for perf) */}
      {!isMobile && (
        <FloatingShape
          position={[5.4, 0.4, -2]}
          color="#1e90ff"
          shape="knot"
          speed={0.35}
          scale={0.95}
          emissiveIntensity={0.22}
          opacity={0.2}
        />
      )}

      {/* Left side cluster */}
      <FloatingShape
        position={[-5.2, 1.6, -1]}
        color="#2dd4bf"
        shape="icosahedron"
        speed={0.4}
        scale={isMobile ? 0.7 : 0.95}
        emissiveIntensity={0.16}
        opacity={0.18}
      />
      <FloatingShape
        position={[-5, -1.8, -2]}
        color="#4fb0ff"
        shape="torus"
        speed={0.5}
        scale={isMobile ? 0.6 : 0.8}
        emissiveIntensity={0.16}
        opacity={0.16}
      />

      {/* Right side accents */}
      <FloatingShape
        position={[4.2, 2.6, -3]}
        color="#2dd4bf"
        shape="octahedron"
        speed={0.4}
        scale={isMobile ? 0.45 : 0.55}
        emissiveIntensity={0.14}
        opacity={0.16}
      />
      <FloatingShape
        position={[5.8, -1.8, -1.5]}
        color="#4fb0ff"
        shape="icosahedron"
        speed={0.38}
        scale={isMobile ? 0.5 : 0.7}
        emissiveIntensity={0.14}
        opacity={0.16}
      />

      {/* Top center floating accent (desktop only) */}
      {!isMobile && (
        <FloatingShape
          position={[0, 3.4, -3]}
          color="#1e90ff"
          shape="torus"
          speed={0.3}
          scale={0.55}
          emissiveIntensity={0.12}
          opacity={0.14}
        />
      )}

      {/* Soft atmospheric glow spheres */}
      <CoreGlow position={[-3, 0.5, -5]} color="#1e90ff" scale={2.2} />
      {!isMobile && <CoreGlow position={[3.5, -0.5, -6]} color="#2dd4bf" scale={1.8} />}

      {/* Sparkles — very sparse, faint (desktop only for perf) */}
      {!isMobile && (
        <Sparkles
          count={22}
          scale={[16, 9, 4]}
          size={1.5}
          speed={0.2}
          opacity={0.18}
          color="#7fdfff"
        />
      )}

      <Particles count={isMobile ? 30 : 55} />
    </>
  );
}

export default function HeroScene() {
  const isMobile = useIsMobile();

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={isMobile ? [1, 1] : [1, 1.8]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <SceneContent isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
