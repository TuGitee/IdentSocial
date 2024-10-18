<template>
    <header class="header" :class="{ light }">
        <BackButton></BackButton>
        <h1 class="title" v-if="title" v-text="title"></h1>
        <slot></slot>
    </header>
</template>

<script>
import BackButton from '@/components/BackButton';
export default {
    name: 'PageHeader',
    components: {
        BackButton
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        light: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped lang="less">
header {
    --color: @black;
    --shadow: 0 0 4px @white;

    &.light {
        --color: @white;
        --shadow: 0 0 4px @black;
    }

    .title {
        margin-top: 12px;
        margin-bottom: 12px;
        color: transparent;
        width: fit-content;
        background: linear-gradient(45deg, @purple, @pink);
        -webkit-background-clip: text;
    }
}
</style>