/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import mokokoSource from "./mokoko.png";
import minecraftSource from "./minecraft.png";
import checkerboard1024Source from "./checkerboard-1024x1024.png";

import GUI from "lil-gui";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";
    // Scene
    const scene = new THREE.Scene();

    const geometry = new THREE.BufferGeometry();
    // prettier-ignore
    const positionArray = new Float32Array([
      -0.5, 0.5, 0,
      0.5, 0.5, 0,
      -0.5, -0.5, 0,
      0.5, -0.5, 0
    ]);
    const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
    geometry.setAttribute("position", positionAttribute);

    const indices = [0, 2, 1, 2, 3, 1];
    geometry.setIndex(indices);

    const planeGeometry = new THREE.PlaneGeometry(2, 2);

    // TODO: uvArray를 작성해줘
    // prettier-ignore
    const uvArray = new Float32Array([
      0,1,
      1,1,
      0,0,
      1,0,
      // TODO:
    ]);
    const uvAttribute = new THREE.BufferAttribute(uvArray, 2);
    planeGeometry.setAttribute("uv", uvAttribute);

    const textureLoader = new THREE.TextureLoader();
    const colorTexture = textureLoader.load(
      // TODO: 아무 이미지니 가져와서 넣어줘
      checkerboard1024Source.src,
      // new URL("", import.meta.url).href,
    );

    const gui = new GUI({
      width: 300,
      title: "Debug UI",
      closeFolders: true,
    });

    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;

    gui.add(colorTexture.repeat, "x").min(-30).max(30).step(1).name("repeat x");
    gui.add(colorTexture.repeat, "y").min(-30).max(30).step(1).name("repeat y");

    gui
      .add(colorTexture.offset, "x")
      .min(-30)
      .max(30)
      .step(0.01)
      .name("offset x");
    gui
      .add(colorTexture.offset, "y")
      .min(-30)
      .max(30)
      .step(0.01)
      .name("offset y");

    gui
      .add(colorTexture, "rotation")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01)
      .name("rotation");

    gui.add(colorTexture.center, "x").min(0).max(1).step(0.01).name("center x");
    gui.add(colorTexture.center, "y").min(0).max(1).step(0.01).name("center y");
    gui
      .add(colorTexture, "magFilter")
      .options({
        NearestFilter: THREE.NearestFilter,
        LinearFilter: THREE.LinearFilter,
        NearestMipmapNearestFilter: THREE.NearestMipmapNearestFilter,
        NearestMipmapLinearFilter: THREE.NearestMipmapLinearFilter,
        LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
        LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
      })
      .onChange(() => {
        colorTexture.needsUpdate = true;
      });
    gui
      .add(colorTexture, "minFilter")
      .options({
        NearestFilter: THREE.NearestFilter,
        LinearFilter: THREE.LinearFilter,
        NearestMipmapNearestFilter: THREE.NearestMipmapNearestFilter,
        NearestMipmapLinearFilter: THREE.NearestMipmapLinearFilter,
        LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
        LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
      })
      .onChange(() => {
        colorTexture.needsUpdate = true;
      });

    const material = new THREE.MeshBasicMaterial({
      map: colorTexture,
      // wireframe: true,
    });
    // const mesh = new THREE.Mesh(geometry, material);
    const mesh = new THREE.Mesh(planeGeometry, material);
    scene.add(mesh);

    // Sizes
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

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100,
    );
    camera.position.z = 3;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, el.current);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Animate
    const clock = new THREE.Clock();

    let requestId: number;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      controls.update();

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

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;
