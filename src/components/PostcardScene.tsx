"use client";

import {
  AccumulativeShadows,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { type FC, useEffect, useState } from "react";
import { DoubleSide, Texture, TextureLoader } from "three";

const POSTCARD_HEIGHT = 148; //mm
const POSTCARD_WIDTH = 105; //mm
const POSTCARD_ASPECT = POSTCARD_WIDTH / POSTCARD_HEIGHT;

const WIDTH = 2; // Width of one side
const THICKNESS = 0.005; // Simulated paper thickness

const PostcardScene: FC = () => {
  return (
    <Canvas shadows>
      <OrbitControls enableZoom={false} />
      <PerspectiveCamera makeDefault position={[5, 7, 12]} fov={20} />

      <color attach="background" args={["#f2e1c4"]} />

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

      <Card />
    </Canvas>
  );
};

export default PostcardScene;

const Card: FC = () => {
  const [material, setMaterial] = useState<Texture>();

  // Load the texture image
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("/cover.png", (loadedTexture) => {
      setMaterial(loadedTexture);
    });
  }, []);

  return (
    <group>
      {/* BACK */}
      <group position={[-WIDTH / 2, 0, 0]} rotation={[0, Math.PI / 8, 0]}>
        <mesh position={[WIDTH / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[WIDTH, WIDTH / POSTCARD_ASPECT, THICKNESS]} />
          <meshStandardMaterial color="white" side={DoubleSide} />
        </mesh>
      </group>

      {/* FRONT */}
      <group
        position={[-WIDTH / 2, 0, -THICKNESS / 8]}
        rotation={[0, -Math.PI / 8, 0]}
      >
        {/* THICKNESS */}
        <mesh position={[WIDTH / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[WIDTH, WIDTH / POSTCARD_ASPECT, THICKNESS]} />
          <meshStandardMaterial color="white" side={DoubleSide} />
        </mesh>
        {/* PLANE FOR IMAGE */}
        <mesh position={[WIDTH / 2, 0, 0.01]} receiveShadow>
          <planeGeometry args={[WIDTH, WIDTH / POSTCARD_ASPECT, 1]} />
          <meshStandardMaterial attach="material" map={material} />
        </mesh>
      </group>
    </group>
  );
};
