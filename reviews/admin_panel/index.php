<?php
require_once('../../scripts/funciton.php');

session_start();
$session = false;
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

if ($_POST['exit']) {
    session_destroy();
    $session = false;
    header('Location: index.php');
    die();
}

if ($_SESSION['login'] && $_SESSION['password']) {
    $login = $_SESSION['login'];
    $session = true;
    $connection = connectDb();
    $reviewCategories = $connection->query("SELECT * FROM reviews_categories ORDER BY position_category");
    if ($reviewCategories != false) {
        $reviewCategories = $reviewCategories->fetchAll();
    }
//    $reviewsData = $connection->query("SELECT * FROM reviews ORDER BY id_subcategory, position_review");
    $reviewsData = $connection->query("SELECT * FROM reviews ORDER BY id_subcategory");
    if ($reviewsData != false) {
        $reviewsData = $reviewsData->fetchAll();
    } else {
        $reviewsData = [];
    }
    $subcategoriesTags = $connection->query(
            "SELECT reviews_tags.id_tag, reviews_tags.name_tag, id_subcategory 
                        FROM reviews_subcategories_tags JOIN 
                        reviews_tags ON reviews_subcategories_tags.id_tag = reviews_tags.id_tag")->fetchAll();
    $reviews = array();
    foreach ($reviewsData as $reviewData) {
        if (!array_key_exists($reviewData['id_subcategory'], $reviews)) {
            $reviews[$reviewData['id_subcategory']] = [];
        }
        array_push($reviews[$reviewData['id_subcategory']],
            array(
                'id_review' => $reviewData['id_review'],
                'extension_file' => $reviewData['extension_file'],
                'type_file' => $reviewData['type_file'],
                'height_file' => $reviewData['heightImage'],
                'position_review' => $reviewData['position_review']
            )
        );
    }
//    echo '<pre>';
//    print_r($reviews);
//    echo '</pre>';
    $dataSubcategories = $connection->query(
        "SELECT id_subcategory, name_subcategory, 
                    reviews_categories.name_category, reviews_categories.id_category, reviews_categories.position_category, 
                    page_banner_title, banner_file_name, position_subcategory
            FROM reviews_subcategories
            JOIN reviews_categories ON reviews_subcategories.id_category=reviews_categories.id_category ORDER BY position_category, position_subcategory")->fetchAll();
    $reviewSubcategories = array();
    foreach ($dataSubcategories as $dataItem) {
        if (!array_key_exists($dataItem['name_category'], $reviewSubcategories)) {
            $reviewSubcategories[$dataItem['name_category']] = [];
        }
        $arrayTags = [];
        foreach ($subcategoriesTags as $tag) {
            if ($tag['id_subcategory'] == $dataItem['id_subcategory']) {
                array_push($arrayTags, array('id' => $tag['id_tag'], 'name' => $tag['name_tag']));
            }
        }
        array_push($reviewSubcategories[$dataItem['name_category']],
            array(
                'name' => $dataItem['name_subcategory'],
                'id' => $dataItem['id_subcategory'],
                'id_category' => $dataItem['id_category'],
                'tags' => $arrayTags,
                'page_banner_title' => $dataItem['page_banner_title'],
                'banner_file_name' => $dataItem['banner_file_name'],
                'position' => $dataItem['position_subcategory']
            )
        );
    }
    $reviewTags = $connection->query("SELECT * FROM reviews_tags")->fetchAll();
    $reviewAdmins = $connection->query("SELECT * FROM reviews_admins")->fetchAll();
}

?>

<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="../../css/colors.css">
    <link rel="stylesheet" href="../../css/fonts.css">
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="../css/input-file.css">
    <meta http-equiv="pragma" content="no-cache" />
    <?php if (!$session) { ?>
    <link rel="stylesheet" href="css/autorization.css">
    <?php } ?>
    <link rel="shortcut icon" href="https://static.tildacdn.com/tild3436-3436-4462-b663-666663396533/favicon.ico" type="image/x-icon">
    <title>Админка</title>
    <?php if ($session) { ?>
    <script src="../../js/masonry-grid.js" defer></script>
    <script src="js/main.js" defer></script>
    <script src="js/admins.js" defer></script>
    <?php } ?>
    <?php if (!$session) { ?>
    <script src="js/autorization.js" defer></script>
    <?php } ?>
</head>
<body>
    <main class="main">
        <?php if (!$session) { ?>
        <section class="section autorization">
            <div class="container">
                <form class="autorization__form">
                    <input type="text" name="login" class="section__input autorization__input" placeholder="Логин" required>
                    <input type="password" name="password" class="section__input autorization__input" placeholder="Пароль"
                           autocomplete="on" required>
                    <button class="autorization__button">Войти</button>
                </form>
            </div>
        </section>
        <?php } else { ?>

        <section class="section exit">
            <div class="container">
                <div class="exit__content">
                    <span class="exit__login section__item-name"><?= $login ?></span>
                    <form action="" class="section__form exit__form" method="POST">
                        <button name="exit" value="true" class="section__button-arrow exit__button">Выход</button>
                    </form>
                </div>
            </div>
        </section>

        <section class="section categories">
            <div class="container">
                <div class="section__top">
                    <h2 class="section__title">Категории</h2>
                    <button id="show-categories" class="section__button-arrow button-arrow-down">
                        <img src="img/arrow_down.png" alt="arrow down">
                    </button>
                </div>
                <div class="section__content categories__content list-content hidden">
                    <button class="section__button button-save-order save-order-categories hidden"
                            data-request="saveOrderCategories">Сохранить</button>
                    <button class="section__button button-edit-order edit-order-categories" <?= count($reviewCategories) < 2 ? ' disabled' : '' ?>>Изменить порядок</button>
                    <ul class="section__list categories__list list-order-editable<?= count($reviewCategories) < 1 ? ' hidden' : '' ?>">
                        <?php foreach ($reviewCategories as $category) { ?>
                        <li class="section__item item-edit-order item-editable" category-id="<?= $category['id_category'] ?>"
                            item-id="<?= $category['id_category'] ?>"
                            position="<?= $category['position_category'] ?>">
                            <div class="nav-item__image-container">
                                <div class="category__icon image-wrapper">
                                    <img class="image-load" src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87_w200.webp" alt="" style="display: none;">
                                    <img src="../img/menu/<?= $category['id_category'] ?>.svg" alt="icon" class="nav-item__icon file-image">
                                    <label class="edit-button" for="edit-icon-category<?= $category['id_category'] ?>">
                                        <input type="file" data-type-request="editIconCategory" data-item-id="<?= $category['id_category'] ?>" class="edit-icon-category edit-image" id="edit-icon-category<?= $category['id_category'] ?>" style="width: 1px; height: 1px;">
                                        <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"/>
                                        </svg>
                                    </label>
                                </div>
                            </div>
                            <div class="section__item-name-container item-name edit-text-container">
                                <span class="section__item-name text-editable name-category-<?= $category['id_category'] ?>"><?= $category['name_category'] ?></span>
                                <input type="text" class="section__item-name input-edit hidden" data-request="categoryName" data-item-id="<?= $category['id_category'] ?>" value="<?= $category['name_category'] ?>">
                                <button class="edit-button edit-button-text edit-button-category-name">
                                    <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"></path>
                                    </svg>
                                </button>
                                <div class="section__buttons">
                                    <button class="section__button button-save hidden">Сохранить</button>
                                    <button class="section__button button-cancel hidden">Отмена</button>
                                </div>
                            </div>
                            <button class="section__button-arrow categories__item button-delete-category" id="<?= $category['id_category'] ?>">Удалить</button>
                        </li>
                        <?php } ?>
                    </ul>
                    <form class="section__item categories__form" enctype="multipart/form-data">
                        <input type="text" class="section__input input-name-category" placeholder="Название" required>
<!--                        <input type="text" class="section__input input-anchor-category" placeholder="Метка категории" required>-->

                        <div class="form-input-category-icon upload-file__wrapper">
                            <input type="file" name="icon" id="input-icon-category" class="section__input input-icon-category upload-file__input" required>
                            <label class="upload-file__label" for="input-icon-category">
                                <svg class="upload-file__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path
                                            d="M286 384h-80c-14.2 1-23-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c11.6 11.6 3.7 33.1-13.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-23-23V366c0-13.3 10.7-24 24-24h136v8c0 31 24.3 56 56 56h80c30.9 0 55-26.1 57-55v-8h135c13.3 0 24 10.6 24 24zm-124 88c0-11-9-20-19-20s-19 9-20 20 9 19 20 20 21-9 20-20zm64 0c0-12-9-20-20-20s-20 9-19 20 9 20 20 20 21-9 20-20z">
                                    </path>
                                </svg>
                                <span class="upload-file__text">Загрузить иконку категории</span>
                            </label>
                        </div>
                        <button class="section__button-arrow button-add-category">Добавить</button>
                    </form>
                </div>
            </div>
        </section>

        <section class="section subcategories">
            <div class="container">
                <div class="section__top">
                    <h2 class="section__title">Карточки</h2>
                    <button id="show-subcategories" class="section__button-arrow button-arrow-down">
                        <img src="img/arrow_down.png" alt="arrow down">
                    </button>
                </div>
                <div class="section__content subcategories__content hidden">
                    <ul class="section__list subcategories__list<?= count($reviewCategories) == 0 ? ' hidden' : '' ?>">
                        <?php foreach ($reviewCategories as $category) { ?>
                        <li class="section__item subcategories__item category-<?= $category['id_category'] ?>">
                            <div class="section__item-top">
                                <h2 class="section__item-title name-category-<?= $category['id_category'] ?>"><?= $category['name_category'] ?></h2>
                                <button class="section__button-arrow button-arrow-down show-subcategories-in-category">
                                    <img src="img/arrow_down.png" alt="arrow down">
                                </button>
                            </div>
                            <div class="section__item-content list-subcategories-in-category list-content hidden">
                                <button class="section__button button-save-order save-order-subcategories hidden"
                                data-request="saveOrderSubcategories">Сохранить</button>
                                <button class="section__button button-edit-order edit-order-subcategories"
                                    <?php
                                    if (!array_key_exists($category['name_category'], $reviewSubcategories)) {
                                        echo ' disabled';
                                    } else if (count($reviewSubcategories[$category['name_category']]) < 2) {
                                        echo ' disabled';
                                    }
                                    ?>>Изменить порядок</button>
                                <ul class="section__sub-list list-order-editable">
                                    <?php
                                    if (array_key_exists($category['name_category'], $reviewSubcategories)) {
                                        foreach ($reviewSubcategories[$category['name_category']] as $subcategory) { ?>
                                            <li class="section__item subcategory item-edit-order" id-subcategory="<?= $subcategory['id'] ?>"
                                                item-id="<?= $subcategory['id'] ?>" position="<?= $subcategory['position'] ?>">
                                                <div class="section__item-name-container item-name edit-text-container">
                                                    <span class="section__item-name text-editable name-subcategory-<?= $subcategory['id'] ?>"><?= $subcategory['name'] ?></span>
                                                    <input type="text" class="section__item-name input-edit hidden" data-request="subcategoryName"
                                                           data-item-id="<?= $subcategory['id'] ?>" value="<?= $subcategory['name'] ?>">
                                                    <button class="edit-button edit-button-text edit-button-subcategory-name">
                                                        <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"></path>
                                                        </svg>
                                                    </button>
                                                    <div class="section__buttons">
                                                        <button class="section__button button-save hidden">Сохранить</button>
                                                        <button class="section__button button-cancel hidden">Отмена</button>
                                                    </div>
                                                </div>
                                                <div class="subcategory__banner">
                                                    <div class="section__item-name-container edit-text-container">
                                                        <span class="section__item-banner-title text-editable"><?= $subcategory['page_banner_title'] ?></span>
                                                        <input type="text" class="section__item-name input-edit hidden" data-request="subcategoryTitle"
                                                               data-item-id="<?= $subcategory['id'] ?>" value="<?= $subcategory['name'] ?>">
                                                        <button class="edit-button edit-button-text edit-button-subcategory-name">
                                                            <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"></path>
                                                            </svg>
                                                        </button>
                                                        <div class="section__buttons">
                                                            <button class="section__button button-save hidden">Сохранить</button>
                                                            <button class="section__button button-cancel hidden">Отмена</button>
                                                        </div>
                                                    </div>
                                                    <div class="subcategory__banner-image image-wrapper">
                                                        <img class="image-load" src="https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87_w200.webp" alt="" style="display: none;">
                                                        <img class="subcategory__banner-file file-image" src="<?= '../img/banners/' . ($subcategory['banner_file_name'] ? $subcategory['banner_file_name'] : 'default.png') ?>" alt="">
                                                        <label class="subcategory__banner-edit-button edit-button
" for="edit-banner-subcategory<?= $subcategory['id'] ?>">
                                                            <input type="file" data-type-request="editBannerSubcategory" data-item-id="<?= $subcategory['id'] ?>" class="edit-image edit-banner-subcategory" id="edit-banner-subcategory<?= $subcategory['id'] ?>" style="width: 1px; height: 1px;">
                                                            <svg class="edit-icon" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M20.8984 0.972656C19.8516 0.972656 18.8047 1.37891 17.9922 2.19531L2.17969 18.0078L0.726562 25.2734L7.99219 23.8203L23.8047 8.00781C25.4336 6.38281 25.4336 3.82031 23.8047 2.19531C22.9922 1.37891 21.9492 0.972656 20.8984 0.972656ZM20.8984 2.875C21.4023 2.875 21.9063 3.12109 22.3945 3.60547C23.3672 4.58203 23.3672 5.62109 22.3945 6.59375L21.6992 7.28516L18.7148 4.30078L19.4062 3.60938C19.8945 3.12109 20.3984 2.87891 20.9023 2.87891L20.8984 2.875ZM17.3008 5.71484L20.2852 8.69922L8.17578 20.8125C7.51953 19.5195 6.48047 18.4805 5.19141 17.8242L17.3008 5.71484ZM3.90625 19.5742C5.07031 20.0664 5.9375 20.9297 6.42578 22.0938L3.27344 22.7266L3.90625 19.5742Z"/>
                                                            </svg>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="subcategories-tags">
                                                    <ul class="subcategories-tags__list"
                                                        <?= count($subcategory['tags']) != 0 ? ' style="margin-right: 10px"' : '' ?>
                                                    >
                                                    <?php foreach ($subcategory['tags'] as $tag) { ?>
                                                        <li class="subcategories-tags__item category">
                                                            <span><?= $tag['name'] ?></span>
                                                            <button class="subcategories-tags-item__button-delete button-tag-delete" id-tag="<?= $tag['id'] ?>">
                                                                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope tp-yt-iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope tp-yt-iron-icon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" class="style-scope tp-yt-iron-icon"></path></g></svg>
                                                            </button>
                                                        </li>
                                                    <?php } ?>
                                                    </ul>
                                                    <div class="input-tags-wrapper">
                                                        <input type="text" class="subcategories-tags__input subcategory__tags-input" placeholder="Теги">
                                                    </div>

                                                </div>
                                                <button
                                                    class="section__button-arrow category__item button-delete-subcategory"
                                                    id="<?= $subcategory['id'] ?>">Удалить
                                                </button>
                                            </li>
                                        <?php }
                                    } ?>
                                </ul>
                                <form class="section__item section__sub-item subcategories__form" id="<?= $category['id_category'] ?>">
                                    <input type="text" class="section__input input-name-subcategory" placeholder="Название" required>
                                    <input type="text" class="section__input input-title-subcategory" placeholder="Заголовок" required>
                                    <div class="upload-file__wrapper">
                                        <input type="file" name="files" id="new-subcategory-<?= $category['id_category'] ?>" class="upload-file__input input-banner-subcategory" required>
                                        <label class="upload-file__label" for="new-subcategory-<?= $category['id_category'] ?>">
                                            <svg class="upload-file__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path
                                                        d="M286 384h-80c-14.2 1-23-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c11.6 11.6 3.7 33.1-13.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-23-23V366c0-13.3 10.7-24 24-24h136v8c0 31 24.3 56 56 56h80c30.9 0 55-26.1 57-55v-8h135c13.3 0 24 10.6 24 24zm-124 88c0-11-9-20-19-20s-19 9-20 20 9 19 20 20 21-9 20-20zm64 0c0-12-9-20-20-20s-20 9-19 20 9 20 20 20 21-9 20-20z">
                                                </path>
                                            </svg>
                                            <span class="upload-file__text">Баннер карточки</span>
                                        </label>
                                    </div>
                                    <div class="subcategories-tags">
                                        <ul class="subcategories-tags__list" style="margin-right: 10px;">
                                            <?php ?>
                                        </ul>
                                        <div class="input-tags-wrapper">
                                            <input type="text" class="subcategories-tags__input" placeholder="Теги">
                                        </div>
                                    </div>
                                    <button class="section__button-arrow button-add-subcategory">Добавить</button>
                                </form>
                            </div>
                        </li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
        </section>

<!--        <section class="section tags">-->
<!--            <div class="container">-->
<!--                <div class="section__top">-->
<!--                    <h2 class="section__title">Теги</h2>-->
<!--                    <button id="show-tags" class="section__button-arrow button-arrow-down">-->
<!--                        <img src="img/arrow_down.png" alt="arrow down">-->
<!--                    </button>-->
<!--                </div>-->
<!--                <div class="section__content tags__content hidden">-->
<!--                    <ul class="section__list tags__list">-->
<!--                        --><?php //foreach ($reviewTags as $tag) { ?>
<!--                            <li class="section__item">-->
<!--                                <span class="section__item-name">--><?//= $tag['name_tag'] ?><!--</span>-->
<!--                                <button class="section__button-arrow tags__item button-delete-tag" id="--><?//= $tag['id_tag'] ?><!--">Удалить</button>-->
<!--                            </li>-->
<!--                        --><?php //} ?>
<!--                    </ul>-->
<!--                    <form class="section__item tags__form">-->
<!--                        <input type="text" class="section__input input-name-tag" placeholder="Тег" required>-->
<!--                        <button class="section__button-arrow button-add-tag">Добавить</button>-->
<!--                    </form>-->
<!--                </div>-->
<!--            </div>-->
<!--        </section>-->

        <section class="section reviews">
            <div class="container">
                <div class="section__top">
                    <h2 class="section__title">Отзывы</h2>
                    <button id="show-reviews" class="section__button-arrow button-arrow-down">
                        <img src="img/arrow_down.png" alt="arrow down">
                    </button>
                </div>
                <div class="section__content reviews__content hidden">
                    <ul class="section__list reviews__list<?= count($reviewSubcategories) == 0 ? ' hidden' : '' ?>">
                        <?php foreach ($reviewSubcategories as $category => $subcategories) {
                            foreach ($subcategories as $subcategory) { ?>
                            <li class="section__item category-<?= $subcategory['id_category'] ?>" subcategory-id="<?= $subcategory['id'] ?>">
                                <div class="section__item-top">
                                    <h2 class="section__item-name name-subcategory-<?= $subcategory['id'] ?>"><?= $subcategory['name'] ?></h2>
                                    <button class="section__button-arrow button-arrow-down show-reviews-subcategory">
                                        <img src="img/arrow_down.png" alt="arrow down">
                                    </button>
                                </div>
                                <div class="section__item-content list-reviews list-content hidden">
                                    <button class="section__button button-save-order save-order-reviews hidden"
                                            data-request="saveOrderReviews">Сохранить</button>
                                    <button class="section__button button-edit-order edit-order-reviews"
                                    <?php if (array_key_exists($subcategory['id'], $reviews)) {
                                        if (count($reviews[$subcategory['id']]) < 2) { ?>
                                             disabled
                                        <?php }
                                    } else { ?>
                                        disabled
                                    <?php } ?>
                                    >Изменить порядок</button>
                                    <div class="section__subcategory-reviews-content subcategory-<?= $subcategory['id'] ?> list-order-editable">
                                    <?php if (array_key_exists($subcategory['id'], $reviews)) {
                                        foreach ($reviews[$subcategory['id']] as $review) { ?>
                                           <div class="review-card item-edit-order" item-id="<?= $review['id_review'] ?>"
                                                position="<?= $review['position_review'] ?>"
                                                style="height: <?= $review['height_file'] ? $review['height_file'] . 'px' : 'initial' ?>">
                                                <?php if ($review['type_file'] == 'image') { ?>
                                                <img class="review-card__image" src="../img/screens/<?= $review['id_review'] . '.' . $review['extension_file'] ?>" alt="review screen" draggable="false">
                                                <?php } else { ?>
                                                <video class="review-card__video" src="../video/<?= $review['id_review'] . '.' . $review['extension_file'] ?>"></video>
                                                <button class="video-play">
                                                    <img src="../img/play-review-icon.svg" alt="play icon" class="video-play__icon">
                                                </button>
                                                <?php } ?>
                                               <?php if ($review['type_file'] == 'image') { ?>
                                               <button class="review-card-button review-card__button-paint button-paint" data-review-id="<?= $review['id_review'] ?>">
                                                   <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                       <path d="M24.322 2.2204C23.4181 1.32823 21.9525 1.32823 21.0494 2.2204L7.62816 15.4705C5.98441 15.4338 3.70939 16.0158 2.72734 19.2322C1.97659 20.9346 0 20.8487 0 20.8487C4.10394 25.4019 8.94071 22.8214 10.0454 21.7026C11.0157 20.719 11.1555 19.5166 11.0516 18.5549L24.322 5.45169C25.226 4.55952 25.226 3.11262 24.322 2.2204ZM8.95395 20.6253C8.18522 21.3385 4.74923 22.9284 2.72734 21.387C2.72734 21.387 3.43125 20.8378 3.96408 19.7354C5.23672 16.3549 8.40862 16.8548 8.40862 16.8548L9.49928 17.9322C9.51022 17.9424 10.3141 19.3643 8.95395 20.6253ZM10.5907 16.8549C10.4899 16.7557 9.50009 15.7775 9.50009 15.7775L11.1368 14.1619L12.2275 15.2392L10.5907 16.8549ZM23.2306 4.37435L13.3181 14.1619L12.2274 13.0846L22.14 3.29779C22.4416 3.00012 22.9298 3.00012 23.2306 3.29779C23.5322 3.59467 23.5322 4.07746 23.2306 4.37435Z"/>
                                                   </svg>
                                               </button>
                                               <?php } ?>
<!--                                                <button class="review-card-button review-card__button-crop button-crop">-->
<!--                                                    <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                                                        <line x1="0.5" y1="3.5" x2="2.66748" y2="3.5" stroke-linecap="round"/>-->
<!--                                                        <rect x="4.5" y="3.5" width="20" height="18"/>-->
<!--                                                        <line x1="4.5" y1="3.58252" x2="4.5" y2="0.499991" stroke-linecap="round"/>-->
<!--                                                        <line x1="24.5" y1="24.5825" x2="24.5" y2="21.5" stroke-linecap="round"/>-->
<!--                                                        <line x1="26.5" y1="21.5" x2="28.6675" y2="21.5" stroke-linecap="round"/>-->
<!--                                                    </svg>-->
<!--                                                </button>-->
                                                <button class="review-card-button review-card__button-delete button-delete button-delete-review" id-review="<?= $review['id_review'] ?>" file-review="<?= $review['id_review'] . '.' . $review['extension_file'] ?>">
                                                    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <line x1="0.362976" y1="0.656128" x2="18.363" y2="19.6561"/>
                                                        <line x1="0.637024" y1="19.6561" x2="18.637" y2="0.656128"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        <?php }
                                    } else { ?>
                                        <span>0 отзывов</span>
                                    <?php } ?>
                                    </div>
                                    <form class="reviews__form" enctype="multipart/form-data" id="subcategory-<?= $subcategory['id'] ?>">
                                        <div class="upload-file__wrapper">
                                            <input type="file" name="files" id="new-reviews-subcategory-<?= $subcategory['id'] ?>" class="section__input upload-file__input" multiple required>
                                            <label class="upload-file__label" for="new-reviews-subcategory-<?= $subcategory['id'] ?>">
                                                <svg class="upload-file__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path d="M286 384h-80c-14.2 1-23-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c11.6 11.6 3.7 33.1-13.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-23-23V366c0-13.3 10.7-24 24-24h136v8c0 31 24.3 56 56 56h80c30.9 0 55-26.1 57-55v-8h135c13.3 0 24 10.6 24 24zm-124 88c0-11-9-20-19-20s-19 9-20 20 9 19 20 20 21-9 20-20zm64 0c0-12-9-20-20-20s-20 9-19 20 9 20 20 20 21-9 20-20z"></path>
                                                </svg>
                                                <span class="upload-file__text">Загрузить отзывы</span>
                                            </label>
                                        </div>
                                        <button class="section__button-arrow category__item button-add-reviews">Добавить</button>
                                    </form>
                                </div>
                            </li>
                        <?php }
                        } ?>
                    </ul>
                </div>
            </div>
            <div class="review-edit hidden">
                <div class="container">
                    <img src="" alt="">
                    <canvas></canvas>
                    <div class="review-edit__toolbar toolbar">
                        <input class="toolbar__input-color" type="color" value="#000000">
                        <div class="toolbat__item active" id="brush">
                            <img src="img/brush.svg" alt="">
                        </div>
                        <div class="toolbat__item" id="rectangle">
                            <img src="img/rectangle.svg" alt="">
                        </div>
                        <div class="toolbat__item" id="rectangleFill">
                            <img src="img/rectangle-fill.svg" alt="">
                        </div>
                        <div class="toolbat__item" id="circle">
                            <img src="img/circle.svg" alt="">
                        </div>
                        <div class="toolbat__item" id="circleFill">
                            <img src="img/circle-fill.svg" alt="">
                        </div>
                    </div>
                    <div class="review-edit__button">
                        <button class="section__button review-edit__button review-edit__save-button hidden">Сохранить</button>
                        <button class="section__button review-edit__button review-edit__cancel-button hidden">Отмена</button>
                    </div>
                </div>
                <button class="review-edit-close" data-review-id="">
                    <svg viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0.362976" y1="0.656128" x2="39.2051" y2="41.6561"/>
                        <line x1="1.79492" y1="41.6561" x2="40.637" y2="0.656129"/>
                    </svg>
                </button>
            </div>
        </section>

        <section class="section admins">
            <div class="container">
                <div class="section__top">
                    <h2 class="section__title">Пользователи</h2>
                    <button id="show-admins" class="section__button-arrow button-arrow-down">
                        <img src="img/arrow_down.png" alt="arrow down">
                    </button>
                </div>
                <div class="section__content admins__content hidden">
                    <ul class="section__list admins__list">
                        <?php foreach ($reviewAdmins as $admin) { ?>
                        <li class="section__item">
                            <span class="section__item-name"><?= $admin['login'] ?></span>
                            <button class="section__button-arrow button-delete-admin" id="<?= $admin['id_admin'] ?>">Удалить</button>
                        </li>
                        <?php } ?>
                    </ul>
                    <form class="section__item admins__form">
                        <input type="text" name="login" class="section__input input-login-admin" placeholder="Логин" required>
                        <input type="text" name="password" class="section__input input-password-admin" placeholder="Пароль" required>
                        <button class="section__button-arrow button-add-admin">Добавить</button>
                    </form>
                </div>
            </div>
        </section>

        <?php } ?>
    </main>
</body>
</html>
