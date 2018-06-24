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
                  <div class="title">{{ coin.maxDiff }}</div>
                </v-flex> 
              </v-layout>
              <v-layout row>
                <v-flex xs6>
                  <v-card color="blue" class="white--text pl-2">
                    <div class="caption">Lowest</div>
                    <div class="title">{{ coin.lowestExchange.name }}</div>
                    <div class="body2">{{ coin.lowestExchange.last }}</div>
                  </v-card>
                  
                </v-flex>
                <v-flex xs6>
                  <v-card color="red lighten-1" class="white--text pl-2">
                    <div class="caption">Highest</div>
                    <div class="title">{{ coin.highestExchange.name }}</div>
                    <div class="body2">{{ coin.highestExchange.last }}</div>
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
export default {
  name: 'summary-view',
  data() {
    return {
      // TODO: temporal data. This data is for temporal usage.
      coins: [
        {
          id: 'btc',
          name: 'BTC',
          maxDiff: '+1.2%',
          lowestExchange: { id: 'coinone', name: 'Coinone', last: '7,200,000' },
          highestExchange: { id: 'korbit', name: 'Korbit', last: '7,199,310' }
        },
        {
          id: 'eth',
          name: 'ETH',
          maxDiff: '+2.5%',
          lowestExchange: { id: 'coinone', name: 'Coinone', last: '542,000' },
          highestExchange: { id: 'korbit', name: 'Korbit', last: '543,200' }
        }
      ]
    };
  }
};
</script>