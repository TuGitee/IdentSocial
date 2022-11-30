import request from "./request";

import mockRequest from './mockRequest';

export const reqMockUserInfo = () => mockRequest.get('/userInfo');
export const reqMockRecommendInfo = () => mockRequest.get('/recommendInfo');
export const reqMockFollowingInfo = () => mockRequest.get('/followingInfo');
export const reqMockNearbyInfo = () => mockRequest.get('/nearbyInfo');