<template>
  <div class="thePiperAtTheGatesOfDawn">
    <canvas ref="webgl" class="webgl"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

@Component({
  components: {},
})
export default class ThePiperAtTheGatesOfDawn extends Vue {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  textureLoader: THREE.TextureLoader;

  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  constructor() {
    super();
    this.textureLoader = new THREE.TextureLoader();
  }

  async mounted(): Promise<void> {
    this.scene = new THREE.Scene();
    this.loadCamera();
    this.loadImage();
    this.loadBackDescription();
    await this.loadGround();
    this.renderWebGL();

    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    // controls.autoRotate = true;
    controls.enableZoom = false;
    controls.enablePan = true;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;

    const tick = () => {
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
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    const material = new THREE.MeshBasicMaterial({
      map: this.textureLoader.load(`./0.jpg`),
    });
    const img = new THREE.Mesh(geometry, material);

    this.scene.add(img);
  }

  private loadBackDescription(): void {
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    const material = new THREE.MeshBasicMaterial({
      color: "white",
      side: THREE.BackSide,
    });
    const img = new THREE.Mesh(geometry, material);
    // img.position.z = -0.00001;

    this.scene.add(img);
  }

  private async loadGround(): Promise<void> {
    const img = await this.textureLoader.load("./ground.jpeg");
    var groundMaterial = new THREE.MeshStandardMaterial({
      map: img,
      side: THREE.DoubleSide,
    });

    var mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10000, 10000),
      groundMaterial
    );
    mesh.position.y = 0.0;
    mesh.rotation.x = -Math.PI / 2;
    // mesh.receiveShadow = true;
    this.scene.add(mesh);
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
}
</script>
<style lang="scss" scoped>
.thePiperAtTheGatesOfDawn {
  position: fixed;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fce5cd;
}
</style>
