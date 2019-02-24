import Vue from "vue";
import Router from "vue-router";
import EventCreate from "./views/EventCreate.vue";
import EventList from "./views/EventList.vue";
import EventShow from "./views/EventShow.vue";
import NProgress from "nprogress";
import store from "@/store/store";
import NotFound from "@/views/NotFound.vue";
import NetworkIssue from "@/views/NetworkIssue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "event-list",
      component: EventList,
      props: true
    },
    {
      path: "/event/:id",
      name: "event-show",
      component: EventShow,
      props: true,
      async beforeEnter(to, from, next) {
        try {
          const event = await store.dispatch("event/fetchEvent", to.params.id);
          to.params.event = event;
          next();
        } catch (error) {
          console.log("TCL: }catch -> error", error);
          if (error.response && error.response.status === 404) {
            next({ name: "404", params: { resource: "event" } });
          } else {
            next({ name: "network-issue" });
          }
        }
      }
    },
    {
      path: "/event/create",
      name: "event-create",
      component: EventCreate
    },
    {
      path: "404",
      name: "404",
      component: NotFound,
      props: true
    },
    {
      path: "/network-issue",
      name: "network-issue",
      component: NetworkIssue
    },
    {
      path: "*",
      redirect: { name: "404", params: { resource: "page" } }
    }
  ]
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
