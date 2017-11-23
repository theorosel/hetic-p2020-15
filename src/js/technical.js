// import getScrollPercent from '/utils/scroll.js'

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
      const radius  = 250
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

let smallDots = new fullCircle(80, 'technical__circle', 'dot__small')
smallDots.createPoints()
smallDots.placePoints()

let bigDots = new fullCircle(4, 'technical__circle', 'dot__big')
bigDots.createPoints()
bigDots.placePoints()

/*
 *
    Required functions and variables
 *
 */
const addEvent = (element, eventType, handler) => {
  if (element.addEventListener){
    element.addEventListener(eventType, handler, false)
  }
  else if (element.attachEvent){
    element.attachEvent('on' + eventType, handler)
  }
  else{
    element['on' + eventType] = handler
  }
}

const getScrollPercent = layer => {
    let layerTop         = layer.getBoundingClientRect().top,
        windowHeight     = window.innerHeight,
        percentageHeight = Math.floor((windowHeight - layerTop - windowHeight) / layer.offsetHeight * 100)

        // console.log(percentageHeight + '%')
    return percentageHeight;
}

const displayStepContent = (element, className, step) => {
    for(let i = 0; i < element.length; i++){
        element[i].classList.remove(className)
    }
    element[step].classList.add(className)
}

const moveSkate = () => {
    let scrollPercent   = getScrollPercent(skateSection),
        skateTop        = wholeSkate.style.top,
        skateLeft       = wholeSkate.style.left,
        skateTopPart    = skateImages[0].style.bottom,
        skateBottomPart = skateImages[2].style.top

    wholeSkate.style.position = 'fixed'

    if(scrollPercent < 40){
        skateTop = scrollPercent
        skateLeft = scrollPercent

        wholeSkate.style.left = skateLeft + '%'
        wholeSkate.style.top = skateTop + '%'
        wholeSkate.style.opacity = scrollPercent * 2.5 / 100

        skateImages[0].classList.remove('explode-skate-1')
        skateImages[2].classList.remove('explode-skate-2')
    }
    else{
        skateImages[0].style.position = 'fixed'
        skateImages[2].style.position = 'fixed'

        skateImages[0].classList.add('explode-skate-1')
        skateImages[2].classList.add('explode-skate-2')
    }
}

const fillCircle = () => {
    let scrollPercent = getScrollPercent(techSection)
    if(scrollPercent < allSteps.length+1){
        for(let i = 0; i < allSteps.length; i++){
            if(i < scrollPercent){
                allSteps[i].classList.add('active-dot')
            }
            else{
                allSteps[i].classList.remove('active-dot')
            }
        }
    }
}

let allSteps  = [],
    mainDots  = []
    allSteps  = document.querySelectorAll('.dot__small')
    allSteps  = [...allSteps]
    mainDots  = document.querySelectorAll('.dot__big')
    mainDots  = [...mainDots]

let techSection  = document.querySelector('.technical'),
    techCircle   = document.querySelector('.technical__circle'),
    skateSection = document.querySelector('.skate__container'),
    wholeSkate   = document.querySelector('.skate__images'),
    skateImages  = document.querySelectorAll('.skate__images img'),
    steps        = document.querySelectorAll('.step'),
    state        = true

/*
 *
    Scroll animation, filling the circle
 *
 */
const handleTechScroll = () => {
    let techSectionPos  = techSection.getBoundingClientRect(),
        top             = techSectionPos.top,
        bottom          = techSectionPos.bottom,
        skateSectionPos = skateSection.getBoundingClientRect(),
        skateTop        = skateSectionPos.top

    if(skateTop <= 0){
        moveSkate()
    }

    if(top <= 0) {
        let scrollPercent = getScrollPercent(techSection)
        techCircle.style.position = 'fixed'

        // skate and circle structure appear
        if(scrollPercent < 100){
            // circle appears
            for(let i = 0; i < allSteps.length; i++){
                allSteps[i].classList.add('visible')
            }
            for(let i = 0; i < mainDots.length; i++){
                mainDots[i].classList.add('visible')
            }

            // filling circle
            if(scrollPercent < allSteps.length+1){
                // small dots progression
                fillCircle()
                // steps
                if(scrollPercent <= 20){
                    displayStepContent(mainDots, 'active-step', 0)
                    steps[0].classList.remove('visible')
                    console.log('first dot')
                }
                else if(scrollPercent > 20 && scrollPercent <= 40){
                    displayStepContent(mainDots, 'active-step', 1)
                    displayStepContent(steps, 'visible', 0)
                    displayStepContent(skateImages, 'visible', 0)
                    console.log('second dot')
                }
                else if(scrollPercent > 40 && scrollPercent <= 60){
                    displayStepContent(mainDots, 'active-step', 2)
                    displayStepContent(steps, 'visible', 1)
                    displayStepContent(skateImages, 'visible', 1)
                    console.log('third dot')
                }
                else if(scrollPercent > 60 && scrollPercent < allSteps.length+1){
                    displayStepContent(mainDots, 'active-step', 3)
                    displayStepContent(steps, 'visible', 2)
                    displayStepContent(skateImages, 'visible', 2)
                    console.log('fourth dot')
                }
            }
            else{
                console.log('scroll 80+')
                steps[2].classList.remove('visible')
                wholeSkate.style.opacity = 0
                // circle disappears
                for(let i = 0; i < allSteps.length; i++){
                    allSteps[i].classList.remove('visible')
                }
                for(let i = 0; i < mainDots.length; i++){
                    mainDots[i].classList.remove('visible')
                }
            }
        }
        else{
            console.log('autres sections')
        }
    }
    else{
        console.log('dernier else')
        // circle disappears
        for(let i = 0; i < allSteps.length; i++){
            allSteps[i].classList.remove('visible')
        }
        for(let i = 0; i < mainDots.length; i++){
            mainDots[i].classList.remove('visible')
        }
    }
}

addEvent(window, 'scroll', handleTechScroll)
// addEvent(window, 'mousewheel', handleTechScroll)
// addEvent(window, 'DOMMouseScroll', handleTechScroll)
// addEvent(window, 'wheel', handleTechScroll)
// addEvent(window, 'MozMousePixelScroll', handleTechScroll)
