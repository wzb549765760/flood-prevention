<template>
  <div id="app">
    <transition name="move" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>
