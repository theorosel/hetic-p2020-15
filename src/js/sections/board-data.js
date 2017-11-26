const $section = document.querySelector('.board-data')
const $dataBoxes = document.querySelectorAll('.data-box')

$dataBoxes.forEach(
    function(box) {
        console.log(Math.floor((Math.round(box.offsetWidth / 3) * 2)))
    }
)