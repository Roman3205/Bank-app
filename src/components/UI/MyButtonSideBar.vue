<template>
    <button class="btn btn-outline-primary"><slot></slot></button>
</template>

<script>
    export default {
        name: 'my-button-bar'
    }
</script>

<style lang="scss" scoped>
    @mixin flex-mix($direction, $justify, $align, $gap) {
        display: flex;
        flex-direction: $direction;
        justify-content: $justify;
        align-items: $align;
        gap: $gap;
    }

    button {
        width: 85%;
        border-width: 2px;
        transition: 0.8s ease;
        @include flex-mix(row, left, center, 10px);
        padding-left: 25px;
        font-size: 15px;
    }
</style>