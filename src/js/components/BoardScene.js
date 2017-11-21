import {TweenMax, Power0, Power2, Power1, Expo, Power3, TimelineMax} from 'gsap'
import scrollToPlugin from 'gsap/src/uncompressed/plugins/ScrollToPlugin.js'
import Hammer from 'hammerjs'
import {getScrollPercent} from '../utils/scroll.js'
import map from '../utils/map.js'


class BoardScene {
    constructor(el, window) {
        this.$el                 = {}
        this.$el.container       = el
        this.$el.width           = this.$el.container.offsetWidth
        this.$el.height          = this.$el.container.offsetHeight
        this.$titleParts         = this.$el.container.querySelectorAll('.text-word')
        this.$el.line            = this.$el.container.querySelector('.control__line')
        this.$el.cursor          = this.$el.container.querySelector('.cursor')
        this.$el.strokeCircle    = this.$el.container.querySelector('.progress')
        this.$el.strokeProgress  = this.$el.container.querySelector('.progress__value')
        this.$el.boardContainer  = this.$el.container.querySelector('.board__container')
        this.$el.board           = this.$el.container.querySelector('.board__img')
        this.rotationCoef        = 20
        this.$el.shadow          = this.$el.container.querySelector('.board__shadow')

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

    /**
     * Build the drag system, Set inital data
     * and place event listeners
     * @method init
     */
    init() {
        
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

                    TweenMax.to(this.$el.cursor, 0.3, {
                        x: this.temp_move,
                        ease: Power0.easenone
                    })

                    TweenMax.to(this.$el.board, 0.3, {
                        y: - (this.temp_move / 5),
                        z: 0,
                        scale: 1 + (this.temp_move / 1500),
                        ease: Power0.easenone
                    })

                    TweenMax.to(this.$el.shadow, 0.3, {
                        scale: 1 + (this.temp_move / 1500),
                        ease: Power0.easenone
                    })

                    this.updateStroke(value)
                    this.updateTitleParts(value)
                }
                if (this.cursorPosition >= this.cursor.obj.rightLimit) {
                    this.cursor.obj.active = false
                    this.cursor.obj.lock = true

                    setTimeout( () => {
                        TweenLite.to(window, 1.2, {
                            scrollTo: window.innerHeight,
                            ease: Power3.easeInOut
                        });
                    }, 1000);
                }
            }
        })

        this.cursor.on('panend', (event) => {
            let middle = Math.round(this.$el.line.getBoundingClientRect().width / 2)
            if (this.temp_move >= 0 && this.temp_move >= middle) {
                // Update Cursor position
                TweenMax.to(this.$el.cursor, 0.7, {
                    x: this.lineWidth,
                    ease: Power3.easeOut
                })
                // Update Cursor Stroke circle
                TweenMax.to(this.$el.strokeProgress, 0.7, {
                    strokeDashoffset: 0,
                    ease: Power3.easeOut
                })

                TweenMax.to(this.$el.board, 0.7, {
                    y: - (this.lineWidth / 5),
                    z: 0,
                    ease: Power0.easenone
                })

                // this.$titleParts.forEach( 
                //     (part, index) => {
                //         TweenMax.to(part, 0.1, {
                //             y: - ((value * (100 / ((index * 0.1) + 1)))),
                //             ease: Power0.easenone
                //         })
                // });

                setTimeout( () => {
                    TweenLite.to(window, 2, {
                        scrollTo: window.innerHeight,
                        ease: Power3.easeInOut
                    });
                }, 1000);
            } else if (this.temp_move < middle) {
                this.$el.board.classList.add('levitate')

                // Update Cursor X position
                TweenMax.to(this.$el.cursor, 0.7, {
                    x: 0,
                    ease: Power3.easeOut
                })
                // Update Cursor Stroke circle fill
                TweenMax.to(this.$el.strokeProgress, 0.7, {
                    strokeDashoffset: this.strokeCircum,
                    ease: Power3.easeOut
                })

                // Update board Y position
                TweenMax.to(this.$el.board, 0.7, {
                    y: 0,
                    ease: Power0.easenone
                })

                // Update title parts Y positions
                this.$titleParts.forEach( 
                    (part, index) => {
                        TweenMax.to(part, 0.5, {
                            y: 0,
                            ease: Power0.easenone
                        })
                });

            }
        })

        if (window.matchMedia("(min-width: 600px)").matches) {
            this.$el.container.addEventListener('mousemove', (event) => {
                let x = event.clientX
                let y = event.clientY
                let mapX = map(x, 0, this.$el.width, -1, 1)
                let mapY = map(y, 0, this.$el.height, -1, 1)

                TweenMax.to(this.$el.boardContainer, 0.7, {
                    x: mapX * this.rotationCoef,
                    y: mapY * this.rotationCoef,
                    rotationZ: 0,
                    ease: Power0.easeOut
                })
            })
        } else {
            console.log('mobile');
            this.$el.container.addEventListener('devicemotion', (event) => {
                // ... Do something on mobile using gyroscope
                console.log(event)
            })
        }

        window.addEventListener('resize', () => {
            this.resize()
        })

        window.addEventListener('scroll', () => {
            let scrollPercent = getScrollPercent(document.querySelector('.video-intro'))
            this.boardLeave(scrollPercent)
            this.titlePartsLeave(scrollPercent)
        })
    }


    /**
     * Update Stroke circle fill according to value
     * @method uupdateStroke
     * @param {float} value : value of the section scrolled
     */
    updateStroke(value) {
        let dashoffset = this.strokeCircum * (1 - value);

        this.$el.strokeProgress.style.strokeDashoffset = dashoffset;
        this.$el.strokeProgress.style.strokeDasharray = this.strokeCircum;
    }


    /**
     * Update Title parts Y positions according to value
     * @method updateTitleParts
     * @param {float} value : value of the section scrolled
     */
    updateTitleParts(value) {
        this.$titleParts.forEach( 
            (part, index) => {
                TweenMax.to(part, 0.5, {
                    y: - ((value * (100 / ((index * 0.1) + 1)))),
                    ease: Power0.easenone
                })
        });
    }
    
    /**
     * Get the board off the screen on z axis according to
     * @method boardLeave
     * @param {float} value : value of the section scrolled
     */
    boardLeave(value) {
        TweenMax.to(this.$el.board, 0.3, {
            z: - value * 15,
            ease: Power0.easenone
        })
        TweenMax.to(this.$el.shadow, 0.3, {
            z: - value * 15,
            ease: Power0.easenone
        })
    }

    /**
     * Get title parts off the screen on y axis according to a value
     * @method titlePartsLeave
     * @param {float} value : value of the section scrolled
     */
    titlePartsLeave(value) {
        this.$titleParts.forEach( 
            (part, index) => {
                console.log('part : ' + part, 'index : ' + value * index)

                TweenMax.to(part, 0.5, {
                    y: - ((value * (10 / ((index * 0.1) + 1)))),
                    ease: Power0.easenone
                })
        });
    }


    /**
     * Update controls positions listenning resize event
     * @method resize
     */
    resize() {
        this.cursor.obj.leftLimit = Math.round(this.$el.line.getBoundingClientRect().left),
        this.cursor.obj.rightLimit = Math.round(this.$el.line.getBoundingClientRect().left + this.$el.line.getBoundingClientRect().width),
        this.cursorPosition = Math.round(this.$el.cursor.getBoundingClientRect().left) + (this.$el.cursor.offsetWidth / 2)
    }
}

export default BoardScene;
