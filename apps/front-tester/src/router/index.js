import axios from "axios";
import { createRouter, createWebHistory } from "vue-router";

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
        }
    ],
});

router.beforeEach(async (to, from) => {
    if (to.name == 'login') {
        return true;
    }

    const APIGetMeCall = `${import.meta.env.VITE_API_URL}/me`;

    try {
        const me = await axios.get(APIGetMeCall, {withCredentials: true});
    
        if (!me.data && to.name != 'login') {
            return { name: 'login' };
        }

        if (to.meta.roles && !to.meta.roles.includes(me.data.role)) {
            return { name: 'home' };
        }
    } catch(error) {
        return { name: 'login' };
    }
})

export default router;