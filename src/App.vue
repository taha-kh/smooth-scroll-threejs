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
* {
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100vh;
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
  background-color: black;
  color: white;
}
</style>
