<?php
include_once("../../../scripts/funciton.php");

header('Content-Type: text/html; charset=utf-8');

function checkFile($icon, $allowedExtension, $size) {
    $iconName = $icon['name'];
    $iconError = $icon['error'];
    $iconSize = $icon['size'];
    $iconExtension = strtolower(end(explode('.', $iconName)));
    $iconName = explode('.', $iconName)[0];
    $fullNameFile = $iconName . '.' . $iconExtension;
    if (in_array($iconExtension, $allowedExtension)) {
        if ($iconSize < $size) {
            if ($iconError === 0) {
                return 'Успешно';
            } else {
                return 'Error:Что-то пошло не так';
            }
        } else {
            return 'Error:Слишком большой размер файла. Файл должен быть не больше ' .
                ($size < (1024 * 1024) ? ($size / 1024 . 'кб') : ($size / 1024 / 1024 . 'мб')) ;
        }
    } else {
        return "Error:Неверный тип файла {$fullNameFile}";
    }
}

function deleteFile($fileDestination) {
    if (file_exists($fileDestination)) {
        unlink($fileDestination);
    }
}

function uploadFile($file, $itemId, $type) {
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileExtension = strtolower(end(explode('.', $fileName)));
    $newName = $itemId . '.' . $fileExtension;

    $path = '../../img/';
    if ($type != 'editIconCategory') {
        $connection = connectDb();
        $query = "UPDATE reviews_subcategories SET banner_file_name = '{$newName}' WHERE id_subcategory = {$itemId}";
        $path .= 'banners/';
        if ($type != 'editBannerSubcategory') {
            $query = "UPDATE reviews SET banner_file_name = '{$newName}' WHERE id_subcategory = {$itemId}";
            $path .= 'screens/';
        }
        $connection->query($query);
    } else {
        $path .= 'menu/';
    }

    $fileDestination = $path . $newName;
    deleteFile($fileDestination);
    move_uploaded_file($fileTmpName, $fileDestination);
    return preg_replace('/..\//', '', $fileDestination, 1);
}

function checkUploadFile($file, $maxSize, $itemId, $request, $massExtension) {
    $return = checkFile($file, $massExtension, $maxSize);
    if ($return === 'Успешно') {
        try {
            return json_encode(uploadFile($file, $itemId, $request));
        } catch (Exception $e) {
            return json_encode('Error:',  $e->getMessage());
        }
    } else {
        return json_encode($return, JSON_UNESCAPED_UNICODE);
    }
}

