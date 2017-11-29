import { TweenMax, Linear, Power0, TimelineMax } from 'gsap'
import { enterInView, completelyInView } from './../utils/view.js'
import { getScrollPercent } from './../utils/scroll.js'
import TextSplitter from './../components/TextSplitter.js'
import { intersectionObserver } from './../utils/intersectionObserver.js'

/*
 *
    Circle dots creation
 *
 */

class fullCircle{
    constructor(number, wrap, identity){
      this.number   = number,
      this.wrap     = wrap,
      this.identity = identity
    }

    createPoints(){
      this.container = document.querySelector('.' + this.wrap)
      for(let i = 0; i < this.number; i++){
        let newDot = document.createElement("div")
        newDot.className = this.identity
        this.container.appendChild(newDot)
      }
    }

    placePoints(){
      const radius  = window.innerWidth / 4.5
      let dots      = document.querySelectorAll('.' + this.identity),
      container     = this.container,
      width         = container.offsetWidth,
      height        = container.offsetHeight,
      angle         = -Math.PI / 2,
      step          = (2 * Math.PI) / dots.length

      dots.forEach((dot) => {
        let x = Math.round(width/2 + radius * Math.cos(angle) - dot.offsetWidth/2),
            y = Math.round(height/2 + radius * Math.sin(angle) - dot.offsetHeight/2)
        dot.style.top = y + 'px'
        dot.style.left = x + 'px'
        angle += step
      })
    }
}
`$`
if (window.matchMedia("(min-width: 600px)").matches) {

    // create the circle only on desktop
    let smallDots = new fullCircle(80, 'technical__circle', 'dot__small')
    smallDots.createPoints()
    smallDots.placePoints()

    let bigDots = new fullCircle(4, 'technical__circle', 'dot__big')
    bigDots.createPoints()
    bigDots.placePoints()
}

/*
 *
    Required functions and variables
 *
 */

let allSteps  = [],
    mainDots  = []
    allSteps  = document.querySelectorAll('.dot__small')
    allSteps  = [...allSteps]
    mainDots  = document.querySelectorAll('.dot__big')
    mainDots  = [...mainDots]

let techSection  = document.querySelector('.technical'),
    techSteps    = document.querySelector('.technical__steps'),
    techTitle    = document.querySelector('.technical__steps h2'),
    techCircle   = document.querySelector('.technical__circle'),
    skateSection = document.querySelector('.skate'),
    wholeSkate   = document.querySelector('.skate__images'),
    skateImages  = document.querySelectorAll('.skate__images img'),
    steps        = document.querySelectorAll('.technical__step')

let $headline = new TextSplitter(
    techTitle, {
        inner: true,
        lastWordBlue: true
    }
)

TweenMax.set($headline.$words, {
    y: 100
})

/**
 * Returns the percentage of the section that is scrolled
 * @function getScroll
 * @param layer
 */
const getScroll  = layer => {
    let layerTop         = layer.getBoundingClientRect().top,
        windowHeight     = window.innerHeight,
        percentageHeight = Math.floor((windowHeight - layerTop - windowHeight) / layer.offsetHeight * 100)

    return percentageHeight;
}

const displayCircle = () => {
    for(let i = 0; i < allSteps.length; i++){
            allSteps[i].classList.add('visible')
        }
        for(let i = 0; i < mainDots.length; i++){
            mainDots[i].classList.add('visible')
    }
}

const removeCircle = () => {
    for(let i = 0; i < allSteps.length; i++){
            allSteps[i].classList.remove('visible')
        }
        for(let i = 0; i < mainDots.length; i++){
            mainDots[i].classList.remove('visible')
    }
}

/**
 * Display the right content and remove the previous ones
 * @function displayStepContent
 * @param element, className and {float} step
 */
const displayStepContent = (element, className, step) => {
    for(let i = 0; i < element.length; i++){
        element[i].classList.remove(className)
    }
    element[step].classList.add(className)
}

/**
 * Display the right image and blur the previous ones
 * @function switchSkatePart
 * @param element, className and {float} step
 */
const switchSkatePart = (element, className, step) => {
    for(let i = 0; i < element.length; i++){
        element[i].classList.remove(className)
        element[i].style.opacity = 0.3
    }
    element[step].classList.add(className)
}

// move the skate according to scroll
const moveSkate = () => {
    let skatePercent    = getScroll(skateSection),
        skateTop        = wholeSkate.style.top,
        skateLeft       = wholeSkate.style.left,
        skateTopPart    = skateImages[0].style.bottom,
        skateBottomPart = skateImages[2].style.top,
        gcbdLeft        = wholeSkate.getBoundingClientRect().left - (wholeSkate.offsetWidth / 2)

    wholeSkate.style.position = 'fixed'

    if(skatePercent < 37){
        skateTop = skatePercent
        skateLeft = skatePercent

        TweenMax.to(wholeSkate, 0.7, {
            opacity: skatePercent * 2.5 / 100,
            left: `${skateLeft}%`,
            top: `${skateTop}%`,
            ease: Power2.easeNone
        })

        skateImages[0].classList.remove('explode-skate-1')
        skateImages[2].classList.remove('explode-skate-2')
    }
    else{
        setTimeout(() => {

            skateImages[0].style.position = 'fixed'
            skateImages[2].style.position = 'fixed'

            skateImages[0].classList.add('explode-skate-1')
            skateImages[2].classList.add('explode-skate-2')
        }, 800);
    }
}

