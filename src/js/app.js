import {TweenMax, Power0} from 'gsap'
import Hammer from 'hammerjs'
import { enterInView, completelyInView, halfInView } from './utils/view.js'
import getScrollPercent from './utils/scroll.js'
import map from './utils/map.js'

class Hero {
    constructor(el) {
        this.$el                 = {}
        this.$el.container       = el
        this.$el.width           = this.$el.container.offsetWidth
        this.$el.height          = this.$el.container.offsetHeight
        this.$el.line            = this.$el.container.querySelector('.line')
        this.$el.cursor          = this.$el.container.querySelector('.cursor')
        this.$el.cursorDot       = this.$el.container.querySelector('.dot__start--blue')
        this.$el.strokeCircle    = this.$el.container.querySelector('.progress')
        this.$el.strokeProgress  = this.$el.container.querySelector('.progress__value')
        this.$el.boardContainer  = this.$el.container.querySelector('.board__container')
        this.$el.board           = this.$el.container.querySelector('.board__img')
        this.rotationCoef        = 20
        this.$el.shadow          = this.$el.container.querySelector('.shadow')

        this.cursor         = new Hammer(this.$el.cursor)
        this.cursorPosition = 0
        this.temp_move      = 0
        this.lineWidth      = Math.round(this.$el.line.getBoundingClientRect().width)
        this.strokeRadius   = 54
        this.strokeCircum   = Math.round(2 * Math.PI * this.strokeRadius)
        this.cursor.obj = {
            leftLimit:  Math.round(this.$el.line.getBoundingClientRect().left),
            rightLimit: Math.round(this.$el.line.getBoundingClientRect().left + this.$el.line.getBoundingClientRect().width),
            active: false,
            lock: false
        }
    }

    /*
     * init()
     * Build the drag system, Set inital data
     * and place event listeners
     */
    init() {
        console.log(this.$el.container,this.$el.height, this.$el.board);
        this.cursor.on('panstart', (event) => {
            this.cursor.obj.active = true
            this.$el.board.classList.remove('levitate')
        })
        
        this.cursor.on('panmove', (event) => {
            
            this.cursorPosition = Math.round(this.$el.cursor.getBoundingClientRect().left) + (this.$el.cursor.offsetWidth / 2)
            let value = map(this.cursorPosition, this.cursor.obj.leftLimit, this.cursor.obj.rightLimit, 0, 1);
            this.temp_move = Math.round(event.deltaX)

            if (this.cursor.obj.active != false) {
                if (value >= 0 && value <= 1) {

                    // Update Cursor position
                    new TweenMax(this.$el.cursor, 0.3, {
                        x: this.temp_move,
                        ease: Power0.easenone
                    })

                    // Update Cursor dot blue opacity
                    new TweenMax(this.$el.cursorDot, 0.3, {
                        opacity: value,
                        ease: Power0.easenone
                    })

                    new TweenMax(this.$el.board, 0.3, {
                        y: - (this.temp_move / 2),
                        scale: 1 + (this.temp_move / 1500),
                        ease: Power0.easenone
                    })

                    new TweenMax(this.$el.shadow, 0.3, {
                        scale: 1 + (this.temp_move / 1500),
                        ease: Power0.easenone
                    })

                    // Update Cursor strock procgress
                    this.updateStroke(value)
                }
                if (this.cursorPosition >= this.cursor.obj.rightLimit) {
                    alert('Bien joué BG')
                    this.cursor.obj.active = false
                    this.cursor.obj.lock = true
                    // ... Call heroLeave function
                }
            }
        })

        this.cursor.on('panend', (event) => {
            let middle = Math.round(this.$el.line.getBoundingClientRect().width / 2)

            if (this.temp_move >= 0 && this.temp_move >= middle) {

                // Update Cursor position
                new TweenMax(this.$el.cursor, 0.7, {
                    x: this.lineWidth,
                    ease: Power3.easeOut
                })

                // Update Cursor Stroke circle
                new TweenMax(this.$el.strokeProgress, 0.7, {
                    strokeDashoffset: 0,
                    ease: Power3.easeOut
                })

                new TweenMax(this.$el.board, 0.7, {
                    y: - (this.lineWidth / 2),
                    ease: Power0.easenone
                })

                // ... Call heroLeave function
                setTimeout( () => {
                    alert("Hello");
                }, 700);
            }
            else if (this.temp_move < middle) {
                // this.$el.board.classList.add('levitate')

                // Update Cursor position
                new TweenMax(this.$el.cursor, 0.7, {
                    x: 0,
                    ease: Power3.easeOut
                })
                // Update Cursor Stroke circle
                new TweenMax(this.$el.strokeProgress, 0.7, {
                    strokeDashoffset: this.strokeCircum,
                    ease: Power3.easeOut
                })

                new TweenMax(this.$el.board, 0.7, {
                    y: 0,
                    ease: Power0.easenone
                })

            }
        })

        if (window.matchMedia("(min-width: 600px)").matches) {

            console.log('desktop');
            this.$el.container.addEventListener('mousemove', (event) => {
                let x = event.clientX
                let y = event.clientY
                let mapX = map(x, 0, this.$el.width, -1, 1)
                let mapY = map(y, 0, this.$el.height, -1, 1)

                // console.log(mapX, mapY);

                new TweenMax(this.$el.boardContainer, 0.9, {
                    x: mapX * this.rotationCoef,
                    y: mapY * this.rotationCoef,
                    rotationX: mapX * this.rotationCoef,
                    rotationY: mapY * this.rotationCoef,
                    rotationZ: 0,
                    ease: Power0.easeOut
                })
            })
        }
        else {
            console.log('mobile');
            this.$el.container.addEventListener('devicemotion', (event) => {
                // ... Do something on mobile using gyroscope
                console.log(event)
                console.log('yo');
            })
        }

        window.addEventListener('resize', () => {
            this.resize()
        })
    }


    /*
     * updateStroke(Value : float)
     * Fill the stroke circle according to drag value
     * and place event listeners
     */
    updateStroke(value) {
        let dashoffset = this.strokeCircum * (1 - value);

        this.$el.strokeProgress.style.strokeDashoffset = dashoffset;
        this.$el.strokeProgress.style.strokeDasharray = this.strokeCircum;
        // console.log('progress:', value + '%', '|', 'offset:', dashoffset)
    }


    /*
     * resize()
     * Fill the stroke circle according to drag value
     * and place event listeners
     */
    resize() {
        this.cursor.obj.leftLimit = Math.round(this.$el.line.getBoundingClientRect().left),
        this.cursor.obj.rightLimit = Math.round(this.$el.line.getBoundingClientRect().left + this.$el.line.getBoundingClientRect().width),
        this.cursorPosition = Math.round(this.$el.cursor.getBoundingClientRect().left) + (this.$el.cursor.offsetWidth / 2)
    }
}

const hero = new Hero(document.querySelector('.hero'))
hero.init()
