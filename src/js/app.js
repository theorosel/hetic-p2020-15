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
        // this.$el.board           = document.querySelector('.board__img')
        // this.$el.shadow          = document.querySelector('.shadow')

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

        this.cursor.on('panstart', (event) => {
            this.cursor.obj.active = true
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

                // ... Call heroLeave function
                setTimeout( () => {
                    alert("Hello");
                }, 700);
            }
            else if (this.temp_move < middle) {
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

            }
        })

        window.addEventListener('resize', () => {
            this.resize()
        })
    }

    updateStroke(value) {
        let dashoffset = this.strokeCircum * (1 - value);
        // console.log('progress:', value + '%', '|', 'offset:', dashoffset)

        this.$el.strokeProgress.style.strokeDashoffset = dashoffset;
        this.$el.strokeProgress.style.strokeDasharray = this.strokeCircum;
    }

    resize() {
        this.cursor.obj.leftLimit = Math.round(this.$el.line.getBoundingClientRect().left),
        this.cursor.obj.rightLimit = Math.round(this.$el.line.getBoundingClientRect().left + this.$el.line.getBoundingClientRect().width),
        this.cursorPosition = Math.round(this.$el.cursor.getBoundingClientRect().left) + (this.$el.cursor.offsetWidth / 2)
        console.log(this.cursor.obj.leftLimit, this.cursor.obj.rightLimit);
    }
}

const hero = new Hero(document.querySelector('.control'))
hero.init()
