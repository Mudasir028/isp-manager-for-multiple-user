import Index from "views/Index.js";
import Users from "views/examples/users";
import Packages from "views/examples/packages";
import Franchises from "views/examples/franchise";
import CreateUser from "views/examples/createUser";
import CreatePackage from "views/examples/createPackage";
import CreateFranchise from "views/examples/createFranchise";
import UserBills from "views/examples/userBills";
import Subscriptions from "views/examples/subscriptions";
import PaidBills from "views/examples/paidBills";
import SubscribePackage from "views/examples/subscribePackage";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/isp",
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni  ni-single-02 text-yellow",
    component: Users,
    layout: "/isp",
  },
  {
    path: "/packages",
    name: "Packages",
    icon: "ni ni-planet text-red",
    component: Packages,
    layout: "/isp",
  },
  {
    path: "/franchises",
    name: "Franchises",
    icon: "ni ni-app",
    component: Franchises,
    layout: "/isp",
  },
  {
    path: "/create-user",
    name: "Create User",
    icon: "ni ni-user-run text-pink",
    component: CreateUser,
    layout: "/isp",
  },
  {
    path: "/create-package",
    name: "Create Package ",
    icon: " ni ni-diamond text-blue",
    component: CreatePackage,
    layout: "/isp",
  },
  {
    path: "/create-Franchise",
    name: "Create Franchise ",
    icon: " ni ni-shop text-yellow",
    component: CreateFranchise,
    layout: "/isp",
  },
  {
    path: "/subscribe-package",
    name: "Subscribe Package",
    icon: "ni ni-delivery-fast text-purple",
    component: SubscribePackage,
    layout: "/isp",
  },
  {
    path: "/subscriptions",
    name: "Subscriptions",
    icon: "ni ni-spaceship text-vilet",
    component: Subscriptions,
    layout: "/isp",
  },
  {
    path: "/user-bills",
    name: "Unpaid Bills ",
    icon: "ni ni-money-coins text-red",
    component: UserBills,
    layout: "/isp",
  },
  {
    path: "/paid-bills",
    name: "Paid Bills ",
    icon: "ni ni-money-coins text-green",
    component: PaidBills,
    layout: "/isp",
  },
];
export default routes;
