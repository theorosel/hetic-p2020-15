class TextSlider {
    constructor(el) {
        this.$el           = {}
        this.$el.container = el
        this.facts         = ['technology', 'Progress', 'Future', 'Slide']
        this.rollParts     = []
        this.currentIndex  = 0
        this.intervalValue = 2500
        this.interval      = null
        this.isPlaying     = false

        this.initParts()
    }

    initParts() {
        this.$el.container.innerHTML = ''
        this.facts.forEach(
            fact => {
                const $part = document.createElement('span')

                $part.classList.add('roll__part')
                $part.innerText = fact

                this.rollParts.push($part)
                this.$el.container.appendChild($part)
            }
        )

        this.rollParts.forEach(
            (part, index) => {
                if(index > 0) {
                    part.style.transform = 'translateY(100%)'
                }
            }
        )
    }

    roll() {
        const transition = 'all 1.8s cubic-bezier(1, 0.01, 0.04, 1.04)'
        const none = 'none'

        if(this.currentIndex == 0) {
            this.rollParts[this.currentIndex].style.transform = 'translateY(-100%)'
            this.rollParts[this.currentIndex].style.transition = transition

            this.rollParts[this.currentIndex + 1].style.transform = 'translateY(0%)'
            this.rollParts[this.currentIndex + 1].style.transition = transition

            this.rollParts[this.rollParts.length - 1].style.transform = 'translateY(100%)'
            this.rollParts[this.rollParts.length - 1].style.transition = none
        }
        else if (this.currentIndex >= 0 && this.currentIndex < this.rollParts.length - 1 ) {
            if(this.rollParts[this.currentIndex - 1]) {
                this.rollParts[this.currentIndex - 1].style.transform = 'translateY(100%)'
                this.rollParts[this.currentIndex - 1].style.transition = none
            }
            this.rollParts[this.currentIndex].style.transform = 'translateY(-100%)'
            this.rollParts[this.currentIndex].style.transition = transition

            this.rollParts[this.currentIndex + 1].style.transform = 'translateY(0%)'
            this.rollParts[this.currentIndex + 1].style.transition = transition

        } else if(this.currentIndex == this.rollParts.length - 1) {
            this.rollParts[this.currentIndex - 1].style.transform = 'translateY(100%)'
            this.rollParts[this.currentIndex - 1].style.transition = none

            this.rollParts[this.currentIndex].style.transform = 'translateY(-100%)'
            this.rollParts[this.currentIndex].style.transition = transition

            this.rollParts[0].style.transform = 'translateY(0%)'
            this.rollParts[0].style.transition = transition
            this.currentIndex = -1
        }
        this.currentIndex ++
    }

    play() {
        this.interval = setInterval(() => {
            this.roll()
        }, this.intervalValue)
        this.isPlaying = true
    }

    pause() {
        clearInterval(this.interval)
        this.isPlaying = false
    }
}

export default TextSlider

