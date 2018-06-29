<template>
  <div
    id="e3"
    style="max-width: 1000px; margin: auto;"
    class="grey lighten-3"
  >
    <!-- Coin combobox -->
    <v-container id="coin-combobox" grid-list-xl>
      <v-layout row wrap>
        <v-flex xs12 sm4>
          <p class="subheading pl-1">Coin</p>
          <v-select
            :items="coinKinds"
            label="Select"
            segmented
            target="#coin-dropbox"
            v-model="selectedCoin"
          ></v-select>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Each exchange info -->
    <v-container fluid grid-list-lg>
        <v-flex v-for="exchange in exchanges" :key="exchange.id" xs12>
          <v-card color="white" class="black--text">
            <v-container fluid grid-list-xl>
              <v-layout row justify-space-between>
                <v-flex xs5 class="text-xs-left pl-3">
                  <div class="headline">{{ exchange.name }}</div>
                </v-flex>
                <v-flex xs3 class="text-xs-right pr-3">
                  <div class="caption">Last Trade </div>
                  <div class="title red--text">{{ exchange.last | currency }}</div>
                </v-flex> 
              </v-layout>
              
              <v-layout row>
                <v-flex xs3>
                  <v-card color="red lighten-1" class="white--text pl-2">
                    <div class="caption">Change Rate</div>
                    <div class="subheading">{{ exchange.changeRate | percentage(4, true) }}</div>
                  </v-card>
                </v-flex>
                
                <v-flex xs3>
                  <v-card color="white lighten-1" class="black--text pl-2">
                    <div class="caption">24h Highest</div>
                    <div class="subheading">{{ exchange.high | currency }}</div>
                  </v-card>                  
                </v-flex>

                <v-flex xs3>
                  <v-card color="white lighten-1" class="black--text pl-2">
                    <div class="caption">24h Lowest</div>
                    <div class="subheading">{{ exchange.low | currency }}</div>
                  </v-card>                  
                </v-flex>

                <v-flex xs3>
                  <v-card color="white lighten-1" class="black--text pl-2">
                    <div class="caption">24h Volume</div>
                    <div class="subheading">{{ exchange.volume.toLocaleString('en') }}</div>
                  </v-card>                  
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { COIN_KINDS } from '../store/constant';

export default {
  name: 'details-view',
  data() {
    const coinKinds = COIN_KINDS.map(value => ({
      id: value,
      text: value.toUpperCase(),
      callback: () => {}
    }));

    return {
      coinKinds,
      selectedCoin: coinKinds[0]
    };
  },
  computed: {
    ...mapGetters({
      coins: 'getCoins'
    }),
    exchanges() {
      return this.coins[this.selectedCoin.id].exchanges;
    }
  }
};
</script>