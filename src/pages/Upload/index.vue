<template>
    <div class="upload" id="root">
        <div class="upload-header">
            <div class="upload-header-left" @click="goBack">
                <i class="el-icon-arrow-left"></i>
                取消
            </div>
            <div class="upload-header-center">
                <span class="upload-header-center-send">发表动态</span>
            </div>
            <div class="upload-header-right">
                <el-button class="upload-header-right-send" type="primary" @click="submit" :disabled="isLoading || !textarea && !fileList.length">
                    <i class="el-icon-loading" v-if="isLoading"></i>
                    <span v-else>发布</span>
                </el-button>
            </div>
        </div>
        <div class="upload-content">
            <el-input type="textarea" :rows="4" placeholder="这一刻的想法..." v-model="textarea" resize="none"
                autosize></el-input>
            <el-upload action="#" class="upload-content-image" list-type="picture-card" ref="upload"
                :auto-upload="false" multiple :limit="9" :on-exceed="handleExceed" :on-change="handleChange" accept="image/*" close>
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" preview="上传文件" ref="preview">
                    <div class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                            <i class="el-icon-delete"></i>
                        </span>
                        <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                    </div>
                </div>
            </el-upload>

            <div class="upload-content-choices">
                <button class="upload-content-choices-item">
                    <span class="upload-content-choices-item-left"><i
                            class="el-icon-location-outline"></i>所在位置</span><span
                        class="upload-content-choices-item-right"><i class="el-icon-arrow-right"></i></span>
                </button>
                <button class="upload-content-choices-item">
                    <span class="upload-content-choices-item-left"><i class="el-icon-view"></i>谁可以看</span><span
                        class="upload-content-choices-item-right"><i class="el-icon-arrow-right"></i></span>
                </button>
            </div>
        </div>

    </div>
</template>

<script>
import * as imageStorage from '@/utils/storage'
import { v4 as uuid } from 'uuid';
export default {
    name: "Upload",
    data() {
        return {
            textarea: '',
            isLoading: false,
            fileList: []
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        handlePreview(file) {
            Array.from(document.querySelectorAll(".el-upload-list__item-thumbnail")).forEach(item => {
                if (item.src === file.url) {
                    item.click();
                }
            })
        },
        handleRemove(file) {
            this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(item => item !== file)
        },
        handleChange() {
            this.$previewRefresh()
        },
        handleExceed(file, fileList) {
            if (fileList.length >= 9) {
                this.$message.error("最多上传9张图片");
                return
            }
            const newFileList = Array.from(file).slice(0, 9 - fileList.length).map(item => ({ raw: item, url: URL.createObjectURL(item), uid: uuid()}));
            fileList.push(...newFileList);
        },
        async submit() {
            if (this.isLoading) return;
            this.isLoading = true;
            let files = this.$refs.upload.uploadFiles;
            const fileList = []
            for (let i = 0; i < files.length; i++) {
                const id = await imageStorage.set(files[i].raw);
                fileList[i] = id;
            }
            this.$store.dispatch("postBlog", { text: this.textarea, imgs: fileList }).then(() => {
                setTimeout(() => {
                    this.$router.back();
                });
            }).catch(() => {
                this.$message.error("发布失败")
            }).finally(() => {
                this.isLoading = false;
            })
        },
    },
    mounted() {
        this.fileList = this.$refs.upload.uploadFiles || [];
    }
}
</script>

<style scoped lang="less">
@import "@/css/user.less";

.upload {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    img {
        user-select: none;
        -webkit-user-drag: auto;
    }

    .upload-header {
        width: calc(100% - 2.4rem);
        padding: .5rem 0rem;
        // padding-top: calc(constant(safe-area-inset-top) + 0.5rem);
        // padding-top: calc(env(safe-area-inset-top) + 0.5rem);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;
        line-height: 1rem;
        position: fixed;
        user-select: none;

        .upload-header-left {
            width: fit-content;
            height: 100%;
            width: 4rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            i {
                font-size: 1.1rem;
            }
        }

        .upload-header-center {
            width: fit-content;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
            font-size: 1.1rem;
        }

        .upload-header-right {
            height: 100%;
            width: 4rem;
            display: flex;
            justify-content: center;
            align-items: center;

            .upload-header-right-send {
                font-size: 1rem;
                width: 100%;
                color: white;
                line-height: 1;
                border-radius: .5rem;
                border: none;
                padding: .5rem .7rem;
            }
        }
    }

    .upload-content {
        width: calc(100% - 2.4rem);
        position: fixed;
        overflow: scroll;
        top: calc(constant(safe-area-inset-top) + 3rem);
        top: calc(env(safe-area-inset-top) + 3rem);
        height: calc(100vh - constant(safe-area-inset-top) - 3rem);
        height: calc(100vh - env(safe-area-inset-top) - 3rem);
        // padding: 0 1.2rem;

        /deep/ .el-textarea {

            textarea {
                border: none;
                line-height: 1.5;
                font-size: 1rem;
                user-select: text;
                padding-left: 0;
                padding-right: 0;
                background-color: transparent;
            }
        }

        &-image {
            margin-top: 4rem;
            user-select: none;

            @image-size: calc((100vw - 3.8rem) / 3);

            /deep/ .el-upload--picture-card {
                margin: 0.2rem;
                width: @image-size;
                height: @image-size;
                line-height: @image-size;
            }

            /deep/ .el-upload-list--picture-card {
                line-height: 0;
                font-size: 0;

                .el-upload-list__item {
                    margin: 0.2rem;
                    border: none;
                    border-radius: .5rem;
                    width: @image-size;
                    height: @image-size;
                    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);

                    &>div {
                        width: @image-size;
                        height: @image-size;
                    }
                }
            }

            .el-upload-list__item-thumbnail {
                object-fit: cover;
            }
        }

        &-choices {
            user-select: none;
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            margin-top: 1rem;
            padding-bottom: calc(constant(safe-area-inset-bottom) + 3rem);
            padding-bottom: calc(env(safe-area-inset-bottom) + 3rem);

            &-item {
                font-size: 1rem;
                line-height: 1;
                padding: 1.2rem 0.8rem;
                background-color: transparent;
                border: none;
                color: #333;
                border-top: 0.5px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;

                &:last-child {
                    border-bottom: 0.5px solid #ddd;
                }

                .upload-content-choices-item-left {
                    font-size: 1rem;
                    line-height: 1;
                    display: flex;
                    align-items: center;

                    i {
                        font-size: 1.2rem;
                        margin-right: 1rem;
                    }

                }

                .upload-content-choices-item-right {
                    font-size: 1rem;
                    line-height: 1;
                    display: flex;
                    align-items: center;

                    i {
                        font-size: 1.2rem;
                        margin-left: .5rem;
                    }
                }

            }
        }
    }


}
</style>