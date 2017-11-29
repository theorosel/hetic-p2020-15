import { TweenMax, TimelineMax, Power3, Power2 } from 'gsap'
import map from '../utils/map.js'
import TextSplitter from './TextSplitter.js'

class Marker {
    constructor(el) {
        this.$el             = {}
        this.$el.container   = el
        this.$el.zone
        this.$el.svg
        this.$el.stroke
        this.$el.progress
        this.$el.content
        this.$el.title
        this.$el.description
        this.timelineReveal  = new TimelineMax();
        this.timelineEnter   = new TimelineMax();
        this.hover           = false
        this.zoneLimits = {}
        this.title   = this.$el.container.getAttribute('data-title')
        this.description = this.$el.container.getAttribute('data-description')

        this.init()
    }

    init() {
        this.build()
        this.setHandler()
    }

    build() {
       const template =
       `<div class="marker__zone"></div>
        <div class="marker__circle">
            <svg class="marker__svg">
                <circle class="marker__stroke" cx="36" cy="35" r="30" stroke-width="3" />
                <circle class="marker__progress" cx="36" cy="35" r="30" stroke-width="8" />
            </svg>
        </div>
        <div class="marker__content">
            <h3 class="marker__title">${ this.title }</h3>
            <p class="marker__description">${ this.description }</p>
        </div>`

        this.$el.container.innerHTML = template

        this.$el.zone        = this.$el.container.querySelector('.marker__zone')
        this.$el.svg         = this.$el.container.querySelector('.marker__svg')
        this.$el.stroke      = this.$el.container.querySelector('.marker__stroke')
        this.$el.progress    = this.$el.container.querySelector('.marker__progress')
        this.$el.content     = this.$el.container.querySelector('.marker__content')

        this.$el.title       = new TextSplitter(
            this.$el.container.querySelector('.marker__title'), {
                inner: true,
                lastWordBlue: true
            }
        )

        this.$el.description = new TextSplitter(
            this.$el.container.querySelector('.marker__description'), {
                inner: true,
                lastWordBlue: false
            }
        )

        TweenMax.set(this.$el.description.$words, {
            y: 100
        })

        TweenMax.set(this.$el.title.$words, {
            y: 100
        })
    }

    setHandler() {
        this.$el.zone.addEventListener('mouseenter', () => {
            this.updateLimits()
            this.hover = true

            if (this.$el.container.classList.contain = 'active') {
                this.$el.container.classList.add('active')
                this.reveal();
                this.restart();
            }
        })

        this.$el.zone.addEventListener('mouseleave', () => {
            this.hover = false
            this.reverse();

            if (this.$el.container.classList.contain = 'active') {
                this.$el.container.classList.remove('active')

            }
        })

        this.$el.zone.addEventListener('mousemove', (event) => {
            if (this.hover == true) {
                this.updateContentPosition(event)
            } else {
                return false
            }
        })
    }

    reveal() {
        this.timelineReveal
            .staggerTo(this.$el.title.$words, 0.9, {
                y: 0,
                opacity: 1,
                ease: Power3.easeOut
            }, 0.01,'enter')
            .staggerTo(this.$el.description.$words, 0.9, {
                y: 0,
                opacity: 1,
                ease: Power3.easeOut
            }, 0.01,'enter')
            .to(this.$el.svg, 0.9, {
                scale: 0.6,
                ease: Power3.easeInOut
            }, 'enter')
    }

    reverse() {
        this.timelineReveal.reverse();
    }

    restart() {
        this.timelineReveal.restart();
    }

    updateLimits() {
        this.zoneLimits.top = this.$el.zone.getBoundingClientRect().top
        this.zoneLimits.right = this.$el.zone.getBoundingClientRect().left + this.$el.zone.offsetWidth
        this.zoneLimits.bottom = this.$el.zone.getBoundingClientRect().top + this.$el.zone.offsetHeight
        this.zoneLimits.left = this.$el.zone.getBoundingClientRect().left
        this.zoneLimits. width = this.$el.zone.offsetWidth
        this.zoneLimits. height = this.$el.zone.offsetHeight
    }

    updateContentPosition(event) {
        const mappedX = map(event.clientX, this.zoneLimits.left, this.zoneLimits.right, -1, 1)
        const mappedY = map(event.clientY, this.zoneLimits.bottom, this.zoneLimits.top, 1, -1)

        TweenMax.to(this.$el.content, 0.3, {
            x: mappedX * 200,
            y: mappedY * 200,
            ease: Power2.easeNone
        })
    }
}

export default Marker
