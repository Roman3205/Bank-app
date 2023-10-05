let cardMixin = {
    methods: {
        getNumberCorrect(val) {
            let valueCard = String(val)
            let part1 = valueCard.slice(0, 4)
            let part2 = valueCard.slice(4, 8)
            let part3 = valueCard.slice(8, 12)
            let part4 = valueCard.slice(12, 16)
            return String(part1 + ' ' + part2 + ' ' + part3 + ' ' + part4)
        }
    }
}

export default cardMixin