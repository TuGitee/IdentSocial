<template>
    <div class="my-image">
        <div class="container" :style="{
            paddingTop: ratio * 100 + '%'
        }">
            <img :src="src" v-bind="$attrs" @load="isLoaded = true" @error="isError = true" alt=""
                :class="{ loaded: isLoaded, error: isError }" v-if="src && !isError">
            <div class="my-image-loading" v-else-if="!isLoaded">
                <slot name="loading">
                    <span>加载中...</span>
                </slot>
            </div>
            <div class="my-image-error" v-else>
                <slot name="error">
                    <slot>
                        <span>加载失败</span>
                    </slot>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyImage',
    props: {
        src: {
            type: String,
            default: ''
        },
        ratio: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            isLoaded: false,
            isError: false
        }
    },
    watch: {
        src(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.isLoaded = false;
            this.isError = false;
        }
    },
}
</script>

<style scoped lang="less">
.my-image {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 4px;

    .container {
        width: 100%;
        position: absolute;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 3;
            border-radius: inherit;

            &.error {
                opacity: 0;
            }
        }

        .my-image-loading,
        .my-image-error {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            font-size: .8rem;
            background-color: #f2f2f2;
            color: #aaa;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
        }
    }
}
</style>