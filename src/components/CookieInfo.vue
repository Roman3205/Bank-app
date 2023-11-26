<template>
    <transition name="cookie-alert">
        <div v-if="cookieAlert" class="cookie-block">
            <div class="text-top">
                <h2><b>Мы используем cookie</b></h2>
                <i class="fa fa-times" @click="closeAlert"></i>
            </div>
            <div class="text-bottom">
                <p class="text-secondary">
                    Чтобы улучшить работу сайта и предоставить вам больше возможностей.<br> Продолжая использовать сайт, вы соглашаетесь с условиями пользования cookie
                </p>
                <my-button-reg @click="acceptCookie">Согласен</my-button-reg>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            cookieAlert: {
                type: Boolean,
                default: false
            }
        },

        methods: {
            acceptCookie() {
                this.$emit('accept', false)
            },

            closeAlert() {
                this.$emit('update:cookieAlert', false)
            }
        },

        emits: ['accept', 'update:cookie-alert']
    }
</script>

<style lang="scss" scoped>
    .cookie-alert-leave-from, .cookie-alert-leave-active {
        opacity: 1;
        transition: all 0.6s ease-in;
        transform: translateX(30px);
    }

    .cookie-alert-leave-to {
        opacity: 0;
        transition: all 0.6s ease-in;
    }

    .cookie-block {
        position: absolute;
        bottom: 30px;
        right: 30px;
        background-color: #fff;
        padding: 20px 30px;
        display: flex;
        flex-direction: column;
        border-radius: 20px;
        border: 2px solid gray;
        min-width: 900px;
        gap: 10px;

        .text-top, .text-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        p {
            margin: 0;
        }

        h2 {
            font-size: 24px!important;
        }

        i.fa-times {
            font-size: 25px;
            margin-top: -5px;
            cursor: pointer;
            transition: 0.7s ease;

            &:hover {
                opacity: 0.65;
            }
        }
    }
</style>