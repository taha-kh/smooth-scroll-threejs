<template>
  <div>
    <div class="content">
      <h1>{{ albumTitle }}</h1>
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

/* eslint-disable @typescript-eslint/no-explicit-any */
@Component
export default class HelloWorld extends Vue {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  textureLoader: THREE.TextureLoader;

  albumTitle: string | undefined;

  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  albums = [
    {
      id: "0",
      name: "The Piper at the Gates of Dawn",
    },
    {
      id: "1",
      name: "A Saucerful of Secrets",
    },
    {
      id: "2",
      name: "More",
    },
    {
      id: "3",
      name: "Ummagumma",
    },
    {
      id: "4",
      name: "Atom Heart Mother",
    },
    {
      id: "5",
      name: "Meddle",
    },
    {
      id: "6",
      name: "Obscured by Clouds",
    },
    {
      id: "7",
      name: "The Dark Side of the Moon",
    },
    {
      id: "8",
      name: "Wish You Were Here",
    },
    {
      id: "9",
      name: "Animals",
    },
    {
      id: "10",
      name: "The Wall",
    },
    {
      id: "11",
      name: "The Final Cut",
    },
    {
      id: "12",
      name: "A Momentary Lapse of Reason",
    },
    {
      id: "13",
      name: "The Division Bell",
    },
  ];

  constructor() {
    super();
    this.textureLoader = new THREE.TextureLoader();
    this.albumTitle = "";
  }

  mounted(): void {
    this.scene = new THREE.Scene();
    // this.scene.background = this.textureLoader.load("./sky.jpg");
    this.loadCamera();
    this.loadImage();
    this.renderWebGL();

    const mouse = new THREE.Vector2();
    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    let x = 0;
    let position = 0;

    window.addEventListener("wheel", (event) => {
      x = event.deltaY * 0.0007;
      console.log(x);
    });

    const raycaster = new THREE.Raycaster();

    const tick = () => {
      position += x;
      x *= 0.9;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.getImagesFromScene());

      for (const intersect of intersects) {
        gsap.to(intersect.object.scale, { x: 1.7, y: 1.7 });
        // gsap.to(intersect.object.rotation, { y: -0.5 });
        // gsap.to(intersect.object.position, { z: -0.9 });
        this.albumTitle = this.albums.find(
          (album) => album.id === intersect.object.name
        )?.name;
      }

      for (const object of this.getImagesFromScene()) {
        if (!intersects.find((i) => i.object === object)) {
          gsap.to(object.scale, { x: 1, y: 1 });
          // gsap.to(object.rotation, { y: 0 });
          // gsap.to(object.position, { z: 0 });
        }
      }

      this.camera.position.x = -position;

      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(tick);
    };

    tick();
  }

  private loadCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 2;
    this.scene.add(this.camera);
  }

  private loadImage(): void {
    const geometry = new THREE.PlaneBufferGeometry(1, 1);

    for (let index = 0; index < 14; index++) {
      const material = new THREE.MeshBasicMaterial({
        map: this.textureLoader.load(`./${index}.jpg`),
      });

      const img = new THREE.Mesh(geometry, material);
      img.position.set(index * 1.5, 0, 0);
      img.name = index.toString();

      this.scene.add(img);
    }
  }

  private renderWebGL(): void {
    const canvas = this.$refs.webgl as HTMLCanvasElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener("resize", this.onResizeWindow);
  }

  private onResizeWindow(): void {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private getImagesFromScene(): THREE.Object3D[] {
    let objs: THREE.Object3D[] = [];
    this.scene.traverse((object: any) => {
      if (object.isMesh) objs.push(object);
    });

    return objs;
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
  width: 100%;
  text-align: center;

  h1 {
    font-size: 3em;
    color: white;
    text-transform: uppercase;
    font-weight: 200;
  }
}
</style>
