import './components/LazyLoading'
import './sections/hero'
import './sections/video-intro'
import './sections/magic-explained'
import './sections/board-data'
// import './technical'

window.onbeforeunload = function() {
    window.scrollTo(0,0);
}
