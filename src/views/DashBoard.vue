<script>

export default {
    data() {
        return {
            month: [
                {
                    name: 'Август',
                    topUp: 53,
                    withdraw: 23
                },
                {
                    name: 'Сентябрь',
                    topUp: 25,
                    withdraw: 86
                },
                {
                    name: 'Октябрь',
                    topUp: 35,
                    withdraw: 50
                }
            ]
        }
    }
}

</script>

<template>
    <div class="container">
        <div class="left">
                <div class="finance">
                    <h2><b>Финансовый отчет</b></h2>
                    <div class="blocks">
                        <div class="balance me-2">
                            <p>Пополнения</p>
                            <p class="rub-m"><b>23212</b><b><i class="fa fa-rub"></i></b></p>
                        </div>
                        <div class="spent me-2">
                            <p>Затраты</p>
                            <p class="rub-m"><b>5212</b><b><i class="fa fa-rub"></i></b></p>
                        </div>
                        <div class="saving">
                            <p>Сбережения</p>
                            <p class="rub-m"><b>1322</b><b><i class="fa fa-rub"></i></b></p>
                        </div>
                    </div>
                </div>
                <div class="wallet-block">
                <h2><b>Мой кошелек</b></h2>
                <select>
                    <option>2022 2013 8847 2819</option>
                    <option>3212 2013 8237 2819</option>
                </select>
                <div class="card">
                    <p>Роман Романов</p>
                    <p>06/30</p>
                    <p><b>2131 3103 8130 1210</b></p>
                </div>
                <h5><b>Счет карты</b></h5>
                <div class="money-wallet"><div class="rub"><i class="fa fa-rub"></i></div><p class="rub-m"><b>2 102,03</b> <i class="fa fa-rub"></i></p></div>
            </div>
        </div>
        <div class="right">
            <div class="block-top">
                <div class="statistics">
                    <h2><b>Статистика</b></h2>
                    <div class="blocks">
                        <div class="count">
                            <p>8000</p>
                            <p>5000</p>
                            <p>3000</p>
                            <p>1000</p>
                            <p>500</p>
                            <p>300</p>
                            <p>0</p>
                        </div>
                        <div class="time">
                            <div class="month" v-for="(item) in month">
                                <div class="stat">
                                    <div class="top-up" :style="{height: item.topUp + '%'}"></div>
                                    <div class="withdrawals" :style="{height: item.withdraw + '%'}"></div>
                                </div>
                                <p>{{ item.name }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="spent-diagram">
                    <h2><b>Диаграмма расходов</b><br><span class="text-secondary">в этом месяце</span></h2>
                    <div class="blocks">
                        <div class="percent">
                            <svg viewBox="0 0 36 36" class="circular-chart">
                                <path class="circle" stroke-dasharray="100, 100" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path class="circle" stroke-dasharray="85, 100" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path class="circle" stroke-dasharray="60, 100" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path class="circle" stroke-dasharray="30, 100" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div class="text-block-info">
                                <h2><b>232 <i class="fa fa-rub"></i></b></h2>
                            </div>
                        </div>
                        <div class="withdraw">
                            <div class="category">
                                <div class="one"></div><p>ЖКХ, связь, интернет</p>
                            </div>
                            <div class="category">
                                <div class="two"></div><p>Супермаркеты</p>
                            </div>
                            <div class="category">
                                <div class="three"></div><p>Транспорт</p>
                            </div>
                            <div class="category">
                                <div class="four"></div><p>Подписки</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="transactions-history">
                <h2><b>Операции</b></h2>
                <p class="text-secondary">Последнии 3 операции по счету за 2023 год</p>
                <div class="blocks">
                    <div class="titles">
                        <p>Имя</p>
                        <p>Дата</p>
                        <p>Номер транзакции</p>
                        <p>Переведено</p>
                        <p>Статус</p>
                    </div>
                    <div class="transactions-block">
                        <div class="transaction" v-for="index in 3">
                            <div class="name">
                                <img src="../assets/images/user.png" width="30" alt="">
                                <p><b>Роман</b></p>
                            </div>
                            <div class="date">
                                5 авг. в 19:30
                            </div>
                            <div class="id">
                                ASF3213221FS
                            </div>
                            <div class="money rub-m">
                                <b>13213</b><i class="fa fa-rub"></i>
                            </div>
                            <div class="status">
                                <p class="text-success">Выполнено</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import '../assets/sass/dashboard.scss';

</style>
