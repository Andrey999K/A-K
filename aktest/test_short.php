<?php

// ЗАПРЕТ КЭШИРОВАНИЯ СТРАНИЦЫ
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

require_once "scripts/functions.php";

// echo "<pre>";
// var_dump($_POST);
// echo "</pre>";

if ($_POST['startTest']) {
    foreach($_COOKIE as $key => $value) {
        if (preg_match('/^question\\d+$/u', $key) || 
        preg_match('/^question_text\\d+$/u', $key) ||
        $key == 'generated_question') {
            setcookie($key, '', time() - 3600);
        }
    }
    setcookie('submit', '', time() - 3600);
    // echo "<pre>";
    // var_dump($_COOKIE);
    // echo "</pre>";
    header('Location: test_short.php');
}

if ($_COOKIE['submit']) {
    header('Location: result_short.php');
}

$title = "Short test";

$questions = getQuestionsById();
$answers = getAnswersById();
$parts = getPartsById();

$questions_texts = getQuestionsTextsById();
$answers_texts = getAnswersTextsById();
$texts = getKTextsById();

$k_questions = count($questions);
$k_answers = count($answers);

$k_grammar = 0;
$k_vocab = 0;
$k_audio = 0;

$massQuestions = [];

// ПРОВЕРЯЕМ КУКИ
if ($_COOKIE['generated_question']) {
    $massQuestions = json_decode($_COOKIE['generated_question']);
} else {
    // ГЕНЕРИРУЕМ ВОПРОСЫ
    for ($p = 1; $p < 4; $p++) {
        $n = 0;
        while (true) {
            $x = rand(0, $k_questions);
            if ($questions[$x]['part'] == $p && !in_array($x, $massQuestions)) {
                array_push($massQuestions, $x);
                $n++;
                if ($n == 4) {
                    break;
                }
            }
        }
    }
    $x = rand(0, $k_texts);
    array_push($massQuestions, $x);
    setcookie('generated_question', json_encode($massQuestions), time() + 3600);
}

// echo '<pre>';
// var_dump($_COOKIE);
// echo '</pre>';


require "templates/header.php";

?>

