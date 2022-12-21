<?php

if (! $_COOKIE['submit']) {
    header('Location: index.php');
}

require_once "scripts/functions.php";
$title = "Answers";
require "templates/header.php";
$questions = getQuestionsById();
$answers = getAnswersById();
$parts = getPartsById();

$questions_texts = getQuestionsTextsById();
$answers_texts = getAnswersTextsById();
$texts = getKTextsById();

$data = [];

foreach ($_COOKIE as $key => $value) {

    if (preg_match('/^question\\d+$/u', $key) || 
        preg_match('/^question_text\\d+$/u', $key)) {

            if (preg_match('/^question\\d+$/u', $key)) {
                $key = (int) str_replace("question", "", $key);
                $value = (int) str_replace("value", "", $value);
                array_push($data, array('id_question' => $key, 'id_answer' => $value));
            } elseif (preg_match('/^question_text\\d+$/u', $key)) {
                $key = (int) str_replace("question_text", "", $key);
                $valueMass = json_decode($value);
                if (gettype($valueMass) == 'array') {
                    // $value = (int) str_replace("value", "", $value);
                    for ($i=0; $i < count($valueMass); $i++) { 
                        $valueMass[$i] = (int) str_replace("value", "", $valueMass[$i]);
                    }
                    $obj = new ArrayObject($valueMass);
                    $value = $obj->getArrayCopy();
                } else {
                    $value = (int) str_replace("value", "", $value);
                }
                array_push($data, array('id_question_text' => $key, 'id_answer_text' => $value));
            }

        };

}

for ($i = 0; $i < count($data); $i++) {

    // ЗАПОЛНЯЕМ МАССИВ ДАННЫХ ВОПРОСАМИ И ОТВЕТАМИ ИЗ ПЕРВЫХ ТРЁХ ЧАСТЕЙ
    for ($j = 0; $j < count($questions); $j++) {
        if ($data[$i]['id_question'] == $questions[$j]['id_question']) {
            $data[$i]['question'] = $questions[$j]['question'];
            $variantNumber = 1;
            $data[$i]['answers'] = array();
            for ($m = 0; $m < count($answers); $m++) {
                if ($answers[$m]['question'] == $questions[$j]['id_question']) {
                    $data[$i]['answers']['variant_' . $variantNumber] =
                        array(
                            'answer' => $answers[$m]['answer'],
                            'correct' => (int) $answers[$m]['correct']
                        );
                    if ($data[$i]['id_answer'] == $answers[$m]['id_answer']) {
                        $data[$i]['answers']['variant_' . $variantNumber]['selected'] = 1;
                    } else {
                        $data[$i]['answers']
                        ['variant_' . $variantNumber]['selected'] = 0;
                    }
                    $data[$i]['answers']['variant_' . $variantNumber]['id_answer'] =
                        (int) $answers[$m]['id_answer'];
                    $variantNumber++;
                }
            }
        }
    }

    // ЗАПОЛНЯЕМ МАССИВ ДАННЫХ ВОПРОСАМИ И ОТВЕТАМИ ИЗ ПОСЛЕДНЕЙ ЧАСТИ
    for ($j = 0; $j < count($questions_texts); $j++) { 
        if ($data[$i]['id_question_text'] == $questions_texts[$j]['id_question_text']) {
            $data[$i]['question'] = $questions_texts[$j]['question_text'];
            $variantNumber = 1;
            $data[$i]['answers'] = array();
            for ($m = 0; $m < count($answers_texts); $m++) {
                if ($answers_texts[$m]['question'] == $questions_texts[$j]['id_question_text']) {
                    $data[$i]['answers']['variant_' . $variantNumber] =
                        array(
                            'answer' => $answers_texts[$m]['answer_text'],
                            'correct' => (int) $answers_texts[$m]['correct']
                        );
                    if (gettype($data[$i]['id_answer_text']) == 'array') {
                        if (in_array(
                            $answers_texts[$m]['id_answer_text'], 
                            $data[$i]['id_answer_text']
                            )) {
                            $data[$i]['answers']['variant_' . $variantNumber]['selected'] = 1;
                        } else {
                            $data[$i]['answers']
                            ['variant_' . $variantNumber]['selected'] = 0;
                        }
                    } else {
                        if ($answers_texts[$m]['id_answer_text'] == $data[$i]['id_answer_text']) {
                            $data[$i]['answers']['variant_' . $variantNumber]['selected'] = 1;
                        } else {
                            $data[$i]['answers']
                            ['variant_' . $variantNumber]['selected'] = 0;
                        }
                    }
                    $data[$i]['answers']['variant_' . $variantNumber]['id_answer'] =
                        (int) $answers_texts[$m]['id_answer_text'];
                    $variantNumber++;
                }
            }
        }
    }

}

