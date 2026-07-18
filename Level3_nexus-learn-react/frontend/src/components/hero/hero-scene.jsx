import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const PANEL_COLORS = ["#4f46e5", "#7c3aed", "#06b6d4"];

function GlassPanel({ position, size, color, rotationSpeed = 0.15 }) {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
      <RoundedBox ref={meshRef} args={size} radius={0.08} smoothness={4} position={position}>
        <meshPhysicalMaterial
          color={color}
          transmission={0.85}
          roughness={0.15}
          thickness={0.6}
          ior={1.3}
          transparent
          opacity={0.55}
          metalness={0.1}
        />
      </RoundedBox>
    </Float>
  );
}

/**
 * Tilts the whole cluster toward the cursor — capped at ±6° per the design
 * system (ARCHITECTURE.md §2.3: "subtle, ±6° max"), lerped so it feels like
 * weight rather than snapping.
 */
function CursorTiltGroup({ children }) {
  const groupRef = useRef(null);
  const { pointer } = useThree();
  const MAX_TILT = THREE.MathUtils.degToRad(6);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetX = pointer.y * MAX_TILT;
    const targetY = pointer.x * MAX_TILT;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.04
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.04
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#06b6d4" />

      <CursorTiltGroup>
        <GlassPanel position={[-1.4, 0.6, 0]} size={[1.8, 1.1, 0.15]} color={PANEL_COLORS[0]} />
        <GlassPanel
          position={[1.3, -0.3, -0.6]}
          size={[1.5, 1.5, 0.15]}
          color={PANEL_COLORS[1]}
          rotationSpeed={-0.1}
        />
        <GlassPanel
          position={[0, -1.1, 0.4]}
          size={[1.3, 0.9, 0.15]}
          color={PANEL_COLORS[2]}
          rotationSpeed={0.2}
        />
      </CursorTiltGroup>
    </Canvas>
  );
}
