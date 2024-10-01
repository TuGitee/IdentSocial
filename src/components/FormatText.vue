<template>
    <p class="text">
        <template v-for="(item) in textList">
            <router-link v-if="determineComponent(item) === 'router-link'" :to="determineLink(item)" :key="item"
                @click.stop>
                {{ determineText(item) }}
            </router-link>
            <template v-else>{{ item }}</template>
        </template>
    </p>
</template>

<script>
export default {
    props: {
        text: String,
    },
    computed: {
        textList() {
            return this.text.split(/(@\[.+?\]\(.+?\))/);
        },
    },
    methods: {
        determineComponent(item) {
            return item.startsWith('@') ? 'router-link' : 'span';
        },
        determineLink(item) {
            const match = item.match(/@\[.+?\]\((.+?)\)/);
            if (match) {
                const uid = match[1];
                return {
                    name: 'UserDetail',
                    params: {
                        uid,
                    },
                };
            } else {
                return {};
            }
        },
        determineText(item) {
            if (this.determineComponent(item) === 'router-link') {
                return item.replace(/(@)\[(.+?)\]\(.+?\)/, '$1$2');
            } else {
                return item;
            }
        },
    },
};
</script>

<style scoped lang="less">
.text {
    a {
        color: @purple;
    }
}
</style>