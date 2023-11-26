<template>
    <button class="btn" type="submit"><slot></slot></button>
</template>

<script>
    export default {
        name: 'my-button-reg'
    }
</script>

<style lang="scss" scoped>
    button {
        font-size: 1.1rem;
        height: 55px;
        color: #fff;
        transition: all 0.7s ease;
        background-color: rgb(106, 167, 253);
        border: 3px solid rgb(106, 167, 253);
    
        &:active, &:focus {
            border: 3px solid rgb(106, 167, 253);
        }

        &:hover {
            opacity: 0.75;
            border: 3px solid rgb(106, 167, 253);
        }
    }
</style>