"use client";

import {
  AccumulativeShadows,
  Backdrop,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { type FC, useEffect, useRef } from "react";
import { DoubleSide } from "three";
import * as THREE from "three";

const POSTCARD_HEIGHT = 148; //mm
const POSTCARD_WIDTH = 105; //mm
const POSTCARD_ASPECT = POSTCARD_WIDTH / POSTCARD_HEIGHT;

const WIDTH = 2; // Width of one side
const THICKNESS = 0.005; // Simulated paper thickness

const PostcardScene: FC = () => {
  return (
    <Canvas shadows>
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
      />
      <PerspectiveCamera makeDefault position={[2, 3, 12]} fov={20} />
      <Rig />

      <ambientLight intensity={3} />
      <pointLight
        position={[-1, 2, 3]}
        castShadow
        intensity={40}
        rotation={[Math.PI / 2, 0, 0]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <AccumulativeShadows
        temporal
        frames={60}
        color="black"
        opacity={0.8}
        blend={10}
        position={[0, -1.4, 0]}
        scale={12}
      >
        <RandomizedLight
          amount={5}
          radius={2}
          intensity={4}
          position={[-5, 8, 10]}
          // bias={-0.0001}
          // mapSize={1024}
        />
      </AccumulativeShadows>

      {/* <Backdrop
        floor={40} // Stretches the floor segment, 0.25 by default
        segments={20} // Mesh-resolution, 20 by default
        receiveShadow
        scale={20} // Scales the backdrop, 1 by default
        position={[0, -1.4, -5]} // Position of the backdrop
      >
        <meshStandardMaterial color="#f2e1c4" />
      </Backdrop> */}

      <Card />
    </Canvas>
  );
};

export default PostcardScene;

const Card: FC = () => {
  const texture = useTexture("/cover.png");

  const frontGroupRef = useRef<THREE.Group>(null);
  const backGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!texture) return;

    if (!frontGroupRef.current || !backGroupRef.current) return;

    gsap.to(backGroupRef.current.rotation, {
      x: 0,
      y: Math.PI / 8,
      z: 0,
      duration: 1,
    });

    gsap.to(frontGroupRef.current.rotation, {
      x: 0,
      y: -Math.PI / 8,
      z: 0,
      duration: 1,
    });
  }, [texture]);

  if (!texture) return null;

  return (
    <group>
      {/* BACK */}
      <group
        ref={backGroupRef}
        position={[-WIDTH / 2, 0, 0]}
        // rotation={[0, Math.PI / 8, 0]}
      >
        <mesh position={[WIDTH / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[WIDTH, WIDTH / POSTCARD_ASPECT, THICKNESS]} />
          <meshStandardMaterial color="white" side={DoubleSide} />
        </mesh>
      </group>

      {/* FRONT */}
      <group
        ref={frontGroupRef}
        position={[-WIDTH / 2, 0, -THICKNESS / 8]}
        // rotation={[0, -Math.PI / 8, 0]}
      >
        {/* THICKNESS */}
        <mesh position={[WIDTH / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[WIDTH, WIDTH / POSTCARD_ASPECT, THICKNESS]} />
          <meshStandardMaterial color="white" side={DoubleSide} />
        </mesh>
        {/* PLANE FOR IMAGE */}
        <mesh position={[WIDTH / 2, 0, 0.01]} receiveShadow>
          <planeGeometry args={[WIDTH, WIDTH / POSTCARD_ASPECT, 1]} />
          <meshStandardMaterial attach="material" map={texture} />
        </mesh>
      </group>
    </group>
  );
};

const Rig: FC = () => {
  useFrame((state) => {
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    const x = !!pointerX ? Math.sin(-pointerX) * 4 : 2;
    const y = !!pointerY ? pointerY * 4 : 3;
    const z = !!pointerX ? 6 + Math.cos(pointerX) * 6 : 12;

    gsap.to(state.camera.position, {
      x,
      y,
      z,
      duration: 0.2,
      ease: "power2.out",
    });
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};
