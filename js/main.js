var partNumber = 0;

function showGrammar() {
    partNumber = 0;
    document.getElementById("part1").style.display = "block";
    document.getElementById("part2").style.display = "none";
    document.getElementById("part3").style.display = "none";
    document.getElementById("part4").style.display = "none";
    console.log('showGrammar()');
    window.scrollTo(0, 0);
}

function showVocab() {
    partNumber = 1;
    document.getElementById("part1").style.display = "none";
    document.getElementById("part2").style.display = "block";
    document.getElementById("part3").style.display = "none";
    document.getElementById("part4").style.display = "none";
    console.log('showVocab()');
    window.scrollTo(0, 0);
}

function showAudio() {
    partNumber = 2;
    document.getElementById("part1").style.display = "none";
    document.getElementById("part2").style.display = "none";
    document.getElementById("part3").style.display = "block";
    document.getElementById("part4").style.display = "none";
    console.log('showAudio()');
    window.scrollTo(0, 0);
}

function showReading() {
    partNumber = 3;
    document.getElementById("part1").style.display = "none";
    document.getElementById("part2").style.display = "none";
    document.getElementById("part3").style.display = "none";
    document.getElementById("part4").style.display = "block";
    console.log('showReading()');
    window.scrollTo(0, 0);
}


const praises = ['Сильно', 'Ого!', 'Быстро']


function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


const buttons = document.querySelectorAll('.answer-box');
const parts = document.querySelectorAll('.part1, .part2, .part3, .part4');
const inputs = document.querySelectorAll('.answer-box input');


function selectedAnswerBoxes() {
    inputs.forEach(item => {
        if (item.checked) {
            item.closest('.answer-box').classList.add('selected');
        } else {
            item.closest('.answer-box').classList.remove('selected');
        }
    });
}


// ПОДСЧЁТ КОЛИЧЕСТВА ВОПРОСОВ В КАЖДОМ РАЗДЕЛЕ
let countQuestions = [];
parts.forEach(item => {
    countQuestions.push(item.querySelectorAll('.question-box').length)
});


// ПОДГОТОВКА НАДПИСЕЙ "Ого!" И ДРУГИХ
let randomNumbersPrises = []
for (let i = 0; i < parts.length; i++) {
    randomNumbersPrises.push(getRandomArbitrary(0, praises.length))
}

// ВСТАВКА НАДПИСЕЙ "Ого!" И ДРУГИХ
// ВСТАВКА НАДПИСЕЙ "0 из 4"
parts.forEach(item => {
    let praisesElements = item.querySelectorAll('.praise');
    let countQuestionElem = item.querySelectorAll('.countCompleteQuestion');
    for (let i = 0; i < praisesElements.length; i++) {
        praisesElements[i].textContent = praises[randomNumbersPrises[i]];
        countQuestionElem[i].textContent = `0 из ${countQuestions[i]}`
    }
});


// ФУНКЦИЯ ПОДСЧЁТА КОЛИЧЕСТВА ВОПРОСОВ В КАЖДОЙ ЧАСТИ
function countQuestion() {
    let countQuestion = [];
    parts.forEach(item => {
        countQuestion.push(item.querySelectorAll('.question-box').length);
    });
    return countQuestion;
}


// ФУНКЦИЯ ПОДСЧЁТА КОЛИЧЕСТВА ВЫБРАННЫХ ВОПРОСОВ В КАЖДОЙ ЧАСТИ
function countSelectQuestion() {
    let selectQuestion = [];
    parts.forEach(item => {
        selectQuestion.push(0);
        let questions = item.querySelectorAll('.question-box');
        for (let i = 0; i < questions.length; i++) {
            let inputs = questions[i].querySelectorAll('input');
            for (let j = 0; j < inputs.length; j++) {
                if (inputs[j].checked && inputs[j].id != '') {
                    selectQuestion[selectQuestion.length - 1]++;
                    break;
                }
            }
        }
    });
    return selectQuestion;
}


// ФУНКЦИЯ ИЗМЕНЕНИЯ ЗНАЧЕНИЯ ПОЛОСЫ ПРОГРЕССА
function completeProgressbar(progressbar, percent) {
    progressbar.style.width = percent + '%';
}


// ПОЛУЧЕНИЕ ПОЛОСЫ ПРОГРЕССА
function getProgressbar(number) {
    let progressBars = [];
    parts.forEach(item => {
        progressBars.push(item.querySelectorAll('.part-btn .part-progress-bar__complete')[number]);
    });
    return progressBars;
}


