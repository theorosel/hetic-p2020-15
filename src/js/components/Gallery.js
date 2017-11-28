import { TweenMax, Power0 } from 'gsap'
import Hammer from 'hammerjs'

class Gallery {
    constructor(el) {
        this.$el                = {}
        this.$el.container      = el
        this.$el.containerInner = this.$el.container.querySelector('.gallery__inner')
        this.$el.items          = this.$el.container.querySelectorAll('.gallery__image')
        this.container          = new Hammer(this.$el.containerInner)

        this.old_move  = 0
        this.temp_move = 0
        this.distance  = 0

        this.init()
    }

    init() {
        this.container.on('panmove', (event) => {
            this.moveGallery(event)
        })

        this.container.on('panend', (event) => {
            this.updateGallery()
        })
    }

    moveGallery(event) {
        this.temp_move = event.deltaX
        if (this.isDraggable(window, this.$el.containerInner)) {
            TweenMax.to(this.$el.containerInner, 0.3, {
                x: this.old_move + this.temp_move,
                ease: Power2.easeNone
            })

            this.$el.items.forEach( 
                (item) => {
                    TweenMax.to(item, 0.5, {
                        x: this.temp_move / 7,
                        ease: Power0.easenone
                    })
            })
        }
    }

    updateGallery() {
        if (!this.isDraggable(window, this.$el.containerInner)) {
            TweenMax.to(this.$el.containerInner, 0.4, {
                x: 0,
                ease: Power0.easeInOut
            })

            this.old_move = 0
            this.temp_move = 0
        } else {
            this.old_move = this.old_move + this.temp_move
        }
    }

    isDraggable(window, layer) {
        const layerLeft = Math.round(layer.getBoundingClientRect().left)
        const layerRight = Math.round(layer.getBoundingClientRect().right - window.innerWidth)
        const limitLeft = Math.round((window.innerWidth / 3) / 2)

        if (layerLeft <= limitLeft && layerRight >= 0) {
            return true   
        } else {
            return false
        }
    }
}

export default Gallery