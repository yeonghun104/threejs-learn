/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

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
      // Debug
      const gui = new GUI();

      // Canvas
      const canvas = el.current;

      // Scene
      const scene = new THREE.Scene();

      const parameters = {
        count: 100000,
        size: 0.02,
        radius: 5,
        branches: 2,
        spin: 2,
        randomness: 0.8,
        randomnessPower: 0.05,
        insideColor: "#ff6030",
        outsideColor: "#1b3984",
      };

      let geometry: THREE.BufferGeometry | null = null;
      let material: THREE.PointsMaterial | null = null;
      let points: THREE.Points | null = null;

      const generateGalaxy = () => {
        // Destroy old galaxy
        if (geometry !== null && material !== null && points !== null) {
          geometry.dispose();
          material.dispose();
          scene.remove(points);
        }

        /**
         * Geometry
         */
        geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        for (let i = 0; i < parameters.count; i++) {
          const i3 = i * 3;

          const radius = Math.random() * parameters.radius;

          const spinAngle = radius * parameters.spin;
          const branchAngle =
            ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

          const randomX =
            Math.random() ** parameters.randomnessPower *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;
          const randomY =
            Math.random() ** parameters.randomnessPower *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;
          const randomZ =
            Math.random() ** parameters.randomnessPower *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;

          positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
          positions[i3 + 1] = randomY;
          positions[i3 + 2] =
            Math.sin(branchAngle + spinAngle) * radius + randomZ;

          const mixedColor = colorInside.clone();
          mixedColor.lerp(colorOutside, radius / parameters.radius);
          colors[i3] = mixedColor.r;
          colors[i3 + 1] = mixedColor.g;
          colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        /**
         * Material
         */
        material = new THREE.PointsMaterial({
          size: parameters.size,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true,
        });

        /**
         * Points
         */
        points = new THREE.Points(geometry, material);
        scene.add(points);
      };

      gui
        .add(parameters, "count")
        .min(100)
        .max(1000000)
        .step(100)
        .onFinishChange(generateGalaxy);
      gui
        .add(parameters, "size")
        .min(0.001)
        .max(0.1)
        .step(0.001)
        .onFinishChange(generateGalaxy);
      gui
        .add(parameters, "radius")
        .min(0.01)
        .max(20)
        .step(0.01)
        .onFinishChange(generateGalaxy);
      gui
        .add(parameters, "branches")
        .min(2)
        .max(20)
        .step(1)
        .onFinishChange(generateGalaxy);
      gui
        .add(parameters, "spin")
        .min(-5)
        .max(5)
        .step(0.001)
        .onFinishChange(generateGalaxy);
      gui
        .add(parameters, "randomness")
        .min(0)
        .max(2)
        .step(0.001)
        .onFinishChange(generateGalaxy);
      gui
        .add(parameters, "randomnessPower")
        .min(1)
        .max(10)
        .step(0.001)
        .onFinishChange(generateGalaxy);
      gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
      gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

      generateGalaxy();

      // /**
      //  * Test cube
      //  */
      // const cube = new THREE.Mesh(
      //   new THREE.BoxGeometry(1, 1, 1),
      //   new THREE.MeshBasicMaterial(),
      // );
      // scene.add(cube);

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
      camera.position.x = 3;
      camera.position.y = 3;
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
        points?.rotateY(0.001);
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