// ПОЛУЧЕНИЕ СЧЁТЧИКА ВЫБРАННЫХ ОТВЕТОВ
function getCounterQuestion(number) {
    let countersQuestion = [];
    parts.forEach(item => {
        countersQuestion.push(item.querySelectorAll('.countCompleteQuestion')[number]);
    });
    return countersQuestion;
}


// ВСТАВКА ПРОПУЩЕННОГО СЛОВА В ПРЕДЛОЖЕНИЕ
function insertWordInSentence(sentence, word, typeWord) {
    let regexp = /_+/;
    if (!sentence.match(/_+/)) {
        regexp = /<span class="insertedWord">[a-zA-Z\s]*<\/span>/;
    }
    // sentense.replace(/<span class="insertedWord">make<\/span>/, '<span>aaa</span>');
    switch (typeWord) {
        case 'right':
            return sentence.replace(regexp, `<span class="insertedWord rightWord">${word}</span>`);
        case 'wrong':
            return sentence.replace(regexp, `<span class="insertedWord wrongWord">${word}</span>`);
        default:
            return sentence.replace(regexp, `<span class="insertedWord">${word}</span>`);
    }
    
}


// ВСТАВКА ВЫБРАННЫХ СЛОВ В ПРЕДЛОЖЕНИЯ
// function insertWordsSentence(partNumber, questionNumber) {
//     const part = parts[partNumber - 1];
//     const question = part.querySelectorAll('.question-box')[questionNumber - 1];
//     const inputs = question.querySelectorAll('input');
//     let questionText = question.querySelector('.question-text span');
//     let sentenceText = questionText.textContent;
//     for (let i = 0; i < inputs.length - 1; i++) {

//         if (inputs[i].checked) {

//             const word = inputs[i].labels[0].textContent;
//             if (sentenceText.match(/_+/)) {
//                 questionText.innerHTML = insertWordInSentence(sentenceText, word);
//             }
//             break;
//         }
//     }
// }


function insertWordsSentence(partNumber, questionNumber) {
    const part = parts[partNumber - 1];
    const question = part.querySelectorAll('.question-box')[questionNumber - 1];
    const inputs = question.querySelectorAll('.answer-box');
    let questionText = question.querySelector('.question-text span');
    let sentenceText = questionText.innerHTML;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains('right-answer')) {
            const word = inputs[i].textContent;
            questionText.innerHTML = insertWordInSentence(sentenceText, word, 'right');
            return true;
        } else if (inputs[i].classList.contains('selected')) {
            const word = inputs[i].textContent;
            questionText.innerHTML = insertWordInSentence(sentenceText, word);
        }
        // if (inputs[i].classList.contains('selected')) {
        //     const word = inputs[i].textContent;
        //     if (sentenceText.match(/_+/)) {
        //         if (inputs[i].classList.contains('wrong-answer')) {
        //             questionText.innerHTML = insertWordInSentence(sentenceText, word, 'wrong');
        //         } else if (inputs[i].classList.contains('right-answer')) {
        //             questionText.innerHTML = insertWordInSentence(sentenceText, word, 'right');
        //         } else {
        //             questionText.innerHTML = insertWordInSentence(sentenceText, word);
        //         }
        //     }
        //     return true;
        // } 
        // else if (inputs[i].classList.contains('right-answer')) {
        //     const word = inputs[i].textContent;
        //     if (sentenceText.match(/_+/)) {
        //         questionText.innerHTML = insertWordInSentence(sentenceText, word);
        //     }
        // }
    }
}


// ПОДСЧЁТ ВЫПОЛНЕННЫХ ВОПРОСОВ И ИЗМЕНЕНИЕ ПРОГРЕССБАРА
function editDataQuestions() {
    for (let i = 0; i < parts.length; i++) {
        let countSelectQuestions = countSelectQuestion()[i];
        let countQuestions = countQuestion()[i];
        let progressPercent = countSelectQuestions / countQuestions * 100;
        console.log(progressPercent);
        let progressBar = getProgressbar(i);
        let counterQuestion = getCounterQuestion(i);
        for (let j = 0; j < progressBar.length; j++) {
            completeProgressbar(progressBar[j], progressPercent);
            counterQuestion[j].textContent = `${countSelectQuestions} из ${countQuestions}`
        }
        if (i < parts.length - 2) {
            for (let j = 1; j <= countQuestions; j++) {
                insertWordsSentence(i + 1, j);
            }
        }
    }
}