<main>
    <div class="container">
        <div class="page-title test-header">
            <h1>Тест</h1>
            <!-- <div class="part-btn-wrapper flex">
				<button class="part-btn" onclick="showGrammar()">Грамматика</button>
				<button class="part-btn" onclick="showVocab()">Словарный запас</button>
				<button class="part-btn" onclick="showAudio()">Аудирование</button>
				<button class="part-btn" onclick="showReading()">Чтение</button>
			</div> -->
        </div>

        <form action="result_short.php" method="post" id="main-form">
            <?php
            
            

            $n = 0;

            for ($p = 1; $p < 4; $p++) {

                echo '<div id="part' . $p . '" class="part part' . $p . '">';

                switch ($p) {
                    case 1:
                        echo '<div class="part-btn-wrapper flex">
									<div class="part-btn part-btn-active" onclick="showGrammar()">
                                        Грамматика
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showVocab()">
                                        Словарный запас
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showAudio()">
                                        Аудирование
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showReading()">
                                        Чтение
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
								</div>';
                        break;
                    case 2:
                        echo '<div class="part-btn-wrapper flex">
									<div class="part-btn" onclick="showGrammar()">
                                        Грамматика
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn part-btn-active" onclick="showVocab()">
                                        Словарный запас
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showAudio()">
                                        Аудирование
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showReading()">
                                        Чтение
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
								</div>';
                        break;
                    case 3:
                        echo '<div class="part-btn-wrapper flex">
									<div class="part-btn" onclick="showGrammar()">
                                        Грамматика
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showVocab()">
                                        Словарный запас
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn part-btn-active" onclick="showAudio()">
                                        Аудирование
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showReading()">
                                        Чтение
                                        <div class="part-progress-bar">
                                            <div class="part-progress-bar__complete"></div>
                                        </div>
                                        <div class="test__praise praise hidden"></div>
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
								</div>';
                        break;
                }

                echo '<div class="questions-wrapper">';

                // $n = 0;

                for ($i = 0; $i < 4; $i++) { 
                    $x = $massQuestions[$n++];
                    echo '<div class="question-box"><p class="question-number">0' . ($i + 1) . '</p>';
                    if ($p == 3) {
                        echo '<div class="player test__player">';
                        echo '    <audio class="audio" src="audio/' . $questions[$x]['question'] . '.mp3"></audio>';
                        echo '    <div class="play"><img src="../img/play.svg" alt="btn"></div>';
                        echo '    <div class="progress">';
                        echo '        <div class="progress__complete"></div>';
                        echo '    </div>';
                        echo '    <div class="progress__current-time">0:03</div>';
                        echo '</div>';
                    } else {
                        echo '<p class="question-text"><span>' . $questions[$x]['question'] . '</span></p>';
                    }
                    for ($j = 0; $j < $k_answers; $j++) {
                        if ($answers[$j]['question'] == $questions[$x]['id_question']) {
                            echo '<div class="answer-box">';
                            echo '    <input type="radio" name="question' . ($x + 1) . '" value="value' . $answers[$j]['id_answer'] . '" id="id' . $answers[$j]['id_answer'] . '"/>';
                            echo '    <label for="id' . $answers[$j]['id_answer'] . '" class="answer-label">' . $answers[$j]['answer'] . '</label>';
                            echo '    <span class="checkmark"></span>';
                            echo '</div>';
                        }
                    }

                    echo '    <input style="display: none" type="radio" name="question' . ($x + 1) . '" value="False" checked/>';
                    echo '</div>';
                }
                // while (true) {
                //     $x = rand(0, $k_questions);

                //     if ($questions[$x]['part'] == $p && !in_array($x, $massQuestions)) {

                //         array_push($massQuestions, $x);
                //         $n++;
                //         echo '<div class="question-box"><p class="question-number">0' . $n . '</p>';

                //         if ($p == 3) {
                //             echo '<div class="player">';
                //             echo '    <audio class="audio" src="audio/' . $questions[$x]['question'] . '.mp3"></audio>';
                //             echo '    <div class="play"><img src="img/play.svg" alt="btn"></div>';
                //             echo '    <div class="progress">';
                //             echo '        <div class="progress__complete"></div>';
                //             echo '    </div>';
                //             echo '    <div class="progress__current-time">0:03</div>';
                //             echo '</div>';
                //             // echo '<audio>';
                //             // echo '<source src="audio/' . $questions[$x]['question'] . '.mp3" type="audio/mpeg">';
                //             // echo 'Your browser does not support the audio element.';
                //             // echo '</audio>';
                //             // echo '</p>';
                //         } else {
                //             echo '<p class="question-text"><span>' . $questions[$x]['question'] . '</span></p>';
                //         }

                //         for ($j = 0; $j < $k_answers; $j++) {
                //             if ($answers[$j]['question'] == $questions[$x]['id_question']) {
                //                 echo '<div class="answer-box">';
                //                 // echo $answers[$j]['answer'];
                //                 echo '<input type="radio" name="question' . ($x + 1) . '" value="value' . $answers[$j]['id_answer'] . '" id="id' . $answers[$j]['id_answer'] . '"/>';
                //                 echo '<label for="id' . $answers[$j]['id_answer'] . '" class="answer-label">' . $answers[$j]['answer'] . '</label>';
                //                 echo '<span class="checkmark"></span>';
                //                 echo '</div>';
                //             }
                //         }

                //         echo '<input style="display: none" type="radio" name="question' . ($x + 1) . '" value="False" checked/>';

                //         // if ($n == 4) {
                //         //     break;
                //         // }
                //         echo '</div>';
                //     }
                // }

                echo '</div>';

                switch ($p) {
                    case 1:
                        echo '<div class="bottom-btn-wrapper flex">
									<div class="bottom-main-btn" onclick="showVocab()">Далее</div>
								</div>';
                        break;
                    case 2:
                        echo '<div class="bottom-btn-wrapper flex">
						    		<div class="bottom-back-btn" onclick="showGrammar()">Назад</div>
									<div class="bottom-main-btn" onclick="showAudio()">Далее</div>
								</div>';
                        break;
                    case 3:
                        echo '<div class="bottom-btn-wrapper flex">
						    		<div class="bottom-back-btn" onclick="showVocab()">Назад</div>
									<div class="bottom-main-btn" onclick="showReading()">Далее</div>
								</div>';
                        break;
                }

                // echo '</div>';
                echo '</div>';
            }

            //reading part
            $k_texts = count($texts);
            $k_questions_texts = count($questions_texts);
            $k_answers_texts = count($answers_texts);

            echo '<div id="part4" class="part part4">';
            echo '<div class="part-btn-wrapper flex">
						<div class="part-btn" onclick="showGrammar()">
                            Грамматика
                            <div class="part-progress-bar">
                                <div class="part-progress-bar__complete"></div>
                            </div>
                            <div class="test__praise praise hidden"></div>
                            <div class="countCompleteQuestion">0 из 4</div>
                        </div>
						<div class="part-btn" onclick="showVocab()">
                            Словарный запас
                            <div class="part-progress-bar">
                                <div class="part-progress-bar__complete"></div>
                            </div>
                            <div class="test__praise praise hidden"></div>
                            <div class="countCompleteQuestion">0 из 4</div>
                        </div>
						<div class="part-btn" onclick="showAudio()">
                            Аудирование
                            <div class="part-progress-bar">
                                <div class="part-progress-bar__complete"></div>
                            </div>
                            <div class="test__praise praise hidden"></div>
                            <div class="countCompleteQuestion">0 из 4</div>
                        </div>
						<div class="part-btn part-btn-active" onclick="showReading()">
                            Чтение
                            <div class="part-progress-bar">
                                <div class="part-progress-bar__complete"></div>
                            </div>
                            <div class="test__praise praise hidden"></div>
                            <div class="countCompleteQuestion">0 из 4</div>
                        </div>
					</div>';

            echo '<p class="reading-instruction">Прочитайте текст и ответьте на вопросы</p>';

            // $n = 0;
            // $x = rand(0, $k_texts - 1);
            $x = $massQuestions[12];
            echo '<p class="text">' . $texts[$x]['text'] . '</p>';
            $idText = $texts[$x]['id_text'];
            echo '<div class="questions-wrapper">';
            $n = 1;
            for ($i=0; $i < $k_questions_texts; $i++) {
                if ($questions_texts[$i]['text'] == $idText) {
                    echo '<div class="question-box">';
                    echo '    <p class="question-number">0' . $n++ . '</p>';
                    echo '    <p class="question-text">';
                    echo '        <span>' . $questions_texts[$i]['question_text'] . '</span>';
                    echo '    </p>';

                    if ($questions_texts[$i]['value'] == 1) {
                        $typeInput = 'radio';
                        $checkmark = '';
                        $checkbox = '';
                    } else {
                        $typeInput = 'checkbox';
                        $checkmark = 'square';
                        $checkbox = '[]';
                    }
                    $idQuestion = $questions_texts[$i]['id_question_text'];
                    for ($j=0; $j < $k_answers_texts; $j++) {
                        if ($answers_texts[$j]['question'] == $idQuestion) {
                            echo '    <div class="answer-box">';
                            echo '        <input type="' . $typeInput . '" name="question_text' . 
                                              $questions_texts[$i]['id_question_text'] . $checkbox .
                                              '" value="value' . $answers_texts[$j]['id_answer_text'] . 
                                          '" id="id' . $answers_texts[$j]['id_answer_text'] . 
                                          '"/>';
                            echo '        <label for="id' . $answers_texts[$j]['id_answer_text'] . 
                                              '" class="answer-label">' . $answers_texts[$j]['answer_text'] . 
                                          '</label>';
                            echo '        <span class="checkmark ' . $checkmark . '"></span>';
                            echo '    </div>';
                        }
                    }

                    echo '</div>';
                }
            }
            echo '</div>';

            echo '<div class="bottom-btn-wrapper flex">
						<div class="bottom-back-btn" onclick="showAudio()">Назад</div>
						<input type="submit" name="submit" value="Узнать результат" class="submit">
					</div>';
            echo '</div>';
            ?>
        </form>
    </div>
</main>

<?php
require "templates/footer.php";
?>