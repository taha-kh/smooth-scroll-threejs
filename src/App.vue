<template>
  <div id="app">
    <transition
      enter-active-class="animated fadeInDownBig"
      leave-active-class="animated fadeOutDownBig"
    >
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Flamenco:wght@300&display=swap");
* {
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100vh;
  font-family: "Flamenco", cursive;
  overflow: hidden;
  background-color: black;
  color: white;
  cursor: url("/triangle.svg"), auto;
}
</style>
