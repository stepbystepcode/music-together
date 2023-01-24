import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue'


const routes = [
    {
        path: "/",
        name: 'Home',
        component: HomeView
    },
    {
        path: "/search",
        name: 'Search', 
        component: () => import('../views/SearchView.vue')
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router;