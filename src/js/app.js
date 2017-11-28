import './components/LazyLoading'
import './sections/hero'
import './sections/video-intro'
import './sections/magic-explained'
import './sections/board-data'
import './sections/clean-design'
// import './technical'

window.addEventListener('beforeunload', () => {
    window.scrollTo(0,0);
})
