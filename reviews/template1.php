<?php

require_once('../scripts/db.php');
$connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);

$reviews = $connection->query("SELECT * FROM reviews")->fetchAll();

?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reviews | A&K Test</title>
    <link rel="stylesheet" href="../css/libs/swiper-bundle.min.css">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="stylesheet" href="./css/templates-reviews.css">
    <script src="../js/libs/swiper-bundle.min.js" defer></script>
    <script src="../js/masonry.min.js" defer></script>
    <script src="./js/main.js" defer></script>
</head>
<body class="page reviews template">

    <header class="page-header">
        <div class="page-header__top">
            <h2>Тут будет хэдер</h2>
        </div>
        <div class="back page-header__bottom">
            <div class="container">
                <div class="back__content">
                    <a class="back-button" href="index.html">
                        <img src="./img/back.svg" alt="back" class="back__icon">
                        <span class="back__text">Вернуться</span>
                    </a>
                </div>
            </div>
        </div>
    </header>

    <main class="main">

        <section class="reviews-banner">
            <div class="container">
                <div class="reviews-banner__content">
                    <span class="category">Отзывы</span>
                    <h1 class="main-title">A&K reviews</h1>
                    <h2 class="reviews-banner__title">Подача документов<br><span>в Нью-Йорк</span></h2>
                    <div class="reviews-banner__image-container">
                        <img src="./img/banner-template-image.png" alt="London" class="reviews-banner__image">
                    </div>
                    <div class="section-reviews__quantity">
                        <span class="reviews-quantity">326</span>
                        <span class="reviews-simple-text">отзывов</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="reviews-cards">
            <div class="container">
                <div class="reviews-cards__content">
                    <div class="reviews-cards__top">
                        <div class="reviews-cards__pagination pagination-pages">
                            <button class="pagination-pages__previous-page pagination-button">
                                <img src="./img/previous-page.svg" alt="previous page" class="pagination-pages__previous-page-icon">
                            </button>
                            <ul class="reviews-card__pages">
                                <li class="reviews-card__page">1</li>
                                <li class="reviews-card__page selected-page">2</li>
                                <li class="reviews-card__page">3</li>
                                <li class="reviews-card__page">4</li>
                                <li class="reviews-card__page">5</li>
                            </ul>
                            <button class="pagination-pages__next-page pagination-button">
                                <img src="./img/next-page.svg" alt="next page" class="pagination-pages__next-page-icon">
                            </button>
                        </div>
                    </div>
                    <div style="--swiper-navigation-color: #B4B4B4;
                                --swiper-pagination-color: #B4B4B4"
                        class="swiper mySwiper hidden">
                        <button class="slider__close">
                            <svg class="slider__close-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.37496 1.01839C3.06062 0.714793 2.63962 0.546803 2.20262 0.5506C1.76563 0.554397 1.34761 0.729679 1.0386 1.03869C0.729582 1.34771 0.5543 1.76573 0.550502 2.20272C0.546705 2.63972 0.714695 3.06072 1.01829 3.37506L10.6433 13.0001L1.01663 22.6251C0.857442 22.7788 0.730471 22.9627 0.643123 23.1661C0.555775 23.3694 0.509798 23.5881 0.507875 23.8094C0.505952 24.0307 0.548122 24.2502 0.631923 24.455C0.715725 24.6598 0.83948 24.8459 0.995968 25.0024C1.15246 25.1589 1.33854 25.2826 1.54337 25.3664C1.7482 25.4502 1.96766 25.4924 2.18896 25.4905C2.41026 25.4886 2.62896 25.4426 2.8323 25.3552C3.03564 25.2679 3.21955 25.1409 3.37329 24.9817L13 15.3567L22.625 24.9817C22.9393 25.2853 23.3603 25.4533 23.7973 25.4495C24.2343 25.4457 24.6523 25.2704 24.9613 24.9614C25.2703 24.6524 25.4456 24.2344 25.4494 23.7974C25.4532 23.3604 25.2852 22.9394 24.9816 22.6251L15.3566 13.0001L24.9816 3.37506C25.2852 3.06072 25.4532 2.63972 25.4494 2.20272C25.4456 1.76573 25.2703 1.34771 24.9613 1.03869C24.6523 0.729679 24.2343 0.554397 23.7973 0.5506C23.3603 0.546803 22.9393 0.714793 22.625 1.01839L13 10.6434L3.37496 1.01672V1.01839Z"/>
                            </svg>
                        </button>
                        <ul class="reviews-cards__grid grid swiper-wrapper">
