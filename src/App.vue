<template>
  <div id="app">
    <transition name="fade" mode="out-in">
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
}

.fade-enter,
.fade-leave-to {
  transition: translateX(3em);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
</style>
