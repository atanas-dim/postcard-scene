"use client";

import {
  AccumulativeShadows,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { DoubleSide } from "three";
import type * as THREE from "three";

const POSTCARD_HEIGHT = 148; //mm
const POSTCARD_WIDTH = 105; //mm
const POSTCARD_ASPECT = POSTCARD_WIDTH / POSTCARD_HEIGHT;

const WIDTH = 2; // Width of one side
const THICKNESS = 0.01; // Simulated paper thickness

const PostcardScene = () => {
  return (
    <Canvas shadows>
      <OrbitControls enableZoom={false} />
      <PerspectiveCamera makeDefault position={[5, 7, 12]} fov={20} />

      <color attach="background" args={["#f2e6c4"]} />

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
        position={[0, -2, 0]}
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

      {/* BACK */}
      <group position={[-WIDTH / 2, 0, 0]} rotation={[0, Math.PI / 8, 0]}>
        <mesh position={[WIDTH / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[WIDTH, WIDTH / POSTCARD_ASPECT, THICKNESS]} />
          <meshStandardMaterial color="white" side={DoubleSide} />
        </mesh>
      </group>

      {/* FRONT */}
      <group
        position={[-WIDTH / 2, 0, THICKNESS]}
        rotation={[0, -Math.PI / 8, 0]}
      >
        <mesh position={[WIDTH / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[WIDTH, WIDTH / POSTCARD_ASPECT, THICKNESS]} />
          <meshStandardMaterial color="white" side={DoubleSide} />
        </mesh>
      </group>
    </Canvas>
  );
};

export default PostcardScene;