?>

<main>
    <div class="container">
        <div class="test-header">
            <h1>Ответы</h1>
        </div>
        <div id="main-form">
            <?php
            $k_questions = count($questions);
            $k_answers = count($answers);

            $k_grammar = 0;
            $k_vocab = 0;
            $k_audio = 0;

            $massQuestions = [];

            $numberQuestionInArray = 0;

            for ($p = 1; $p < 4; $p++) {

                echo '<div id="part' . $p . '" class="part part' . $p . '">';

                switch ($p) {
                    case 1:
                        echo '<div class="part-btn-wrapper flex page-answer">
									<div class="part-btn part-btn-active" onclick="showGrammar()">
                                        Грамматика
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showVocab()">
                                        Словарный запас
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showAudio()">
                                        Аудирование
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showReading()">
                                        Чтение
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
								</div>';
                        break;
                    case 2:
                        echo '<div class="part-btn-wrapper flex page-answer">
									<div class="part-btn" onclick="showGrammar()">
                                        Грамматика
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn part-btn-active" onclick="showVocab()">
                                        Словарный запас
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showAudio()">
                                        Аудирование
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showReading()">
                                        Чтение
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
								</div>';
                        break;
                    case 3:
                        echo '<div class="part-btn-wrapper flex page-answer">
									<div class="part-btn" onclick="showGrammar()">
                                        Грамматика
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showVocab()">
                                        Словарный запас
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn part-btn-active" onclick="showAudio()">
                                        Аудирование
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
									<div class="part-btn" onclick="showReading()">
                                        Чтение
                                        <div class="countCompleteQuestion">0 из 4</div>
                                    </div>
								</div>';
                        break;
                }

                echo '<div class="questions-wrapper">';

                $n = 1;

                for ($i = 0; $i < 4; $i++) {
                    echo '<div class="question-box">';
                    echo '    <p class="question-number">0' . $n . '</p>';
                    $numberQuestionInArray++;
                    if ($p == 3) {
                        echo '<div class="player test__player">';
                        echo '    <audio class="audio" src="audio/' . $data[($p - 1) * 4 + $i]['question'] . '.mp3"></audio>';
                        echo '    <div class="play"><img src="img/play.svg" alt="btn"></div>';
                        echo '    <div class="progress">';
                        echo '        <div class="progress__complete"></div>';
                        echo '    </div>';
                        echo '    <div class="progress__current-time">0:03</div>';
                        echo '</div>';
                    } else {
                        echo '    <p class="question-text">';
                        echo '        <span>' . $data[($p - 1) * 4 + $i]['question'] . '</span>';
                        echo '    </p>';
                    }
                    $answersQuestion = $data[($p - 1) * 4 + $i]['answers'];
                    $idQuestion = $data[($p - 1) * 4 + $i]['id_question'];
                    for ($j = 0; $j < count($answersQuestion); $j++) {

                        echo '<div class="answer-box';

                        if ($answersQuestion['variant_' . ($j + 1)]['selected'] == 1) {
                            echo ' selected';
                        }

                        if ($answersQuestion['variant_' . ($j + 1)]['correct'] == 1) {
                            echo ' right-answer';
                        } else {
                            echo ' wrong-answer';
                        }

                        echo '">';

                        $idAnswer = $answersQuestion['variant_' . ($j + 1)]['id_answer'];
                       
                        echo '<div class="answer-label">' .
                            $answersQuestion['variant_' . ($j + 1)]['answer'] . '</div>';
                        echo '<span class="checkmark"></span>';
                        echo '</div>';
                    }
                    echo '</div>';
                    $n++;
                }

                echo '<div class="bottom-btn-wrapper flex">
						<a class="submit" href="result_short.php">Вернуться к результату</a>
					</div>';

                echo '</div>';
                echo '</div>';
            }

            echo '<div id="part4" class="part part4">';

            echo '<div class="part-btn-wrapper flex page-answer">
                        <div class="part-btn" onclick="showGrammar()">
                            Грамматика
                            <div class="countCompleteQuestion">0 из 4</div>
                        </div>
                        <div class="part-btn" onclick="showVocab()">
                            Словарный запас
                            <div class="countCompleteQuestion">0 из 4</div>
                        </div>
                        <div class="part-btn" onclick="showAudio()">
                            Аудирование
                            <div class="countCompleteQuestion">0 из 4</div>
                        </div>
                        <div class="part-btn part-btn-active" onclick="showReading()">
                            Чтение
                            <div class="countCompleteQuestion">0 из 4</div>
                        </div>
                    </div>';
            
            echo '<p class="reading-instruction">Прочитайте текст и ответьте на вопросы</p>';

            // ПО ID ВОПРОСА ИЩЕМ ID ТЕКСТА
            for ($i = 0; $i < count($questions_texts); $i++) { 
                if (
                    $questions_texts[$i]['id_question_text'] == 
                    $data[$numberQuestionInArray]['id_question_text']
                    ) {
                    $idText = $questions_texts[$i]['text'];
                }
            }

            // ИЩЕМ ТЕКСТ ПО ЕГО ID
            for ($i = 0; $i < count($texts); $i++) { 
                if ($texts[$i]['id_text'] == $idText) {
                    $textForQuestion = $texts[$i]['text'];
                }
            }

            echo '<p class="text">' . $textForQuestion . '</p>';

            echo '<div class="questions-wrapper">';

            for ($i = 0; $i < 3; $i++) { 
                echo '<div class="question-box">';
                echo '    <p class="question-number">0' . ($i + 1) . '</p>';
                echo '    <p class="question-text">' . 
                $data[$numberQuestionInArray + $i]['question'] . '</p>';
                $answersCurrentQuestion = $data[$numberQuestionInArray + $i]['answers'];
                if (gettype($data[$numberQuestionInArray + $i]['id_answer_text']) == 'array') {
                    $checkmark = ' square';
                } else {
                    $checkmark = '';
                }
                for ($j = 0; $j < count($answersCurrentQuestion); $j++) {
                    echo '<div class="answer-box';
                    
                    // ЕСЛИ БЫЛО ВЫБРАНО, ДОБАВЛЯЕМ КЛАСС SELECTED
                    if ($answersCurrentQuestion['variant_' . ($j + 1)]['selected'] == 1) {
                        echo ' selected';
                    }

                    if ($answersCurrentQuestion['variant_' . ($j + 1)]['correct'] == 1) {
                        echo ' right-answer';
                    } else {
                        echo ' wrong-answer';
                    }

                    echo '">';
                    echo '<div class="answer-label">' . 
                    $answersCurrentQuestion['variant_' . ($j + 1)]['answer'] . '</div>';
                    echo '<span class="checkmark' . $checkmark . '"></span>';
                    echo '</div>';
                }
                echo '</div>';
            }

            echo '<div class="bottom-btn-wrapper flex">
						<a class="submit" href="result_short.php">Вернуться к результату</a>
					</div>';

            echo '</div>';

            echo '</div>';

            echo '</div>';
            ?>
        </div>
    </div>
</main>

<?php
require "templates/footer.php";
?>