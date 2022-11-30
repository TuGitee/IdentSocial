import Mock from 'mockjs'
import userInfo from './userInfo.json'
import recommendInfo from './recommendInfo.json'
import followingInfo from './followingInfo.json'
import nearbyInfo from './nearbyInfo.json'

Mock.mock("/mock/userInfo", { code: 200, data: userInfo })
Mock.mock("/mock/recommendInfo", { code: 200, data: recommendInfo })
Mock.mock("/mock/nearbyInfo", { code: 200, data: nearbyInfo })
Mock.mock("/mock/followingInfo", { code: 200, data: followingInfo })