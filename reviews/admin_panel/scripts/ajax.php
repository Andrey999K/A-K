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
    global $connection;
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileExtension = strtolower(end(explode('.', $fileName)));
    $newName = $itemId . '.' . $fileExtension;

    $path = '../../img/';
    if ($type == 'editIconCategory') {
        $path .= 'menu/';
    } else {
        $query = '';
        if ($type == 'editBannerSubcategory') {
            $query = "UPDATE reviews_subcategories SET banner_file_name = '{$newName}' WHERE id_subcategory = {$itemId}";
            $path .= 'banners/';
        } else if ($type == 'editReview') {
//            $query = "UPDATE reviews SET name_file = '{$newName}' WHERE id_subcategory = {$itemId}";
            $path .= 'screens/';
        }
        if ($query != '') {
            $connection->query($query);
        }
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
            return json_encode(uploadFile($file, $itemId, $request), JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            return json_encode('Error:',  $e->getMessage(), JSON_UNESCAPED_UNICODE);
        }
    } else {
        return json_encode($return, JSON_UNESCAPED_UNICODE);
    }
}

function deleteBannerSubcategory($idSubcategory) {
    global $connection;
    $bannerFileName = $connection->query("SELECT banner_file_name FROM reviews_subcategories WHERE id_subcategory = {$idSubcategory}");
    $bannerFileName = $bannerFileName->fetch();
    $bannerFileName = $bannerFileName[0];
    deleteFile('../../img/banners/' . $bannerFileName);
}

$connection = connectDB();

