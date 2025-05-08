import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import QuizView from "../views/QuizView.vue";
import IdentificationView from "../views/IdentificationView.vue";
import WorldsView from "../views/WorldsView.vue";
import MissionView from "../views/MissionView.vue";
import RoleView from "../views/RoleView.vue";
import GradeView from "../views/GradeView.vue";
import ProcessingView from "../views/ProcessingView.vue";
import ResultView from "../views/ResultView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/quiz",
    name: "quiz",
    component: QuizView,
  },
  {
    path: "/identification",
    name: "identification",
    component: IdentificationView,
  },
  {
    path: "/worlds",
    name: "worlds",
    component: WorldsView,
  },
  {
    path: "/mission",
    name: "mission",
    component: MissionView,
  },
  {
    path: "/role",
    name: "role",
    component: RoleView,
  },
  {
    path: "/grade",
    name: "grade",
    component: GradeView,
  },
  {
    path: "/processing",
    name: "processing",
    component: ProcessingView,
  },
  {
    path: "/result",
    name: "result",
    component: ResultView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
