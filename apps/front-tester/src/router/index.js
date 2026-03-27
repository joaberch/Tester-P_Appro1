import { createRouter, createWebHistory } from "vue-router";
import msalInstance, { loginRequest } from "../config/authConfig";
import axios from "axios";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import('../views/HomeView.vue'),
            meta: { roles: ["admin", "teacher", "student"] },
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
            meta: { roles: ["admin", "teacher", "student"] },
        },
        {
            path: "/module/:id",
            name: "module",
            component: () => import('../views/ModuleView.vue'),
            meta: { roles: ["admin", "teacher", "student"] },
        },
        {
            path: "/test/edit/:id",
            name: "edit-test",
            component: () => import('../views/EditTestView.vue'),
            meta: { roles: ["admin", "teacher"] },
        },
        {
            path: "/test/correct/:id",
            name: "correct-test",
            component: () => import('../views/CorrectTestView.vue'),
            meta: { roles: ["admin", "teacher"] },
        },
        {
            path: "/test/create",
            name: "create-test",
            component: () => import('../views/CreateTestView.vue'),
            meta: { roles: ["admin", "teacher"] },
        },
        {
            path: "/module/create",
            name: "create-module",
            component: () => import('../views/CreateModule.vue'),
            meta: { roles: ["admin", "teacher"] },
        },
        {
            path: "/module/edit/:id",
            name: "edit-module",
            component: () => import('../views/EditModuleView.vue'),
            meta: { roles: ["admin", "teacher"] },
        },
        {
            path: "/admin",
            name: "admin",
            component: () => import('../views/AdminView.vue'),
            meta: { roles: ["admin"] },
        },
        {
            path: "/user/create",
            name: "create-user",
            component: () => import('../views/CreateUserView.vue'),
            meta: { roles: ["admin"] },
        },
        {
            path: "/documents",
            name: "document",
            component: () => import('../views/DocumentsView.vue'),
            meta: { roles: ["admin", "teacher", "student"]}
        },
        {
            path: "/auth-response",
            redirect: "/login"
        }
    ],
});

router.beforeEach(async (to, from) => {
    if (to.name == 'login') {
        return true;
    }

    try {
        const APICheckTokenCall = `${import.meta.env.VITE_API_URL}/auth/check`;
        const check = await axios.get(APICheckTokenCall, {
            withCredentials: true,
        });

        if (check.data.token == '') {
            return { name: 'login' };
        }

        const APIGetMeCall = `${import.meta.env.VITE_API_URL}/me`;
        const me = await axios.get(APIGetMeCall, {
            withCredentials: true,
        });
        if (to.meta.roles && !to.meta.roles.includes(me.data.role)) {
            return { name: 'home' };
        }

        return true;
    } catch(error) {
        console.error(error)
        return { name: 'login' };
    }
})

export default router;