// ОЧИСТКА LOCALSTORAGE ОТ ВЫБРАННЫХ ВАРИАНТОВ ОТВЕТОВ
function localStorageClear() {
    for (key in localStorage) {
        if (key.startsWith('id')) {
            localStorage.removeItem(key);
        }
    }
}


// СОХРАНЯЕМ ВЫБРАННЫЕ ВАРИАНТЫ ОТВЕТА
function saveCheckInputs() {
    localStorageClear();
    buttons.forEach(item => {
        let input = item.querySelector('input');
        if (input.checked) {
            localStorage.setItem(input.id, 'true');
        }
    });
}


// AUDIO PLAYERS
const players = document.querySelectorAll('.player'),
    playButtons = document.querySelectorAll('.play');
audios = document.querySelectorAll('.audio');


// PLAY
function playSong(player, audio) {
    player.classList.add('playing');
    audio.play();
}


// PAUSE
function pauseSong(player, audio) {
    player.classList.remove('playing');
    audio.pause();
}


// ОСТАНОВИТЬ ВСЕ АУДИОДОРОЖКИ
function pauseAllSong() {
    for (player of players) {
        const audio = player.querySelector('audio'),
        icon = player.querySelector('.play img')
        icon.src = icon.src.replace('stop', 'play')
        pauseSong(player, audio)
    }
}


//ФУНКЦИЯ ФОРМАТИРОВАНИЯ ВРЕМЕНИ. НАПРИМЕР: 3.546 -> 0:03
function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return `${minutes}:${seconds}`;
}


// ФУНКЦИЯ ПОЛУЧЕНИЯ URL ТЕКУЩЕЙ СТРАНИЦЫ
function currentURL() {
    return document.URL.split('/')[document.URL.split('/').length - 1];
}


// ФУНКЦИЯ ПОЛУЧЕНИЯ ИМЕНИ ФАЙЛА ИЗ ПУТИ
function getNameFile(pathToFile) {
    pathToFile = pathToFile.split('/');
    return pathToFile[pathToFile.length - 1];
}


// ФУНКЦИЯ ПОЛУЧЕНИЯ ПУТИ БЕЗ ИМЕНИ ФАЙЛА
function getPathFile(pathToFile) {
    pathToFile = pathToFile.split('/');
    pathToFile.pop()
    return pathToFile.join('/') + '/';
}


function toggleIconPlaySrc(src) {
    let nameFile = getNameFile(src);
    if (nameFile == 'play.svg') {
        src = getPathFile(src) + 'stop.svg'
    } else {
        src = getPathFile(src) + 'play.svg'
    }
    return src;
}


function toggleIconPlay(player) {
    let src = player.querySelector('.play img').src;
    src = toggleIconPlaySrc(src);
    player.querySelector('.play img').src = src;
}


// КНОПКИ ЗАПУСКА И ОСТАНОВКИ АУДИОДОРОЖКИ
playButtons.forEach(item => {
    item.addEventListener('click', () => {
        let player = item.parentNode;
        const isPlaying = player.classList.contains('playing');
        let audio = player.querySelector('audio');
        pauseAllSong();
        if (isPlaying) {
            pauseSong(player, audio);
        } else {
            toggleIconPlay(item);
            playSong(player, audio);
        }
    })
})


// СОБЫТИЯ АУДИОДОРОЖЕК
audios.forEach(item => {

    let player = item.parentNode;
    let progressComplete = player.querySelector('.progress__complete');

    // СОБЫТИЕ ЗАГРУЗКИ АУДИО
    item.addEventListener('loadedmetadata', () => {
        let durationAudio = item.duration;
        player.querySelector('.progress__current-time').textContent = formatTime(durationAudio);
    });

    // СОБЫТИЕ ЗАВЕРШЕНИЯ АУДИО
    item.addEventListener('ended', () => {
        toggleIconPlay(player);
        pauseSong(player, item);
    })

    // ПРОКРУТКА ПОЛОСЫ ПРОГРЕССА АУДИО ПРИ ВКЛЮЧЁННОЙ АУДИОДОРОЖКЕ
    item.addEventListener('timeupdate', () => {
        const {
            duration,
            currentTime
        } = event.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressComplete.style.width = `${progressPercent}%`;
    })
})


// УПРАВЛЕНИЕ ПОЛОСОЙ ПРОГРЕССА АУДИОДОРОЖКИ
const progressBars = document.querySelectorAll('.progress');

progressBars.forEach(item => {
    let player = item.parentNode;
    let audio = player.querySelector('.audio');
    item.addEventListener('click', () => {
        const width = event.target.clientWidth;
        const clickX = event.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });
})


