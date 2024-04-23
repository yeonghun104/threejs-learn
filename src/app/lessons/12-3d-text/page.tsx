/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";

      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      // scene.add(ambientLight);

      // const pointLight = new THREE.PointLight(0xffffff, 30);
      // pointLight.position.set(2, 3, 4);
      // scene.add(pointLight);

      const fontLoader = new FontLoader();
      const matcapTexture = fontLoader.load(
        new URL("./font/Nanum GangInHanWiRo_Regular.json", import.meta.url)
          .href,
        (font) => {
          const textGeometry = new TextGeometry("지금부터는 제가", {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
          });
          const textMaterial = new THREE.MeshBasicMaterial({
            wireframe: false,
          });
          const text = new THREE.Mesh(textGeometry, textMaterial);
          scene.add(text);
        },
      );

      // for (let i = 0; i < 100; i++) {
      //   const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
      //   const donutMaterial = new THREE.MeshMatcapMaterial({
      //     matcap: matcapTexture,
      //   });
      //   const donut = new THREE.Mesh(donutGeometry, donutMaterial);
      //   scene.add(donut);
      // }

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
      camera.position.x = 1;
      camera.position.y = 1;
      camera.position.z = 2;
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

        // sphere.rotation.y = elapsedTime * 0.1;
        // plane.rotation.y = elapsedTime * 0.1;
        // torus.rotation.y = elapsedTime * 0.1;

        // sphere.rotation.x = elapsedTime * -0.15;
        // plane.rotation.x = elapsedTime * -0.15;

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
