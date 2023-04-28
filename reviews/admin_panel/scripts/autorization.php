<?php
header('Content-Type: text/html; charset=utf-8');

if ($_POST['login']) {
    require_once('../../../scripts/db.php');
    $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
    $login = $_POST['login'];
    $password = $_POST['password'];
    $user = $connection->
        query("SELECT * FROM reviews_admins WHERE login = '{$login}' LIMIT 1")->fetch();
    if (!$user) {
        echo json_encode(array('error' => 'Неправильный логин или пароль'));
        die();
    }
    if (password_verify($password, $user['password'])) {
        session_start();
        ini_set('session.gc.maxlifetime', 3600 * 24 * 60);
        $_SESSION['login'] = $login;
        $_SESSION['password'] = $password;
//        $reviewCategories = $connection->query("SELECT * FROM reviews_categories")->fetchAll();
//        $dataSubcategories = $connection->query(
//            "SELECT id_subcategory, name_subcategory, reviews_categories.name_category, reviews_categories.id_category
//            FROM reviews_subcategories
//            JOIN reviews_categories ON reviews_subcategories.id_category=reviews_categories.id_category")->fetchAll();
//        $reviewSubcategories = array();
//        foreach ($dataSubcategories as $dataItem) {
//            if (!array_key_exists($dataItem['name_category'], $reviewSubcategories)) {
//                $reviewSubcategories[$dataItem['name_category']] = [];
//            }
//            array_push($reviewSubcategories[$dataItem['name_category']],
//                array(
//                    'name' => $dataItem['name_subcategory'],
//                    'id' => $dataItem['id_subcategory'],
//                    'id_category' => $dataItem['id_category']
//                )
//            );
//        }
//        $reviewTags = $connection->query("SELECT * FROM reviews_tags")->fetchAll();
//        $reviewAdmins = $connection->query("SELECT * FROM reviews_admins")->fetchAll();
//        $html = '<section class="section categories">
//            <div class="container">
//                <div class="section__top">
//                    <h2 class="section__title">Категории отзывов</h2>
//                    <button id="show-categories" class="section__button-arrow button-arrow-down">
//                        <img src="img/arrow_down.png" alt="arrow down">
//                    </button>
//                </div>
//                <div class="section__content categories__content hidden">
//                    <ul class="section__list categories__list">';
//                        foreach ($reviewCategories as $category) {
//                            $html .= '<li class="section__item">
//                                <div class="nav-item__image-container">
//                                    <img src="../img/menu/' . $category['anchor_category'] . '.svg" alt="icon" class="nav-item__icon">
//                                </div>
//                                <span class="section__item-name">' . $category['name_category'] . '</span>
//                                <button class="section__button-arrow categories__item button-delete-category" id="' . $category['id_category'] . '">Удалить</button>
//                            </li>';
//                         }
//                    $html .= '</ul>
//                    <form class="section__item categories__form" enctype="multipart/form-data">
//                        <input type="text" class="section__input input-name-category" placeholder="Название" required>
//                        <input type="text" class="section__input input-anchor-category" placeholder="Метка категории" required>
//                        <input type="file" class="section__input input-icon-category" required>
//                        <button class="section__button-arrow button-add-category">Добавить</button>
//                    </form>
//                </div>
//            </div>
//        </section>';



        echo json_encode(array('error' => false));
    } else {
        echo json_encode(array('error' => 'Неправильный логин или пароль!'));
    }
}