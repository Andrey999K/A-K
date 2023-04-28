const headerMenu = document.querySelector('.page-header__bottom');
const headerBottomContent = document.querySelector('.page-header__bottom-content');
const allScrollMenu = headerBottomContent.scrollWidth - headerBottomContent.clientWidth + 116;

let scrollY = window.scrollY;
let currentScrollMenu = 0;

function scrollMenu(ev) {
    // console.log(event.clientX);
    console.log(eventMouse);
    if (eventTouch || eventMouse) {
        let move = null;
        if (eventMouse) {
            move = event.clientX - eventMouse.clientX;
            console.log(event.clientX, eventMouse.clientX);
        } else if (eventTouch) {
            move = ev.touches[0].pageX - eventTouch.touches[0].pageX;
        }
        let translate = 0;
        console.log(currentScrollMenu, move);
        if (currentScrollMenu === 0) {
            translate = move
        } else {
            translate = currentScrollMenu + move
        }
        // console.log(translate, -allScrollMenu);
        // console.log(translate > -allScrollMenu);
        if (translate <= 0 && translate > -allScrollMenu) {
            headerBottomContent.style.transform = `translate(${translate}px)`
        }
    }

}

window.addEventListener('scroll', () => {
    if (scrollY < window.scrollY) {
        headerMenu.classList.add('hidden')
    } else if (scrollY > window.scrollY) {
        headerMenu.classList.remove('hidden')
    }
    scrollY = window.scrollY
});

let eventTouch = null;
headerMenu.addEventListener("touchstart", function (ev) {
    eventTouch = ev;
});

headerMenu.addEventListener("touchmove", scrollMenu);

headerMenu.addEventListener("touchend", function (ev) {
    eventTouch = null;
    currentScrollMenu = parseInt(headerBottomContent.style.transform.match(/-{0,1}\d+/))
    console.log(currentScrollMenu);
});

let eventMouse = null;
headerMenu.addEventListener("mousedown", (ev) => {
    eventMouse = ev;
    headerMenu.addEventListener("mousemove", scrollMenu);
});

headerMenu.addEventListener("mouseup", () => {
    eventMouse = null;
    currentScrollMenu = parseInt(headerBottomContent.style.transform.match(/-{0,1}\d+/));
    headerMenu.removeEventListener("mousemove", scrollMenu);
});

addEventListener('dragstart', (event) => {
    event.preventDefault();
});