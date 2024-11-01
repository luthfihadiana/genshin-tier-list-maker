import { RouteRecordRaw} from 'vue-router'

const routes:Readonly<RouteRecordRaw[]> = [
  { path: "/list", name: "Home",  component: () => import("../pages/List.vue")},
  { 
    path: "/list/:id", 
    name: "Detail", 
    component: () => import("../pages/Upsert.vue"),
    beforeEnter: (to, _ , next) => {
      const paramsid = Number(to.params.id);

      // Check if `paramsid` is a valid positive number
      if (isNaN(paramsid) || paramsid <= 0) {
        next({ name: "NotFound" }); // Redirect to a Not Found page or another route
      } else {
        next(); // Allow access to the route
      }
    },
  },
  { path: "/create", name: "Create", component: () => import("../pages/Upsert.vue")},
  { path: "/", redirect: "/list"},
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../pages/NotFound.vue"), // Lazy load a Not Found component
  },
]

export default routes;