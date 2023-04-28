<?php
include_once("../../scripts/funciton.php");

$connection = connectDB();

$data = $connection->query("SELECT * FROM reviews")->fetchAll();

foreach ($data as $item) {
//    echo $item['id_review'] . ' | ' .
//        $item['name_file'] . ' | ' .
//        $item['type_file'] . ' | ' .
//        $item['id_subcategory'] . ' | ' .
//        $item['height_image'] . '<br>';
//    $fileDestination = '../video/' . $item['id_review'] . '_' . $item['name_file'];
        $fileDestination = '../img/screens/' . $item['id_review'] . '.' . $item['extension_file'];
    echo $fileDestination . '<br>';
    if (file_exists($fileDestination)) {
        echo 'Файл есть<br>';
        $heightImg = getHeightImg($fileDestination);
        $widthImg = getWidthImg($fileDestination);
        $newHeight = round($heightImg / $widthImg * 260);
        echo 'Ширина: ' . $widthImg . ' Высота: ' . $heightImg . ' Новая высота: ' . $newHeight . '<br>';
//        $connection->query(
//            "UPDATE reviews SET height_file = 506 WHERE id_review = {$item['id_review']}"
//        );
    } else {
        echo 'Файла нет<br>';
        $connection->query("DELETE FROM reviews WHERE id_review = {$item['id_review']}");
    }
//    echo $item['height_file'] . '<br>';
//    echo '<img src="' . $fileDestination . '">';

}