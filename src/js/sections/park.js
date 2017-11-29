import { TweenMax, TimelineMax } from 'gsap'
import {getScrollPercent} from './../utils/scroll.js'
import TextSplitter from './../components/TextSplitter.js'
import { intersectionObserver } from './../utils/intersectionObserver.js'
import { enterInView } from './../utils/view.js'
import map from './../utils/map.js'

// DOM elements
const $section = document.querySelector('.park');
const $parkScene = document.querySelector('.park__inner')
const $parkMain = document.querySelector('.park__main')
const $parkBottom = document.querySelector('.park__bottom')
const $parkTree = document.querySelector('.park__tree')
const $content = document.querySelector('.park__content')
const timeline = new TimelineMax()
const $headline = new TextSplitter(
    document.querySelector('.park__title'), {
        inner: true,
        lastWordBlue: true
    }
)
const $description = new TextSplitter(
    document.querySelector('.park__description'), {
        inner: true,
        lastWordBlue: false
    }
)

// Datas
const tXCoef = 12
const rXCoef = 1.5
const rYCoef = 0.2
const width = window.innerWidth
const height = window.innerHeight

// Set initial state
TweenMax.set($headline.$words, {
    y: 100
})
TweenMax.set($description.$words, {
    y: 100
})

/**
 * Move the Scene park according to mose move with 3D effect
 * @function movePark
 * @param {float} mapX : mouse position between -1 & 1 on the X axis
 * @param {float} mapY : mouse position between -1 & 1 on the Y axis
 */
function movePark(mapX, mapY) {

    // Move bottom left skate ramp
    TweenMax.to($parkBottom, 0.7, {
        x: mapX * tXCoef,
        rotationY: mapX * rYCoef,
        rotationX: mapY * rXCoef,
        ease: Power0.easeNone
    })

    // Move skate park grloablly
    TweenMax.to($parkMain, 0.7, {
        x: - mapX * tXCoef,
        rotationY: - mapX * rYCoef,
        rotationX: mapY * rXCoef,
        ease: Power0.easeNone
    })

    // Move top right Tree bracnch
    TweenMax.to($parkTree, 0.7, {
        x: - mapX * tXCoef,
        rotationY: - mapX * rYCoef,
        rotationX: mapY * rXCoef,
        ease: Power0.easeNone
    })
}

/**
 * Update content in the park according to the scroll
 * @function updateParkScene
 * @param {float} value : value of the section scrolled and currently in viewport
 */
function updateParkScene(value) {

    // Scale & fade-in the park
    TweenMax.to($parkMain, 0.1, {
        opacity: (value / 100) - 0.1,
        scale: 1 + (value / 2000),
        ease: Power0.easeNone
    })

    // Translate top right tree branch on the y axis
    TweenMax.to($parkTree, 0.4, {
        y: - value * 4,
        ease: Power0.easeNone
    })

    // Translate $section content on the y axis
    TweenMax.to($content, 0.4, {
        y: - value,
        ease: Power0.easeNone
    })
}

// Check when the $section enter in the window & start animation
intersectionObserver($section, () => {
    timeline
        .staggerTo($headline.$words, 1.2, {
            y: 0,
            ease: Power3.easeOut
        }, 0.03,'enter')
        .staggerTo($description.$words, 0.7, {
            y: 0,
            opacity: 1,
            ease: Power3.easeOut
        }, 0.008, 'enter')
})

// Listeners
$section.addEventListener('mousemove', (event) => {
    let x = event.clientX
    let y = event.clientY

    let mapX = map(x, 0, width, -1, 1)
    let mapY = map(y, 0, height, 1, -1)

    movePark(mapX, mapY)
})

window.addEventListener('scroll', () => {
    if (enterInView($parkScene)) {
        let scrollPercent = getScrollPercent($section)
        updateParkScene(scrollPercent)
    }
})
