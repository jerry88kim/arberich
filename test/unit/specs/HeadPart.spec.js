import Vue from 'vue';
import headPart from '@/components/HeadPart';

function getRenderedVm(Component, propsData) {
  const Constructor = Vue.extend(Component);
  const vm = new Constructor({ propsData }).$mount();
  return vm;
}

describe('HeadPart.vue', () => {
  it('renders correctly with props', done => {
    const vm = getRenderedVm(headPart, {
      tabs: [{ id: 'tab1', name: 'Tab1' }]
    });

    Vue.nextTick(() => {
      expect(vm.$data.model).to.equal('tab1');

      expect(vm.$el.querySelector('#tab1').id).to.equal('tab1');

      done();
    });
  });
});
