import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const COIN_KINDS = ['btc', 'etc', 'eth', 'xrp'];

const BITTHUMB_REQUEST_ADDR = 'https://api.bithumb.com/public/ticker/ALL';
const BITTHUMB_COIN_MAP = {};

const COINONE_REQUEST_ADDR = 'https://api.coinone.co.kr/ticker/?currency=all';
const COINONE_COIN_MAP = {};

const UPBIT_REQUEST_ADDR = `https://api.upbit.com/v1/ticker?markets=${COIN_KINDS.map(
  value => `KRW-${value.toUpperCase()}`
).toString()}`;
const UPBIT_COIN_MAP = {};

const coins = {};
COIN_KINDS.forEach(value => {
  BITTHUMB_COIN_MAP[value] = value.toUpperCase();
  COINONE_COIN_MAP[value] = value;
  UPBIT_COIN_MAP[value] = `KRW-${value.toUpperCase()}`;

  coins[value] = {
    id: value,
    name: value.toUpperCase(),
    // favorite coin or not (false: default)
    // Get favorite coin info from cache if it exists.
    favorite: localStorage.getItem(`favorite-${value}`) === 'true' || false,
    exchanges: {
      bitthumb: { id: 'bitthumb', name: 'Bitthumb', last: 0 },
      coinone: { id: 'coinone', name: 'Coinone', last: 0 },
      upbit: { id: 'upbit', name: 'Upbit', last: 0 }
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
  requestUpbitData({ commit }) {
    return new Promise(resolve => {
      Vue.$http.get(UPBIT_REQUEST_ADDR).then(response => {
        commit('setUpbitData', response.data);
        resolve();
      });
    });
  },
  requestSortedCoinsData({ dispatch, commit }) {
    Promise.all([
      dispatch('requestBitthumbData'),
      dispatch('requestCoinoneData'),
      dispatch('requestUpbitData')
    ]).then(() => {
      commit('setSortedCoinsData');
      commit('sortSortedCoins');
    });
  }
};

const mutations = {
  setBitthumbData(state, data) {
    Object.keys(BITTHUMB_COIN_MAP).forEach(coinName => {
      state.coins[coinName].exchanges.bitthumb.last = parseInt(
        data[BITTHUMB_COIN_MAP[coinName]].closing_price,
        10
      );
    });
  },
  setCoinoneData(state, data) {
    Object.keys(COINONE_COIN_MAP).forEach(coinName => {
      state.coins[coinName].exchanges.coinone.last = parseInt(
        data[COINONE_COIN_MAP[coinName]].last,
        10
      );
    });
  },
  setUpbitData(state, data) {
    COIN_KINDS.forEach((coinName, index) => {
      state.coins[coinName].exchanges.upbit.last = parseInt(
        data[index].prev_closing_price,
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

        if (last > 0 && lowest > last) {
          lowest = last;
          lowestExchange = exchanges[exchangeName];
        }

        if (last > 0 && highest < last) {
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
      const { lowestExchange, highestExchange } = getLowestHighestExchange(
        state.coins[coinName].exchanges
      );

      state.sortedCoins.push({
        id: state.coins[coinName].id,
        name: state.coins[coinName].name,
        favorite: state.coins[coinName].favorite,
        lowestExchange,
        highestExchange,
        maxDiff: getMaxDiff(lowestExchange.last, highestExchange.last)
      });
    });
  },
  sortSortedCoins(state) {
    // Sort sortedCoins having favorite priority with descending order
    state.sortedCoins.sort(
      (a, b) => b.favorite - a.favorite || b.maxDiff - a.maxDiff
    );
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
