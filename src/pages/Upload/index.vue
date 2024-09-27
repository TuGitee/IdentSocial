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
                <button class="upload-header-right-send" @click="submit" :disabled="isLoading || !textarea && !fileList.length">
                    <i class="el-icon-loading" v-if="isLoading"></i>发布
                </button>
            </div>
        </div>
        <div class="upload-content">
            <el-input type="textarea" :rows="4" placeholder="这一刻的想法..." v-model="textarea" resize="none"
                autosize></el-input>
            <el-upload action="#" class="upload-content-image" list-type="picture-card" ref="upload"
                :auto-upload="false" multiple :limit="9" :on-change="handleChange" accept="image/*" close>
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
                <button class="upload-content-choices-item" @click="clearAll">
                    <span class="upload-content-choices-item-left"><i class="el-icon-delete"></i>清空所有图片</span><span
                        class="upload-content-choices-item-right"><i class="el-icon-arrow-right"></i></span>
                </button>
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
        handleChange(file, fileList) {
            if (fileList.length > 9) {
                this.$message.error('最多上传9张图片');
                return;
            }
            this.$previewRefresh()
        },
        async submit() {
            if (this.isLoading) return;
            this.isLoading = true;
            let files = this.$refs.upload.uploadFiles;
            const fileList = []
            for (let i = 0; i < files.length; i++) {
                const id = uuid();
                await imageStorage.set(id, files[i].raw);
                fileList[i] = id;
            }
            this.$store.dispatch("postBlog", { text: this.textarea, imgs: fileList }).then(() => {
                setTimeout(() => {
                    this.$router.back();
                });
            }).catch(() => {
                this.$notify({
                    title: '失败',
                    message: '发布失败',
                    type: 'error',
                    duration: 2000
                })
            }).finally(() => {
                this.isLoading = false;
            })

            // files压缩
            // for (let i = 0; i < files.length; i++) {
            //     let file = files[i].raw
            //     let reader = new FileReader()
            //     reader.readAsDataURL(file)
            //     await new Promise((resolve) => {
            //         reader.onload = (e) => {
            //             let img = new Image()
            //             img.src = e.target.result
            //             img.onload = () => {
            //                 let canvas = document.createElement('canvas')
            //                 let ctx = canvas.getContext('2d')
            //                 let width = img.width
            //                 let height = img.height
            //                 canvas.width = width
            //                 canvas.height = height
            //                 ctx.drawImage(img, 0, 0, width, height)
            //                 let base64 = canvas.toDataURL('image/jpeg', 0.5)
            //                 files[i].raw = this.dataURLtoFile(base64, file.name)
            //                 resolve()
            //             }
            //         }
            //     })
            // }

            // let filesList = []
            // for (let i = 0; i < files.length; i++) {
            //     const fd = new FormData()
            //     fd.append('picture', files[i].raw)
            //     try {
            //         let res = await this.$api.post("/picture/upload", fd, {
            //             headers: {
            //                 'Content-Type': 'multipart/form-data'
            //             }
            //         })
            //         if (res.status !== 200) {
            //             this.$notify({
            //                 title: "错误",
            //                 message: "上传失败",
            //                 duration: 2000,
            //                 type: "error"
            //             })
            //             return;
            //         }
            //         filesList.push(res.data.data.link)
            //     } catch (err) {
            //         this.isLoading = false;
            //         this.$notify({
            //             title: "错误",
            //             message: "上传失败",
            //             duration: 2000,
            //             type: "error",
            //         })
            //         return;
            //     }
            // }

            // this.$blogAxios.post('/post', {
            //     content: this.textarea,
            //     userId: this.$store.state.user.token
            // }).then(res => {
            //     this.textarea = ''

            //     this.$blogAxios.post(`/picture`, {
            //         postId: res.data.data,
            //         paths: filesList
            //     }).catch(err => {
            //         throw new Error('fail');
            //     })

            //     this.$notify({
            //         title: "成功",
            //         message: "发布成功",
            //         type: "success",
            //         duration: 2000,

            //     })
            //     this.isLoading = false;
            //     this.$router.go(-1)
            // }).catch(() => {
            //     this.isLoading = false;
            //     this.$notify({
            //         title: "错误",
            //         message: "发布失败",
            //         duration: 2000,
            //         type: "error",
            //     })
            // })

        },
        dataURLtoFile(dataurl, filename) {
            let arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], filename, {
                type: mime
            })
        },
        clearAll() {
            this.$confirm("确认删除所有图片？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: true,
            }).then(() => {
                this.$refs.upload.clearFiles()
            }).catch(() => { })
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
            display: flex;
            justify-content: center;
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
            display: flex;
            justify-content: center;
            align-items: center;

            .upload-header-right-send {
                font-size: 1rem;
                color: white;
                background-color: @purple;
                line-height: 1;
                border-radius: .5rem;
                border: none;
                padding: .5rem .7rem;

                &:disabled {
                    filter: brightness(.9);
                }
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

            @image-size: calc((100vw - 5.6rem) / 3);

            /deep/ .el-upload--picture-card {
                margin: 0.5rem;
                width: @image-size;
                height: @image-size;
                line-height: @image-size;
            }

            /deep/ .el-upload-list--picture-card {
                .el-upload-list__item {
                    margin: 0.5rem;
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