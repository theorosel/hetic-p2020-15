class TextSplitter {
    constructor(el) {
        this.$el           = {}
        this.$el.container = el
        this.string        = this.$el.container.innerText
        this.$words        = []

        this.initParts()
    }

    initParts() {
        const words = this.string.split(' ')
        this.$el.container.innerText = ''

        words.forEach(
            (word, index) => {
                const $word = document.createElement('div')
                const $wordInner = document.createElement('div')

                $word.classList.add('text-word')
                $wordInner.classList.add('text-word__inner')
                $wordInner.innerText = word

                if (index === words.length - 1) {
                    $word.classList.add('text-word--blue')
                }

                $word.appendChild($wordInner)
                this.$words.push($word)
                this.$el.container.appendChild($word)
            }
        )
        return this.$words
    }
}

export default TextSplitter

