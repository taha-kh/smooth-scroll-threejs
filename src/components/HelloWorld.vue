<template>
  <div>
    <div class="content">
      <p>PINK FLOYD.</p>
      <h1>{{ albumTitle }}</h1>
      <v-icon dark>
        mdi-menu
      </v-icon>
    </div>

    <canvas ref="webgl" class="webgl"></canvas>
    <div class="scroll-indication">
      <v-icon dark left class="animated infinite wobble">
        mdi-arrow-left
      </v-icon>
      <p>Scroll</p>
      <v-icon dark right class="animated infinite wobble">
        mdi-arrow-right
      </v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
import gsap from "gsap";
import albums from "../models/Discography";

/* eslint-disable @typescript-eslint/no-explicit-any */
@Component
export default class HelloWorld extends Vue {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  textureLoader: THREE.TextureLoader;
  background!: THREE.Mesh;

  albumTitle: string | undefined;

  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  constructor() {
    super();
    this.textureLoader = new THREE.TextureLoader();
    this.albumTitle = "";
  }

  async mounted(): Promise<void> {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#202124");
    this.loadCamera();
    //await this.loadBackground();
    this.loadImage();
    this.renderWebGL();

    this.$el.addEventListener("pointerdown", this.onAlbumClicked);

    const mouse = new THREE.Vector2();
    this.$el.addEventListener("mousemove", (event: any) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    let x = 0;
    let position = 0;

    this.$el.addEventListener("wheel", (event: any) => {
      x = event.deltaY * 0.0007;
    });

    const raycaster = new THREE.Raycaster();
    const tick = () => {
      position += x;
      x *= 0.9;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.getImagesFromScene());

      for (const intersect of intersects) {
        gsap.to(intersect.object.scale, { x: 1.7, y: 1.7 });

        this.albumTitle = albums.find(
          (album) => album.id === intersect.object.name
        )?.name;
      }

      for (const object of this.getImagesFromScene()) {
        if (!intersects.find((i) => i.object === object)) {
          gsap.to(object.scale, { x: 1, y: 1 });
        }
      }

      this.camera.position.x = -position;

      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(tick);
    };

    tick();
  }

  async loadBackground(): Promise<void> {
    const geometry = new THREE.PlaneGeometry(100, 10);
    const texture = await this.textureLoader.load("./starry.jpg");
    texture.repeat.set(16, 16);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.background = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        map: texture,
      })
    );

    this.scene.add(this.background);
  }

  private onAlbumClicked(event: any): void {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects(this.getImagesFromScene());
    for (const intersect of intersects) {
      this.$router.push({
        name: albums.find((a) => a.id === intersect.object.name)?.url,
      });

      event.stopPropagation();
    }
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
  display: flex;
  align-items: center;
  z-index: 1;
  width: 100%;
  height: 66px;
  text-align: center;
  margin-top: 5px;
  padding: 0px 25px;
  justify-content: space-between;

  h1 {
    font-size: 2em;
    color: white;
    text-transform: uppercase;
    font-weight: 200;
    letter-spacing: 4px;
    width: 400px;
    margin-left: -110px;
  }

  p {
    font-weight: 900;
    letter-spacing: 4px;
  }
}

.scroll-indication {
  display: flex;
  position: absolute;
  width: 300px;
  bottom: 50px;
  right: 25%;
  left: 50%;
  margin-left: -150px;
  justify-content: center;
  font-weight: 100;

  p {
    border: 1px solid;
    border-radius: 50px;
    padding: 5px 18px;
  }
}

.v-icon.v-icon {
  font-weight: 100;
}
</style>
