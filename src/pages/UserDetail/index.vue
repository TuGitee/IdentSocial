<template>
    <div id="root">
        User {{ uid }}
    </div>
</template>
  
<script>
export default {
    data() {
        return {

        }
    },
    computed:{
        uid(){
            return  this.$route.params.uid
        }
    }
}
</script>
  
<style></style>