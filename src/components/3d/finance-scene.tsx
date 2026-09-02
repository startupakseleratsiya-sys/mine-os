"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

/* ── Floating gold coin ── */
function Coin() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.5}>
      <group>
        {/* Main coin body */}
        <mesh ref={meshRef} castShadow>
          <cylinderGeometry args={[1.8, 1.8, 0.22, 80]} />
          <meshStandardMaterial
            color="#c8952a"
            metalness={0.95}
            roughness={0.08}
            envMapIntensity={2.5}
          />
        </mesh>

        {/* Inner emboss ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, 0.04, 16, 80]} />
          <meshStandardMaterial
            color="#daa520"
            metalness={1}
            roughness={0.05}
          />
        </mesh>

        {/* Dollar sign — 3D text substitute using torus */}
        <mesh position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.06, 16, 40, Math.PI * 1.5]} />
          <meshStandardMaterial
            color="#a07010"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Coin edge serrations */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * 1.82,
                0,
                Math.sin(angle) * 1.82,
              ]}
              rotation={[0, angle, 0]}
            >
              <boxGeometry args={[0.04, 0.24, 0.04]} />
              <meshStandardMaterial
                color="#b8820a"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

/* ── Orbiting rings ── */
function OrbitRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) ring1.current.rotation.z = t * 0.3;
    if (ring2.current) ring2.current.rotation.z = -t * 0.2;
    if (ring3.current) ring3.current.rotation.x = t * 0.15;
  });

  return (
    <group>
      <mesh ref={ring1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#4a9e72"
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshStandardMaterial
          color="#2a5e47"
          metalness={0.5}
          roughness={0.4}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 2, Math.PI / 6, 0]}>
        <torusGeometry args={[4.2, 0.008, 16, 100]} />
        <meshStandardMaterial
          color="#163e32"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

/* ── Floating particles (small spheres) ── */
function Particles({ count = 60 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 5,
        ] as [number, number, number],
        size: Math.random() * 0.045 + 0.01,
        speed: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.6 ? "#4a9e72" : Math.random() > 0.5 ? "#c8952a" : "#dce7dd",
        opacity: Math.random() * 0.6 + 0.2,
      })),
    [count]
  );

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const t = state.clock.getElapsedTime() * particles[i].speed;
      child.position.y += Math.sin(t + i) * 0.003;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={p.color}
            transparent
            opacity={p.opacity}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Floating mini coins (dollar signs) ── */
function MiniCoins() {
  const refs = useRef<THREE.Mesh[]>([]);

  const coins = useMemo(
    () =>
      [
        { pos: [-3.5, 1.5, -1] as [number, number, number], scale: 0.45, speed: 0.7 },
        { pos: [3.2, -1.2, -0.5] as [number, number, number], scale: 0.35, speed: 0.9 },
        { pos: [-2.5, -2, 0.5] as [number, number, number], scale: 0.3, speed: 0.5 },
        { pos: [2.8, 2.2, -1] as [number, number, number], scale: 0.25, speed: 1.1 },
      ],
    []
  );

  useFrame((state) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = state.clock.getElapsedTime();
      mesh.rotation.y = t * coins[i].speed;
      mesh.position.y = coins[i].pos[1] + Math.sin(t * coins[i].speed + i) * 0.2;
    });
  });

  return (
    <>
      {coins.map((coin, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
          position={coin.pos}
          scale={coin.scale}
        >
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial
            color="#c8952a"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </>
  );
}

/* ── Glass sphere ── */
function GlassSphere() {
  return (
    <mesh position={[0, 0, -0.5]}>
      <sphereGeometry args={[2.4, 64, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.5}
        roughness={0.05}
        transmission={1}
        ior={1.5}
        color="#dce7dd"
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

/* ── Scene fallback ── */
function SceneFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative">
        <div className="size-32 rounded-full border-2 border-[#163e32]/20 animate-spin-slow" />
        <div className="absolute inset-4 rounded-full border-2 border-[#4a9e72]/30 animate-spin-reverse" />
        <span className="absolute inset-0 flex items-center justify-center text-4xl">
          💰
        </span>
      </div>
    </div>
  );
}

/* ── Main exported component ── */
export function FinanceScene({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[-4, -4, 3]} intensity={1.5} color="#4a9e72" />
          <pointLight position={[4, 4, -3]} intensity={1} color="#c8952a" />

          <GlassSphere />
          <Coin />
          <OrbitRings />
          <MiniCoins />
          <Particles count={50} />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
