"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const Page = () => {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) return;
    el.current.innerHTML = "";

    // Scene
    const scene = new THREE.Scene();

    // Object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Sizes
    const sizes = {
      width: 800,
      height: 600,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    /**
     * Animate
     */
    // const clock = new THREE.Clock();
    // const tick = () => {
    //   const elapsedTime = clock.getElapsedTime();
    //
    //   // Update objects
    //   mesh.position.x = Math.cos(elapsedTime);
    //   mesh.position.y = Math.sin(elapsedTime);
    //   camera.lookAt(mesh.position);
    //
    //   // Render
    //   renderer.render(scene, camera);
    //
    //   // Call tick again on the next frame
    //   window.requestAnimationFrame(tick);
    // }

    gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
    const tick = () => {
      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return <canvas ref={el}></canvas>;
};
export default Page;
