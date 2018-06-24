<template>
  <div>
    <v-toolbar color="cyan" dark tabs>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>ArBeRich</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-tabs
        slot="extension"
        centered
        color="cyan"
        slider-color="yellow"
        grow
      >
        <v-tab 
          v-for="item in tabs"
          v-model="model"
          :key="item.id"
          :href="`#${item.id}`"
          @click="updateTab(item.id)"
        >
          {{ item.name }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="model">
      <v-tab-item
        v-for="item in tabs"
        :key="item.id"
        :id="item.id"
      >
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
export default {
  name: 'head-part',
  props: {
    tabs: {
      type: Array,
      default: []
    }
  },
  data() {
    return { model: this.tabs[0].id };
  },
  methods: {
    updateTab(tabId) {
      this.model = tabId;
      this.$router.push({ name: tabId, path: `/${tabId}` });
    }
  }
};
</script>
<style>
</style>