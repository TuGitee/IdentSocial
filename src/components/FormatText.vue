<template>
    <p class="text">
        <template v-for="(item, index) in textList">
            <router-link v-if="determineComponent(item) === 'router-link'" :to="determineLink(item)" :key="index"
                @click.stop>
                {{ determineText(item) }}
            </router-link>
            <br v-else-if="determineComponent(item) === 'br'" :key="index" />
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
            return this.text.split(/(@\[.+?\]\(.+?\)|\n)/);
        },
    },
    methods: {
        determineComponent(item) {
            return item.startsWith('@') ? 'router-link' : item === '\n' ? 'br' : 'span';
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
            } else if (item === '\n') {
                return '<br>';
            } else {
                return item;
            }
        },
    },
};
</script>