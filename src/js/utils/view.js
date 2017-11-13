export function enterInView(layer) {
    let rect = layer.getBoundingClientRect()

    if (rect.top < window.innerHeight) {
        return true
    }
}

export function completelyInView(layer) {
    let rect = layer.getBoundingClientRect()

    if (rect.bottom < window.innerHeight) {
        return true
    }
}

export function halfInView(layer) {
    let rect = layer.getBoundingClientRect()

    if (rect.top - (rect.height / 2) < window.innerHeight) {
        return true
    }
}
