// layout
import { DefaultLayout, AdminLayout } from "../components/layouts/index";
import AdminWeb from "../pages/admin/adminWeb";
import Banner from "../pages/banner/banner";
import CreateBanner from "../pages/banner/createBanner";
import AdCategory from "../pages/category/Category";
import CreateCategory from "../pages/category/createCategory";
import EdtCategory from "../pages/category/edtCategory";
import Home from "../pages/Home";
import RoleList from "../pages/role/RoleList";
import Setting from "../pages/settings/setting";
import StaticalJobPostGeneral from "../pages/statisticalMail.js/StaticalJobPostGeneral";
import StaticalJobPostSpecific from "../pages/statisticalMail.js/StaticalJobPostSpecific";
import StaticalProductCategory from "../pages/statisticalMail.js/StaticalProductCategoryGeneral";
import StaticalProduct from "../pages/statisticalMail.js/StaticalProductGeneral";
import StatisticalJobApplicationGeneral from "../pages/statisticalMail.js/StatisticalJobApplicationGeneral";
import StatisticalBlogs from "../pages/statisticalMail.js/StatisticsBlog";
import ManageTag from "../pages/tag/ManageTag";
import AdUser from "../pages/User/AdUser";

const publicRoutes = [
  // auth
  { path: "/", component: Home, layout: DefaultLayout },
  {
    path: "/thong_ke/blog",
    component: StatisticalBlogs,
    layout: DefaultLayout,
  },
  {
    path: "/thong_ke/san_pham",
    component: StaticalProduct,
    layout: DefaultLayout,
  },
  {
    path: "/thong_ke/the_loai",
    component: StaticalProductCategory,
    layout: DefaultLayout,
  },
  {
    path: "/thong_ke/don_ung_tuyen",
    component: StatisticalJobApplicationGeneral,
    layout: DefaultLayout,
  },
  {
    path: "/thong_ke/ung_tuyen",
    component: StaticalJobPostGeneral,
    layout: DefaultLayout,
  },

  {
    path: "/thong_ke/tuyen_dung",
    component: StaticalJobPostSpecific,
    layout: DefaultLayout,
  },

  {
    path: "/tag",
    component: ManageTag,
    layout: DefaultLayout,
  },
  {
    path: "/the_loai",
    component: AdCategory,
    layout: DefaultLayout,
  },
  {
    path: "/the_loai/tao_the_loai",
    component: CreateCategory,
    layout: DefaultLayout,
  },
  {
    path: "/the_loai/sua_the_loai/:id",
    component: EdtCategory,
    layout: DefaultLayout,
  },
  {
    path: "/banners",
    component: Banner,
    layout: DefaultLayout,
  },
  {
    path: "/banners/tao_banner",
    component: CreateBanner,
    layout: DefaultLayout,
  },
  {
    path: "/setting",
    component: Setting,
    layout: DefaultLayout,
  },
];

const privateRoutes = [
  {
    path: "/user",
    component: AdUser,
    layout: DefaultLayout,
  },
  {
    path: "/thong_tin_web",
    component: AdminWeb,
    layout: DefaultLayout,
  },

  {
    path: "/role",
    component: RoleList,
    layout: DefaultLayout,
  },
];

export { publicRoutes, privateRoutes, DefaultLayout, AdminLayout };
