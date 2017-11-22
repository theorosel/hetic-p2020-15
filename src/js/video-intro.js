import { TweenMax, Power0 } from 'gsap'
import { enterInView, completelyInView } from './utils/view.js'
import { getScrollPercent } from './utils/scroll.js'

const $section = document.querySelector('.video-intro')
const $video = document.querySelector('.video-intro__video')
const $masksTop = document.querySelectorAll('.mask__top')
const $masksBottom = document.querySelectorAll('.mask__bottom')

$masksTop.forEach(
    function(mask, index) {
        mask.style.transform = `scaleY(1)`
    }
)

$masksBottom.forEach(
    function(mask, index) {
        mask.style.transform = `scaleY(0)`
    }
)

/**
 * Update scale of each top overlays on y axis according to value
 * @function updateMaskTop
 * @param {float} value : 0 to 100 - value of the scroll
 */
function updateMaskTop(value) {
    $masksTop.forEach(
        function(mask, index) {
            TweenMax.to(mask, 0.3, {
                scaleY: 1 - value,
                ease: Power0.easeNone
            })
        }
    )
}

/**
 * Update scale of each top overlays on y axis according to value
 * @function updateMaskBottom
 * @param {float} value : 0 to 100 - value of the scroll
 */
function updateMaskBottom(value) {
    $masksBottom.forEach(
        function(mask, index) {
            TweenMax.to(mask, 0.3, {
                scaleY: value,
                ease: Power0.easeNone
            })
        }
    )
}

window.addEventListener('scroll', () => {
    if (enterInView($section)) {
        let scrollPercent = getScrollPercent($section)
        $video.play()
        updateMaskTop(scrollPercent / 100)
    }

    if (completelyInView($section)) {
        let scrollPercent = getScrollPercent($section)
        updateMaskBottom((scrollPercent - 100) / 100)
    }
})

