import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import PublicLayout from '../layouts/PublicLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import Home from '../views/Home.vue'
import PublicCollection from '../views/PublicCollection.vue'
import PublicDetail from '../views/PublicDetail.vue'
import Participate from '../views/Participate.vue'
import Missing from '../views/Missing.vue'
import Dashboard from '../views/Dashboard.vue'
import AdminList from '../views/AdminList.vue'
import Editor from '../views/Editor.vue'

const sections = ['edicoes', 'temas', 'categorias', 'noticias', 'editais']
export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, saved) {
    return saved ?? (to.hash ? { el: to.hash, behavior: 'smooth' } : { top: 0 })
  },
  routes: [
    { path: '/', component: PublicLayout, children: [
      { path: '', component: Home },
      ...sections.flatMap(section => [
        { path: section, component: PublicCollection, props: { section } },
        { path: section + '/:slug', component: PublicDetail, props: (route: RouteLocationNormalized) => ({ section, slug: route.params.slug }) },
      ]),
      { path: 'faca-parte', component: Participate },
      { path: ':pathMatch(.*)*', component: Missing },
    ] },
    { path: '/admin', component: AdminLayout, children: [
      { path: '', component: Dashboard },
      { path: 'nova-publicacao', component: Editor, props: { section: 'noticias', choose: true } },
      { path: ':section', component: AdminList, props: true },
      { path: ':section/:id', component: Editor, props: true },
    ] },
  ],
})