<!--                            <li class="reviews-cards__card card-review grid-item" slide-number="1">-->
<!--                                <img class="card-review__image card-review__content" src="./img/screens/1.png" alt="review screen">-->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review card-review-video grid-item" slide-number="2">-->
<!--                                <video src="./video/video_2022-09-03_13-34-12.mp4" class="card-review__video card-review__content"></video>-->
<!--                                <button class="card-review__video-play">-->
<!--                                    <img src="./img/play-review-icon.svg" alt="play icon" class="card-review__video-play-icon">-->
<!--                                </button>-->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review grid-item" slide-number="3"> -->
<!--                                <img class="card-review__image card-review__content" src="./img/screens/2.png" alt="review screen"> -->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review grid-item" slide-number="4">    -->
<!--                                <img class="card-review__image card-review__content" src="./img/screens/1.png" alt="review screen">-->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review card-review-video grid-item" slide-number="5">-->
<!--                                <video src="./video/video_2022-09-03_13-34-12.mp4" class="card-review__video card-review__content"></video>-->
<!--                                <button class="card-review__video-play">-->
<!--                                    <img src="./img/play-review-icon.svg" alt="play icon" class="card-review__video-play-icon">-->
<!--                                </button>-->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review grid-item" slide-number="6">   -->
<!--                                <img class="card-review__image card-review__content" src="./img/screens/2.png" alt="review screen"> -->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review grid-item" slide-number="7">-->
<!--                                <img class="card-review__image card-review__content" src="./img/screens/1.png" alt="review screen">-->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review card-review-video grid-item" slide-number="8">-->
<!--                                <video src="./video/video_2022-09-03_13-34-12.mp4" class="card-review__video card-review__content"></video>   -->
<!--                                <button class="card-review__video-play">-->
<!--                                    <img src="./img/play-review-icon.svg" alt="play icon" class="card-review__video-play-icon">-->
<!--                                </button>-->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review grid-item" slide-number="9">-->
<!--                                <img class="card-review__image card-review__content" src="./img/screens/2.png" alt="review screen">-->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review grid-item" slide-number="10">-->
<!--                                <img class="card-review__image card-review__content" src="./img/screens/1.png" alt="review screen">-->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review card-review-video grid-item" slide-number="11">-->
<!--                                <video src="./video/video_2022-09-03_13-34-12.mp4" class="card-review__video card-review__content"></video>-->
<!--                                <button class="card-review__video-play">-->
<!--                                    <img src="./img/play-review-icon.svg" alt="play icon" class="card-review__video-play-icon">-->
<!--                                </button>-->
<!--                            </li>-->
<!--                            <li class="reviews-cards__card card-review grid-item" slide-number="12">  -->
<!--                                <img class="card-review__image card-review__content" src="./img/screens/2.png" alt="review screen">-->
<!--                            </li>-->
                            <?php for ($i = 0; $i < count($reviews); $i++) { ?>

                                <li class="reviews-cards__card card-review grid-item" slide-number="<?=$i+1?>">
                                    <?php if ($reviews[$i]['type_file'] == 'image') { ?>
                                        <img class="card-review__image card-review__content" src="<?=$reviews[$i]['path_to_file']?>" alt="review screen">
                                    <?php } else { ?>
                                        <video src="<?=$reviews[$i]['path_to_file']?>" class="card-review__video card-review__content"></video>
                                    <button class="card-review__video-play">
                                        <img src="./img/play-review-icon.svg" alt="play icon" class="card-review__video-play-icon">
                                    </button>
                                    <?php } ?>
                                </li>

                            <?php } ?>
                        </ul>
                        <div class="swiper-button-next slider__button"></div>
                        <div class="swiper-button-prev slider__button"></div>
                        <div class="swiper-pagination"></div>
                    </div>
                    <div class="reviews-cards__bottom">
                        <div class="reviews-cards__pagination pagination-pages">
                            <button class="pagination-pages__previous-page pagination-button">
                                <img src="./img/previous-page.svg" alt="previous page" class="pagination-pages__previous-page-icon">
                            </button>
                            <ul class="reviews-card__pages">
                                <li class="reviews-card__page">1</li>
                                <li class="reviews-card__page selected-page">2</li>
                                <li class="reviews-card__page">3</li>
                                <li class="reviews-card__page">4</li>
                                <li class="reviews-card__page">5</li>
                            </ul>
                            <button class="pagination-pages__next-page pagination-button">
                                <img src="./img/next-page.svg" alt="next page" class="pagination-pages__next-page-icon">
                            </button>
                        </div>
                        <a href="#" class="reviews-cards__other-review-link">Отзывы о других услугах ➞</a>
                    </div>
                </div>
            </div>
        </section>
        <!-- <script type="module">
            var swiper = new Swiper(".mySwiper", {
                zoom: true,
                navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
                },
                pagination: {
                el: ".swiper-pagination",
                dynamicBullets: true,
                clickable: true,
                },
            });
        </script> -->
    </main>
</body>
</html>