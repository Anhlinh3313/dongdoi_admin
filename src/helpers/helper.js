import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();

export const getLoggedInUser = () => {
  const user = sessionStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

//login
export const postLogin = (data) => api.create(url.API_USER_LOGIN, data);

//posts
export const insertPosts = (data) => api.create(url.API_POST_INSERT, data);
export const updatePosts = (id, data) =>
  api.update(`${url.API_POST_UPDATE}/${id}`, data);
export const getPagingPostsV2 = (data) =>
  api.get(url.API_POST_GET_PAGING_V2, data);
export const deletePosts = (id, data) =>
  api.delete(`${url.API_POST_DELETE}/${id}`, data);
export const getPostById = (id, data) =>
  api.get(`${url.API_POST_GET_BY_ID}/${id}`, data);

//Menu
export const insertMenu = (data) => api.create(url.API_MENU_INSERT, data);
export const updateMenu = (id, data) =>
  api.update(`${url.API_MENU_UPDATE}/${id}`, data);
export const getAllMenu = (data) => api.get(url.API_MENU_GET_PAGING, data);
export const deleteMenu = (id, data) =>
  api.delete(`${url.API_MENU_DELETE}/${id}`, data);
export const getMenuById = (id, data) =>
  api.get(`${url.API_MENU_GET_PAGING_BY_ID}/${id}`, data);

//Role
export const insertRole = (data) => api.create(url.API_ROLE_INSERT, data);
export const updateRole = (id, data) =>
  api.update(`${url.API_ROLE_UPDATE}/${id}`, data);
export const deleteRole = (id, data) =>
  api.delete(`${url.API_ROLE_DELETE}/${id}`, data);
export const getAllRole = (data) => api.get(url.API_ROLE_GETALL, data);
export const getPagingRole = (data) => api.get(url.API_ROLE_GET_PAGING, data);
export const getRoleById = (id, data) =>
  api.get(`${url.API_ROLE_GET_PAGING_BY_ID}/${id}`, data);

//Action
export const insertAction = (data) => api.create(url.API_ACTION_INSERT, data);
export const updateAction = (id, data) =>
  api.update(`${url.API_ACTION_UPDATE}/${id}`, data);
export const deleteAction = (id, data) =>
  api.delete(`${url.API_ACTION_DELETE}/${id}`, data);
export const getAllAction = (data) => api.get(url.API_ACTION_GETALL, data);
export const getPagingAction = (data) =>
  api.get(url.API_ACTION_GET_PAGING, data);
export const getActionById = (id, data) =>
  api.get(`${url.API_ACTION_GET_PAGING_BY_ID}/${id}`, data);

//RoleAction
export const insertRoleAction = (data) =>
  api.create(url.API_ROLEACTION_INSERT, data);
export const updateRoleAction = (id, data) =>
  api.update(`${url.API_ROLEACTION_UPDATE}/${id}`, data);
export const insertManyRoleAction = (data) =>
  api.create(url.API_ROLEACTION_INSERTMANY, data);
export const updateManyRoleAction = (id, data) =>
  api.update(`${url.API_ROLEACTION_UPDATEMANY}/${id}`, data);
export const deleteRoleAction = (id, data) =>
  api.delete(`${url.API_ROLEACTION_DELETE}/${id}`, data);
export const getPagingRoleAction = (data) =>
  api.get(url.API_ROLEACTION_GET_PAGING, data);
export const getRoleActionById = (id, data) =>
  api.get(`${url.API_ROLEACTION_GET_PAGING_BY_ID}/${id}`, data);

//User
export const insertUser = (data) => api.create(url.API_USER_INSERT, data);
export const updateUser = (id, data) =>
  api.update(`${url.API_USER_UPDATE}/${id}`, data);
export const deleteUser = (id, data) =>
  api.delete(`${url.API_USER_DELETE}/${id}`, data);
export const getAllUser = (data) => api.get(url.API_USER_GETALL, data);
export const getPagingUser = (data) => api.get(url.API_USER_GET_PAGING, data);
export const getUserById = (id, data) =>
  api.get(`${url.API_USER_GET_PAGING_BY_ID}/${id}`, data);

//Slide
export const insertSlide = (data) => api.create(url.API_SLIDE_INSERT, data);
export const updateSlide = (id, data) =>
  api.update(`${url.API_SLIDE_UPDATE}/${id}`, data);
export const deleteSlide = (id, data) =>
  api.delete(`${url.API_SLIDE_DELETE}/${id}`, data);
export const getAllSlide = (data) => api.get(url.API_SLIDE_GETALL, data);
export const getPagingSlide = (data) =>
  api.get(url.API_SLIDE_GET_PAGING, data);
export const getSlideById = (id, data) =>
  api.get(`${url.API_SLIDE_GET_PAGING_BY_ID}/${id}`, data);

//Banner Slide
export const insertBannerSlide = (data) => api.create(url.API_BANNER_SLIDE_INSERT, data);
export const updateBannerSlide = (id, data) =>
  api.update(`${url.API_BANNER_SLIDE_UPDATE}/${id}`, data);
export const deleteBannerSlide = (id, data) =>
  api.delete(`${url.API_BANNER_SLIDE_DELETE}/${id}`, data);
export const getAllBannerSlide = (data) => api.get(url.API_BANNER_SLIDE_GETALL, data);
export const getPagingBannerSlide = (data) =>
  api.get(url.API_BANNER_SLIDE_GET_PAGING, data);
export const getBannerSlideById = (id, data) =>
  api.get(`${url.API_BANNER_SLIDE_GET_PAGING_BY_ID}/${id}`, data);

//Bank
export const insertBank = (data) => api.create(url.API_BANK_INSERT, data);
export const updateBank = (id, data) => api.update(`${url.API_BANK_UPDATE}/${id}`, data);
export const deleteBank = (id, data) => api.delete(`${url.API_BANK_DELETE}/${id}`, data);
export const getAllBank = (data) => api.get(url.API_BANK_GETALL, data);
export const getPagingBank = (data) => api.get(url.API_BANK_GET_PAGING, data);
export const getBankById = (id, data) => api.get(`${url.API_BANK_GET_PAGING_BY_ID}/${id}`, data);

//AccountBank
export const insertAccountBank = (data) => api.create(url.API_ACCOUNTBANK_INSERT, data);
export const updateAccountBank = (id, data) => api.update(`${url.API_ACCOUNTBANK_UPDATE}/${id}`, data);
export const deleteAccountBank = (id, data) => api.delete(`${url.API_ACCOUNTBANK_DELETE}/${id}`, data);
export const getAllAccountBank = (data) => api.get(url.API_ACCOUNTBANK_GETALL, data);
export const getPagingAccountBank = (data) => api.get(url.API_ACCOUNTBANK_GET_PAGING, data);
export const getAccountBankById = (id, data) => api.get(`${url.API_ACCOUNTBANK_GET_PAGING_BY_ID}/${id}`, data);

//Thumbnail
export const insertThubnail = (data) => api.create(url.API_THUMBNAIL_INSERT, data);
export const updateThubnail = (id, data) =>
  api.update(`${url.API_THUMBNAIL_UPDATE}/${id}`, data);
export const deleteThubnail = (id, data) =>
  api.delete(`${url.API_THUMBNAIL_DELETE}/${id}`, data);
export const getAllThubnail = (data) => api.get(url.API_THUMBNAIL_GETALL, data);
export const getPagingThubnail = (data) =>
  api.get(url.API_THUMBNAIL_GET_PAGING, data);
export const getThubnailById = (id, data) =>
  api.get(`${url.API_THUMBNAIL_GET_PAGING_BY_ID}/${id}`, data);