import './components/LazyLoading'
import './hero'
import './video-intro'
import './board-data'
// import './technical'

window.onbeforeunload = function() {
    window.scrollTo(0,0);
}
