<?php
$mysqli = false;
function connectDB()
{
    global $mysqli;
    global $orderby;
    $mysqli = new mysqli("localhost", "u1379484_default", "n7RRO9k0K05ImIx6", "u1379484_testdb");
//     $mysqli = new mysqli("localhost", "root", "", "aktest_db");
    $mysqli->query("SET NAMES 'utf-8'");
}

function closeDB()
{
    global $mysqli;
    $mysqli->close();
}

// questions

function getQuestionsById()
{
    global $mysqli;
    connectDB();
    $result = $mysqli->query("SELECT * FROM `questions` ORDER BY `id_question`");

    closeDB();

    return resultToArray($result);
}

function getQuestionsTextsById()
{
    global $mysqli;
    connectDB();
    $result = $mysqli->query("SELECT * FROM `questions_texts` ORDER BY `id_question_text`");

    closeDB();

    return resultToArray($result);
}

// answers

function getAnswersById()
{
    global $mysqli;
    connectDB();
    $result = $mysqli->query("SELECT * FROM `answers` ORDER BY `id_answer`");

    closeDB();

    return resultToArray($result);
}

function getAnswersTextsById()
{
    global $mysqli;
    connectDB();
    $result = $mysqli->query("SELECT * FROM `answers_texts` ORDER BY `id_answer_text`");

    closeDB();

    return resultToArray($result);
}

// parts

function getPartsById()
{
    global $mysqli;
    connectDB();
    $result = $mysqli->query("SELECT * FROM `parts` ORDER BY `id_part`");

    closeDB();

    return resultToArray($result);
}

// texts

function getKTextsById()
{
    global $mysqli;
    connectDB();
    $result = $mysqli->query("SELECT * FROM `texts` ORDER BY `id_text`");

    closeDB();

    return resultToArray($result);
}

function setResult($result)
{
    global $mysqli;
    connectDB();

    $numberWorse = $mysqli->query(
        "SELECT COUNT(number_of_questions) as count FROM " .
            "test_results WHERE number_of_questions < " . $result
    );
    $numberWorse = resultToArray($numberWorse);
    $numberWorse = $numberWorse[0]['count'];

    $numberAll = $mysqli->query(
        "SELECT COUNT(number_of_questions) as count FROM test_results"
    );
    $numberAll = resultToArray($numberAll);
    $numberAll = $numberAll[0]['count'];

    $mysqli->query(
        "INSERT INTO test_results (number_of_questions) VALUES (" . $result . ");"
    );

    closeDB();
    return round($numberWorse / $numberAll * 100);
}

// others

function resultToArray($result)
{
    $array = array();
    while (($row = $result->fetch_assoc()) != false)
        $array[] = $row;
    return $array;
}

function clearCookie() {
    if ($_COOKIE) {
        foreach($_COOKIE as $key => $value)
            if (preg_match('/^question\\d+$/u', $key) || 
            preg_match('/^question_text\\d+$/u', $key) ||
            $key == 'generated_question') {
                setcookie($key, '', time() - 3600);
            };
        setcookie('submit', '', time() - 3600);
    };
}