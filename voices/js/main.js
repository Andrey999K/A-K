const buttonsVoices = document.querySelectorAll('.voice__button');
const progressbarComplete = document.querySelector('.progressbar__complete');
const progressbarPercentElem = document.querySelector('.progressbar__percent');
const praise = document.querySelector('.praise');
const progressTranslateBlock = document.querySelector('.voices__progressbar-section');
const buttonTranslate = document.querySelector('.voices__translate-button');
const voiceQuestionEn = document.querySelectorAll('.voice__question-en');
const voiceQuestionRu = document.querySelectorAll('.voice__question-ru');
const voiceItems = document.querySelectorAll('.voices-grid__item');


function toggleQuestionComplete(voiceAnswered, button, text, textButton) {
    voiceAnswered.classList.toggle('voice__answered');
    voiceAnswered.querySelector('span').textContent = text;
    button.textContent = textButton;
    button.classList.toggle('voice__button-cancel');
}


function checkSavedQuestion() {
    if (localStorage.length != 0) {
        voiceItems.forEach(item => {
            if (item.id in localStorage) {
                const voiceAnswered = item.querySelector('.voice__bottom>div');
                const voiceButton = item.querySelector('.voice__button');
                item.classList.add('answered');
                toggleQuestionComplete(voiceAnswered, voiceButton,  'Отвечено', 'Отменить');
            }
        });
    }
}


function checkProgressbar() {
    const numberQuestionComplete = document.querySelectorAll('.voice__button-cancel').length;
    const numberQuestion = document.querySelectorAll('.voice__button').length;
    const percentProgress = Math.floor(numberQuestionComplete / numberQuestion * 100)
    progressbarComplete.style.width = `${percentProgress}%`;
    progressbarPercentElem.textContent = `${percentProgress}%`;
    if (percentProgress == 100) {
        praise.classList.remove('hidden');
    }
}


checkSavedQuestion();
checkProgressbar();


buttonsVoices.forEach(item => {
    item.addEventListener('click', () => {
        const voiceAnswered = item.previousElementSibling;
        const question = item.closest('.voices-grid__item');
        const idQuestion = question.id;
        question.classList.toggle('answered');
        if (item.textContent == 'Да') {
            toggleQuestionComplete(voiceAnswered, item,  'Отвечено', 'Отменить');
            localStorage.setItem(idQuestion, 'true');
        } else {
            toggleQuestionComplete(voiceAnswered, item,  'Удалось ответить?', 'Да');
            localStorage.removeItem(idQuestion);
        }
        const voicesNumber = document.querySelectorAll('.voice__button').length;
        const voicesCompleteNumber = document.querySelectorAll('.voice__button-cancel').length;
        const progressPercent = Math.floor(voicesCompleteNumber / voicesNumber * 100);
        progressbarComplete.style.width = `${progressPercent}%`;
        progressbarPercentElem.textContent = `${progressPercent}%`;
        if (progressPercent == 100) {
            praise.classList.remove('hidden');
        } else {
            praise.classList.add('hidden');
        }
    });
});

document.addEventListener('scroll', () => {
    // console.dir(progressTranslateBlock);
    if (progressTranslateBlock.getBoundingClientRect().y == 0) {
        progressTranslateBlock.style.boxShadow = '0px 4px 16px rgba(0, 22, 37, 0.04)';
    } else {
        progressTranslateBlock.style.boxShadow = 'none';
    }
});

buttonTranslate.addEventListener('click', () => {
    const textElem = buttonTranslate.querySelector('span');
    if (textElem.textContent == 'Перевести вопросы на RU') {
        textElem.textContent = 'Перевести вопросы на EN'
    } else {
        textElem.textContent = 'Перевести вопросы на RU'
    }
    console.log(voiceQuestionEn);
    for (let i = 0; i < voiceQuestionEn.length; i++) {
        voiceQuestionEn[i].classList.toggle('hidden');
        voiceQuestionRu[i].classList.toggle('hidden');
    }
});