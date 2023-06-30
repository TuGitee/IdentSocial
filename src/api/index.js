import { userRequest, blogRequest } from "./request";

import mockRequest from './mockRequest';

export const reqMockUserInfo = () => mockRequest.get('/userInfo');
export const reqMockRecommendInfo = () => mockRequest.get('/recommendInfo');
export const reqMockFollowingInfo = () => mockRequest.get('/followingInfo');
export const reqMockNearbyInfo = () => mockRequest.get('/nearbyInfo');

export const reqUserInfo = (id) => userRequest.get(`/user?userId=${id}`);
export const reqRecommendInfo = (cur,pagesize) => blogRequest.get(`/post/recommend?current=${cur}&pageSize=${pagesize}`);
export const reqFollowingInfo = (id) => userRequest.get(`/relationship/1?userId=${id}`);
export const findUserBlog = (id) => blogRequest.get(`/post/1?userId=${id}`);