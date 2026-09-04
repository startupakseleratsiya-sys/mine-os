"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// 3D Avatar (Kalra/Finora) Modelini yuklash
// Hozircha 'avatar.glb' fayli yo'q bo'lgani uchun, xatolik bermaslik uchun vaqtincha kubik chizamiz.
// Siz ReadyPlayerMe dan yoki maxsus 3D dizaynerdan modelni olib public/avatar.glb qilib joylaysiz.

function Model({ isSpeaking }: { isSpeaking: boolean }) {
  const group = useRef<THREE.Group>(null);
  
  // Agar avatar.glb public papkada bo'lsa, pastdagi kodni ochamiz:
  // const { scene, animations } = useGLTF("/avatar.glb");
  
  // Oddiy animasiya (mikrofon gapirganda qimirlaydi)
  useFrame((state, delta) => {
    if (group.current) {
      if (isSpeaking) {
        group.current.rotation.y = Math.sin(state.clock.elapsedTime * 5) * 0.1;
        group.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.05;
      } else {
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, 0.1);
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.1);
      }
    }
  });

  return (
    <group ref={group}>
      {/* Vaqtincha robot/bosh o'rniga yashil sfera */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial color="#163e32" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Ko'zlar */}
      <mesh position={[-0.2, 1.6, 0.45]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.2, 1.6, 0.45]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      
      {/* Og'iz (gapirganda kattalashadi) */}
      <mesh position={[0, 1.3, 0.48]} scale={[1, isSpeaking ? 2 : 0.2, 1]}>
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* Tana */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.5, 32]} />
        <meshStandardMaterial color="#dce7dd" />
      </mesh>
    </group>
  );
}

export function AvatarViewer({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#f3f1eb] to-[#e2e4df] relative shadow-inner">
      <Canvas camera={{ position: [0, 2, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[-5, 5, 5]} intensity={1} castShadow />
        
        <Model isSpeaking={isSpeaking} />
        
        <Environment preset="city" />
        <ContactShadows position={[0, -0.25, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