// ДЛЯ СТРАНИЦЫ ANSWERS
if (document.title == 'Answers | A&K Test') {
    let numberRightAnswers = [];
    let numberAllAnswers = [];
    // ПОДСЧИТЫВАЕМ ПРАВИЛЬНЫЕ ВАРИАНТЫ И ВСЕГО
    parts.forEach(item => {
        numberRightAnswers.push(item.querySelectorAll('.selected.right-answer').length);
        numberAllAnswers.push(item.querySelectorAll('.right-answer').length);
    });
    for (let i = 0; i < parts.length; i++) {
        let countCompleteQuestion = parts[i].querySelectorAll('.countCompleteQuestion');
        for (let j = 0; j < countCompleteQuestion.length; j++) {
            countCompleteQuestion[j].textContent = numberRightAnswers[j] + ' из ' + numberAllAnswers[j];
        }
        // ВСТАВЛЯЕМ СЛОВА В ПРЕДЛОЖЕНИЯ
        if (i < parts.length - 2) {
            let questions = parts[i].querySelectorAll('.question-box');
            for (let j = 0; j < questions.length; j++) {
                insertWordsSentence(i + 1, j + 1);
            }
        }
    }
}


// СОХРАНЯЕМ ПРОГРЕСС ТЕСТА
if (currentURL() == 'test_short.php') {     
    const form = document.getElementById('main-form');
    // ОЧИЩАЕМ ЛОКАЛЬНОЕ ХРАНИЛИЩЕ ПОСЛЕ ОТПРАВКИ РЕЗУЛЬТАТОВ ТЕСТА
    form.addEventListener('submit', () => {
        localStorageClear();
    });
    if (localStorage.length != 0) {
        for (let key in localStorage) {
            if(key.startsWith('id')){
                let input = document.getElementById(key);
                input.checked = true;
                input.closest('.answer-box').classList.add('selected');
            }
        }
        editDataQuestions();
    }

    // ЗАПОЛНЕНИЕ ПРОГРЕСС БАРА, ПОКАЗ НАДПИСЕЙ И ПОДСЧЁТ ОТВЕТОВ
    buttons.forEach(item => {
        item.addEventListener("click", () => {
            saveCheckInputs();
            selectedAnswerBoxes();
            let questions = parts[partNumber].querySelectorAll('.question-box')
            let countQuestions = questions.length;
            let completeQuestions = 0;
            questions.forEach(elem => {
                let inputs = elem.querySelectorAll('.answer-box input')
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i].checked) {
                        completeQuestions += 1;
                        break;
                    }
                }
            });
            let completePercent = completeQuestions / countQuestions * 100;
            parts.forEach(part => {
                let progressbar = part.querySelectorAll('.part-btn .part-progress-bar__complete')[partNumber];
                completeProgressbar(progressbar, completePercent);
                let partButton = part.querySelectorAll('.part-btn')[partNumber]
                partButton.querySelector('.countCompleteQuestion').textContent =
                    `${completeQuestions} из ${countQuestions}`;

                if (completePercent === 100) {
                    partButton.style.color = "#ffd241";
                    let praiseElem = partButton.querySelector('.praise');
                    praiseElem.classList.remove('hidden');

                    setTimeout(function () {
                        praiseElem.classList.add('hidden');
                    }, 3000)
                }

            })
            let sentenceText = item.closest('.question-box').querySelector('span').textContent;
            if (sentenceText.match(/_+/)) {
                item.closest('.question-box').querySelector('span').innerHTML = insertWordInSentence(sentenceText, item.textContent);;
            } else {
                let sentenceText = item.closest('.question-box').querySelector('span');

                if (sentenceText.querySelector('span')) {
                    let completeWord = sentenceText.querySelector('span');
                    completeWord.textContent = item.textContent;
                }
            }
        });
    });
}


// ОЧИЩАЕМ LOCALSTORAGE ПЕРЕД НОВЫМ ПРОХОЖДЕНИЕМ ТЕСТА
if (currentURL() == 'result_short.php') {
    let formButton = document.querySelector('.result-btns form');
    formButton.addEventListener('submit', () => {
        localStorageClear();
        // var xhr = new XMLHttpRequest();
        // xhr.open('POST', 'scripts/clearCookie.php')
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // xhr.onreadystatechange = function() {
        //     if (xhr.readyState === 4 && xhr.status === 200) {
        //         location="test_short.php";
        //     }
        // }
        // xhr.send('clearCookie=true');
    });
}