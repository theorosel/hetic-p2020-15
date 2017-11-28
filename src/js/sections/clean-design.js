import { TweenMax, Power3 } from 'gsap'
import Gallery from './../components/Gallery'
import TextSplitter from './../components/TextSplitter.js'
import { intersectionObserver } from './../utils/intersectionObserver.js'

const $section = document.querySelector('.clean-design')
const $sectionGallery = document.querySelector('.clean-design__gallery')
const $blackPart = document.querySelector('.clean-design__part')
const $gallery = new Gallery(document.querySelector('.gallery'));
const $itemsOverlay = document.querySelectorAll('.gallery-item__overlay')
const timeline = new TimelineMax()
const $headline = new TextSplitter(
    document.querySelector('.clean-design__title'), {
        inner: true,
        lastWordBlue: true
    }
)

TweenMax.set($headline.$words, {
    y: 100
})

intersectionObserver($section, () => {
    timeline
        .staggerTo($headline.$words, 1.2, {
            y: 0,
            ease: Power3.easeOut
        }, 0.03, '+=0.9')
})

intersectionObserver($sectionGallery, () => {
    timeline
        .to($blackPart, 1.4, {
            scaleX: 1,
            ease: Expo.easeInOut
        }, 'enter')
        .staggerTo($itemsOverlay, 1.4, {
            scaleX: 0,
            ease: Expo.easeInOut
        }, 0.03, 'enter')
})