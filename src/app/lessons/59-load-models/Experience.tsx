import {
  ContactShadows,
  OrbitControls,
  Sky,
  useHelper,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import { useControls } from "leva";
import Hamburger from "@/app/lessons/59-load-models/Hamburger";
import Fox from "@/app/lessons/59-load-models/Fox";

export default function Experience() {
  const directionalLight = useRef<any>();

  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  return (
    <>
      <Sky sunPosition={sunPosition} />
      <ContactShadows
        color="1d8f75"
        opacity={0.4}
        blur={2.8}
        far={5}
        resolution={512}
        scale={10}
        position={[0, -0.99, 0]}
        frames={1}
      />
      <color args={["ivory"]} attach="background" />

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
        castShadow
        ref={directionalLight}
        position={[1, 2, 3]}
        intensity={4.5}
      />
      <ambientLight intensity={1.5} />
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      {/*<Suspense*/}
      {/*  fallback={*/}
      {/*    <mesh position-y={0.5} scale={[2, 3, 2]}>*/}
      {/*      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />*/}
      {/*      <meshBasicMaterial wireframe color="red" />*/}
      {/*    </mesh>*/}
      {/*  }*/}
      {/*>*/}
      {/*  <Hamburger />*/}
      {/*</Suspense>*/}
      <Suspense
        fallback={
          <mesh position-y={0.5} scale={[2, 3, 2]}>
            <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
            <meshBasicMaterial wireframe color="red" />
          </mesh>
        }
      >
        <Fox />
      </Suspense>
    </>
  );
}
