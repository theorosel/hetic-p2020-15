/** Class which split a string and return array of words. */
class TextSplitter {
    /**
     * Create a Board Scene.
     * @param {DOM} el - the Dom element
     * @param {object} options
     *      - @param {boolean} innner : true if we want word in a parent clip
     *      - @param {boolean} lastWordBlue : true if we want the last word blue
     */
    constructor(el, options) {
        this.$el           = {}
        this.$el.container = el
        this.options       = options
        this.string        = this.$el.container.innerText
        this.$words        = []

        this.initParts()
    }

    /**
     * Get the board off the screen on z axis according to
     * @method initParts()
     * call in init()
     */
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

                if (this.options.inner) {
                    this.$words.push($wordInner)
                    this.$words.push($word)
                } else {
                    this.$words.push($word)
                }

                if (index === words.length - 1) {
                    if(this.options.lastWordBlue) {
                        $word.classList.add('text-word--blue')
                    }
                }

                $word.appendChild($wordInner)
                // this.$words.push($word)
                this.$el.container.appendChild($word)
            }
        )
        return this.$words
    }
}

export default TextSplitter

