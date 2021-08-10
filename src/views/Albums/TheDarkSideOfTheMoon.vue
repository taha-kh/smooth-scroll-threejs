<template>
  <div class="theDarkSideOfTheMoon">
    <canvas ref="webgl" class="webgl"></canvas>
    <v-btn dark class="btn-turn" @click="onTurnBack">Turn Back</v-btn>
    <div class="dark-side-content">
      <div class="dark-side-content-text">
        <p>
          The Dark Side of the Moon (litt. « la face sombre de la Lune ») est le
          huitième album studio du groupe britannique de rock progressif Pink
          Floyd, sorti le 1er mars 1973 par Harvest Records. Principalement
          développé lors de performances en public, le groupe présente une
          première version de l'album plusieurs mois avant le début de
          l'enregistrement. Le concept de l'album repose sur les pressions
          subies par le groupe au cours de leur vie, et traitant des problèmes
          apparents de santé mentale dont souffrait l'ancien membre du groupe,
          Syd Barrett, ayant quitté la formation en 1968. The Dark Side of the
          Moon est enregistré en deux sessions en 1972 et 1973 aux studios Abbey
          Road à Londres. Le disque s'appuie sur des idées explorées dans les
          enregistrements et les performances antérieurs de Pink Floyd, tout en
          omettant les longues instrumentations qui caractérisaient leurs
          premiers travaux. Le groupe utilise l'enregistrement multipiste, des
          boucles de bande et des synthétiseurs analogiques, y compris
          l'expérimentation avec le EMS VCS3 et un Synthi A. L'ingénieur Alan
          Parsons est responsable de nombreux aspects sonores et du recrutement
          de la chanteuse Clare Torry, que l’on découvre sur The Great Gig in
          the Sky. Album conceptuel, The Dark Side of the Moon explore des
          thèmes tels que les conflits, la cupidité, le temps, la mort et la
          maladie mentale. Des bribes d'interviews de l'équipe de route du
          groupe sont présentées aux côtés de citations philosophiques. La
          pochette, qui représente un spectre de prisme, est conçue par Storm
          Thorgerson en réponse à la demande du claviériste Richard Wright qui
          souhaite un graphisme « simple et audacieux », représentant
          l'éclairage du groupe et les thèmes de l'album. L'album est promu avec
          deux quarante-cinq tours : Money et Us and Them. The Dark Side of the
          Moon fait partie des disques les plus acclamés de l'histoire par la
          critique, figurant souvent sur les listes professionnelles des plus
          grands albums de tous les temps. Il contribue à propulser Pink Floyd
          vers la gloire internationale, apportant richesse et reconnaissance à
          ses quatre membres. Véritable succès de l'ère des albums, il propulse
          également les ventes de disques dans toute l'industrie musicale des
          années 1970. Il est certifié quatorze fois platine au Royaume-Uni et
          est en tête du classement Billboard « Top LPs & Tapes » aux
          États-Unis, où il a figuré pendant 958 semaines au total. Avec des
          ventes estimées à plus de 45 millions d'exemplaires, c'est l'album de
          Pink Floyd qui a connu le plus grand succès commercial et l'un des
          albums les plus vendus dans le monde. En 2013, il est sélectionné pour
          être conservé dans le United States National Recording Registry par la
          bibliothèque du Congrès, car il est jugé « culturellement,
          historiquement ou esthétiquement important ».
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

@Component({
  components: {},
})
export default class TheDarkSideOfTheMoon extends Vue {
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
    this.scene.background = new THREE.Color("white");
    this.loadCamera();
    this.loadImage();
    this.loadBackDescription();
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

  onTurnBack(): void {
    this.camera.rotation.y = Math.PI * 2;
  }
  private loadImage(): void {
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    const material = new THREE.MeshBasicMaterial({
      map: this.textureLoader.load(`./7.jpg`),
    });
    const img = new THREE.Mesh(geometry, material);
    img.position.x = 1.8;
    this.scene.add(img);
  }

  private loadBackDescription(): void {
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    const material = new THREE.MeshBasicMaterial({
      color: "black",
      side: THREE.BackSide,
    });
    const img = new THREE.Mesh(geometry, material);
    img.position.x = -1.8;

    this.scene.add(img);
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
.theDarkSideOfTheMoon {
  position: fixed;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fce5cd;
}

.btn-turn {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
}

.dark-side-content {
  position: absolute;
  z-index: 1;
  top: 0;
  font-weight: bold;
  background: #e0d8c5;
  overflow: auto;
  height: 100%;

  &-text {
    padding: 75px;
    line-height: 1.8;
    text-align: justify;
    letter-spacing: 3px;
    color: rgb(92, 90, 90);
    width: 600px;
    // background: red;
  }
}
</style>
