import { createRouter, createWebHistory } from "vue-router";

import weapons from '../views/Weapons.vue'
import SingleWeapon from '../views/SingleWeapon.vue'

const routes = [
    {
        path: "/",
        name: "Home",
        component: weapons
    },
    {
        path: "/:id",
        name: "Weapon",
        component: SingleWeapon
    },


]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router