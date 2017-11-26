import {TweenMax, Power2, Expo} from 'gsap'
import Preloader from './../components/Preloader'
import Loader from './../components/Loader'
import BoardScene from './../components/BoardScene'
import TextSplitter from './../components/TextSplitter'
import TextSlider from './../components/TextSlider'

const preloader = new Preloader()

preloader.on('complete', () => {
    console.log('complete')
    const loader = new Loader()
    const $loader = document.querySelectorAll('.loader')
    const $loaderParts = document.querySelectorAll('.loader__part')
    const $loaderPicture = document.querySelector('.loader__cover__picture')
    const $loaderCover = document.querySelector('.loader__cover')
    const $loaderOverlay = document.querySelector('.loader__cover__overlay')
    
    loader.on('progress', value => {
        $loaderOverlay.style.transform = `translateX(${value}%)`
    })
    
    loader.on('complete', () => {
        setTimeout(() => {
            const $board = document.querySelector('.board__img')
            const $shadow = document.querySelector('.board__shadow')
            const $dragCursor = document.querySelector('.cursor')
            const $dragCursorDot = document.querySelectorAll('.cursor__dot')
            const $dragLine = document.querySelector('.control__line')
            const $dragCircle = document.querySelector('.progress__meter')

            const $headlineParts = new TextSplitter(
                document.querySelector('.headline'), {
                    inner: false,
                    lastWordBlue: true
                }
            )
            const $headlineRoll  = new TextSlider($headlineParts.$words[$headlineParts.$words.length - 1])

            const boardScene = new BoardScene(document.querySelector('.hero'))
            const timeline = new TimelineMax()
            console.log($headlineParts.$words)

            const introComplete = () => {
                $headlineRoll.play()
                boardScene.init()
            }

            timeline
            .staggerTo($loaderParts, 0.9, {
                scaleX: 1,
                ease: Power2.easeInOut
            }, 0.1)
            .to($loaderPicture, 1.3, {
                x: 200,
                opacity: 0,
                ease: Power2.easeInOut
            }, '-= 1.15')
            .set($loaderCover, {
                display: 'none'
            })
            .staggerTo($loaderParts, 1.5, {
                y: window.innerHeight,
                ease: Power2.easeInOut
            }, 0.1, '+= 0.05')
            .from($board, 1.3, {
                y: - window.innerHeight,
                ease: Power2.easeInOut
            }, '-= 1.5')
            .from($shadow, 1.5, {
                scale: 0.1,
                ease: Power2.easeInOut
            }, '-= 1.5')
            .staggerFrom($headlineParts.$words, 2, {
                y: - window.innerHeight / 2,
                ease: Expo.easeInOut
            }, - 0.023, '-= 1.6')
            .staggerFrom($dragCursorDot, 0.4, {
                opacity: 0,
                scaleX: 0,
                ease: Expo.easeInOut
            }, 0,'-= 1.6')
            .from($dragLine, 1.2, {
                transformOrigin: 'right',
                scaleX: 0,
                ease: Expo.easeInOut
            }, '-= 1.2')
            .from($dragCursor, 1.2, {
                x: $dragLine.offsetWidth,
                ease: Expo.easeInOut
            }, '-= 1.2')
            .to($dragCircle, 1.2, {
                strokeDashoffset: 0,
                ease: Expo.easeInOut
            }, '-= 1.2')
            .set($loader, {
                display: 'none'
            })
            .call(introComplete)
        }, 1000);
    })
})


