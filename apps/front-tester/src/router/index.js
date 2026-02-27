import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import('../views/HomeView.vue'),
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue"),
        },
        {
            path: "/test/:id",
            name: "test",
            component: () => import('../views/TestView.vue'),
        },
        {
            path: "/module/:id",
            name: "module",
            component: () => import('../views/ModuleView.vue'),
        },
        {
            path: "/test/edit/:id",
            name: "edit-test",
            component: () => import('../views/EditTestView.vue'),
        }
    ],
});

export default router;