import { TweenMax, Power0, TimelineMax } from 'gsap'
import { enterInView, completelyInView } from './../utils/view.js'
import { intersectionObserver } from './../utils/intersectionObserver.js'
import { getScrollPercent } from './../utils/scroll.js'
import TextSplitter from './../components/TextSplitter.js'

const $section = document.querySelector('.board-data')
const $background = document.querySelector('.board-data__background')
const $backgroundImage =document.querySelector('.board-data__image') 
const $dataBoxes = document.querySelectorAll('.data-box')
const $dataBoxesContent = document.querySelectorAll('.data-box__content')
const timeline = new TimelineMax()
const $titles  = document.querySelectorAll('.data-box__title')
const $unities = document.querySelectorAll('.data-box__unity')
const $descriptions = document.querySelectorAll('.data-box__description')

console.log($backgroundImage)

$dataBoxes.forEach(
    function($box, index) {
        $box.style.top = index * 400 + 'px';
    }
)

/**
 * Update scale of each top overlays on y axis according to value
 * @function updateBoxesPosition
 * @param {float} value : 0 to 100 - value of the scroll
 */
function updateBoxesPosition(value) {
    console.log(value)
    $dataBoxes.forEach(
        function($box, index) {
            TweenMax.to($box, 0.4, {
                y: - (value * index) * 4 + 'px',
                ease: Power0.easeNone
            })
        }
    )
}

/**
 * Update scale of each top overlays on y axis according to value
 * @function updateBkgOpacity
 * @param {float} value : 0 to 100 - value of the scroll
 */
function updateBkg(value) {
    TweenMax.to($background, 0.4, {
        opacity: (value / 100) - 0.1,
        y: - value * 2 + 'px',
        ease: Power0.easeNone
    })
    TweenMax.to($backgroundImage, (0.4), {
        scale: 1 + value / 100,
        ease: Power0.easeNone
    })
}

if (window.matchMedia("(min-width: 900px)").matches) {
    console.log('mobile')
    window.addEventListener('scroll', () => {
        if (enterInView($section)) {
            let scrollPercent = getScrollPercent($section)
            updateBoxesPosition(scrollPercent)
        }
    }) 
}

window.addEventListener('scroll', () => {
    if (enterInView($background)) {
        let scrollPercent = getScrollPercent($section)
        updateBkg(scrollPercent)
    }
}) 

intersectionObserver($section, () => {
    timeline
        .staggerTo($dataBoxes, 1.4, {
            transformOrigin: 'left bottom',
            scaleX: 1,
            ease: Power3.easeInOut
        }, 0.02)
        .staggerFrom($dataBoxesContent, 1.2, {
            opacity: 0,
            y: 40,
            ease: Power0.easeNone
        }, 0.02, '-= 1.1')
})
