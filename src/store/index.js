import Vuex from 'vuex';
import Vue from 'vue';
import {
  COIN_KINDS,
  EXCHANGES,
  BITTHUMB_REQUEST_ADDR,
  BITTHUMB_COIN_MAP,
  COINONE_REQUEST_ADDR,
  COINONE_COIN_MAP,
  UPBIT_REQUEST_ADDR
} from './constant';

Vue.use(Vuex);

const coins = {};
COIN_KINDS.forEach(value => {
  BITTHUMB_COIN_MAP[value] = value.toUpperCase();
  COINONE_COIN_MAP[value] = value;

  const exchanges = {};
  EXCHANGES.forEach(exchangeName => {
    exchanges[exchangeName] = {
      id: exchangeName,
      name: exchangeName.charAt(0).toUpperCase() + exchangeName.substring(1),
      // last price
      last: 0,
      // lowest price within 24h
      low: 0,
      // highest price within 24h
      high: 0,
      // change rate within 24h
      changeRate: 0,
      // volume within 24h
      volume: 0
    };
  });

  coins[value] = {
    id: value,
    name: value.toUpperCase(),
    // favorite coin or not (false: default)
    // Get favorite coin info from cache if it exists.
    favorite: localStorage.getItem(`favorite-${value}`) === 'true' || false,
    exchanges
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
    return new Promise((resolve, reject) => {
      Vue.$http
        .get(BITTHUMB_REQUEST_ADDR)
        .then(response => {
          commit('setBitthumbData', response.data.data);
          resolve();
        })
        .catch(() => reject());
    });
  },
  requestCoinoneData({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get(COINONE_REQUEST_ADDR)
        .then(response => {
          commit('setCoinoneData', response.data);
          resolve();
        })
        .catch(() => reject());
    });
  },
  requestUpbitData({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.$http
        .get(UPBIT_REQUEST_ADDR)
        .then(response => {
          commit('setUpbitData', response.data);
          resolve();
        })
        .catch(() => reject());
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

/**
 * Set exchange's info
 *
 * @param {Object} exchange Exchange
 * @param {string} last Last price
 * @param {string} low Lowest price within 24h
 * @param {string} high Highest price within 24h
 * @param {string} volume Volume within 24h
 * @param {string} [changeRate] Change rate within 24h
 */
function setExchangeData(exchange, last, low, high, volume, changeRate) {
  exchange.last = parseInt(last, 10);
  exchange.low = parseInt(low, 10);
  exchange.high = parseInt(high, 10);

  exchange.volume = parseFloat(volume);
  exchange.changeRate = parseFloat(changeRate);
}

const mutations = {
  setBitthumbData(state, data) {
    Object.keys(BITTHUMB_COIN_MAP).forEach(coinName => {
      const bitthumbData = data[BITTHUMB_COIN_MAP[coinName]];

      setExchangeData(
        state.coins[coinName].exchanges.bitthumb,
        bitthumbData.closing_price,
        bitthumbData.min_price,
        bitthumbData.max_price,
        bitthumbData.units_traded,
        bitthumbData['24H_fluctate_rate']
      );
    });
  },
  setCoinoneData(state, data) {
    Object.keys(COINONE_COIN_MAP).forEach(coinName => {
      const coinoneData = data[COINONE_COIN_MAP[coinName]];

      // (TICKER: last - TICKER: yesterday_last) x 100 / yesterday_last
      const changeRate =
        ((coinoneData.last - coinoneData.yesterday_last) * 100) /
        coinoneData.yesterday_last;

      setExchangeData(
        state.coins[coinName].exchanges.coinone,
        coinoneData.last,
        coinoneData.low,
        coinoneData.high,
        coinoneData.volume,
        changeRate
      );
    });
  },
  setUpbitData(state, data) {
    COIN_KINDS.forEach((coinName, index) => {
      const upbitData = data[index];

      setExchangeData(
        state.coins[coinName].exchanges.upbit,
        upbitData.prev_closing_price,
        upbitData.low_price,
        upbitData.high_price,
        upbitData.acc_trade_volume_24h,
        upbitData.signed_change_rate
      );
    });
  },
  setSortedCoinsData(state) {
    /**
     * Get lowest exchange & highest exchange
     *
     * @param {Object} exchanges All exchange object
     * @returns {Object}
     */
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

    /**
     * Calculate maximum diff between each exchange's last price
     * @param {number} lowest Lowest last price
     * @param {number} highest Highest last price
     * @returns {number}
     */
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
