document.addEventListener("DOMContentLoaded", ()=>{

    var grid = document.querySelector('.grid');
    masonryGrid(grid, 1160, 560);
    // var msnry = new Masonry( grid, {
    //     itemSelector: '.grid-item',
    //     columnWidth: 260,
    //     gutter: 40,
    // });

    var mySwiper = new Swiper(".mySwiper", {
        zoom: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        },
        speed: 800,
        pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
        clickable: true,
        },
    });

    const cardsReview = document.querySelectorAll('.reviews-cards__card');
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const swiper = document.querySelector('.mySwiper');
    const sliderCloseButton = document.querySelector('.slider__close');
    let video = document.querySelectorAll('.slider__wrapper .card-review__video');

    let coordTopCardsReview = [];
    let heightGrid = 0;
    let newReviewIndex = 0;
    let newPageIndex = 0;


    function deleteClass(classElem) {
        const elem = document.querySelector(`.${classElem}`);
        if (elem) {
            elem.classList.remove(classElem)
        }
    }

    function getRequestParam(param) {
        let mass = document.URL.split('?')[document.URL.split('?').length - 1].split('&');
        for (let i = 0; i < mass.length; i++) {
            let name = mass[i].split('=')[0];
            if (name === param) {
                return mass[i].split('=')[1];
            }
        }
        return false;
    }

    function getReviewPage(review) {
        return review.getAttribute('page-number').split(' / ')[0];
    }

    function getCountPage(review) {
        return review.getAttribute('page-number').split(' / ')[1];
    }

    function getReviewNumber(review) {
        return review.getAttribute('review-number').split(' / ')[0];
    }

    function getCountReview(review) {
        return review.getAttribute('review-number').split(' / ')[1];
    }

    function clearActiveSlide() {
        deleteClass('swiper-slide-active');
        deleteClass('swiper-slide-next');
        deleteClass('swiper-slide-prev')
    }

    // PLAY
    function playVideo(video) {
        video.play();
        video.parentElement.children[1].classList.add('playing')
    }

    // PAUSE
    function pauseVideo(video) {
        video.pause();
        video.parentElement.children[1].classList.remove('playing')
    }

    function stopVideo(video) {
        pauseVideo(video);
        video.currentTime = 0;
    }

    // ПРОВЕРКА КОНЦА СЛАЙДЕРА
    // ЕСЛИ КОНЕЦ, МЫ ПОДГРУЖАЕМ ЕЩЁ ОДИН ОТЗЫВ
    function checkEndSlider() {
        console.log('page: ', getRequestParam('page') ? getRequestParam('page') : 1);
        if (document.querySelector('.swiper-slide-prev')) {
            newPageIndex = Math.floor(((Number(document.querySelector('.swiper-slide-active')
                .getAttribute('slide-number'))) - 1) / 12);
        }
        if (!document.querySelector('.swiper-slide-next') ||
            !document.querySelector('.swiper-slide-prev')) {
            const currentSlide = document.querySelector('.swiper-slide-active');
            let newSlideNumber = Number(currentSlide.getAttribute('slide-number')) + 1;
            let idReviewCurrent = currentSlide.getAttribute('id-review');
            let idSubcategory = getRequestParam('subcategory');
            let reviewNumber = Number(currentSlide.getAttribute('review-number')) + 1;
            if (!document.querySelector('.swiper-slide-prev')) {
                newSlideNumber = Number(currentSlide.getAttribute('slide-number')) - 1;
                reviewNumber = Number(currentSlide.getAttribute('review-number')) - 1;
            }
            createNewReviewCard(newSlideNumber, idReviewCurrent, idSubcategory, currentSlide);
            // if (!document.querySelector('.swiper-slide-prev')) {
            //     console.log(document.querySelector('.swiper-slide-prev'));
            //     newReviewIndex--;
            // }
            // console.log(`newReviewIndex = ${newReviewIndex}`);
            // if (newReviewIndex === -1) {
            //     newPageIndex--;
            // } else if (newReviewIndex === -14) {
            //     newReviewIndex = -2;
            //     newPageIndex--;
            // }
            // console.log(`newPageIndex = ${newPageIndex}`);
            //
            // let newSlideNumber = false;
            // if (!document.querySelector('.swiper-slide-next')) {
            //     newSlideNumber = Number(document.querySelector('.swiper-slide-active')
            //         .getAttribute('slide-number')) + 1;
            // } else if (!document.querySelector('.swiper-slide-prev')) {
            //     newSlideNumber = Number(document.querySelector('.swiper-slide-active')
            //         .getAttribute('slide-number')) - 1;
            // }
            // console.log(newSlideNumber);
            // const idReviewCurrent = document.querySelector('.swiper-slide-active')
            //     .getAttribute('id-review');
            // let idSubcategory = getRequestParam('subcategory');
            // createNewReviewCard(newSlideNumber, idReviewCurrent, idSubcategory);
        }
    }

    function sliderOn(event) {

        removeMasonryGrid(swiperWrapper);

        // ВЫБОР НАЖАТОЙ КАРТИНКИ КАК АКТИВНОГО СЛАЙДА В СЛАЙДЕРЕ
        const currentSlide = event.target.closest('.reviews-cards__card');
        const currentSlideNumber = currentSlide.getAttribute('slide-number');
        mySwiper.activeIndex = currentSlideNumber - 1;

        cardsReview.forEach(item => {
            item.classList.add('swiper-slide');
            item.classList.add('not-active');
            item.classList.remove('card-review', 'grid-item');
            item.style.position = 'sticky';

            const swiperContainer = document.createElement('div');
            swiperContainer.className = 'swiper-zoom-container';

            const sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'slider__wrapper';
            
            sliderWrapper.innerHTML = item.innerHTML;
            swiperContainer.append(sliderWrapper);
            item.replaceChildren(swiperContainer);

            item.removeEventListener('click', sliderOn);
        });

        swiperWrapper.classList.remove('grid', 'reviews-cards__grid');
        swiperWrapper.removeAttribute('data-masonry');
        heightGrid = swiperWrapper.style.height;
        swiperWrapper.style.height = '100%';
        swiperWrapper.style.position = 'absolute';
        swiper.classList.remove('hidden');
        swiper.classList.add('zoom');


        if (event.target.classList.contains('card-review__video') ||
        event.target.classList.contains('video-play__icon')) {
            playVideo(event.currentTarget.querySelector('video'))
        }

        // ВОЗМОЖНОСТЬ ЗАПУСКА И ОСТАНОВКИ ВИДЕО ПОСЛЕ ИНИЦИАЛИЗАЦИИ СЛАЙДЕРА
        const slider = document.querySelectorAll('.slider__wrapper');

        slider.forEach(item => {
            if (item.querySelector('.card-review__video')) {
                item.addEventListener('click', () => {
                    const video = item.querySelector('.card-review__video');
                    if (video.paused) {
                        playVideo(video)
                    } else {
                        pauseVideo(video)
                    }
                })
            }
        });

        setTimeout(() => {
            checkEndSlider();
        }, 10);

        // ЗАПУСК ВИДЕО ПОСЛЕ КЛИКА
        // let video = document.querySelectorAll('.slider__wrapper .card-review__video')
        // video.forEach(item => {
        //     item.addEventListener('click', () => {
        //         if (item.classList.contains('playing')) {
        //             pauseVideo(item)
        //         } else {
        //             playVideo(item)
        //         }
        //         item.classList.toggle('playing')
        //     });
        // });
    }

    function sliderOff() {
        cardsReview.forEach(item => {
            item.classList.remove('swiper-slide');
            item.classList.add('card-review', 'grid-item');
            item.style.position = '';
            item.style.width = '';

            const sliderWrapper = item.querySelector('.slider__wrapper');
            item.innerHTML = sliderWrapper.innerHTML;

            item.addEventListener('click', sliderOn);
        });

        swiperWrapper.classList.add('grid', 'reviews-cards__grid');
        swiperWrapper.style.height = '';
        swiperWrapper.style.position = '';
        swiperWrapper.removeAttribute('id');

        // mySwiper.destroySlider()
        // msnry.destroy()
        // msnry = new Masonry( grid, {
        //     itemSelector: '.grid-item',
        //     columnWidth: 260,
        //     gutter: 40,
        // });
        
        swiper.classList.add('hidden');
        swiper.classList.remove('zoom');

        // swiperWrapper.style.height = heightGrid
        // let currentPage = Number(getRequestParam('page'));
        // if (!!currentPage === false) {
        //     currentPage = 1;
        // }

        const currentReview = document.querySelector('.swiper-slide-active');
        const currentPage = getReviewPage(currentReview);

        if (location.href.match(/page=/gui)) {
            location.href =
                location.href.replace(
                    /page=\d+/gui,
                    `page=${currentPage}`
                );
        } else {
            if (getRequestParam('subcategory') || getRequestParam('category')) {
                location.href += `&page=${currentPage}`;
            } else {
                location.href += `?page=${currentPage}`;
            }

        }
        // if (location.search) {
        //     if (location.search.indexOf('?page=') !== -1) {
        //         location.href = location.origin + location.pathname + '?page=' + String(currentPage + newPageIndex);
        //     } else if (location.search.indexOf('&page=') !== -1) {
        //         let href = location.href.replace(/&page=\d+'/ui, '');
        //         location.href = href + '&page=' + String(currentPage + newPageIndex);
        //     } else {
        //         location.href += '&page=' + String(currentPage + newPageIndex);
        //     }
        //     // if (location.search.indexOf('?page=') === -1) {
        //     //     location.href += '?page=' + String(currentPage + newPageIndex);
        //     // } else if (location.search.indexOf('&page=') === -1) {
        //     //     location.href += '&page=' + String(currentPage + newPageIndex);
        //     // } else {
        //     //     let href = location.href.replace(/\?page=\d+'/ui, '');
        //     //     location.href = href + '?page=' + String(currentPage + newPageIndex);
        //     // }
        // } else {
        //
        //
        // }

        // location.href = location.origin + location.pathname + '?page=' + String(currentPage + newPageIndex);

        // location.href = ''

        // location.reload()

        // mySwiper.destroySlider()

        // clearActiveSlide()
    }

    function createElement(tagName, className, attr) {
        const elem = document.createElement(tagName);
        elem.className = className;
        for (let key in attr) {
            elem.setAttribute(key, attr[key]);
        }
        return elem;
    }

    function createReview(reviewData, slideNumber, currentSlide, position) {

        if (slideNumber === 0) {
            slideNumber = 1;
        }

        setTimeout(() => {
            const newReview = createElement('li', 'reviews-cards__card swiper-slide swiper-slide-next',
                {'slide-number': slideNumber, 'id-review': reviewData['id_review']});
            const swiperZoomContainer = createElement('div', 'swiper-zoom-container');
            const sliderWrapper = createElement('div', 'slider__wrapper');
            let fileReview = false;
            if (reviewData['type_file'] === 'image') {
                fileReview = createElement('img', 'card-review__image card-review__content',
                    {'src': `./img/screens/${reviewData['id_review'] + "." + reviewData['extension_file']}`, 'alt': 'review screen'});
            } else {
                fileReview = createElement('video', 'card-review__video card-review__content',
                    {'src': `./video/${reviewData['id_review'] + "." + reviewData['extension_file']}`});
                fileReview.style.width = 'initial';
                fileReview.style.height = '100%';
            }
            let reviewNumber = Number(getReviewNumber(currentSlide)) + (position === 'right' ? 1 : -1);
            newReview.setAttribute('review-number',
                `${reviewNumber} / ${Number(getCountReview(currentSlide))}`
            );
            let pageNumber = Math.floor((reviewNumber - 1) / 12) + 1;
            newReview.setAttribute('page-number',
                `${pageNumber} / ${Number(getCountPage(currentSlide))}`
            );
            sliderWrapper.append(fileReview);
            swiperZoomContainer.append(sliderWrapper);
            newReview.append(swiperZoomContainer);
            if (reviewData['type_file'] === 'video') {
                sliderWrapper.insertAdjacentHTML('beforeend',
                    `<button class="card-review__video-play video-play">
                        <img src="./img/play-review-icon.svg" alt="play icon" class="card-review__video-play-icon video-play__icon">
                       </button>`
                )
                newReview.addEventListener('click', () => {
                    const video = newReview.querySelector('.card-review__video');
                    if (video.paused) {
                        playVideo(video)
                    } else {
                        pauseVideo(video)
                    }
                })
            }

            newReview.style.position = 'sticky';

            if (position === 'right') {
                swiperWrapper.append(newReview);
            } else {
                const slides = swiperWrapper.querySelectorAll('.reviews-cards__card');
                slides.forEach(slide => {
                    slide.setAttribute('slide-number',
                        String(Number(slide.getAttribute('slide-number')) + 1))
                });
                const theFirstChild = swiperWrapper.firstChild;
                swiperWrapper.insertBefore(newReview, theFirstChild);
                mySwiper.activeIndex = 1;
            }
        }, 800);

    }

    function createNewReviewCard(slideNumber, idReviewCurrent, idSubcategory, currentSlide) {

        let direction = 'right';
        if (slideNumber === 0) {
            direction = 'left';
            getNewReview(idReviewCurrent, direction, idSubcategory)
                .then((reviewData) => {
                    createReview(reviewData, slideNumber, currentSlide, direction);
                }).catch(e => console.log(e))
            ;
        } else {
            getNewReview(idReviewCurrent, direction, idSubcategory)
                .then((reviewData) => {
                    createReview(reviewData, slideNumber, currentSlide, direction);
                }).catch(e => console.log(e))
            ;
        }

    }

    async function getNewReview(idCurrentReview, direction, idSubcategory) {
        let response = await fetch(
            `../scripts/get_new_review.php?
            reviewCurrentId=${idCurrentReview}&
            direction=${direction}&
            idSubcategory=${idSubcategory}`);
        return await response.json();
    }

    cardsReview.forEach(item => {
        item.addEventListener('click', sliderOn);
    });

    sliderCloseButton.addEventListener('click', sliderOff);

    mySwiper.on('slideChange', function (event) {
        console.log(event);
        const video = document.querySelectorAll('.card-review__video');
        video.forEach(item => {
            stopVideo(item)
        });

        // console.log(document.querySelector('.swiper-slide-active video'));

        setTimeout(() => {
            if (document.querySelector('.swiper-slide-active video')) {
                playVideo(document.querySelector('.swiper-slide-active video'));
            }
        }, 800);

        setTimeout(() => {
            checkEndSlider();
        }, 10);

        // console.log(slideQuantity);
        // const newReview = createElement('li', 'reviews-cards__card card-review grid-item');
        // swiperWrapper.append(newReview);
    });

});
