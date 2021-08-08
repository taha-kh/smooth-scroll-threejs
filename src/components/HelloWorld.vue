<template>
  <div>
    <div class="content">
      <h1>The art from artists</h1>
    </div>

    <canvas ref="webgl" class="webgl"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
import gsap from "gsap";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "dat.gui";

@Component
export default class HelloWorld extends Vue {
  mounted(): void {
    const textureLoader = new THREE.TextureLoader();

    const canvas = this.$refs.webgl as HTMLCanvasElement;

    const scene = new THREE.Scene();

    const geometry = new THREE.PlaneBufferGeometry(1, 1.3);

    for (let index = 0; index < 5; index++) {
      const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`./${index}.jpg`),
      });

      const img = new THREE.Mesh(geometry, material);
      img.position.set(1, index * -1.8, 0);

      scene.add(img);
    }

    let objs: any = [];
    scene.traverse((object: any) => {
      if (object.isMesh) objs.push(object);
    });

    console.log(objs);

    const pointLight = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);

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

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mouse = new THREE.Vector2();
    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / sizes.width) * 2 - 1;
      mouse.y = (event.clientY / sizes.height) * 2 - 1;
    });

    // Mouse position
    let y = 0;
    let position = 0;
    window.addEventListener("wheel", (event) => {
      y = -event.deltaY * 0.0007;
    });

    const raycaster = new THREE.Raycaster();

    const tick = () => {
      position += y;
      y *= 0.9;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objs);

      for (const intersect of intersects) {
        gsap.to(intersect.object.scale, { x: 1.7, y: 1.7 });
        gsap.to(intersect.object.rotation, { y: -0.5 });
        gsap.to(intersect.object.position, { z: -0.9 });
      }

      for (const object of objs) {
        if (!intersects.find((i) => i.object === object)) {
          gsap.to(object.scale, { x: 1, y: 1 });
          gsap.to(object.rotation, { y: 0 });
          gsap.to(object.position, { z: 0 });
        }
      }

      camera.position.y = -position;

      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
</script>

<style scoped lang="scss">
.webgl {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}
.content {
  position: absolute;
  display: grid;
  align-items: center;
  z-index: 1;
  height: 100%;
  width: 100%;

  h1 {
    font-size: 5em;
    color: white;
    margin-left: 10vw;
  }
}
</style>
