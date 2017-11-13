export function getScrollPercent(layer) {

    let windowBottom = window.innerHeight
    let layerTop = layer.getBoundingClientRect().top
    let percentage = (windowBottom - layerTop) / layer.offsetHeight * 100;

    return percentage
}
