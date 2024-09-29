<template>
    <MaleIcon v-if="gender"></MaleIcon>
    <FemaleIcon v-else></FemaleIcon>
</template>

<script>
import MaleIcon from '@/icons/MaleIcon';
import FemaleIcon from '@/icons/FemaleIcon';
export default {
    components: {
        MaleIcon,
        FemaleIcon
    },
    props: {
        gender: {
            type: Number,
            default: 1
        }
    }
}
</script>