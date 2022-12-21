<?php
require_once "scripts/functions.php";

// ОЧИСТКА КУКИ
// if ($_COOKIE) {
//     foreach($_COOKIE as $key => $value)
//         if (preg_match('/^question\\d+$/u', $key) || 
//         preg_match('/^question_text\\d+$/u', $key) ||
//         $key == 'generated_question') {
//             setcookie($key, '', time() - 3600);
//         };
//     setcookie('submit', '', time() - 3600);
// };

$title = "Full test";
require "templates/header.php";
?>

<main>
    <div class="index-container flex">
        <div class="man"></div>
        <div class="main-header">
            <h2>A&K</h2>
            <h1>Проверьте <span class="yellow-h1">свой уровень</span> английского</h1>
            <p>Вас ожидает 15 вопросов, после которых вы узнаете свой уровень и получите полезные рекомендации</p>
            <div class="btn-wrapper">
                <a href="test_short.php" class="choose-test">Начать тест</a>
                <p>Примерно 10 минут</p>
            </div>
        </div>
        <div class="test"></div>
    </div>

</main>

<?php
require "templates/footer.php";
?>