<template>
  <div
    id="e3"
    style="max-width: 600px; margin: auto;"
    class="grey lighten-3"
  >
    <v-container
      fluid
      style="min-height: 0;"
      grid-list-lg
    >
      <v-layout row wrap>
        <v-flex v-for="coin in coins" :key="coin.id" xs12>
          <v-card color="white" class="black--text">
            <v-container fluid grid-list-xl>
              <v-layout row justify-space-between>
                <v-flex xs5 class="text-xs-left pl-3">
                  <div class="headline">{{ coin.name }}</div>
                </v-flex>
                <v-flex xs3 class="text-xs-right pr-3">
                  <div class="title">{{ coin.maxDiff | percentage(coin.maxDiff) }}</div>
                </v-flex> 
              </v-layout>
              <v-layout row>
                <v-flex xs6>
                  <v-card color="blue" class="white--text pl-2">
                    <div class="caption">Lowest</div>
                    <div class="title">{{ coin.lowestExchange.name }}</div>
                    <div class="body2">{{ coin.lowestExchange.last | currency('₩', 0) }}</div>
                  </v-card>
                </v-flex>
                <v-flex xs6>
                  <v-card color="red lighten-1" class="white--text pl-2">
                    <div class="caption">Highest</div>
                    <div class="title">{{ coin.highestExchange.name }}</div>
                    <div class="body2">{{ coin.highestExchange.last | currency('₩', 0) }}</div>
                  </v-card>
                  
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'summary-view',
  computed: {
    ...mapGetters({
      coins: 'getSortedCoins'
    })
  },
  created() {
    setInterval(() => {
      this.$store.dispatch('requestSortedCoinsData');
    }, 2000);
  }
};
</script>