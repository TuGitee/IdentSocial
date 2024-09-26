<template>
    <div class="personal-center">
        <!-- 个人主页封面 -->
        <img class="cover" src="/static/cover.jpg"/>
        <!-- 头像 -->
        <div class="avatar-container" @touchstart="chooseImage">
            <img class="avatar" :src="avatar || '/static/default-avatar.png'"/>
            <span class="avatar-text">上传<i class="el-icon-edit"></i>
            </span>

        </div>

        <div class="on">
            <!-- 昵称 -->
            <div class="info-row">
                <span class="label">昵称</span>
                <span class="value">{{ nickname }}
                    <i class="el-icon-arrow-right"></i>
                </span>

            </div>

            <!-- 个性签名 -->
            <div class="info-row">
                <span class="label">个性签名</span>
                <span class="value">{{ signature }}
                    <i class="el-icon-arrow-right"></i>
                </span>
            </div>
            <!-- 个人主页封面 -->
            <div class="info-row">
                <span class="label"><i class="el-icon-camera"></i>个人主页封面</span>
                <span class="value"></span>
            </div>
        </div>
        <div class="onder">
            <!-- 姓名 -->
            <div class="info-row">
                <span class="label">性别</span>
                <span class="value">{{ six }}
                    <i class="el-icon-arrow-right"></i>
                </span>
            </div>

            <!-- 年龄 -->
            <div class="info-row">
                <span class="label">年龄</span>
                <span class="value">{{ age }}
                    <i class="el-icon-arrow-right"></i>
                </span>
            </div>

            <!-- 生日 -->
            <div class="info-row">
                <span class="label">生日</span>
                <span class="value">{{ birthday }}
                    <i class="el-icon-arrow-right"></i>
                </span>
            </div>

            <!-- 现居地 -->
            <div class="info-row">
                <span class="label">现居地</span>
                <span class="value">{{ location }}
                    <i class="el-icon-arrow-right"></i>
                </span>
            </div>
        </div>

    </div>
</template>





<script>
export default {
    data() {
        return {
            nickname: 'Moenning',
            signature: '人生需要动态规划',
            six: '女',
            age: 25,
            birthday: '1998-05-20',
            location: '北京市',
            avatar: '', // 头像路径
        };
    },
    methods: {
        chooseImage() {
            
        },

    }

}
</script>

<style>
.on {
    width: 100%;
    height: 240rpx;
    margin-bottom: 50rpx;
    padding: 30rpx;
    background-color: white;
    border-radius: 10rpx;
    /* border: 1px solid red; */
}

.onder {
    width: 100%;
    height: 340rpx;
    margin-bottom: 100rpx;
    padding: 30rpx;
    border-radius: 10rpx;
    background-color: white;
    /* border: 1px solid green; */
}

.personal-center {
    height: 100vh;
    padding: 0rpx;
    background-color: #F8F2FF;
}

.cover {
    width: 100%;
    height: 200rpx;

}

.info-row {
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10rpx;
}

.label {
    font-size: 28rpx;
    color: #333;
    width: 180rpx;
}

.value {
    font-size: 28rpx;
    color: #666;
    /* border: 1px solid gold; */
}

.el-icon-arrow-right {
    display: block;
    width: 40rpx;
    height: 40rpx;
    /* background-color: pink; */
}



.avatar-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 50rpx;
    border-radius: 50%;
    border: 1px solid gray;
}

.avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.avatar-text {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    position: absolute;
    bottom: -10rpx;
    left: 130rpx;
    right: 0;
    text-align: center;
    font-size: 24rpx;
    color: grey;
    background-color: #F8F2FF;
    /* border: 1px solid red; */
}
</style>
