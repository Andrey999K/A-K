<?php

if ($_GET['reviewCurrentId']) {
    $idReviewPrev = $_GET['reviewCurrentId'];
    $direction = $_GET['direction'];
    $idSubcategory = $_GET['idSubcategory'];
    if ($idSubcategory == 'false') {
        $idSubcategory = false;
    }
    require_once('../scripts/db.php');
    $connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
    if ($direction == 'right') {
        $query = "SELECT * FROM reviews WHERE" .
            ($idSubcategory ? " id_subcategory = {$idSubcategory} AND" : "") . " id_review > " . $idReviewPrev . " LIMIT 1";
    } else if ($direction == 'left') {
        $query = "SELECT * FROM reviews WHERE" .
            ($idSubcategory ? " id_subcategory = {$idSubcategory} AND" : "") . " id_review < " . $idReviewPrev . "
         ORDER BY id_review DESC LIMIT 1";
    }
    $reviews = $connection->query($query)->fetch();
    if (!$reviews) {
        if ($direction == 'right') {
            $query = "SELECT * FROM reviews" .
                ($idSubcategory ? " WHERE id_subcategory = {$idSubcategory}" : "") . " ORDER BY id_review LIMIT 1";
            $reviews = $connection->query($query)->fetch();
            if ($reviews) {
                echo json_encode($reviews);
            } else {
                echo json_encode(false);
            }
            die();
        } else if ($direction == 'left') {
            $query = "SELECT * FROM reviews" .
                ($idSubcategory ? " WHERE id_subcategory = {$idSubcategory}" : "") . " ORDER BY id_review DESC LIMIT 1";
            $reviews = $connection->query($query);
            if ($reviews) {
                $reviews = $reviews->fetch();
                echo json_encode($reviews);
            } else {
                echo json_encode(false);
            }
            die();
        }
    } else {
        echo json_encode($reviews);
        die();
    }
}

