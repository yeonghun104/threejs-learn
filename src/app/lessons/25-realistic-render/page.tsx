"use client";

import { useEffect, useRef } from "react";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// @ts-ignore
import CANNON from "cannon";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;
    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";

      const gui = new GUI();

      /**
       * Base
       */
      // Canvas
      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      // textureLoader
      const textureLoader = new THREE.TextureLoader();
      const environmentMap = textureLoader.load(
        "/environmentMaps/blockadesLabsSkybox/fantasy_lands_castles_at_night.jpg",
      );
      environmentMap.mapping = THREE.EquirectangularReflectionMapping;
      environmentMap.colorSpace = THREE.SRGBColorSpace;

      scene.background = environmentMap;
      scene.environment = environmentMap;
      scene.environmentIntensity = 1;
      scene.backgroundBlurriness = 0;
      scene.backgroundIntensity = 1;

      /**
       * Loaders
       */
      const gltfLoader = new GLTFLoader();

      gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
        gltf.scene.scale.set(10, 10, 10);
        scene.add(gltf.scene);
      });

      /**
       * Torus Knot
       */
      const torusKnot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
        new THREE.MeshStandardMaterial({
          roughness: 0.3,
          metalness: 1,
          color: 0xaaaaaa,
        }),
      );
      torusKnot.position.x = -4;
      torusKnot.position.y = 4;
      scene.add(torusKnot);

      /**
       * Sizes
       */
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100,
      );
      camera.position.set(4, 7, 15);
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // Tone mapping
      //   renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 3;

      gui.add(renderer, "toneMapping", {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
      });
      gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

      /**
       * Animate
       */
      const clock = new THREE.Clock();
      let oldElapsedTime = 0;

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();
    }
    main();

    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;
