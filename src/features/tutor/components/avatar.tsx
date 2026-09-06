"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ErrorBoundary } from "@/components/error-boundary";

/**
 * Finora avatari — hozircha parametrik "bosh + tana". GLB model qo'shilsa
 * (public/avatar.glb), Model komponentini useGLTF bilan almashtirish kifoya.
 */
function Model({ isSpeaking }: { isSpeaking: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    if (isSpeaking) {
      group.current.rotation.y = Math.sin(t * 3) * 0.12;
      group.current.position.y = Math.sin(t * 8) * 0.04;
      if (mouth.current) mouth.current.scale.y = 1 + Math.abs(Math.sin(t * 14)) * 2.2;
    } else {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t * 0.6) * 0.05, 0.08);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.1);
      if (mouth.current) mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, 0.25, 0.15);
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 48, 48]} />
        <meshStandardMaterial color="#163e32" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[-0.18, 1.6, 0.44]}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.18, 1.6, 0.44]}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh ref={mouth} position={[0, 1.32, 0.47]} scale={[1, 0.25, 1]}>
        <boxGeometry args={[0.2, 0.05, 0.04]} />
        <meshStandardMaterial color="#0b1a13" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.5, 32]} />
        <meshStandardMaterial color="#dce7dd" roughness={0.8} />
      </mesh>
    </group>
  );
}

function AvatarFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="grid size-20 place-items-center rounded-full bg-[#163e32] text-3xl text-white">🎓</span>
    </div>
  );
}

export function AvatarViewer({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#f3f1eb] to-[#e2e4df] relative shadow-inner">
      <ErrorBoundary fallback={<AvatarFallback />}>
        <Canvas camera={{ position: [0, 1.6, 3.6], fov: 40 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[-4, 6, 5]} intensity={1.4} />
          <pointLight position={[4, 2, 2]} intensity={0.6} color="#4a9e72" />
          <Model isSpeaking={isSpeaking} />
          <ContactShadows position={[0, -0.25, 0]} opacity={0.4} scale={8} blur={2.5} far={4} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 2}
            target={[0, 1, 0]}
          />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
