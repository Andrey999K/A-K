<?php

if ($_GET['page']) {
    $pageNumber =  (int)$_GET['page'];
} else {
    $pageNumber = 1;
}

function getRequestParameters($idCategory, $idSubcategory, $pageNumber) {
    if ($idSubcategory != 0) {
        $parameters = "?category={$idCategory}&subcategory={$idSubcategory}" .
            ($pageNumber == 1 ? "" : "&page=" . (int)($pageNumber));
    } else {
        $parameters = ($pageNumber == 1 ? "" : '?page=' . (int)($pageNumber) . '"');
    }
    return $parameters;
}

require_once ('../scripts/funciton.php');
$connection = connectDb();

$query = "SELECT * FROM reviews";
$idSubcategory = 0;
if ($_GET['subcategory']) {
    $idSubcategory = $_GET['subcategory'];
    $idCategory = $_GET['category'];
    $query = "SELECT * FROM reviews WHERE id_subcategory = {$idSubcategory} ORDER BY position_review";
}

$reviews = $connection->query($query);
if ($reviews != false) {
    $reviews = $reviews->fetchAll();
} else {
    $reviews = [];
}

if (count($reviews) == 0) {
    header("Location: ../404.php");
}

$bannerTitle = 'Все отзывы';
$bannerImage = '';
$countReviews = 0;
if ($idSubcategory != 0) {
    $query = "SELECT name_subcategory, reviews_categories.name_category, page_banner_title, banner_file_name 
                FROM reviews_subcategories 
                JOIN reviews_categories ON reviews_subcategories.id_category = reviews_categories.id_category
                 WHERE reviews_subcategories.id_subcategory = {$idSubcategory} LIMIT 1";
    $data = $connection->query($query)->fetch();
    $bannerTitle = $data['page_banner_title'];
    $nameFileBanner = $data['banner_file_name'];
    $countReviews = $connection->query(
        "SELECT COUNT(id_review) FROM reviews WHERE id_subcategory = {$idSubcategory}"
    )->fetch()[0];
//    $bannerImage = '<div class="page-banner__image-container" style="background: ' . ($nameFileBanner ? 'url(./img/banners/' . $nameFileBanner . ') no-repeat center/contain"' : 'none;"') . '></div>';
    $bannerImage = '<div class="page-banner__image-container">
                        <img src="./img/banners/' . $nameFileBanner . '" alt="">
                    </div>';
} else {
    $countReviews = $connection->query("SELECT COUNT(id_review) FROM reviews")->fetch()[0];
}



$pageQuantity = intdiv(count($reviews), 12) + (count($reviews) % 12 == 0 ? 0 : 1);

$pagePagination = '<div class="reviews-cards__pagination pagination-pages">
                    <a' . (
                        $pageNumber == 1 ?
                            (   ' href="template.php' .
                                getRequestParameters($idCategory, $idSubcategory, (int)($pageQuantity)) . "\"")
                            :
                            (
                                ' href="template.php' .
                                getRequestParameters($idCategory, $idSubcategory, (int)($pageNumber - 1)) . "\""
                            )
                    ) . ' class="pagination-pages__previous-page pagination-button">
                        <img src="./img/previous-page.svg" alt="previous page" class="pagination-pages__previous-page-icon">
                    </a>
                    <ul class="reviews-card__pages">';

//                            <a href="template.php?page=1" class="pagination-pages__previous-page pagination-button">
//                                <img src="./img/previous-page.svg" alt="previous page" class="pagination-pages__previous-page-icon">
//                            </a>

//                            <a href="template.php?page=2" class="pagination-pages__next-page pagination-button">
//                                <img src="./img/next-page.svg" alt="next page" class="pagination-pages__next-page-icon">
//                            </a>

$lastPage = false;

for ($i = 1; $i <= $pageQuantity; $i++) {
    if ($i == $pageNumber && $i == $pageQuantity) {
        $lastPage = true;
    }
    $pagePagination .=
        '<li class="reviews-card__page' . ($i == $pageNumber ? ' selected-page' : '') . '">
            <a href="template.php'
        . ($idSubcategory == 0 ?
            ($i == 1 ? '' : '?page=' . $i) :
            (
                "?category={$idCategory}&subcategory={$idSubcategory}" . ($i == 1 ? '' : '&page=' . $i)
            ))
        . '">' . $i . '</a>
         </li>';
}

$pagePagination .= '</ul>
                    <a ' . (
                        $lastPage == true ?
                            'href="template.php' .
                            getRequestParameters($idCategory, $idSubcategory, 1)
                            . "\""
                            :
                            'href="template.php' .
                            getRequestParameters($idCategory, $idSubcategory, (int)($pageNumber + 1))
                            . "\""
                        ) . ' class="pagination-pages__next-page pagination-button">
                        <img src="./img/next-page.svg" alt="next page" class="pagination-pages__next-page-icon">
                    </a>
                </div>';

$reviewsHTML = '';
$firstReviewIndex = ($pageNumber - 1) * 12;
for ($i = $firstReviewIndex; $i < count($reviews); $i++) {
    if ($i < 12 * $pageNumber) {
//        echo $i % 12 . "     -----      " . $firstReviewIndex . '       --------      ' . count($reviews) . '<br>';
        $reviewsHTML .=
            '<li
                class="reviews-cards__card card-review grid-item" 
                slide-number="' . (string)($i % 12 + 1) . '" 
                id-review="' . $reviews[$i]['id_review'] .'" 
                page-number="' . $pageNumber . ' / ' . $pageQuantity . '" 
                review-number="' . ($i + 1) . ' / ' . count($reviews) . '" 
                data-position="' . $reviews[$i]['position_review'] . '" 
                style="height: ' . ($reviews[$i]['height_file'] ? ($reviews[$i]['height_file'] . 'px;') : 'initial;') . '"
            >';
        if ($reviews[$i]['type_file'] == 'image') {
            $reviewsHTML .= '<img class="card-review__image card-review__content" src="./img/screens/' . $reviews[$i]['id_review'] . '.' . $reviews[$i]['extension_file'] . '" alt="review screen">';
        } else {
            $reviewsHTML .= '<video src="./video/' . $reviews[$i]['id_review'] . '.' . $reviews[$i]['extension_file'] . '" class="card-review__video card-review__content"></video>
        <button class="card-review__video-play video-play">
            <img src="./img/play-review-icon.svg" alt="play icon" class="card-review__video-play-icon video-play__icon">
        </button>';
        }
        $reviewsHTML .= '</li>';
    }
}


// ЗАГРУЗКА ШАБЛОНА И ВСТАВКА В НЕГО ЗНАЧЕНИЙ

require_once('../scripts/classes.php');
$tpl = new template_class;

$header = include '../template/header.php';

$tpl->get_tpl('template.html');
$tpl->set_value('TITLE', 'Reviews | A&K Test');
$tpl->set_value('HEADER', $header);
$tpl->set_value('BANNER_TITLE', $bannerTitle);
$tpl->set_value('BANNER_IMAGE', $bannerImage);
$tpl->set_value('COUNT_REVIEWS', $countReviews);
$tpl->set_value('PAGE_PAGINATION', $pagePagination);
$tpl->set_value('REVIEWS', $reviewsHTML);

$tpl->tpl_parse();
echo $tpl->html;