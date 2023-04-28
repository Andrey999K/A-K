<?php

require_once('../scripts/db.php');
$connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
$countReview = $connection->query("SELECT COUNT(id_review) as countReview FROM reviews")->fetchAll()[0]["countReview"];

$categoriesReview = $connection->query(
        "SELECT 
                    reviews_categories.id_category,
                    reviews_categories.name_category,
                    reviews_categories.position_category
                FROM reviews 
                    JOIN reviews_subcategories ON reviews_subcategories.id_subcategory = reviews.id_subcategory 
                    JOIN reviews_categories ON reviews_categories.id_category = reviews_subcategories.id_category 
                    GROUP BY reviews_subcategories.id_category 
                    ORDER BY reviews_categories.position_category"
            )->fetchAll();
$dataSubcategories = $connection->query(
    "SELECT reviews_subcategories.id_subcategory, reviews_subcategories.name_subcategory, COUNT(reviews_subcategories.name_subcategory) AS count_reviews, reviews_categories.name_category 
                FROM reviews JOIN reviews_subcategories ON reviews.id_subcategory = reviews_subcategories.id_subcategory 
                JOIN reviews_categories ON reviews_subcategories.id_category=reviews_categories.id_category
                GROUP BY reviews_subcategories.name_subcategory ORDER BY reviews_subcategories.id_category, reviews_subcategories.position_subcategory")->fetchAll();
$tagsSubcategories = $connection->query(
        "SELECT reviews_tags.name_tag, reviews_subcategories_tags.id_subcategory 
                    FROM `reviews_subcategories_tags` 
                    JOIN reviews_tags ON reviews_subcategories_tags.id_tag = reviews_tags.id_tag")->fetchAll();
$reviewSubcategories = array();
foreach ($dataSubcategories as $dataItem) {
    $tags = array();
    foreach ($tagsSubcategories as $tag) {
        if ($tag['id_subcategory'] == $dataItem['id_subcategory']) {
            array_push($tags, $tag['name_tag']);
        }
    }
    if (!array_key_exists($dataItem['name_category'], $reviewSubcategories)) {
        $reviewSubcategories[$dataItem['name_category']] = [];
    }
    array_push($reviewSubcategories[$dataItem['name_category']],
        array(
            'name' => $dataItem['name_subcategory'],
            'id' => $dataItem['id_subcategory'],
            'count_reviews' => $dataItem['count_reviews'],
            'tags' => $tags
        ));
}

?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reviews | A&K Test</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="./css/styles.css">
    <link rel="canonical" href="https://usa-ak.com/var2">
    <link rel="shortcut icon" href="https://static.tildacdn.com/tild3436-3436-4462-b663-666663396533/favicon.ico" type="image/x-icon">
    <script src="../js/anchor-links.js" defer></script>
    <script src="../js/scroll-menu.js" defer></script>
</head>
<body class="page reviews">
    <header class="page-header">
        <nav class="page-header__nav header-nav page-header__bottom">
            <div class="container">
                <div class="page-header__bottom-content">
                    <div class="page-header__move-hand">
                        <img src="../img/hand-move.gif" alt="hand hand-move" class="page-header__move-hand-image">
                    </div>
                    <ul class="header-nav__list nav-list">
                        <?php foreach ($categoriesReview as $category) { ?>
                            <li class="nav-list__item nav-item">
                                <div class="nav-item__image-container">
                                    <img src="img/menu/<?= $category['id_category'] ?>.svg" alt="icon" class="nav-item__icon">
                                </div>
                                <a href="#category-<?= $category['id_category'] ?>" class="nav-item__link"><?= $category['name_category'] ?></a>
                            </li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
        </nav>
        <?= include '../template/header.php' ?>
    </header>
    <main class="main">

        <section class="reviews-banner page-banner">
            <div class="container">
                <div class="reviews-banner__content">
                    <h1 class="main-title">A&K reviews</h1>
                    <h2 class="reviews-banner__title">Отзывы</h2>
                    <p class="reviews-banner__description">Все отзывы наших клиентов в формате скриншотов</p>
                    <div class="reviews-banner___quantity-all reviews-quantity">
                        <span class="reviews-banner__text reviews-simple-text">Отзывов</span>
                        <span class="reviews-banner__quantity reviews-quantity-number"><?=$countReview ?></span>
                    </div>
                    <a class="reviews-banner__button" href="template.php">Смотреть все ➞</a>
                    <picture class="reviews-banner__background">
                        <source srcset="./img/banner-image.png" media="(min-width: 768px)">
                        <img src="./img/banner-image-mobile.png">
                    </picture>
                    <!-- <img src="./img/banner-image-mobile.png" alt="banner image" class="reviews-banner__background"> -->
                </div>
            </div>
        </section>

        <?php foreach ($categoriesReview as $category) { ?>
            <section class="section-reviews" id="category-<?= $category['id_category'] ?>">
                <div class="container">
                    <div class="section-reviews__content">
                        <h2 class="section-reviews__title"><?= $category['name_category'] ?></h2>
                        <ul class="section-reviews__list section-reviews-list">
                            <?php if (array_key_exists($category['name_category'], $reviewSubcategories)) {
                                foreach ($reviewSubcategories[$category['name_category']] as $subcategory) { ?>
                                    <li class="section-reviews-list__item section-reviews-item">
                                        <?php if (count($subcategory['tags']) != 0) { ?>
                                        <ul class="section-reviews-item__category-list">
                                            <?php foreach ($subcategory['tags'] as $tag) { ?>
                                            <li class="section-reviews-item__category-item category">
                                                <span><?= $tag ?></span>
                                            </li>
<!--                                            <li class="section-reviews-item__category-item category">Университет</li>-->
                                            <?php } ?>
                                        </ul>
                                        <?php } ?>
                                        <h3 class="section-reviews-item__title"><?= $subcategory['name'] ?></h3>
                                        <div class="section-reviews-item__content">
                                            <div class="section-reviews__quantity">
                                                <span class="reviews-quantity-number"><?= $subcategory['count_reviews'] ?></span>
                                                <span class="reviews-simple-text">отзывов</span>
                                            </div>
                                            <a href="template.php?category=<?= $category['id_category'] ?>&subcategory=<?= $subcategory['id'] ?>" class="section-reviews__button">Смотреть ➞</a>
                                        </div>
                                    </li>
                                <?php }
                            } ?>
                        </ul>
                    </div>
                </div>
            </section>
        <?php } ?>

    </main>
</body>
</html>