"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const Page = () => {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) return;
    el.current.innerHTML = "";
    const canvas = el.current;

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
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    const aspectRatio = sizes.width / sizes.height;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 1000);

    camera.position.x = 2;
    camera.position.y = 2;
    camera.position.z = 2;
    camera.lookAt(mesh.position);
    scene.add(camera);

    // Cursor
    const cursor = {
      x: 0,
      y: 0,
    };

    window.addEventListener("mousemove", (event) => {
      cursor.x = event.clientX / sizes.width - 0.5;
      cursor.y = -(event.clientY / sizes.height - 0.5);
    });

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
    });

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    // controls.target.y = 2;
    controls.update();

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    const tick = () => {
      // Update controls
      controls.update();

      // // Render
      // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
      // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
      // camera.position.y = cursor.y * 3;
      // camera.lookAt(mesh.position);
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return <canvas ref={el}></canvas>;
};
export default Page;
