<?php

if ($_POST) {
    foreach ($_POST as $key => $value) {
        if (gettype($value) == "array") {
            setcookie($key, json_encode($value), time() + 259200);
        } else {
            setcookie($key, $value, time() + 259200);
        }
    }
} elseif ($_COOKIE['submit']) {
    $obj = new ArrayObject($_COOKIE);
    $_POST = $obj->getArrayCopy();
} else {
    header('Location: index.php');
}

require_once "scripts/functions.php";
$title = "index";
require "templates/header.php";
$questions = getQuestionsById();
$answers = getAnswersById();
$parts = getPartsById();

$questions_texts = getQuestionsTextsById();
$answers_texts = getAnswersTextsById();
$texts = getKTextsById();

// echo '<pre>';
// var_dump($_COOKIE);
// echo '</pre>';

?>

<main>
    <div class="container result-page__container">
        <?php
        $k_questions = count($questions);
        $k_answers = count($answers);

        $k_grammar = 0;
        $k_vocab = 0;
        $k_audio = 0;

        $correct_answers = 0;

        $correct_grammar = 0;
        $correct_vocab = 0;
        $correct_audio = 0;

        for ($p = 1; $p < 4; $p++) {

            for ($i = 0; $i < $k_questions; $i++) {
                if ($questions[$i]['part'] == $p) {

                    // подсчет кол-ва вопросов каждой части
                    switch ($p) {
                        case 1:
                            $k_grammar++;
                            break;
                        case 2:
                            $k_vocab++;
                            break;
                        case 3:
                            $k_audio++;
                            break;
                    }

                    for ($j = 0; $j < $k_answers; $j++) {
                        if ($answers[$j]['question'] == $questions[$i]['id_question']) {

                            // переменная строка как name у radiobutton (чтоб узнать выбранную пользователем radiobutton у каждого вопроса)
                            $q = 'question' . strval($i + 1);

                            if ($answers[$j]['correct'] == 1) {
                                // переменная строка, чтобы из к id ответа приписать value, чтоб потом сравнить с выбранным ответом юзера
                                $v = 'value' . strval($answers[$j]['id_answer']);

                                if ($_POST[$q] == $v) {

                                    $correct_answers++;
                                    switch ($p) {
                                        case 1:
                                            $correct_grammar++;
                                            break;
                                        case 2:
                                            $correct_vocab++;
                                            break;
                                        case 3:
                                            $correct_audio++;
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // check reading

        $k_texts = count($texts);
        $k_questions_texts = count($questions_texts);
        $k_answers_texts = count($answers_texts);
        $correct_reading = 0;

        for ($i = 0; $i < $k_texts; $i++) {
            for ($j = 0; $j < $k_questions_texts; $j++) {

                if ($questions_texts[$j]['text'] == $texts[$i]['id_text']) {

                    $q = 'question_text' . strval($j);

                    // если вопрос с radiogroup
                    if ($questions_texts[$j]['type'] == 0) {
                        for ($a = 0; $a < $k_answers_texts; $a++) {

                            if ($answers_texts[$a]['correct'] == 1) {
                                $v = 'value' . strval($answers_texts[$a]['id_answer_text']);
                                if ($_POST[$q] == $v) {
                                    $correct_answers++;
                                    $correct_reading++;
                                }
                            }
                        }
                    }

                    // если вопрос с checkbox
                    if ($questions_texts[$j]['type'] == 1) {

                        // проверка сколько выбрано  checbox'ов в каждом вопросе
                        $k_checked = 0;
                        for ($a = 0; $a < $k_answers_texts; $a++) {
                            if ($answers_texts[$a]['question'] == $questions_texts[$j]['id_question_text']) {
                                $v = 'question_text' . strval($answers_texts[$a]['id_answer_text']);
                                if (isset($_POST[$v])) {
                                    $k_checked++;
                                }
                            }
                        }

                        // проверка правильности если выбрано меньше 2
                        if ($k_checked <= 2) {
                            for ($a = 0; $a < $k_answers_texts; $a++) {
                                if ($answers_texts[$a]['question'] == $questions_texts[$j]['id_question_text']) {
                                    if ($answers_texts[$a]['correct'] == 1) {
                                        $v = 'question_text' . strval($answers_texts[$a]['id_answer_text']);
                                        if (isset($_POST[$v])) {
                                            $correct_answers++;
                                            $correct_reading++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        // results

        $wrong_answers = 16 - $correct_answers;

        // подсчет кол-ва возможных правильных ответов (баллов) в reading
        $k_reading = 0;

        for ($i = 0; $i < $k_answers_texts; $i++) {
            if ($answers_texts[$i]['correct'] == 1) {
                $k_reading++;
            }
        }

        // define level

        if ($correct_answers < 5) {
            $level = 'A1';
        } elseif ($correct_answers >= 5 && $correct_answers <= 8) {
            $level = 'A2';
        } elseif ($correct_answers >= 9 && $correct_answers <= 11) {
            $level = 'B1';
        } elseif ($correct_answers >= 12 && $correct_answers <= 14) {
            $level = 'B2';
        } elseif ($correct_answers > 14) {
            $level = 'C1+';
        }

        ?>

        <div class="page-title result-header">
            <h1>Поздравляем, <nobr>вы прошли</nobr>
            </h1>
        </div>

        <div class="result-content">
            <div class="your-level">
                <h2>Ваш уровень</h2>
                <?php
                echo '<h3>' . $level . '</h3>';
                echo '<div class="your-level__better-than">Лучше ' .
                    setResult($correct_answers) . '% участников</div>';
                echo '<p class="correct-answers">Правильно: ' . $correct_answers . ' из 16</p>';

                echo '<a class="check-answers" href="answers.php">Посмотреть свои ответы</a>';
                ?>
            </div>

            <div class="text-content">
                <?php
                if ($level == 'A1') {
                    echo '<p class="result-text">Поздравляем, твой уровень А1!</p>

                    <div class="text-content__button">
                        <div class="result-btns">
                            <form action="test_short.php" method="POST">
                                <button class="repeat-btn" type="submit" name="startTest" value="1">
                                    <img src="img/repeat.png">
                                    <span>Повторить тест</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <p class="result-text">А это значит, что ты находишься в начале интересного пути - 
                    изучения английского! Тебе предстоит узнать много нового.</p>

                    <p class="result-text">Как известно, язык изучается гораздо легче, 
                    когда тебя окружают люди, говорящие на нем. Более того, обучаясь в США, 
                    ты будешь гулять по знаменитым улицам, общаться с дружелюбными американцами 
                    в кафе, узнавать самые удобные маршруты от прохожих - и это все будет 
                    раскрепощать и мотивировать говорить на английском как можно больше и 
                    как можно лучше! Учителя же очень доступно и интересно смогут преподнести 
                    материал, благодаря чему ты его легко усвоишь.</p>
                    
                    <p class="result-text">Многие наши студенты с таким же уровнем получили 
                    визы и с удовольствием прокачивают свои языковые навыки в жаркой Калифорнии, 
                    сверкающем Нью-Йорке и солнечном Майами. Уже готов к ним присоединиться?</p>';
                } elseif ($level == 'A2') {
                    echo '<p class="result-text">Поздравляем, твой уровень А2!</p>
                    <div class="text-content__button">
                        <div class="result-btns">
                            <form action="test_short.php" method="POST">
                                <button class="repeat-btn" type="submit" name="startTest" value="1">
                                    <img src="img/repeat.png">
                                    <span>Повторить тест</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <p class="result-text">А ты уже многого достиг! 
                    С таким уровнем ты без труда будешь понимать все, о чем говорит 
                    учитель на уроках. Да и за пределами класса будет немало диалогов, 
                    которые уже легко воспринимаются на слух и в которых ты с 
                    удовольствием примешь участие. В этом и есть прелесть погружения 
                    в языковую среду. У тебя уже есть знания, осталось только вопреки 
                    всем языковым барьерам практиковаться. А в США будут все условия, 
                    располагающие к постоянной практике и использованию английского 
                    в повседневной жизни.</p>';
                } elseif ($level == 'B1') {
                    echo '<p class="result-text">Поздравляем, твой уровень В1!</p>
                    <div class="text-content__button">
                        <div class="result-btns">
                            <form action="test_short.php" method="POST">
                                <button class="repeat-btn" type="submit" name="startTest" value="1">
                                    <img src="img/repeat.png">
                                    <span>Повторить тест</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <p class="result-text">Уровень В1 позволит тебе самостоятельно 
                    совершать многие действия в англоязычной стране - начиная от простых покупок, 
                    заканчивая оформлением банковской карты. Да-да, твоих знаний уже достаточно не 
                    только для мимолетных бесед, но и для таких процедур. Более того, каких-то 3 
                    месяца полного погружения в языковую среду смогут дать тебе максимальный 
                    выхлоп - такой результат, какой можно было бы ожидать за год обучения 
                    в родной стране.</p>';
                } elseif ($level == 'B2') {
                    echo '<p class="result-text">Поздравляем, твой уровень В2!</p>
                    <div class="text-content__button">
                        <div class="result-btns">
                            <form action="test_short.php" method="POST">
                                <button class="repeat-btn" type="submit" name="startTest" value="1">
                                    <img src="img/repeat.png">
                                    <span>Повторить тест</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <p class="result-text">У нас для тебя потрясающие новости! 
                    Ты можешь приезжать в Америку и спокойно покупать себе абонемент 
                    в кино, ведь с таким уровнем не составляет труда смотреть 
                    голливудские фильмы в оригинале. А там ещё немного занятий, 
                    лайфхаков от учителей, общения с американцами и не заметишь 
                    как твой английский достигнет С1!</p>';
                } elseif ($level == 'C1+') {
                    echo '<p class="result-text">Поздравляем, твой уровень С1+!</p>
                    <div class="text-content__button">
                        <div class="result-btns">
                            <form action="test_short.php" method="POST">
                                <button class="repeat-btn" type="submit" name="startTest" value="1">
                                    <img src="img/repeat.png">
                                    <span>Повторить тест</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <p class="result-text">Ты уже звезда, но нет ведь предела 
                    совершенству! Тебе сейчас нужно лишь отточить свои умения, 
                    а это можно сделать, познакомившись  со сленгом и наиболее 
                    частыми выражениями американцев в дружеской беседе. Не успеешь 
                    оглянуться, и тебя с твоим английским уже будут принимать за 
                    местного жителя. Вот так легко можно совершенствовать свой 
                    уровень в языковой среде!</p>';
                }
                ?>
            </div>
            <!--<div class="banner-compilation">
                <div class="present-icon">
                    <img src="img/present-icon.svg">
                </div>
                <div class="banner-compilation__text-content">
                    <p class="banner-compilation__text">Кстати, если ты захочешь подтянуть грамматику, мы подготовили для тебя специальную
                        подборку:
                    </p>
                    <a class="banner-compilation__link" href="#">Смотреть</a>
                </div>
            </div>-->
            <div class="important">
                <div class="important-content">
                    <h2>Важно</h2>
                    <p class="result-text">И помни, что этот тест помогает оценить уровень твоего английского лишь приблизительно. Твои результаты здесь и при сдаче других тестов могут различаться.</p>
                    <!--                    <div class="result-btns">-->
                    <!--                        <a href="polina.com" class="text-polina">-->
                    <!--                            <img src="img/polina.png">-->
                    <!--                            <span>Написать Полине</span>-->
                    <!--                        </a>-->
                    <!--                    </div>-->
                </div>
            </div>
            <div class="result-bottom">
                <p class="result-bottom__big-text">
                    Мы помогаем людям со всего мира воплотить свою мечту в жизнь:
                    поступить в языковые школы в США и наконец-то заговорить на английском языке
                </p>
                <p class="result-text result-bottom__text">
                    Мы будем рады помочь и тебе
                </p>
                <div class="result-info result-bottom__info">
                    <p class="result-info__name">Онлайн</p>
                        <div class="result-info__content">
                        <p class="result-info__desctipiton result-text">
                            Курс английского языка в школе Сан-Диего
                        </p>
                        <a class="result-info__link" href="https://usa-ak.com/course">Смотреть ➞ </a>
                    </div>
                </div>
                <div class="result-info result-bottom__info">
                    <p class="result-info__name">Оффлайн</p>
                    <div class="result-info__content">
                        <p class="result-info__desctipiton result-text">
                            Школы в городах: Сан-Диего, Лос-Анджелес,
                            Солт-Лейк-Сити, Орландо, Майами, Чикаго, Нью-Йорк,
                            Даллас, Индианаполис
                        </p>
                        <a class="result-info__link" href="https://usa-ak.com/services">Смотреть ➞ </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php
require "templates/footer.php"
?>