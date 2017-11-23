import axios from 'axios'

class Loader {
    constructor() {
        this.srcElements    = [].slice.call(document.querySelectorAll('[data-load]'))

        this.requests       = []
        this.progressEvents = []
        this.completeEvents = []
        this.totalProgress  = 0

        this.init()
    }

    init() {
        console.log(this.srcElements)
        this.srcElements.forEach(element => {
            this.requests.push({
                element,
                name: 'src',
                progress: 0
            });
        });

        this.requests.forEach((request, index) => {
           axios
                .get(request.element.getAttribute(request.name), {
                    onDownloadProgress: progressEvent => {
                        const percent = Math.round(progressEvent.loaded / progressEvent.total * 100);

                        this.updateProgress(index, percent);
                    }
                })
                // if (request.name === 'data-load') {
                //     request.element.src = request.element.getAttribute(request.name);
                //     request.element.removeAttribute(request.name);
                // }
                // .then(function (response) {
                //     request.element.src = request.element.getAttribute(request.name);
                // })
        })
    }

    updateProgress(index, progress) {
        this.requests[index].progress = progress
        const total = this.requests.reduce(
            (value, request) => value + request.progress,
            0
        );

        this.totalProgress = Math.floor(total / this.requests.length);

       
        if (this.totalProgress === 100) {
            this.progressEventsCall();
            this.completeEventsCall();
        } 
        else {
            this.progressEventsCall();
        }
    }

    progressEventsCall() {
        this.progressEvents.forEach(({ callback }) => {
            callback(this.totalProgress);
        });
    }
    
    completeEventsCall() {
        this.completeEvents.forEach(({ callback }) => {
            callback();
        });
      }

    on(event, callback) {
        switch (event) {
            case 'progress':
                this.progressEvents.push({ callback });
                console.log('progress')
                break;
      
            case 'complete':
                this.completeEvents.push({ callback });
                break;
      
            default:
                break;
        }
    }
}

export default Loader;