if ($_POST['insert']) {
    if ($_POST['category'] == 'cat') {
        $nameCategory = $_POST['name'];
        $icon = $_FILES['icon'];

        $return = checkFile($icon, ['svg'], 5000);

        if ($return === 'Успешно') {
            $connection = connectDB();
            try {
                $iconName = $icon['name'];
                $iconTmpName = $icon['tmp_name'];
                $iconExtension = strtolower(end(explode('.', $iconName)));
                $data = $connection->query("SELECT position_category FROM reviews_categories ORDER BY position_category DESC LIMIT 1");
                if ($data) {
                    $data = $data->fetch();
                }
                $position = (int)$data["position_category"] + 1;
                $query = "
                            INSERT INTO reviews_categories (
                            name_category, position_category 
                            ) VALUES ('{$nameCategory}', {$position})";
                $connection->query($query);
                $response = $connection->query("SELECT * FROM reviews_categories ORDER BY id_category DESC LIMIT 1")->fetch();
                $fileDestination = '../../img/menu/' . $response['id_category'] . '.' . $iconExtension;
                move_uploaded_file($iconTmpName, $fileDestination);
                echo json_encode($response);
                die();
            } catch (Exception $e) {
                echo json_encode('Error:',  $e->getMessage());
            }
        } else {
            echo json_encode($return);
            die();
        }

//        $iconName = $icon['name'];
//        $iconTmpName = $icon['tmp_name'];
//        $iconType = $icon['type'];
//        $iconError = $icon['error'];
//        $iconSize = $icon['size'];
//        $iconExtension = strtolower(end(explode('.', $iconName)));
//        $iconName = explode('.', $iconName)[0];
//        $allowedExtension= ['svg'];
//        $fullNameFile = $iconName . '.' . $iconExtension;
//
//        if (in_array($iconExtension, $allowedExtension)) {
//            if ($iconSize < 5000) {
//                if ($iconError === 0) {
//                    require_once('../../../scripts/db.php');
//                    $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
//                    try {
//                        $query = "
//                            INSERT INTO reviews_categories (
//                            name_category
//                            ) VALUES ('{$nameCategory}')";
//                        $connection->query($query);
//                        $response = $connection->query("SELECT * FROM reviews_categories ORDER BY id_category DESC LIMIT 1")->fetch();
//                        $fileDestination = '../../img/menu/' . $response['id_category'] . '.' . $iconExtension;
//                        move_uploaded_file($iconTmpName, $fileDestination);
//                        echo json_encode($response);
//                    } catch (Exception $e) {
//                        echo json_encode('Error:',  $e->getMessage());
//                    }
//
//                } else {
//                    echo json_encode('Error:Что-то пошло не так');
//                }
//            } else {
//                echo json_encode('Error:Слишком большой размер файла');
//            }
//        } else {
//            echo json_encode("Error:Неверный тип файла {$fullNameFile}");
//        }
    } else if ($_POST['category'] == 'tag') {
//        $nameTag = $_POST['name'];
//        require_once('../../../scripts/db.php');
//        $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
//        try {
//            $query = "INSERT INTO reviews_tags
//                    (name_tag) VALUES ('{$nameTag}')";
//            $connection->query($query);
//            $response = $connection->query("SELECT * FROM reviews_tags ORDER BY id_tag DESC LIMIT 1")->fetch();
//            echo json_encode($response);
//        } catch (Exception $e) {
//            echo json_encode('Error:',  $e->getMessage());
//        }
    } else if ($_POST['category'] == 'subcat') {
        $nameSubcat = $_POST['name'];
        $titleSubcat = $_POST['title'];
        $idCat = $_POST['idCat'];
        $banner = $_FILES['banner'];
        $tags = $_POST['tags'];
        $tags = explode(',', $tags);
        $return = checkFile($banner, ['png', 'jpg', 'jpeg', 'webp'], 1024 * 1024 * 20);
        if ($return === 'Успешно') {
            require_once('../../../scripts/db.php');
            $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
            try {
                $bannerName = $banner['name'];
                $bannerTmpName = $banner['tmp_name'];
                $bannerExtension = strtolower(end(explode('.', $bannerName)));
                $data = $connection->query("SELECT position_subcategory FROM reviews_subcategories ORDER BY position DESC LIMIT 1");
                if ($data) {
                    $data = $data->fetch();
                }
                $position = (int)$data["position_subcategory"] + 1;
                $query = "INSERT INTO reviews_subcategories 
                    (name_subcategory, id_category, page_banner_title, position_subcategory) VALUES (
                        '{$nameSubcat}', {$idCat}, '{$titleSubcat}', {$position}
                    )";
                $connection->query($query);
                $response = $connection->query("SELECT * FROM reviews_subcategories ORDER BY id_subcategory DESC LIMIT 1")->fetch();
                $lastIdSubcategory = $response['id_subcategory'];
                $fullName = $lastIdSubcategory . '.' . $bannerExtension;
                $fileDestination = '../../img/banners/' . $fullName;
                $connection->query("UPDATE reviews_subcategories SET banner_file_name = '{$fullName}' WHERE id_subcategory = {$response['id_subcategory']}");
                if (file_exists($fileDestination)) {
                    unlink($fileDestination);
                }
                move_uploaded_file($bannerTmpName, $fileDestination);
                $tagsData = [];
                foreach ($tags as $tag) {
                    $connection->query("INSERT INTO reviews_tags (name_tag) VALUES ('{$tag}')");
                    $tagData = $connection->query("SELECT * FROM reviews_tags ORDER BY id_tag DESC LIMIT 1")->fetch();
                    $lastIdTag = $tagData['id_tag'];
                    array_push($tagsData, $tagData);
                    $connection->query("INSERT INTO reviews_subcategories_tags (id_tag, id_subcategory) VALUES ({$lastIdTag}, {$lastIdSubcategory})");
                }
                $response = $connection->query("SELECT * FROM reviews_subcategories ORDER BY id_subcategory DESC LIMIT 1")->fetch();
                $response['tags'] = $tagsData;
                echo json_encode($response);
            } catch (Exception $e) {
                echo json_encode('Error:',  $e->getMessage());
            }
        } else {
            echo json_encode($return);
        }

    } else if ($_POST['category'] == 'reviews') {

        require_once('../../../scripts/db.php');
        $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);

        $idSubcat = $_POST['idSubcat'];
        $files = $_FILES;

        $newFiles = [];

        // ЗАГРУЗКА ОТЗЫВОВ
        for ($i = 0; $i < count($files); $i++) {

            $fileName = $files['file' . $i]['name'];
            $fileTmpName = $files['file' . $i]['tmp_name'];
            $fileType = $files['file' . $i]['type'];
            $fileError = $files['file' . $i]['error'];
            $fileSize = $files['file' . $i]['size'];
            $fileExtension = strtolower(end(explode('.', $fileName)));
            $fileName = explode('.', $fileName)[0];
            $allowedExtensionImg = ['jpg', 'jpeg', 'png'];
            $allowedExtensionVideo = ['mp4', 'mov'];
            $fullNameFile = $fileName . '.' . $fileExtension;


            if (in_array($fileExtension, $allowedExtensionImg)) {
                if ($fileSize < 1024 * 1024 * 20) {
                    if ($fileError === 0) {
                        $connection->query("INSERT INTO reviews (name_file, type_file, id_subcategory)
                                        VALUES ('{$fullNameFile}', 'image', {$idSubcat})");
                        $lastID = $connection->query("SELECT MAX(id_review) FROM reviews");
                        $lastID = $lastID->fetchAll();
                        $lastID = $lastID[0][0];
                        $fileNameNew = $lastID . '_' . $fullNameFile;
                        $fileDestination = '../../img/screens/' . $fileNameNew;
                        move_uploaded_file($fileTmpName, $fileDestination);
                        $heightImg = getHeightImg($fileDestination);
                        $widthImg = getWidthImg($fileDestination);
                        $newHeight = round($heightImg / $widthImg * 260);
                        $connection->query("UPDATE reviews SET height_file = {$newHeight} WHERE id_review = {$lastID}");
                        array_push($newFiles, array(
                            'reviewId' => $lastID,
                            'fileName' => $fileNameNew,
                            'idSubcat' => $idSubcat
                        ));
//                        echo 'Файл <b>' . $fullNameFile . '</b> успешно загружен<br>';
                    } else {
                        echo json_encode(array('error' => 'Что-то пошло не так'), JSON_UNESCAPED_UNICODE);
                        die();
                    }
                } else {
                    echo json_encode(array('error' => 'Файл превышает 20Мб!'), JSON_UNESCAPED_UNICODE);
                    die();
                }
            } else if (in_array($fileExtension, $allowedExtensionVideo)) {
                if ($fileSize < 1024 * 1024 * 500) {
                    if ($fileError === 0) {
                        $connection->query("INSERT INTO reviews (name_file, type_file, id_subcategory)
                                        VALUES ('{$fullNameFile}', 'video', {$idSubcat})");
                        $lastID = $connection->query("SELECT MAX(id_review) FROM reviews");
                        $lastID = $lastID->fetchAll();
                        $lastID = $lastID[0][0];
                        $fileNameNew = $lastID . '_' . $fullNameFile;
                        $fileDestination = '../../video/' . $fileNameNew;
                        move_uploaded_file($fileTmpName, $fileDestination);
                        $connection->query("UPDATE reviews SET height_file = 506 WHERE id_review = {$lastID}");
                        array_push($newFiles, array(
                            'reviewId' => $lastID,
                            'fileName' => $fileNameNew,
                            'idSubcat' => $idSubcat
                        ));
//                        echo 'Файл <b>' . $fullNameFile . '</b> успешно загружен<br>';
                    } else {
                        echo json_encode(array('error' => 'Что-то пошло не так'), JSON_UNESCAPED_UNICODE);
                        die();
                    }
                } else {
                    echo json_encode(array('error' => 'Файл превышает 500Мб!'), JSON_UNESCAPED_UNICODE);
                    die();
                }
            } else {
                echo json_encode(array('error' => ('Неверный тип файла ' . $fullNameFile . '<br>')), JSON_UNESCAPED_UNICODE);
                die();
            }
        }
        echo json_encode(
            array(
                'error' => false,
                'message' => (count($files) . ' отзывов успешно загружено!'),
                'newFiles' => $newFiles
            ),
            JSON_UNESCAPED_UNICODE
        );
    } else if ($_POST['category'] == 'admins') {
        require_once('../../../scripts/db.php');
        $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
        $login = $_POST['login'];
        $password = $_POST['password'];
        $password = password_hash($password, PASSWORD_BCRYPT);
        try {
            $query = "SELECT login FROM reviews_admins WHERE login = '{$login}' LIMIT 1";
            $data = $connection->query($query)->fetch();
            if ($data) {
                echo json_encode("Error:Пользователь с логином {$login} уже существует.");
            } else {
                $connection->query("INSERT INTO reviews_admins (login, password) VALUES ('{$login}', '{$password}')");
                $data = $connection->query("SELECT id_admin, login FROM reviews_admins ORDER BY id_admin DESC LIMIT 1")->fetch();
                echo json_encode($data);
            }

        } catch (Exception $e) {
            echo json_encode('Error:',  $e->getMessage());
        }
    }
} else if ($_POST['delete']) {
    if ($_POST['category'] == 'cat') {
        $catId = $_POST['catId'];
        require_once('../../../scripts/db.php');
        $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
        try {
            $nameFile = '../../img/menu/';
            $data = $connection->query("SELECT * FROM reviews_categories WHERE id_category = {$catId}")->fetch();
            $nameFile .= $data['anchor_category'];
            $nameFile .= '.svg';
            $data = $connection->query("SELECT id_subcategory FROM reviews_subcategories WHERE id_category = {$catId}");
            if ($data) {
                $data = $data->fetchAll();
                foreach ($data as $item) {
                    $connection->query("DELETE FROM reviews WHERE id_subcategory = {$item[0]}");
                }
            }
            $connection->query("DELETE FROM reviews_subcategories WHERE id_category = {$catId}");
            $connection->query("DELETE FROM reviews_categories WHERE id_category = {$catId}");
            if (file_exists($nameFile)) {
                unlink($nameFile);
            }
            echo json_encode(true);
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage());
        }
    } else if ($_POST['category'] == 'tag') {
//        $tagId = $_POST['tagId'];
//        require_once('../../../scripts/db.php');
//        $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
//        try {
//            $connection->query("DELETE FROM reviews_tags WHERE id_tag = {$tagId}");
//            echo json_encode(true);
//        } catch (Exception $e) {
//            echo json_encode('Ошибка: ', $e->getMessage());
//        }

        $subcategoryId = $_POST['subcategoryId'];
        $tagId = $_POST['tagId'];
        try {
            $connection = connectDB();
            $connection->query(
                "DELETE FROM reviews_subcategories_tags 
                        WHERE id_subcategory = {$subcategoryId} 
                        AND id_tag = {$tagId}");
            echo json_encode('Успешно');
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage());
        }
    } else if ($_POST['category'] == 'subcat') {
        $catId = $_POST['catId'];
        require_once('../../../scripts/db.php');
        $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
        try {
            $connection->query("DELETE FROM reviews_subcategories WHERE id_subcategory = {$catId}");
            echo json_encode(true);
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage());
        }
    } else if ($_POST['category'] == 'review') {
        $reviewId = $_POST['idReview'];
        $fileName = $_POST['fileName'];
        $connection = connectDb();
        try {
            $connection->query("DELETE FROM reviews WHERE id_review = {$reviewId}");
            if (file_exists($fileName)) {
                unlink($fileName);
            }
            echo json_encode(true);
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage());
        }
    } else if ($_POST['category'] == 'admins') {
        $userId = $_POST['userId'];
        require_once('../../../scripts/db.php');
        $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
        try {
            $connection->query("DELETE FROM reviews_admins WHERE id_admin = {$userId}");
            echo json_encode(true);
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage());
        }
    }
} else if ($_POST['get_tags']) {
    $connection = connectDb();
    $data = $connection->query("SELECT * FROM reviews_tags")->fetchAll();
    echo json_encode($data);
} else if ($_POST['add_tag_in_subcat']) {
    $idTag = $_POST['id_tag'];
    $idSubcategory = $_POST['id_subcategory'];
    $connection = connectDb();
    try {
        $connection->query("INSERT INTO reviews_subcategories_tags (id_tag, id_subcategory) VALUES ({$idTag}, {$idSubcategory})");
        echo json_encode(true);
    } catch (Exception $e) {
        echo json_encode('Error:',  $e->getMessage());
    }
} else if ($_POST['edit']) {
    if ($_POST['category'] == 'subcat') {
        if ($_POST['value'] == 'banner') {
            $subcategoryId = $_POST['subcategoryId'];
            $banner = $_FILES['bannerFile'];
            $return = checkFile($banner, ['png', 'jpg', 'jpeg', 'webp'], 1024 * 1024 * 20);
            if ($return === 'Успешно') {
                try {
                    $bannerName = $banner['name'];
                    $bannerTmpName = $banner['tmp_name'];
                    $bannerExtension = strtolower(end(explode('.', $bannerName)));
                    $newName = $subcategoryId . '.' . $bannerExtension;
                    $connection = connectDb();
                    $query = "UPDATE reviews_subcategories SET banner_file_name = '{$newName}' WHERE id_subcategory = {$subcategoryId}";
                    $connection->query($query);
                    $fileDestination = '../../img/banners/' . $newName;
                    if (file_exists($fileDestination)) {
                        unlink($fileDestination);
                    }
                    move_uploaded_file($bannerTmpName, $fileDestination);
                    echo json_encode($subcategoryId . '.' . $bannerExtension);
                } catch (Exception $e) {
                    echo json_encode('Error:',  $e->getMessage());
                }
            } else {
                echo json_encode($return, JSON_UNESCAPED_UNICODE);
            }
        }
    }
}

