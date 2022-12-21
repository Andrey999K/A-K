<!--<style type="text/css">-->
<!--    * {-->
<!--        font-family: sans-serif;-->
<!--    }-->
<!--</style>-->
<!---->
<?php
//
//require_once('../scripts/db.php');
//$connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
//
//if (isset($_POST['submit'])) {
//    $files = $_FILES['files'];
////    echo "<pre>";
////    var_dump($files);
////    echo "</pre>";
//    for ($i = 0; $i < count($files['name']); $i++) {
////        echo $files['name'][$i] . "<br>";
//
//        $fileName = $files['name'][$i];
//
//        $fileTmpName = $files['tmp_name'][$i];
//        $fileType = $files['type'][$i];
//        $fileError = $files['error'][$i];
//        $fileSize = $files['size'][$i];
//        $fileExtension = strtolower(end(explode('.', $fileName)));
//        $fileName = explode('.', $fileName)[0];
////        $fileName = preg_replace('/[0-9]/', '', $fileName);
//        $allowedExtension= ['jpg', 'jpeg', 'png'];
//        $fullNameFile = $fileName . '.' . $fileExtension;
//
//        if (in_array($fileExtension, $allowedExtension)) {
//            if ($fileSize < 5000000) {
//                if ($fileError === 0) {
//                    $connection->query("INSERT INTO `reviews` (`name_file`, `type_file`)
//                                        VALUES ('$fullNameFile', 'image')");
//                    $lastID = $connection->query("SELECT MAX(id_review) FROM `reviews`");
//                    $lastID = $lastID->fetchAll();
//                    $lastID = $lastID[0][0];
//                    $fileNameNew = $lastID . '_' . $fullNameFile;
//                    $fileDestination = '../reviews/img/screens/' . $fileNameNew;
//                    move_uploaded_file($fileTmpName, $fileDestination);
//                    echo 'Файл <b>' . $fullNameFile . '</b> успешно загружен<br>';
//                } else {
//                    echo 'Что-то пошло не так';
//                }
//            } else {
//                echo 'Слишком большой размер файла';
//            }
//        } else {
//            echo 'Неверный тип файла <b>' . $fullNameFile . '</b><br>';
//        }
//    }
////    foreach ($_FILES as $files) {
////        $fileName = $file['file']['name'];
////
////        $fileTmpName = $file['file']['tmp_name'];
////        $fileType = $file['file']['type'];
////        $fileError = $file['file']['error'];
////        $fileSize = $file['file']['size'];
////        $fileExtension = strtolower(end(explode('.', $fileName)));
////        $fileName = explode('.', $fileName)[0];
////        $allowedExtension= ['jpg', 'jpeg', 'png'];
////
////        if (in_array($fileExtension, $allowedExtension)) {
////
////        } else {
////            echo 'Неверный тип файла ' . $fileName;
////        }
////    }
//
//
//
//}
//
//?>
<!---->
<!--<form method="POST" enctype="multipart/form-data">-->
<!--    <input multiple type="file" name="files[]" required>-->
<!--    <button name="submit">Отправить</button>-->
<!--</form>-->
