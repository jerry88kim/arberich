import Vue from 'vue';
import Router from 'vue-router';
import SummaryView from '@/components/SummaryView';
import DetailsView from '@/components/DetailsView';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/summary'
    },
    {
      path: '/summary',
      name: 'summary',
      component: SummaryView
    },
    {
      path: '/details',
      name: 'details',
      component: DetailsView
    }
  ]
});
