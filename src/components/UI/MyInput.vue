<template>
    <input :="$attrs" class="form-control" autocomplete="off" @input="inputText" :value="modelValue">
</template>

<script>
    export default {
        name: 'my-input',
        inheritAttrs: false,

        props: {
            modelValue: [String, Number]
        },

        methods: {
            inputText(event) {
                let value = event.target.value
                this.$emit('update:model-value', value.trim())
            }
        },

        emits: ['update:model-value']
    }
</script>

<style lang="scss" scoped>
    input {
        border-radius: 10px;
        color: #ebebeb;
        border: 3px solid rgb(172, 172, 172);
        background-color: inherit;
        height: 55px;
        font-size: 1.1rem;
    
        &:active {
            color: #ebebeb;
        }

        &:focus {
            background-color: inherit;
            color: #ebebeb;
        }
    }

    input::-webkit-input-placeholder {
        color: #fff;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
</style>