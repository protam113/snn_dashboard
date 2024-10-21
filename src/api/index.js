import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

let apiCallCount = 0;

const authApi = (token = null) => {
  const config = {
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const instance = axios.create(config);

  instance.interceptors.request.use(
    (request) => {
      apiCallCount += 1;

      const apiName = endpoints
        ? Object.keys(endpoints).find((key) => request.url === endpoints[key])
        : null;

      console.log(
        `API Call #${apiCallCount}: ${apiName || "Unknown API"} - ${
          request.url
        }`
      );

      return request;
    },
    (error) => {
      // Xử lý lỗi request
      return Promise.reject(error);
    }
  );

  return instance;
};

// Các endpoint API
const endpoints = {
  web: process.env.REACT_APP_Web_ENDPOINT,
  login: process.env.REACT_APP_LOGIN_ENDPOINT,
  refreshLogin: process.env.REACT_APP_refreshLogin_ENDPOINT,
  Verify: process.env.REACT_APP_Verify_ENDPOINT,
  currentUser: process.env.REACT_APP_currentUser_ENDPOINT,
  UserInfo: process.env.REACT_APP_UserInfo_ENDPOINT,
  UpdateProfile: process.env.REACT_APP_UpdateProfile_ENDPOINT,
  ChangePassword: process.env.REACT_APP_ChangePassword_ENDPOINT,
  createUser: process.env.REACT_APP_createUser_ENDPOINT,
  AdminUser: process.env.REACT_APP_AdminUser_ENDPOINT,
  Categories: process.env.REACT_APP_Categories_ENDPOINT,
  Category: process.env.REACT_APP_Category_ENDPOINT,
  Tag: process.env.REACT_APP_Tag_ENDPOINT,
  TagId: process.env.REACT_APP_TagId_ENDPOINT,
  Recruitment: process.env.REACT_APP_Recruitment_ENDPOINT,
  UserBanner: process.env.REACT_APP_UserBanner_ENDPOINT,

  // Admin_role
  AdminBanner: process.env.REACT_APP_AdminBanner_ENDPOINT,
  Banner: process.env.REACT_APP_BannerId_ENDPOINT,
  GroupList: process.env.REACT_APP_GroupList_ENDPOINT,
  GroupAllUser: process.env.REACT_APP_GroupAllUser_ENDPOINT,
  GroupUser: process.env.REACT_APP_GroupUser_ENDPOINT,
  AddUser: process.env.REACT_APP_AddUser_ENDPOINT,
  RemoveUser: process.env.REACT_APP_RemoveUser_ENDPOINT,
  //  Statical
  StaticalUser: process.env.REACT_APP_StaticalUser_ENDPOINT,
  StaticalProductCategoryGeneral:
    process.env.REACT_APP_StaticalProductCategoryGeneral_ENDPOINT,
  StaticalBlogGeneral: process.env.REACT_APP_StaticalBlogGeneral_ENDPOINT,
  StaticalProductGeneral: process.env.REACT_APP_StaticalProductGeneral_ENDPOINT,
  StaticalProductCategorySpecific:
    process.env.REACT_APP_StaticalProductCategorySpecific_ENDPOINT,
  StaticalJobPostGeneral: process.env.REACT_APP_StaticalJobPostGeneral_ENDPOINT,
  StaticalJobApplicationGeneral:
    process.env.REACT_APP_StaticalJobApplicationGeneral_ENDPOINT,
  StaticalJobPostSpecific:
    process.env.REACT_APP_StaticalJobPostSpecific_ENDPOINT,

  Permission: process.env.REACT_APP_Permission_ENDPOINT,
  Roles: process.env.REACT_APP_Roles_ENDPOINT,
  Role: process.env.REACT_APP_Role_ENDPOINT,
  RoleDecentralize: process.env.REACT_APP_RoleDecentralize_ENDPOINT,
  UserJopPost: process.env.REACT_APP_UserJopPost_ENDPOINT,
  AdminUserSearch: process.env.REACT_APP_AdminUserSearch_ENDPOINT,
};

const authApiPrivate = authApi();
authApiPrivate.defaults.withCredentials = true;

export { authApi, endpoints, baseURL, authApiPrivate };
