const intersectionObserver = (element, callback) => {
    const observer = new IntersectionObserver(
        observables => {
            observables.forEach(observable => {
                if (observable.intersectionRatio <= 0.2) return;
                callback();
                observer.disconnect();
            });
        },
        {
            threshold: [0.2]
        }
    );
    observer.observe(element);
};

export { intersectionObserver }