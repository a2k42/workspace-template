<script setup lang="ts">

</script>

<template>
    <button>
        <slot />
    </button>
</template>

<style scoped>
button {
    background: linear-gradient(70deg, #999, #CCC);
    cursor: pointer;
    padding: 1em;
}
</style>
