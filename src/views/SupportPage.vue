<script>

import axios from 'axios'
import dayjs from 'dayjs'
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            colorChat: state =>  state.colorChat,
            backgroundBlock: state => state.backgroundBlock,
            background: state => state.background,
        })
    }    
}

</script>

<template>
    <div class="container">
        <div class="wrapper">
            <div class="block-box">
                <div class="info-user">
                    <div class="user-chat">
                        Ассистент
                    </div>
                </div>
                <div class="messages-container">
                    <h5 style="text-align: center;">Сообщений пока нет</h5>
                    <div class="message-r">
                        <div class="writer">
                            <img src="@/assets/images/user.png" width="50" alt="">
                        </div>
                        <div class="text-message">
                            <div>Тестовое сообщение</div>
                            <div class="date left"><p><sub>12:25 6 августа</sub></p></div>
                        </div>
                    </div>
                    <div class="message-r">
                        <div class="writer">
                            <img src="@/assets/images/user.png" width="50" alt="">
                        </div>
                        <div class="text-message">
                            <div>Тестовое сообщение</div>
                            <div class="date left"><p><sub>12:25 6 августа</sub></p></div>
                        </div>
                    </div>
                    <div class="message-l">
                        <div class="writer">
                            <img src="@/assets/images/assistant.png" width="40" alt="">
                        </div>
                        <div class="text-message">
                            <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic nobis maiores, ea cupiditate voluptatum ad minima, exercitationem dolorum deleniti explicabo necessitatibus minus sint fuga voluptate earum dolor libero corrupti assumenda eligendi in quis distinctio iusto quasi delectus. Eligendi blanditiis ipsam molestiae? Totam pariatur sed quis dolorum numquam, quod vero recusandae officia enim iusto iste delectus dolor voluptate assumenda maiores fuga dolorem necessitatibus. Incidunt voluptas nulla illum possimus ipsa, fugit quae accusamus eius ipsam recusandae cumque officia et itaque, rem ratione exercitationem non temporibus quia, quas tenetur cupiditate. Sapiente nihil minima quas autem fuga voluptas perferendis magnam laborum ducimus cum. Quaerat quibusdam deleniti cumque hic, doloremque reprehenderit id aliquam laborum illum molestiae nobis laboriosam voluptas, illo repellat odio ipsum quos voluptatem. Omnis fugit blanditiis earum nobis, quisquam mollitia ducimus ipsa eius praesentium ad, assumenda voluptatibus dolore exercitationem, quia asperiores quae dolorem voluptates accusantium. Ex exercitationem nemo beatae dicta libero quis accusamus. Cumque sunt veritatis quo voluptatem deserunt, iusto asperiores totam omnis assumenda, facilis unde soluta? Assumenda mollitia repudiandae, architecto et itaque error debitis sit, consequatur blanditiis cum at vel deleniti culpa. Quos inventore quo nesciunt temporibus ipsum ipsa labore suscipit harum cupiditate, illum ipsam molestias vero, dolore ad, culpa eius. Quam.</div>
                            <div class="date left"><p><sub>12:25 6 августа</sub></p></div>
                        </div>
                    </div>
                </div>
                <div class="send-message-form">
                    <form @submit="sendMessage">
                        <input type="text" class="form-control" >
                        <my-button-reg type="submit" class="btn-outline-primary">Отправить</my-button-reg>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/support.scss';

    * {
        color: v-bind(colorChat);
    }

    .block-box, .message-r, .message-l {
        background-color: v-bind(backgroundBlock);
    }
</style>