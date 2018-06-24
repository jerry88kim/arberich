<template>
  <div id="app">
    <v-app>
      <head-part :tabs="tabs"></head-part>
      <v-content fluid>
        <router-view></router-view>
      </v-content>
      <foot-part></foot-part>
    </v-app>
    
  </div>
</template>

<script>
import headPart from '@/components/HeadPart';
import footPart from '@/components/FootPart';

export default {
  name: 'app',
  components: { headPart, footPart },
  data() {
    return {
      tabs: [
        { id: 'summary', name: 'Summary' },
        { id: 'details', name: 'Details' }
      ]
    };
  }
};
</script>

<style>
</style>
