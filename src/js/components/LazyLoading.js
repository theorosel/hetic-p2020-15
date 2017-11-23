import lozad from 'lozad'

const observer = lozad('.lazyload', {
    rootMargin: '200px 0px',
    threshold: 0.3
});
observer.observe();

export default observer;