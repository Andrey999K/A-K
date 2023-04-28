<?php
require_once('../scripts/db.php');
$connection = new PDO("mysql:host=" . HOST . "; dbname=" . DBNAME . "; charset=utf8", USER, PASSWORD);
$voices = $connection->query('SELECT * FROM voices');
$voices = $voices->fetchAll();

?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voices | A&K Test</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="./css/styles.css">


    <!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]function(){(m[i].a=m[i].a[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(89817557, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/89817557" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SCXWYR2L13"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-SCXWYR2L13');
</script>


</head>
<body class="page voices">
    <main class="main">
        <div class="voices__top-section page-top">
            <div class="container voices__container">
                <div class="page__breadcrumbs voices__breadcrumbs">
                    <div class="page__breadcrumbs-item breadcrumbs-item">Поддержка</div>
                    <div class="page__breadcrumbs-item breadcrumbs-item">Подготовка к собеседованию</div>
                </div>
                <div class="page__title voices__title">
                    <h1>Вопросы, которые вы можете услышать на собеседовании</h1>
                </div>
                <p class="page__description block-info">Прослушайте вопросы и попробуйте на них ответить</p>
            </div>
        </div>
        <div class="voices__progressbar-section">
            <div class="container">
                <div class="voices__progress-translate progress-translate">
                    <div class="voices__progressbar progressbar">
                        <span>Прогресс</span>
                        <div class="praise hidden">Отлично!</div>
                        <span class="progressbar__percent">0%</span>
                        <div class="voices__progressbar-line progressbar__line">
                            <div class="progressbar__complete"></div>
                        </div>
                    </div>
                    <button class="voices__translate-button translate-button">
                        <img src="./img/translation-icon.svg" alt="Перевести">
                        <span>Перевести вопросы на RU</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="voices__grid">
            <div class="container">
                <div class="voices__voices-grid voices-grid">
                    <?php
                    foreach ($voices as $voice) {
                        echo '<div class="voices-grid__item voice" id="' . $voice[0] . '">
                        <h3 class="voice__question voice__question-en">' . $voice[1] . '</h3>
                        <h3 class="voice__question voice__question-ru hidden">' . $voice[2] . '</h3>
                        <div class="voice__audio">
                            <div class="player">
                                <audio class="audio" src="./audio/' . $voice[3] . '"></audio>
                                <div class="play">
                                    <img src="../img/play.svg" alt="btn">
                                </div>
                                <div class="progress">
                                    <div class="progress__complete"></div>
                                </div>
                                <div class="progress__current-time">0:00</div>
                            </div>
                        </div>
                        <div class="voice__bottom">
                            <!--<span>Удалось ответить?</span>-->
                            <!--<button class="voice__button">Да</button>-->
                            <div>
                                <img src="./img/check-mark.svg" alt="Галочка">
                                <span>Удалось ответить?</span>
                            </div>
                            <button class="voice__button">Да</button>
                        </div>
                    </div>';
                    }
                    ?>
                </div>
            </div>
        </div>
    </main>
    <script src="../js/main.js"></script>
    <script src="./js/main.js"></script>
</body>
</html>