<template>
  <div id="app">
    <router-view v-slot="{Component}">
      <template v-if="Component">
        <component :is="Component" />
      </template>
    </router-view>
  </div>
</template>

<script setup>

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 32px;
  font-weight: 600;
}
</style>