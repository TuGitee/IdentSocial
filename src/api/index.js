import { userRequest, blogRequest } from "./request";
import { getToken } from "@/utils/token";
import mockRequest from './mockRequest';

export const reqMockUser = (id) => mockRequest.get(`/user/${id}`);
export const reqMockUserLogin = (email, password) => mockRequest.post(`/user/login`, { email, password });
export const reqMockUserRegister = (email, password) => mockRequest.post(`/user`, { email, password })
export const reqMockUpdateUser = (userInfo) => mockRequest.put(`/user`, userInfo);
export const reqMockVerify = (email, code) => mockRequest.post(`/verify`, { email, code });
export const reqMockVerifyCode = (email) => mockRequest.get(`/verify?email=${email}`);
export const reqMockPostList = (page = 1, limit = 10) => mockRequest.get(`/post?page=${page}&limit=${limit}`);
export const reqMockUserPostList = (uid, page = 1, limit = 10) => mockRequest.get(`/post/user?page=${page}&limit=${limit}&uid=${uid}`);
export const reqMockFollowPostList = (page = 1, limit = 10) => mockRequest.get(`/post/follow?page=${page}&limit=${limit}&uid=${getToken()}`);
export const reqMockPost = (id) => mockRequest.get(`/post/${id}`);
export const reqMockAddPost = (text, imgs, postFrom) => mockRequest.post(`/post`, { text, imgs, uid: getToken(), postFrom });
export const reqMockDeletePost = (id) => mockRequest.delete(`/post/${id}`);
export const reqMockPostComment = (id) => mockRequest.get(`/comment/${id}`);
export const reqMockAddPostComment = (bid, cid, text) => mockRequest.post(`/comment`, { cid, text, bid, uid: getToken() });
export const reqMockDeletePostComment = (id) => mockRequest.delete(`/comment/${id}`);
export const reqMockFollow = (fid, isFollow) => mockRequest.post(`/follow`, { fid, isFollow, uid: getToken() });
export const reqMockFollowList = (uid = getToken()) => mockRequest.get(`/follow/${uid}`);
export const reqMockFollowerList = (uid = getToken()) => mockRequest.get(`/follower/${uid}`);
export const reqMockLikeList = () => mockRequest.get(`/like/${getToken()}`);
export const reqMockLike = (bid, isLike) => mockRequest.post(`/like`, { bid, isLike, uid: getToken() });
export const reqUserInfo = (id) => userRequest.get(`/user?userId=${id}`);
export const reqRecommendInfo = (cur, pagesize) => blogRequest.get(`/post/recommend?current=${cur}&pageSize=${pagesize}`);
export const reqFollowingInfo = (id) => userRequest.get(`/relationship/1?userId=${id}`);
export const findUserBlog = (id) => blogRequest.get(`/post/1?userId=${id}`);