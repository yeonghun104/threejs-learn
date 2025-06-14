/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

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

      /**
       * Lights
       */
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      const ambientLightGui = gui.addFolder("ambientLight");
      ambientLightGui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
      scene.add(ambientLight);

      // Directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
      directionalLight.position.set(2, 2, -1);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = Infinity;
      directionalLight.shadow.mapSize.height = Infinity;
      directionalLight.shadow.camera.near = 1;
      directionalLight.shadow.camera.far = 4;
      directionalLight.shadow.camera.top = 2;
      directionalLight.shadow.camera.right = 2;
      directionalLight.shadow.camera.bottom = -2;
      directionalLight.shadow.camera.left = -2;
      directionalLight.shadow.radius = 10;
      directionalLight.color.set("green");

      const directionalLightGui = gui.addFolder("directionalLight");
      directionalLightGui
        .add(directionalLight, "intensity")
        .min(0)
        .max(3)
        .step(0.001);
      directionalLightGui
        .add(directionalLight.position, "x")
        .min(-5)
        .max(5)
        .step(0.001);
      directionalLightGui
        .add(directionalLight.position, "y")
        .min(-5)
        .max(5)
        .step(0.001);
      directionalLightGui
        .add(directionalLight.position, "z")
        .min(-5)
        .max(5)
        .step(0.001);

      scene.add(directionalLight);

      const directionalLightCameraHelper = new THREE.CameraHelper(
        directionalLight.shadow.camera,
      );
      directionalLightCameraHelper.visible = false;
      scene.add(directionalLightCameraHelper);

      // Spot light
      const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
      spotLight.castShadow = true;
      spotLight.position.set(0, 2, 2);
      spotLight.shadow.mapSize.width = Infinity;
      spotLight.shadow.mapSize.height = Infinity;
      spotLight.shadow.camera.near = 1;
      spotLight.shadow.camera.far = 6;
      spotLight.color.set("blue");
      scene.add(spotLight);
      scene.add(spotLight.target);

      const spotLightCameraHelper = new THREE.CameraHelper(
        spotLight.shadow.camera,
      );
      scene.add(spotLightCameraHelper);
      spotLightCameraHelper.visible = false;

      // Point light
      const pointLight = new THREE.PointLight(0xffffff, 2.7);
      pointLight.castShadow = true;
      pointLight.shadow.mapSize.width = 1024;
      pointLight.shadow.mapSize.height = 1024;
      pointLight.shadow.camera.near = 1;
      pointLight.shadow.camera.far = 10;
      pointLight.position.set(-1, 1, 0);
      pointLight.color.set("red");
      scene.add(pointLight);

      const pointLightCameraHelper = new THREE.CameraHelper(
        pointLight.shadow.camera,
      );
      scene.add(pointLightCameraHelper);
      pointLightCameraHelper.visible = false;

      /**
       * Materials
       */
      const material = new THREE.MeshStandardMaterial();
      material.roughness = 0.7;
      const materialGui = gui.addFolder("material");
      materialGui.add(material, "metalness").min(0).max(1).step(0.001);
      materialGui.add(material, "roughness").min(0).max(1).step(0.001);

      /**
       * Objects
       */
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        material,
      );
      sphere.castShadow = true;

      /**
       * Textures
       */
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
      plane.rotation.x = -Math.PI * 0.5;
      plane.position.y = -0.5;
      plane.receiveShadow = true;

      const textureLoader = new THREE.TextureLoader();
      const simpleShadow = textureLoader.load(
        new URL("./static/textures/simpleShadow.jpg", import.meta.url).href,
      );
      const sphereShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1.5),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          alphaMap: simpleShadow,
        }),
      );
      sphereShadow.rotation.x = -Math.PI * 0.5;
      sphereShadow.position.y = plane.position.y + 0.01;

      scene.add(sphere, sphereShadow, plane);

      scene.add(sphere, sphereShadow, plane);

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
      const controls = new OrbitControls(camera, canvas as HTMLElement);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = false;
      renderer.shadowMap.type = THREE.VSMShadowMap;

      /**
       * Animate
       */
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Update the sphere
        sphere.position.x = Math.cos(elapsedTime) * 1.5;
        sphere.position.z = Math.sin(elapsedTime) * 1.5;
        sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

        // Update the shadow
        sphereShadow.position.x = sphere.position.x;
        sphereShadow.position.z = sphere.position.z;
        sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

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
