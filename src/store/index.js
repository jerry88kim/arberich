import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const COIN_KINDS = ['btc', 'etc', 'eth', 'xrp'];

// TODO: Access-Control-Allow-Origin problem should be fixed.
/* const KORBIT_REQUEST_ADDR_PREFIX =
  'https://api.korbit.co.kr/v1/ticker?currency_pair=';
const KORBIT_COIN_MAP = {}; */

const BITTHUMB_REQUEST_ADDR = 'https://api.bithumb.com/public/ticker/ALL';
const BITTHUMB_COIN_MAP = {};

const COINONE_REQUEST_ADDR = 'https://api.coinone.co.kr/ticker/?currency=all';
const COINONE_COIN_MAP = {};

const coins = {};
COIN_KINDS.forEach(value => {
  // KORBIT_COIN_MAP[value] = `${value}_krw`;
  BITTHUMB_COIN_MAP[value] = value.toUpperCase();
  COINONE_COIN_MAP[value] = value;

  coins[value] = {
    id: value,
    name: value.toUpperCase(),
    exchanges: {
      // korbit: { id: 'korbit', name: 'Korbit', last: 0 },
      bitthumb: { id: 'bitthumb', name: 'Bitthumb', last: 0 },
      coinone: { id: 'coinone', name: 'Coinone', last: 0 }
    }
  };
});

const sortedCoins = [];

const state = {
  coins,
  sortedCoins
};

const getters = {
  getCoins: state => state.coins,
  getSortedCoins: state => state.sortedCoins
};

const actions = {
  requestKorbitData() {
    /* Object.keys(KORBIT_COIN_MAP).forEach(coinName => {
      Vue.$http
        .get(KORBIT_REQUEST_ADDR_PREFIX + KORBIT_COIN_MAP[coinName])
        .then(response => {
          commit('setKorbitData', { coinName, last: response.body.last });
        });
    }); */
  },
  requestBitthumbData({ commit }) {
    return new Promise(resolve => {
      Vue.$http.get(BITTHUMB_REQUEST_ADDR).then(response => {
        commit('setBitthumbData', response.data.data);
        resolve();
      });
    });
  },
  requestCoinoneData({ commit }) {
    return new Promise(resolve => {
      Vue.$http.get(COINONE_REQUEST_ADDR).then(response => {
        commit('setCoinoneData', response.data);
        resolve();
      });
    });
  },
  requestSortedCoinsData({ dispatch, commit }) {
    Promise.all([
      // dispatch('requestKorbitData'),
      dispatch('requestBitthumbData'),
      dispatch('requestCoinoneData')
    ]).then(() => commit('setSortedCoinsData'));
  }
};

const mutations = {
  setKorbitData(state, data = {}) {
    state.coins[data.coinName].exchanges.korbit.last = parseInt(data.last, 10);
  },
  setBitthumbData(state, data = {}) {
    Object.keys(BITTHUMB_COIN_MAP).forEach(coinName => {
      state.coins[coinName].exchanges.bitthumb.last = parseInt(
        data[BITTHUMB_COIN_MAP[coinName]].closing_price,
        10
      );
    });
  },
  setCoinoneData(state, data = {}) {
    Object.keys(COINONE_COIN_MAP).forEach(coinName => {
      state.coins[coinName].exchanges.coinone.last = parseInt(
        data[COINONE_COIN_MAP[coinName]].last,
        10
      );
    });
  },
  setSortedCoinsData(state) {
    function getLowestHighestExchange(exchanges) {
      let lowest = Number.MAX_SAFE_INTEGER;
      let highest = Number.MIN_SAFE_INTEGER;
      let lowestExchange;
      let highestExchange;
      let last;

      Object.keys(exchanges).forEach(exchangeName => {
        last = exchanges[exchangeName].last;
        if (lowest > last) {
          lowest = last;
          lowestExchange = exchanges[exchangeName];
        }
        if (highest < last) {
          highest = last;
          highestExchange = exchanges[exchangeName];
        }
      });

      return {
        lowestExchange,
        highestExchange
      };
    }

    function getMaxDiff(lowest, highest) {
      return (highest - lowest) / (highest + lowest);
    }

    // Initialize sortedCoins
    state.sortedCoins = state.sortedCoins.splice();

    Object.keys(state.coins).forEach(coinName => {
      const {
        lowestExchange,
        highestExchange
      } = getLowestHighestExchange(state.coins[coinName].exchanges);

      state.sortedCoins.push({
        id: state.coins[coinName].id,
        name: state.coins[coinName].name,
        lowestExchange,
        highestExchange,
        maxDiff: getMaxDiff(lowestExchange.last, highestExchange.last)
      });
    });

    // Sort sortedCoins with descending order
    state.sortedCoins.sort((a, b) => b.maxDiff - a.maxDiff);
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
