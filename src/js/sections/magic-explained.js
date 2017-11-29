import { TweenMax, TimelineMax, Power2, Power3 } from 'gsap'
import { enterInView, halfInView } from './../utils/view.js'
import { intersectionObserver } from './../utils/intersectionObserver.js'
import TextSplitter from './../components/TextSplitter.js'
import Marker from './../components/Marker.js'

const $section = document.querySelector('.magic-explained')
const $sectionVisual = document.querySelector('.magic-explained__visual')
const $overlayEnter = document.querySelector('.magic-explained__overlay--1')
const $overlayLeave = document.querySelector('.magic-explained__overlay--2')
const $skateImage = document.querySelector('.magic-explained__image')
const $skateStroke = document.querySelector('.magic-explained__stroke')
const $line1 = document.querySelector('.magic-explained__line--1')
const $line2 = document.querySelector('.magic-explained__line--2')
const timeline = new TimelineMax()
const $headline = new TextSplitter(
    document.querySelector('.magic-explained__title'), {
        inner: true,
        lastWordBlue: true
    }
)
const $description = new TextSplitter(
    document.querySelector('.magic-explained__description'), {
        inner: true,
        lastWordBlue: false
    }
)

const $marker1 = new Marker(
    document.querySelector('.marker__1')
)

const $marker2 = new Marker(
    document.querySelector('.marker__2')
)


TweenMax.set($headline.$words, {
    y: 100
})
TweenMax.set($description.$words, {
    y: 100
})

intersectionObserver($section, () => {
    timeline
        .to($overlayEnter, 1.5, {
            scaleX: 0,
            ease: Expo.easeInOut
        }, 'enter')
        .from($skateImage, 1.5, {
            scale: 1.5,
            x: 200,
            ease: Expo.easeInOut
        }, 'enter')
        .set($line2, {
            display: 'none'
        }, '-=0.75')
        .to($skateStroke, 0.3, {
            opacity: 1,
            ease: Expo.easeInOut
        },'-= 0.8', 'strokeEnter')
        .to($overlayLeave, 1.5, {
            scaleX: 1,
            ease: Expo.easeInOut
        }, 'strokeEnter')
        .set($line1, {
            display: 'block'
        }, '-=0.8')
        .staggerTo($headline.$words, 1.2, {
            y: 0,
            ease: Power3.easeOut
        }, 0.03, '-= 1')
        .staggerTo($description.$words, 0.7, {
            y: 0,
            opacity: 1,
            ease: Power3.easeOut
        }, 0.008, '-=1.4')
        .from($description, 1.5, {
            opacity: 0,
            y: '100px',
            ease: Expo.easeInOut
        }, '-= 1.4')
        .to($marker1.$el.stroke, 1.2, {
            strokeDashoffset: 0,
            ease: Expo.easeInOut
        }, '-= 1.5')
        .to($marker2.$el.stroke, 1.2, {
            strokeDashoffset: 0,
            ease: Expo.easeInOut
        }, '-= 1.5')
})
