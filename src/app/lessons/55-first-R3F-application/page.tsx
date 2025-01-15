"use client";

import "./style.css";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import * as THREE from "three";

function Page() {
  return (
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        // outputColorSpace: THREE.SRGBColorSpace
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [3, 2, 6],
      }}
    >
      <Experience />
    </Canvas>
  );
}

export default Page;