const smallDotsProgression = () => {
    let techPercent = getScroll(techSection)
    if(techPercent < allSteps.length+1){
        for(let i = 0; i < allSteps.length; i++){
            if(i < techPercent){
                allSteps[i].classList.add('active-dot')
            }
            else{
                allSteps[i].classList.remove('active-dot')
            }
        }
    }
}

// desktop function
const handleCircleFilling = () => {
    let techPercent  = getScroll(techSection)

    techSteps.style.position = 'fixed'
    techCircle.style.position = 'fixed'
    displayCircle()
    // title
    TweenMax.staggerTo($headline.$words, 1.2, {
            y: 0,
            ease: Power3.easeOut
    }, 0.03)

    // filling circle
    if(techPercent < allSteps.length+1){
        // fill small dots
        smallDotsProgression()

        if(techPercent <= 20){
            displayStepContent(mainDots, 'active-step', 0)
            steps[0].classList.remove('visible')

            for (let i = 0; i < skateImages.length; i++) {
                skateImages[i].style.opacity = 1
            }
        }

        // first processus
        else if(techPercent > 20 && techPercent <= 40){
            displayStepContent(mainDots, 'active-step', 1)
            displayStepContent(steps, 'visible', 0)
            switchSkatePart(skateImages, 'visible', 0)
        }

        // second processus
        else if(techPercent > 40 && techPercent <= 60){
            displayStepContent(mainDots, 'active-step', 2)
            displayStepContent(steps, 'visible', 1)
            switchSkatePart(skateImages, 'visible', 1)
        }

        // third processus
        else if(techPercent > 60 && techPercent < 65){
            displayStepContent(mainDots, 'active-step', 3)
            displayStepContent(steps, 'visible', 2)
            switchSkatePart(skateImages, 'visible', 2)
        }

        // folded skate
        else if (techPercent > 65 && techPercent < allSteps.length+1){
            steps[2].classList.remove('visible')

            for (let i = 0; i < skateImages.length; i++) {
                    skateImages[i].style.opacity = 1
            }

            skateImages[0].classList.remove('explode-skate-1')
            skateImages[2].classList.remove('explode-skate-2')
            wholeSkate.style.opacity = 1
        }
    }

    else{
        // circle, skate and title disappear
        removeCircle()
        wholeSkate.style.opacity = 0
    }
}

// mobile function
const updateSkateY = () => {

    let techPercent = Math.floor(getScrollPercent(techSection))

    if (techPercent < 20) {
        TweenMax.to(skateImages[0], 0,
            {
                top: 0,
                ease: Linear.easeOut
            }
        )
    }

    else if(techPercent >= 20 && techPercent < 50){
        TweenMax.fromTo(skateImages[0], 0,
            {
                top: 0,
                ease: Linear.easeOut
            },
            {
                top: -techPercent * 6,
                ease: Linear.easeOut
            }
        )

        TweenMax.to(skateImages[1], 0,
            {
                top: -15,
                ease: Linear.easeOut
            }
        )
    }

    else if(techPercent > 50 && techPercent < 85){
        TweenMax.fromTo(skateImages[1], 0,
            {
                top: 0,
                opacity: 0,
                ease: Linear.easeOut
            },
            {
                top: (-techPercent * 3) - 150,
                ease: Linear.easeOut
            }
        )

        TweenMax.to(skateImages[2], 0,
            {
                top: 0,
                ease: Linear.easeOut
            }
        )
    }

    else if(techPercent > 85 && techPercent <= 130){
        TweenMax.fromTo(skateImages[2], 0,
            {
                top: 0,
                ease: Linear.easeOut
            },
            {
                top: (-techPercent * 2.6) - 180,
                ease: Linear.easeOut
            }
        )
    }
}

/*
 *
    Scroll animation, filling the circle with different steps
 *
 */

const handleTechScroll  = () => {

    // moving the skate at the right moment
    if(enterInView(skateSection)){
        moveSkate()
    }
    // hide it in other sections
    else{
        wholeSkate.style.opacity = 0
    }

    // deploy the circle as the section appears on the viewport
    if(enterInView(techSection)) {

        if (window.matchMedia("(min-width: 600px)").matches) {
            handleCircleFilling()
        }
        else{
            updateSkateY()
        }
    }
    // remove it on other sections
    else{
        techSteps.style.position = 'relative'
        removeCircle()
    }
}

window.addEventListener("scroll", handleTechScroll, false)
