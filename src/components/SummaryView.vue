<template>
  <div
    id="e3"
    style="max-width: 1000px; margin: auto;"
    class="grey lighten-3"
  >
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <!-- Favorite coins setting menu -->            
        <v-menu open-on-hover offset-x>
          <v-btn slot="activator" dark fab color="pink" fixed bottom left>
            <v-icon dark>favorite</v-icon>
          </v-btn>

          <v-list>
            <v-list-tile v-for="coin in coins" :key="coin.id"  @click="handleFavoriteCheck(coin)">
              <v-list-tile-action>
                <v-checkbox v-model="coin.favorite"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ coin.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>

        <!-- Each coin info -->
        <v-flex v-for="coin in sortedCoins" :key="coin.id" xs12>
          <v-card color="white" class="black--text">
            <v-container fluid grid-list-xl>
              <v-layout row justify-space-between>
                <v-flex xs5 class="text-xs-left pl-3">
                  <v-badge v-model="coin.favorite" color="pink" left>
                    <v-icon slot="badge" dark small>favorite</v-icon>
                    <div class="headline">{{ coin.name }}</div>
                  </v-badge>
                </v-flex>
                <v-flex xs3 class="text-xs-right pr-3">
                  <div class="title">{{ coin.maxDiff | percentage(2) }}</div>
                </v-flex> 
              </v-layout>
              
              <v-layout row>
                <v-flex xs6>
                  <v-card color="blue" class="white--text pl-2">
                    <div class="caption">Lowest</div>
                    <div class="title">{{ coin.lowestExchange.name }}</div>
                    <div class="body2">{{ coin.lowestExchange.last | currency }}</div>
                  </v-card>
                </v-flex>
                
                <v-flex xs6>
                  <v-card color="red lighten-1" class="white--text pl-2">
                    <div class="caption">Highest</div>
                    <div class="title">{{ coin.highestExchange.name }}</div>
                    <div class="body2">{{ coin.highestExchange.last | currency }}</div>
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
      coins: 'getCoins',
      sortedCoins: 'getSortedCoins'
    })
  },
  methods: {
    handleFavoriteCheck(coin) {
      // Save favorite coin info into cache
      localStorage.setItem(`favorite-${coin.id}`, coin.favorite);
      // update sortedCoins for favorite coins immediately
      this.$store.commit('sortSortedCoins');
    }
  }
};
</script>