switch ($_POST['request']) {
    case 'add_tag':
        $subcategoryId = $_POST['subcategoryId'];
        $tagName = $_POST['tagName'];
        try {
            $connection = connectDB();
//            $connection->query("INSERT INTO reviews_tags_ (tag_name, id_subcategory) VALUES ('{$tagName}', {$subcategoryId})");
            $searchTag = $connection->query("SELECT * FROM reviews_tags WHERE name_tag = '{$tagName}'");
            if (!$searchTag) {
                $connection->query("INSERT INTO reviews_tags (name_tag) VALUES ('{$tagName}')");
            } else if (count($searchTag->fetchAll()) == 0) {
                $connection->query("INSERT INTO reviews_tags (name_tag) VALUES ('{$tagName}')");
            }
            $tag = $connection->query("SELECT * FROM reviews_tags WHERE name_tag = '{$tagName}' LIMIT 1")->fetch();
            $connection->query(
                "INSERT INTO reviews_subcategories_tags (id_tag, id_subcategory) VALUES ('{$tag['id_tag']}', {$subcategoryId})"
            );
            echo json_encode(array('error' => false, 'data' => $tag));
        } catch (Exception $e) {
            echo json_encode(array('error' => $e->getMessage()));
        }
        break;
//    case 'edit_order_categories':
//        $newOrder = explode(',', $_POST['new_order']);
//        $listIdCategories = explode(',', $_POST['list_id_categories']);
//        $connection = connectDB();
//        for ($i = 0; $i < count($newOrder); $i++) {
//            try {
//                $query = "UPDATE reviews_categories SET position_category = {$newOrder[$i]} WHERE id_category = {$listIdCategories[$i]}";
//                $connection->query($query);
//            } catch (Exception $e) {
//                echo json_encode(array('error' => $e->getMessage()));
//                die();
//            }
//        }
//        echo json_encode(array('error' => false, 'message' => 'Порядок категорий изменён.'));
//        break;
    case 'editOrder':
        $itemsId = $_POST['itemsId'];
        $itemsId = explode(',', $itemsId);
        $connection = connectDB();
        for ($i = 0; $i < count($itemsId); $i++) {
            try {
                $n = $i + 1;
                if ($_POST['type'] == 'saveOrderCategories') $query = "UPDATE reviews_categories SET position_category = {$n} WHERE id_category = {$itemsId[$i]}";
                if ($_POST['type'] == 'saveOrderSubcategories') $query = "UPDATE reviews_subcategories SET position_subcategory = {$n} WHERE id_subcategory = {$itemsId[$i]}";
                if ($_POST['type'] == 'saveOrderReviews') $query = "UPDATE reviews SET position_review = {$n} WHERE id_review = {$itemsId[$i]}";
                $connection->query($query);
            } catch (Exception $e) {
                echo json_encode(array('error' => $e->getMessage()));
                die();
            }
        }
        if ($_POST['type'] == 'saveOrderCategories') $message = 'Порядок категорий изменён.';
        if ($_POST['type'] == 'saveOrderSubcategories') $message = 'Порядок подкатегорий изменён.';
        if ($_POST['type'] == 'saveOrderReviews') $message = 'Порядок отзывов изменён.';
        echo json_encode(array('error' => false, 'message' => $message));
        break;
    case 'editFile':
        $itemId = $_POST['itemId'];
        $file = $_FILES['file'];
        if ($_POST['requestData'] == 'editIconCategory') {
            $maxSize = 1024 * 50;
            $massExtension = ['svg', 'png', 'jpg', 'jpeg', 'webp'];
        } else if ($_POST['requestData'] == 'editBannerSubcategory') {
            $maxSize = 1024 * 1024 * 20;
            $massExtension = ['png', 'jpg', 'jpeg', 'webp'];
        }
        echo checkUploadFile($file, $maxSize, $itemId, $_POST['requestData'], $massExtension);
        break;
    case 'editText':
        $idItem = $_POST['idItem'];
        $newText = $_POST['newText'];
        $type = $_POST['type'];
        $query = "";
        if ($type == 'categoryName') {
            $query = "UPDATE reviews_categories SET name_category = '{$newText}' WHERE id_category = {$idItem}";
        } else if ($type == 'subcategoryName') {
            $query = "UPDATE reviews_subcategories SET name_subcategory = '{$newText}' WHERE id_subcategory = {$idItem}";
        } else if ($type == 'subcategoryTitle') {
            $query = "UPDATE reviews_subcategories SET page_banner_title = '{$newText}' WHERE id_subcategory = {$idItem}";
        }
        try {
            connectDB()->query($query);
            echo json_encode(array('error' => false));
        } catch (Exception $e) {
            echo json_encode('Error:',  $e->getMessage());
        }
        break;
}