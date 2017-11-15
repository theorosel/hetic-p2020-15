import {TweenMax, Power0, Power4} from 'gsap'
import Preloader from './components/Preloader'
import Loader from './components/Loader'

const preloader = new Preloader()
preloader.on('progress', value => {
    console.log(value)
})

preloader.on('complete', () => {
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
            const timeline = new TimelineMax()
            console.log($board)
    
    
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
            }, 0.1, '+= 0.9')
            .from($board, 1.3, {
                y: - window.innerHeight,
                ease: Power2.easeInOut
            }, '-= 1.5')
            .from($shadow, 1.5, {
                scale: 0.1,
                ease: Power2.easeInOut
            }, '-= 1.5')
            .set($loader, {
                display: 'none'
            })
        }, 3000);
    })
})


