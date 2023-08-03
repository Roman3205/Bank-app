<script>

</script>

<template>
    <div class="container">
        <img src="../assets/images/404.png" width="400" alt="">
        <h1>Страница не найдена</h1>
        <button class="btn btn-outline-primary">Вернуться на главную</button>
    </div>
</template>

<style scoped lang="scss">
    .container {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 30px;
    
        button {
            padding: 10px 125px;
            border-width: 2px;
            transition: 0.8s ease;
            font-size: 15px;
        }
    }

    @media screen and (max-width: 900px) {
        .container {
            padding: 0px 30px;

            img, h1 {
                width: 100%;
            }

            button {
                width: 100%;
                padding: 15px 0;
                font-size: 18px;
            }
        }
    }
</style>