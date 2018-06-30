import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import summaryView from '@/components/SummaryView';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('State', () => {
  let getters;
  let store;

  const ex = {
    id: 'ex',
    name: 'Ex',
    last: 0,
    low: 0,
    high: 0,
    changeRate: 0,
    volume: 0
  };

  const coins = {
    coin: {
      id: 'coin',
      name: 'COIN',
      favorite: false,
      exchanges: {
        ex
      }
    }
  };
  const sortedCoins = [
    {
      id: 'coin',
      name: 'COIN',
      favorite: false,
      lowestExchange: ex,
      highestExchange: ex,
      maxDiff: 0
    }
  ];

  const mutations = {
    sortSortedCoins: () => sortedCoins
  };

  beforeEach(() => {
    getters = { getCoins: () => coins, getSortedCoins: () => sortedCoins };
    store = new Vuex.Store({ state: {}, getters, mutations });
  });

  it('renders correctly from $store.state.coins', () => {
    const wrapper = shallowMount(summaryView, {
      store,
      localVue
    });

    expect(wrapper.vm.coins.coin.id).to.equal('coin');
    expect(wrapper.vm.coins.coin.name).to.equal('COIN');
    expect(wrapper.vm.coins.coin.favorite).to.equal(false);

    expect(wrapper.vm.coins.coin.exchanges.ex.id).to.equal('ex');
    expect(wrapper.vm.coins.coin.exchanges.ex.name).to.equal('Ex');
    expect(wrapper.vm.coins.coin.exchanges.ex.last).to.equal(0);
    expect(wrapper.vm.coins.coin.exchanges.ex.low).to.equal(0);
    expect(wrapper.vm.coins.coin.exchanges.ex.high).to.equal(0);
    expect(wrapper.vm.coins.coin.exchanges.ex.changeRate).to.equal(0);
    expect(wrapper.vm.coins.coin.exchanges.ex.volume).to.equal(0);
  });

  it('renders correctly from $store.state.sortedCoins', () => {
    const wrapper = shallowMount(summaryView, {
      store,
      localVue
    });
    expect(wrapper.vm.sortedCoins[0].id).to.equal('coin');
    expect(wrapper.vm.sortedCoins[0].name).to.equal('COIN');
    expect(wrapper.vm.sortedCoins[0].favorite).to.equal(false);

    expect(wrapper.vm.sortedCoins[0].lowestExchange.id).to.equal('ex');
    expect(wrapper.vm.sortedCoins[0].highestExchange.id).to.equal('ex');
    expect(wrapper.vm.sortedCoins[0].maxDiff).to.equal(0);
  });
});
