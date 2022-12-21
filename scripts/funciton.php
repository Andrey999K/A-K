<?php

function connectDb() {
    require_once('db.php');
    return new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
}

function getHeightImg($path) {
    $size = getimagesize ("$path");
    return $size[1];
}

function getWidthImg($path) {
    $size = getimagesize ("$path");
    return $size[0];
}