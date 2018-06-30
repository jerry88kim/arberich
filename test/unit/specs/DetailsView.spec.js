import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import detailsView from '@/components/DetailsView';

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
    btc: {
      id: 'btc',
      name: 'BTC',
      favorite: false,
      exchanges: {
        ex
      }
    }
  };

  beforeEach(() => {
    getters = { getCoins: () => coins };
    store = new Vuex.Store({ state: {}, getters });
  });

  it('renders correctly from $store.state.coins', () => {
    const wrapper = shallowMount(detailsView, {
      store,
      localVue
    });

    expect(wrapper.vm.coins.btc.id).to.equal('btc');
    expect(wrapper.vm.coins.btc.name).to.equal('BTC');
    expect(wrapper.vm.coins.btc.favorite).to.equal(false);

    expect(wrapper.vm.coins.btc.exchanges.ex.id).to.equal('ex');
    expect(wrapper.vm.coins.btc.exchanges.ex.name).to.equal('Ex');
    expect(wrapper.vm.coins.btc.exchanges.ex.last).to.equal(0);
    expect(wrapper.vm.coins.btc.exchanges.ex.low).to.equal(0);
    expect(wrapper.vm.coins.btc.exchanges.ex.high).to.equal(0);
    expect(wrapper.vm.coins.btc.exchanges.ex.changeRate).to.equal(0);
    expect(wrapper.vm.coins.btc.exchanges.ex.volume).to.equal(0);

    expect(wrapper.vm.coinKinds[0].id).to.equal('btc');
    expect(wrapper.vm.coinKinds[0].text).to.equal('BTC');

    expect(wrapper.vm.selectedCoin.id).to.equal('btc');

    expect(wrapper.vm.exchanges.ex.id).to.equal('ex');
  });
});
