import './components/LazyLoading'
import './sections/hero'
import './sections/video-intro'
// import './sections/technical'
import './sections/magic-explained'
import './sections/board-data'
import './sections/clean-design'
import './sections/park'

window.addEventListener('beforeunload', () => {
    window.scrollTo(0,0);
})
