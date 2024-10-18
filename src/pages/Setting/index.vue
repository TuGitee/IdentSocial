<template>
    <div id="root" class="setting">
        <header>
            <button class="back" @click="goBack">
                <i class="el-icon-arrow-left"></i>
                <b>返回</b>
            </button>
            <h1 class="title"># 设置</h1>
        </header>
        <main>
            <el-form v-if="currentInfo" action="#" @submit.native.prevent="submit" label-position="top">
                <el-form-item label="用户名">
                    <el-input v-model="currentInfo.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload accept="image/*" :show-file-list="false" action="#" :limit="1"
                        :on-change="(file) => handleUpload(file, 'avatar')">
                        <el-image v-if="currentInfo.avatarUrl" :src="currentInfo.avatarUrl" class="avatar"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="currentInfo.gender">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="个人介绍">
                    <el-input type="textarea" autosize v-model="currentInfo.intro"
                        placeholder="这个人很懒，什么都没有留下..."></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="currentInfo.age" type="number" step="1" :min="0" :max="100"
                        placeholder="0~100"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="currentInfo.email" type="email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="currentInfo.phone" type="phone" step="1" :min="0" placeholder="请输入电话"></el-input>
                </el-form-item>
                <el-form-item label="背景">
                    <el-upload accept="image/*" :show-file-list="false" action="#" :limit="1"
                        :on-change="(file) => handleUpload(file, 'background')">
                        <el-image v-if="currentInfo.backgroundUrl" :src="currentInfo.backgroundUrl"
                            class="background"></el-image>
                        <i v-else class="el-icon-plus background-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">修改</el-button>
                </el-form-item>
            </el-form>
        </main>
    </div>
</template>

<script>
import { set } from '@/utils/storage';
import { mapState } from 'vuex';

export default {
    name: 'Setting',
    methods: {
        goBack() {
            this.$router.back();
        },
        getCurrentInfo() {
            return this.$store.dispatch("getUserInfo");
        },
        handleUpload(file, key) {
            this.currentInfo[`${key}Url`] = URL.createObjectURL(file.raw);
            this.currentInfo[key] = file.raw;
        },
        checkInfo() {
            if (!this.currentInfo.username.trim()) {
                this.currentInfo.username = `用户 ${this.userInfo.id.slice(-4)}`;
            }
            if (!this.currentInfo.intro.trim()) {
                this.currentInfo.intro = '这个人很懒，什么都没有留下...';
            }
            return true;
        },
        async submit() {
            this.checkInfo();
            if (this.currentInfo.avatar) {
                const key = await set(this.currentInfo.avatar);
                this.currentInfo.avatar = key;
            }
            if (this.currentInfo.background) {
                const key = await set(this.currentInfo.background);
                this.currentInfo.background = key;
            }
            this.$store.dispatch("updateUserInfo", this.currentInfo).then(() => {
                this.goBack();
                this.$message.success("修改成功");
            });
        }
    },
    computed: {
        ...mapState({ userInfo: state => state.user.userInfo })
    },
    data() {
        return {
            currentInfo: null,
        };
    },
    mounted() {
        this.getCurrentInfo().then(() => {
            const { username, avatar, gender, intro, age, email, background, phone, avatarUrl, backgroundUrl } = this.userInfo;
            this.currentInfo = { username, avatar, gender, intro, age, email, background, phone, avatarUrl, backgroundUrl };
            console.log(this.currentInfo);

        });
    }
}
</script>

<style scoped lang="less">
@import "@/css/user.less";

.setting {
    main {
        /deep/ .el-upload {
            width: 50%;

            .el-image {
                border-radius: 4px;
            }
        }

        .el-button {
            width: 100%;
        }

        .el-textarea {
            /deep/ .el-textarea__inner {
                padding-top: 8.5px;
                padding-bottom: 8.5px;
            }
        }
    }
}
</style>