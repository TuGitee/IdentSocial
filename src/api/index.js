import { userRequest, blogRequest } from "./request";
import { getToken } from "@/utils/token";
import mockRequest from './mockRequest';

export const reqMockUser = (id) => mockRequest.get(`/user/${id}`);
export const reqMockUserLogin = (email, password) => mockRequest.post(`/user/login`, { email, password });
export const reqMockUserRegister = (email, password) => mockRequest.post(`/user`, { email, password })
export const reqMockVerify = (email, code) => mockRequest.post(`/verify`, { email, code });
export const reqMockVerifyCode = (email) => mockRequest.get(`/verify?email=${email}`);
export const reqMockPostList = (page = 1, limit = 10) => mockRequest.get(`/post?page=${page}&limit=${limit}`);
export const reqMockPost = (id) => mockRequest.get(`/post/${id}`);
export const reqMockPostComment = (id) => mockRequest.get(`/comment/${id}`);
export const reqMockAddPostComment = (bid, cid, text) => mockRequest.post(`/comment`, { cid, text, bid, uid: getToken() });
export const reqUserInfo = (id) => userRequest.get(`/user?userId=${id}`);
export const reqRecommendInfo = (cur, pagesize) => blogRequest.get(`/post/recommend?current=${cur}&pageSize=${pagesize}`);
export const reqFollowingInfo = (id) => userRequest.get(`/relationship/1?userId=${id}`);
export const findUserBlog = (id) => blogRequest.get(`/post/1?userId=${id}`);