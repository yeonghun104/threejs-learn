"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";

const Page = () => {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) return;
    /**
     * Debug
     */
    const gui = new GUI({
      width: 300,
      title: "Nice debug UI",
      closeFolders: true,
    });
    const debugObject: any = {};

    window.addEventListener("keydown", (event) => {
      if (event.key == "h") gui.show(gui._hidden);
    });

    el.current.innerHTML = "";
    const canvas = el.current;

    // Scene
    const scene = new THREE.Scene();

    debugObject.color = "#3a6ea6";

    // Object
    const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    const material = new THREE.MeshBasicMaterial({
      color: "#9c7fe3",
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const cubeTweaks = gui.addFolder("Awesome cube");
    cubeTweaks.close();
    cubeTweaks
      .add(mesh.position, "y")
      .min(-3)
      .max(3)
      .step(0.01)
      .name("elevation");
    cubeTweaks.add(mesh, "visible");
    cubeTweaks.add(material, "wireframe");
    cubeTweaks.addColor(material, "color").onChange((value: any) => {
      console.log(value.getHexString());
    });
    debugObject.spin = () => {
      gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    };
    cubeTweaks.add(debugObject, "spin");
    debugObject.subdivision = 2;
    cubeTweaks
      .add(debugObject, "subdivision")
      .min(1)
      .max(20)
      .step(1)
      .onFinishChange(() => {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.BoxGeometry(
          1,
          1,
          1,
          debugObject.subdivision,
          debugObject.subdivision,
          debugObject.subdivision,
        );
      });

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

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
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
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return <canvas ref={el}></canvas>;
};
export default Page;
