/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GUI from "lil-gui";
import "./style.css";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  /**
   * Scroll
   */
  let scrollY = window.scrollY;

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";
    // Scene
    const scene = new THREE.Scene();

    const gui = new GUI();

    const parameters = {
      materialColor: "#ffeded",
    };

    gui.addColor(parameters, "materialColor").onChange(() => {
      material.color.set(parameters.materialColor);
    });

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
      35,
      sizes.width / sizes.height,
      0.1,
      100,
    );
    camera.position.z = 6;
    scene.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setClearAlpha(0);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Objects
     */
    // Texture
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load(
      new URL("./static/textures/gradients/3.jpg", import.meta.url).href,
    );
    gradientTexture.magFilter = THREE.NearestFilter;

    // Material
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture,
    });

    // Meshes
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material,
    );
    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material,
    );
    const sectionMeshes = [mesh1, mesh2, mesh3];

    const objectsDistance = 4;

    mesh1.position.y = -objectsDistance * 0;
    mesh2.position.y = -objectsDistance * 1;
    mesh3.position.y = -objectsDistance * 2;

    scene.add(mesh1, mesh2, mesh3);

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let requestId = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Animate camera
      camera.position.y = scrollY;

      // Animate meshes
      for (const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1;
        mesh.rotation.y = elapsedTime * 0.12;
      }

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      requestId = window.requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  useEffect(() => {
    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;

      console.log(scrollY);
    });
  }, []);

  return (
    <>
      <canvas className="webgl" style={{ display: "block" }} ref={el}></canvas>
      <section className="section">
        <h1>My Portfolio</h1>
      </section>
      <section className="section">
        <h2>My projects</h2>
      </section>
      <section className="section">
        <h2>Contact me</h2>
      </section>
    </>
  );
}

export default Page;