// ДОБАВЛЕНИЕ
if ($_POST['insert']) {
    // ДОБАВЛЕНИЕ КАТЕГОРИИ
    if ($_POST['category'] == 'cat') {
        $nameCategory = $_POST['name'];
        $icon = $_FILES['icon'];

        $return = checkFile($icon, ['svg'], 5000);

        if ($return === 'Успешно') {
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
                echo json_encode($response, JSON_UNESCAPED_UNICODE);
                die();
            } catch (Exception $e) {
                echo json_encode('Error:',  $e->getMessage(), JSON_UNESCAPED_UNICODE);
            }
        } else {
            echo json_encode($return, JSON_UNESCAPED_UNICODE);
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
    }
    // ДОБАВЛЕНИЕ ТЕГА
    else if ($_POST['category'] == 'tag') {
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
    }
    // ДОБАВЛЕНИЕ КАРТОЧКИ (ПОДКАТЕГОРИИ)
    else if ($_POST['category'] == 'subcat') {
        $nameSubcat = $_POST['name'];
        $titleSubcat = $_POST['title'];
        $idCat = $_POST['idCat'];
        $banner = $_FILES['banner'];
        $tags = $_POST['tags'];
        if ($tags != '') {
            $tags = explode(',', $tags);
        } else {
            $tags = [];
        }
        $return = checkFile($banner, ['png', 'jpg', 'jpeg', 'webp'], 1024 * 1024 * 20);
        if ($return === 'Успешно') {
            try {
                $bannerName = $banner['name'];
                $bannerTmpName = $banner['tmp_name'];
                $bannerExtension = strtolower(end(explode('.', $bannerName)));
                $data = $connection->query("SELECT position_subcategory FROM reviews_subcategories WHERE id_category = {$idCat} ORDER BY position_subcategory DESC LIMIT 1");
                $position = 1;
                if ($data) {
                    $data = $data->fetch();
                    $position = (int)$data["position_subcategory"] + 1;
                }
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
                if (count($tags) != 0) {
                    foreach ($tags as $tag) {
                        $connection->query("INSERT INTO reviews_tags (name_tag) VALUES ('{$tag}')");
                        $tagData = $connection->query("SELECT * FROM reviews_tags ORDER BY id_tag DESC LIMIT 1")->fetch();
                        $lastIdTag = $tagData['id_tag'];
                        array_push($tagsData, $tagData);
                        $connection->query("INSERT INTO reviews_subcategories_tags (id_tag, id_subcategory) VALUES ({$lastIdTag}, {$lastIdSubcategory})");
                    }
                }
                $response = $connection->query("SELECT * FROM reviews_subcategories ORDER BY id_subcategory DESC LIMIT 1")->fetch();
                $response['tags'] = $tagsData;
                echo json_encode($response, JSON_UNESCAPED_UNICODE);
            } catch (Exception $e) {
                echo json_encode('Error:',  $e->getMessage(), JSON_UNESCAPED_UNICODE);
            }
        } else {
            echo json_encode($return, JSON_UNESCAPED_UNICODE);
        }

    }
    // ДОБАВЛЕНИЕ ОТЗЫВОВ
    else if ($_POST['category'] == 'reviews') {

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
            $allowedExtensionImg = ['jpg', 'jpeg', 'png', 'webp'];
            $allowedExtensionVideo = ['mp4', 'mov'];
            $fullNameFile = $fileName . '.' . $fileExtension;
            $typeReview = 'image';
            if (in_array($fileExtension, ['mp4', 'mov'])) {
                $typeReview = 'video';
            }
            if (in_array($fileExtension, $allowedExtensionImg)) {
                if ($fileSize < 1024 * 1024 * 20) {
                    if ($fileError === 0) {
                        try {
                            $lastPosition = $connection->query("SELECT position_review FROM reviews WHERE id_subcategory = {$idSubcat} ORDER BY position_review DESC LIMIT 1");
                            $position = 1;
                            if ($lastPosition) {
                                $lastPosition = $lastPosition->fetch();
                                $lastPosition = $lastPosition['position_review'];
                                $position = $lastPosition + 1;
                            }
                            $connection->query("INSERT INTO reviews (extension_file, type_file, id_subcategory, position_review)
                                        VALUES ('{$fileExtension}', 'image', {$idSubcat}, {$position})");
                            $lastID = $connection->query("SELECT MAX(id_review) FROM reviews");
                            $lastID = $lastID->fetchAll();
                            $lastID = $lastID[0][0];
                            $newName = $lastID . '.' . $fileExtension;
                            $fileDestination = '../../img/screens/' . $newName;
                            move_uploaded_file($fileTmpName, $fileDestination);
                            $heightImg = getHeightImg($fileDestination);
                            $widthImg = getWidthImg($fileDestination);
                            $newHeight = round($heightImg / $widthImg * 260);
                            $connection->query("UPDATE reviews SET height_file = {$newHeight} WHERE id_review = {$lastID}");
                            array_push($newFiles, array(
                                'reviewId' => $lastID,
                                'fileName' => $newName,
                                'idSubcat' => $idSubcat,
                                'newHeight' => $newHeight,
                                'position' => $position,
                                'typeReview' => $typeReview
                            ));
//                        echo 'Файл <b>' . $fullNameFile . '</b> успешно загружен<br>';
                        } catch (Exception $e) {
                            echo json_encode(array('error' => 'Что-то пошло не так'), JSON_UNESCAPED_UNICODE);
                            die();
                        }
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
                        try {
                            $lastPosition = $connection->query("SELECT position_review FROM reviews WHERE id_subcategory = {$idSubcat} ORDER BY position_review DESC LIMIT 1");
                            $position = 1;
                            if ($lastPosition) {
                                $lastPosition = $lastPosition->fetch();
                                $lastPosition = $lastPosition['position_review'];
                                $position = $lastPosition + 1;
                            }
                            $connection->query("INSERT INTO reviews (extension_file, type_file, id_subcategory, position_review)
                                        VALUES ('{$fileExtension}', 'video', {$idSubcat}, {$position})");
                            $lastID = $connection->query("SELECT MAX(id_review) FROM reviews");
                            $lastID = $lastID->fetchAll();
                            $lastID = $lastID[0][0];
                            $newName = $lastID . '.' . $fileExtension;
                            $fileDestination = '../../video/' . $newName;
                            move_uploaded_file($fileTmpName, $fileDestination);
                            $connection->query("UPDATE reviews SET height_file = 506 WHERE id_review = {$lastID}");
                            array_push($newFiles, array(
                                'reviewId' => $lastID,
                                'fileName' => $newName,
                                'idSubcat' => $idSubcat,
                                'newHeight' => 506,
                                'position' => $position,
                                'typeReview' => $typeReview
                            ));
                        } catch (Exception $e) {
                            echo json_encode(array('error' => 'Что-то пошло не так'), JSON_UNESCAPED_UNICODE);
                            die();
                        }
                    } else {
                        echo json_encode(array('error' => 'Что-то пошло не так'), JSON_UNESCAPED_UNICODE);
                        die();
                    }
                } else {
                    echo json_encode(array('error' => 'Файл превышает 500Мб!'), JSON_UNESCAPED_UNICODE);
                    die();
                }
            } else {
                echo json_encode(array('error' => ('Неверный тип файла ' . $fullNameFile)), JSON_UNESCAPED_UNICODE);
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
    }
    // ДОБАВЛЕНИЕ АДМИНА
    else if ($_POST['category'] == 'admins') {
        $connection = connectDb();
        $login = $_POST['login'];
        $password = $_POST['password'];
        $password = password_hash($password, PASSWORD_BCRYPT);
        try {
            $query = "SELECT login FROM reviews_admins WHERE login = '{$login}' LIMIT 1";
            $data = $connection->query($query)->fetch();
            if ($data) {
                echo json_encode("Error:Пользователь с логином {$login} уже существует.", JSON_UNESCAPED_UNICODE);
            } else {
                $connection->query("INSERT INTO reviews_admins (login, password) VALUES ('{$login}', '{$password}')");
                $data = $connection->query("SELECT id_admin, login FROM reviews_admins ORDER BY id_admin DESC LIMIT 1")->fetch();
                echo json_encode($data, JSON_UNESCAPED_UNICODE);
            }

        } catch (Exception $e) {
            echo json_encode('Error:',  $e->getMessage(), JSON_UNESCAPED_UNICODE);
        }
    }
}
// УДАЛЕНИЕ
else if ($_POST['delete']) {
    // УДАЛЕНИЕ КАТЕГОРИИ
    if ($_POST['category'] == 'cat') {
        $catId = $_POST['catId'];
        try {
            $nameFile = '../../img/menu/';
            $data = $connection->query("SELECT * FROM reviews_categories WHERE id_category = {$catId}")->fetch();
            $nameFile .= $data['id_category'];
            $nameFile .= '.svg';
            $data = $connection->query("SELECT id_subcategory FROM reviews_subcategories WHERE id_category = {$catId}");
            if ($data) {
                $data = $data->fetchAll();
                foreach ($data as $item) {
                    $dataReviews = $connection->query("SELECT id_review, extension_file, type_file FROM reviews WHERE id_subcategory = {$item[0]}");
                    if ($dataReviews) {
                        $dataReviews = $dataReviews->fetchAll();

                        foreach ($dataReviews as $dataReview) {
                            if ($dataReview['type_file'] == 'image') {
                                deleteFile('../../img/screens/' . $dataReview['id_review'] . '.' . $dataReview['extension_file']);
                            } else {
                                deleteFile('../../video/' . $dataReview['id_review'] . '.' . $dataReview['extension_file']);
                            }
                        }
                    }

                    $connection->query("DELETE FROM reviews WHERE id_subcategory = {$item[0]}");
                }
            }
            $idSubcategories = $connection->query("SELECT id_subcategory FROM reviews_subcategories WHERE id_category = {$catId}");
            $idSubcategories = $idSubcategories->fetchAll();
            foreach ($idSubcategories as $idSubcategory) {
                deleteBannerSubcategory($idSubcategory[0]);
            }
            $connection->query("DELETE FROM reviews_subcategories WHERE id_category = {$catId}");
            $connection->query("DELETE FROM reviews_categories WHERE id_category = {$catId}");
            deleteFile($nameFile);
//            if (file_exists($nameFile)) {
//                unlink($nameFile);
//            }
            echo json_encode(true, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage(), JSON_UNESCAPED_UNICODE);
        }
    }
    // УДАЛЕНИЕ ТЕГА
    else if ($_POST['category'] == 'tag') {
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
            $connection->query(
                "DELETE FROM reviews_subcategories_tags 
                        WHERE id_subcategory = {$subcategoryId} 
                        AND id_tag = {$tagId}");
            $connection->query("DELETE FROM reviews_tags WHERE id_tag = {$tagId}");
            echo json_encode('Успешно', JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage(), JSON_UNESCAPED_UNICODE);
        }
    }
    // УДАЛЕНИЕ КАРТОЧКИ (ПОДКАТЕГОРИИ)
    else if ($_POST['category'] == 'subcat') {
        $catId = $_POST['catId'];
        try {
            $data = $connection->query("SELECT id_review, extension_file, type_file FROM reviews WHERE id_subcategory = {$catId}");
            if ($data) {
                $data = $data->fetchAll();
                foreach ($data as $image) {
                    if ($image['type_file'] == 'image') {
                        deleteFile('../../img/screens/' . $image['id_review'] . '.' . $image['extension_file']);
                    } else {
                        deleteFile('../../video/' . $image['id_review'] . '.' . $image['extension_file']);
                    }

                }
            }
            deleteBannerSubcategory($catId);
            $connection->query("DELETE FROM reviews_subcategories WHERE id_subcategory = {$catId}");
            echo json_encode(true, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage(), JSON_UNESCAPED_UNICODE);
        }
    }
    // УДАЛЕНИЕ ОТЗЫВА
    else if ($_POST['category'] == 'review') {
        $reviewId = $_POST['idReview'];
        $fileName = $_POST['fileName'];
        try {
            $typeReview = $connection->query("SELECT type_file FROM reviews WHERE id_review = {$reviewId} LIMIT 1")->fetch()['type_file'];
            $connection->query("DELETE FROM reviews WHERE id_review = {$reviewId}");
            if ($typeReview == 'image') {
                deleteFile('../../img/screens/' . $fileName);
            } else {
                deleteFile('../../video/' . $fileName);
            }
            echo json_encode(true, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage(), JSON_UNESCAPED_UNICODE);
        }
    }
    // УДАЛЕНИЕ АДМИНА
    else if ($_POST['category'] == 'admins') {
        $userId = $_POST['userId'];
        $connection = connectDb();
        try {
            $connection->query("DELETE FROM reviews_admins WHERE id_admin = {$userId}");
            echo json_encode(true, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode('Error:', $e->getMessage(), JSON_UNESCAPED_UNICODE);
        }
    }
} else if ($_POST['get_tags']) {
    $data = $connection->query("SELECT * FROM reviews_tags")->fetchAll();
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
} else if ($_POST['add_tag_in_subcat']) {
    $idTag = $_POST['id_tag'];
    $idSubcategory = $_POST['id_subcategory'];
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
                    $query = "UPDATE reviews_subcategories SET banner_file_name = '{$newName}' WHERE id_subcategory = {$subcategoryId}";
                    $connection->query($query);
                    $fileDestination = '../../img/banners/' . $newName;
                    if (file_exists($fileDestination)) {
                        unlink($fileDestination);
                    }
                    move_uploaded_file($bannerTmpName, $fileDestination);
                    echo json_encode($subcategoryId . '.' . $bannerExtension, JSON_UNESCAPED_UNICODE);
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
//            $connection->query("INSERT INTO reviews_tags_ (tag_name, id_subcategory) VALUES ('{$tagName}', {$subcategoryId})");
//            $searchTag = $connection->query("SELECT * FROM reviews_tags WHERE name_tag = '{$tagName}'");
//            if (!$searchTag) {
//                $connection->query("INSERT INTO reviews_tags (name_tag) VALUES ('{$tagName}')");
//            } else if (count($searchTag->fetchAll()) == 0) {
//                $connection->query("INSERT INTO reviews_tags (name_tag) VALUES ('{$tagName}')");
//            }
            $connection->query("INSERT INTO reviews_tags (name_tag) VALUES ('{$tagName}')");
            $tag = $connection->query("SELECT * FROM reviews_tags ORDER BY id_tag DESC LIMIT 1")->fetch();
            $connection->query(
                "INSERT INTO reviews_subcategories_tags (id_tag, id_subcategory) VALUES ({$tag['id_tag']}, {$subcategoryId})"
            );
            echo json_encode(array('error' => false, 'data' => $tag), JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode(array('error' => $e->getMessage()), JSON_UNESCAPED_UNICODE);
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
        for ($i = 0; $i < count($itemsId); $i++) {
            try {
                $n = $i + 1;
                if ($_POST['type'] == 'saveOrderCategories') $query = "UPDATE reviews_categories SET position_category = {$n} WHERE id_category = {$itemsId[$i]}";
                if ($_POST['type'] == 'saveOrderSubcategories') $query = "UPDATE reviews_subcategories SET position_subcategory = {$n} WHERE id_subcategory = {$itemsId[$i]}";
                if ($_POST['type'] == 'saveOrderReviews') $query = "UPDATE reviews SET position_review = {$n} WHERE id_review = {$itemsId[$i]}";
                $connection->query($query);
            } catch (Exception $e) {
                echo json_encode(array('error' => $e->getMessage()), JSON_UNESCAPED_UNICODE);
                die();
            }
        }
        if ($_POST['type'] == 'saveOrderCategories') $message = 'Порядок категорий изменён.';
        if ($_POST['type'] == 'saveOrderSubcategories') $message = 'Порядок подкатегорий изменён.';
        if ($_POST['type'] == 'saveOrderReviews') $message = 'Порядок отзывов изменён.';
        echo json_encode(array('error' => false, 'message' => $message), JSON_UNESCAPED_UNICODE);
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
            echo json_encode(array('error' => false), JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode('Error:',  $e->getMessage(), JSON_UNESCAPED_UNICODE);
        }
        break;
    case 'paint':
        $reviewId = $_POST['reviewId'];
        $img = $_POST['image'];
        $img = str_replace('data:image/png;base64,', '', $img);
        $img = str_replace(' ', '+', $img);
        $fileData = base64_decode($img);
        $fileName = $reviewId . '.png';
        $pathImage = '../../img/screens/';
        $connection->query("UPDATE reviews SET extension_file = 'png' WHERE id_review = {$reviewId}");
        deleteFile($pathImage . $fileName);
        file_put_contents($pathImage . $fileName, $fileData);
        echo $reviewId;
}