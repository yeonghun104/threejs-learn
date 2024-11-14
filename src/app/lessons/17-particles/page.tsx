/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ParticalSource from "./static/textures/particles/1.png";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  /**
   * House
   */

  useEffect(() => {
    let requestId: number;

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";

      /**
       * Base
       */
      // Canvas
      const canvas = el.current;

      // Scene
      const scene = new THREE.Scene();

      /**
       * Textures
       */
      const textureLoader = new THREE.TextureLoader();
      const particleTexture = textureLoader.load(ParticalSource.src);

      /**
       * Particles
       */
      // Geometry
      const particlesGeometry = new THREE.BufferGeometry();
      const count = 1000;
      const arrayCount = count * 3;

      const positions = Float32Array.from(
        Array(arrayCount)
          .fill(0)
          .map((_) => (Math.random() - 0.5) * 10),
      );
      const colors = Float32Array.from(
        Array(arrayCount)
          .fill(0)
          .map((_) => Math.random()),
      );

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      particlesGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3),
      );

      // Material
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        // color: "#ff00ff",
        alphaMap: particleTexture,
        transparent: true,
        // alphaTest: 0.001,
        // depthTest: false,
        depthWrite: false,
        // blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      // Points
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

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
      camera.position.z = 3;
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /**
       * Animate
       */
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Update particles
        particles.rotation.x = elapsedTime;
        particles.rotation.y = elapsedTime;
        particles.rotation.z = elapsedTime;

        for (let i = 0; i < count; i++) {
          const xIndex = i * 3;
          const yIndex = i * 3 + 1;
          const zIndex = i * 3 + 2;
          const x = particlesGeometry.attributes.position.array[xIndex];
          const y = particlesGeometry.attributes.position.array[yIndex];
          const z = particlesGeometry.attributes.position.array[zIndex];

          // particlesGeometry.attributes.position.array[xIndex] = Math.sin(
          //   elapsedTime + x,
          // );
          particlesGeometry.attributes.position.array[xIndex] =
            particlesGeometry.attributes.position.array[xIndex] +
            Math.random() -
            0.5;
          particlesGeometry.attributes.position.array[yIndex] =
            particlesGeometry.attributes.position.array[yIndex] +
            Math.random() -
            0.5;
          particlesGeometry.attributes.position.array[zIndex] =
            particlesGeometry.attributes.position.array[zIndex] +
            Math.random() -
            0.5;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

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
