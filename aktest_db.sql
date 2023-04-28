-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Фев 10 2023 г., 01:10
-- Версия сервера: 5.6.41
-- Версия PHP: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `aktest_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `answers`
--

CREATE TABLE `answers` (
  `id_answer` int(3) UNSIGNED NOT NULL,
  `question` int(3) UNSIGNED NOT NULL,
  `answer` varchar(255) NOT NULL,
  `correct` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `answers`
--

INSERT INTO `answers` (`id_answer`, `question`, `answer`, `correct`) VALUES
(1, 1, 'Me', 0),
(2, 1, 'My', 1),
(3, 1, 'Mine', 0),
(4, 1, 'My\'s', 0),
(5, 2, 'create', 0),
(6, 2, 'make', 1),
(7, 2, 'do', 0),
(8, 2, 'render', 0),
(9, 3, 'Them', 0),
(10, 3, 'They', 0),
(11, 3, 'There', 1),
(12, 3, 'Where', 0),
(13, 4, 'take off', 0),
(14, 4, 'will take off', 0),
(15, 4, 'takes off', 1),
(16, 4, 'took off', 0),
(17, 5, 'old', 0),
(18, 5, 'years old', 1),
(19, 5, 'young', 0),
(20, 5, 'age', 0),
(21, 6, 'a engineer', 0),
(22, 6, 'an engineer', 1),
(23, 6, 'engineer', 0),
(24, 6, 'the engineer', 0),
(25, 7, 'is', 0),
(26, 7, 'do', 0),
(27, 7, 'am', 1),
(28, 7, 'can', 0),
(29, 8, 'neither', 0),
(30, 8, 'either', 1),
(31, 8, 'weather', 0),
(32, 8, 'whether', 0),
(33, 9, 'friend', 0),
(34, 9, 'friend\'s', 1),
(35, 9, 'friends', 0),
(36, 9, 'friend\'s got', 0),
(37, 10, 'to', 0),
(38, 10, 'in', 1),
(39, 10, 'at', 0),
(40, 10, 'for', 0),
(41, 11, 'What', 1),
(42, 11, 'How', 0),
(43, 11, 'Why', 0),
(44, 11, 'Where', 0),
(45, 12, 'What', 0),
(46, 12, 'When', 0),
(47, 12, 'Which', 1),
(48, 12, 'Where', 0),
(49, 13, 'some', 0),
(50, 13, 'any', 1),
(51, 13, 'any of', 0),
(52, 13, 'else', 0),
(53, 14, 'can', 0),
(54, 14, 'should', 0),
(55, 14, 'are supposed', 1),
(56, 14, 'had better', 0),
(57, 15, 'make', 0),
(58, 15, 'do', 1),
(59, 15, 'support', 0),
(60, 15, 'bring', 0),
(61, 16, 'boil', 0),
(62, 16, 'will boil', 0),
(63, 16, 'boiled', 0),
(64, 16, 'boils', 1),
(65, 17, 'in', 1),
(66, 17, 'at', 0),
(67, 17, 'on', 0),
(68, 17, 'to', 0),
(69, 18, 'calls', 0),
(70, 18, 'calling', 0),
(71, 18, 'is calling', 1),
(72, 18, 'has been calling', 0),
(73, 19, 'in', 0),
(74, 19, 'to', 0),
(75, 19, 'at', 0),
(76, 19, 'on', 1),
(77, 20, 'to', 0),
(78, 20, 'for', 0),
(79, 20, 'by', 1),
(80, 20, 'up to', 0),
(81, 21, 'in', 1),
(82, 21, 'to', 0),
(83, 21, 'at', 0),
(84, 21, 'on', 0),
(85, 22, 'play', 0),
(86, 22, 'am', 0),
(87, 22, 'playing', 0),
(88, 22, 'do', 1),
(89, 23, 'at', 0),
(90, 23, 'in', 1),
(91, 23, 'on', 0),
(92, 23, 'to', 0),
(93, 24, 'wait', 0),
(94, 24, 'will wait', 0),
(95, 24, 'am waiting', 1),
(96, 24, 'do wait', 0),
(97, 25, 'to', 0),
(98, 25, 'in', 0),
(99, 25, 'at', 1),
(100, 25, 'on', 0),
(101, 26, 'as well', 1),
(102, 26, 'either', 0),
(103, 26, 'same', 0),
(104, 26, 'such', 0),
(105, 27, 'Nile', 0),
(106, 27, 'A Nile', 0),
(107, 27, 'An Nile', 0),
(108, 27, 'The Nile', 1),
(109, 28, 'of', 1),
(110, 28, 'off', 0),
(111, 28, 'from', 0),
(112, 28, 'with', 0),
(113, 29, 'Red Square', 1),
(114, 29, 'A Red Square', 0),
(115, 29, 'An Red Square', 0),
(116, 29, 'The Red Square', 0),
(117, 30, 'take', 1),
(118, 30, 'took', 0),
(119, 30, 'taken', 0),
(120, 30, 'taked', 0),
(121, 31, 'foot', 0),
(122, 31, 'feet', 1),
(123, 31, 'foots', 0),
(124, 31, 'feets', 0),
(125, 32, 'do you', 0),
(126, 32, 'don\'t you', 1),
(127, 32, 'are you', 0),
(128, 32, 'aren\'t you', 0),
(129, 33, 'cap', 0),
(130, 33, 'cup', 1),
(131, 33, 'spoon', 0),
(132, 33, 'fork', 0),
(133, 34, 'after', 1),
(134, 34, 'for', 0),
(135, 34, 'at', 0),
(136, 34, 'out', 0),
(137, 35, 'months', 1),
(138, 35, 'weeks', 0),
(139, 35, 'days', 0),
(140, 35, 'centuries', 0),
(141, 36, 'spend', 0),
(142, 36, 'use', 0),
(143, 36, 'consumption', 0),
(144, 36, 'waste', 1),
(145, 37, 'do', 0),
(146, 37, 'make', 1),
(147, 37, 'perform', 0),
(148, 37, 'get', 0),
(149, 38, 'come to', 0),
(150, 38, 'commute to', 1),
(151, 38, 'communicate to', 0),
(154, 38, 'commemorate to', 0),
(155, 39, 'raises', 0),
(156, 39, 'rises', 1),
(157, 39, 'arises', 0),
(158, 39, 'arouses', 0),
(159, 40, 'pass', 1),
(160, 40, 'skip', 0),
(161, 40, 'transfer', 0),
(162, 40, 'take over', 0),
(163, 41, 'lump', 0),
(164, 41, 'lamp', 1),
(165, 41, 'beacon', 0),
(166, 41, 'pharos', 0),
(167, 42, 'shell', 0),
(168, 42, 'shall', 0),
(169, 42, 'shelf', 1),
(170, 42, 'self', 0),
(171, 43, 'mature', 0),
(172, 43, 'ripe', 1),
(173, 43, 'developed', 0),
(174, 43, 'grown up', 0),
(175, 44, 'razor', 0),
(176, 44, 'eraser', 1),
(177, 44, 'grater', 0),
(178, 44, 'washboard', 0),
(179, 45, 'glass', 0),
(180, 45, 'glasses', 1),
(181, 45, 'scores', 0),
(182, 45, 'points', 0),
(183, 46, 'look', 0),
(184, 46, 'see', 0),
(185, 46, 'watch', 1),
(186, 46, 'gaze', 0),
(187, 47, 'pain', 1),
(188, 47, 'injury', 0),
(189, 47, 'hurt', 0),
(190, 47, 'ache', 0),
(191, 48, 'notes', 1),
(192, 48, 'remarks', 0),
(193, 48, 'minutes', 0),
(194, 48, 'lines', 0),
(195, 49, 'too', 0),
(196, 49, 'sufficiently', 0),
(197, 49, 'lot', 0),
(198, 49, 'enough', 1),
(199, 50, 'fond', 0),
(200, 50, 'found', 0),
(201, 50, 'funded', 0),
(202, 50, 'founded', 1),
(203, 51, 'pays', 0),
(204, 51, 'draws', 1),
(205, 51, 'pulls', 0),
(206, 51, 'drags', 0),
(207, 52, 'deserts', 1),
(208, 52, 'desserts', 0),
(209, 52, 'deserves', 0),
(210, 52, 'deserters', 0),
(211, 53, 'account', 1),
(212, 53, 'score', 0),
(213, 53, 'count', 0),
(214, 53, 'bill', 0),
(215, 54, 'basket', 0),
(216, 54, 'handbag', 1),
(217, 54, 'cart', 0),
(218, 54, 'sack', 0),
(219, 55, 'lied', 0),
(220, 55, 'lay', 1),
(221, 55, 'led', 0),
(222, 55, 'laid', 0),
(223, 56, 'saw', 1),
(224, 56, 'see', 0),
(225, 56, 'sea', 0),
(226, 56, 'seal', 0),
(227, 57, 'lose', 0),
(228, 57, 'loose', 0),
(229, 57, 'lost', 1),
(230, 57, 'lust', 0),
(231, 58, 'placing', 0),
(232, 58, 'construction', 1),
(233, 58, 'housing', 0),
(234, 58, 'structuring', 0),
(235, 59, 'cook', 1),
(236, 59, 'cooker', 0),
(237, 59, 'spatula', 0),
(238, 59, 'oven', 0),
(239, 60, 'personal', 1),
(240, 60, 'personnel', 0),
(241, 60, 'personage', 0),
(242, 60, 'person', 0),
(243, 61, 'missed', 1),
(244, 61, 'bored', 0),
(245, 61, 'late', 0),
(246, 61, 'omitted', 0),
(247, 62, 'shadow', 0),
(248, 62, 'shade', 1),
(249, 62, 'dark', 0),
(250, 62, 'mirror', 0),
(251, 63, 'What book?', 1),
(252, 63, 'It tastes good', 0),
(253, 63, 'I prefer tea', 0),
(254, 63, 'Could you close the window, please?', 0),
(255, 64, 'It\'s sunny.', 1),
(256, 64, 'Thank you!', 0),
(257, 64, 'How are you?', 0),
(258, 64, 'It\'s coming 10 minutes late.', 0),
(261, 65, 'I\'m John, nice to meet you', 1),
(262, 65, 'His name is Andrew', 0),
(263, 65, 'My dog\'s name is Britanny', 0),
(264, 65, 'I\'ve got nothing but my name', 0),
(265, 66, 'I have an elder brother', 0),
(266, 66, 'I\'m getting well', 0),
(267, 66, 'I\'m 30 years old', 1),
(268, 66, 'My old boss was 35', 0),
(269, 67, 'Yes, it\'s mine', 1),
(270, 67, 'I prefer pizza', 0),
(271, 67, 'It is sunny today', 0),
(272, 67, 'Could you call me later, please?', 0),
(273, 68, 'It\'s almost midnight.', 1),
(274, 68, 'Thank you!', 0),
(275, 68, 'I\'ve bought a new watch', 0),
(276, 68, 'It\'s late', 0),
(277, 69, 'Yes, I closed it', 1),
(278, 69, 'No, it\'s far from here', 0),
(279, 69, 'It seems the wind is blowing', 0),
(280, 69, 'You don\'t have to apologize', 0),
(281, 70, 'I do', 1),
(282, 70, 'I prefer horrors', 0),
(283, 70, 'I love the towel, it is striped', 0),
(284, 70, 'I know', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `answers_texts`
--

CREATE TABLE `answers_texts` (
  `id_answer_text` int(3) UNSIGNED NOT NULL,
  `question` int(3) UNSIGNED NOT NULL,
  `answer_text` varchar(255) NOT NULL,
  `correct` int(1) NOT NULL DEFAULT '0',
  `type` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `answers_texts`
--

INSERT INTO `answers_texts` (`id_answer_text`, `question`, `answer_text`, `correct`, `type`) VALUES
(7001, 7001, 'Arkansas', 0, 0),
(7002, 7001, 'Kentucky', 0, 0),
(7003, 7001, 'Kansas', 1, 0),
(7004, 7002, 'a shepherd', 0, 0),
(7005, 7002, 'a farmer', 1, 0),
(7006, 7002, 'a hunter', 0, 0),
(7007, 7003, 'a cookstove', 0, 1),
(7008, 7003, 'a table', 0, 1),
(7009, 7003, 'a washing machine', 1, 1),
(7010, 7003, 'a cupboard', 0, 1),
(7011, 7003, 'an armchair', 1, 1),
(7012, 7004, 'Right after he checked his safe', 0, 0),
(7013, 7004, 'Soon after church', 0, 0),
(7014, 7004, 'Shortly after midnight', 1, 1),
(7015, 7005, 'A book', 0, 0),
(7016, 7005, 'An envelope', 1, 0),
(7017, 7005, 'Cloth', 0, 0),
(7018, 7006, 'attending church', 0, 1),
(7019, 7006, 'checking his safe', 0, 1),
(7020, 7006, 'reading', 1, 1),
(7021, 7006, 'sitting by the fireplace', 1, 1),
(7022, 7006, 'ringing up his neighbor', 0, 1),
(7025, 7009, 'a desert', 0, 0),
(7026, 7009, 'a prairie', 1, 0),
(7027, 7009, 'a savannah', 0, 0),
(7028, 7010, 'a house', 0, 0),
(7029, 7010, 'a tree', 0, 0),
(7030, 7010, 'nothing of the above', 1, 0),
(7031, 7011, 'the house was blue', 0, 1),
(7032, 7011, 'the house was gray', 1, 1),
(7033, 7011, 'the grass was green', 0, 1),
(7034, 7011, 'there were no trees around', 1, 1),
(7035, 7011, 'it never rained I the area', 0, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `parts`
--

CREATE TABLE `parts` (
  `id_part` int(3) UNSIGNED NOT NULL,
  `name_part` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `parts`
--

INSERT INTO `parts` (`id_part`, `name_part`) VALUES
(1, 'Grammar'),
(2, 'Vocabulary'),
(3, 'Audio'),
(4, 'Reading');

-- --------------------------------------------------------

--
-- Структура таблицы `questions`
--

CREATE TABLE `questions` (
  `id_question` int(3) UNSIGNED NOT NULL,
  `question` varchar(255) NOT NULL,
  `value` int(2) NOT NULL DEFAULT '1',
  `part` int(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `questions`
--

INSERT INTO `questions` (`id_question`, `question`, `value`, `part`) VALUES
(1, '___ name is Jack.', 1, 1),
(2, 'If you ___ a mistake, you don\'t pass the test.', 1, 1),
(3, '___ are chairs to sit on and сups to drink from.', 1, 1),
(4, 'The plane ___ at 5:30 tomorrow.', 1, 1),
(5, 'How old is John? He is 20 ___.', 1, 1),
(6, '- What is your job? - I am ___ .', 1, 1),
(7, 'Are you a student? Yes, I ___.', 1, 1),
(8, '- I don\'t like theater. - I don\'t like it ___ .', 1, 1),
(9, 'This is my ___ dog.', 1, 1),
(10, 'The train arrives ___ Warsaw in 2 hours.', 1, 1),
(11, '___ is the weather like today?', 1, 1),
(12, 'The jacket is available in 3 colors: black, blue and brown. ___ color do you prefer?', 1, 1),
(13, 'Do you have ___ questions?', 1, 1),
(14, 'We ___ to show them proper identification to get in.', 1, 1),
(15, 'Can you ___ me a favor?', 1, 1),
(16, 'Water always ___ at 100 &#176;C.', 1, 1),
(17, 'I was born ___ March.', 1, 1),
(18, 'Get Max on the phone, his father ___ him now.', 1, 1),
(19, 'He\'s coming ___ Monday.', 1, 1),
(20, 'I have to complete the work ___ Friday.', 1, 1),
(21, 'It often snows ___ winter.', 1, 1),
(22, 'Do you like to play tennis? - Yes, I ___.', 1, 1),
(23, 'Fishing is best ___ the morning.', 1, 1),
(24, 'What are you doing? I ___ for the bus.', 1, 1),
(25, 'John began his course ___ the end of 2015.', 1, 1),
(26, 'Please, fill out this form ___.', 1, 1),
(27, '___ is the longest river in the world.', 1, 1),
(28, 'The candle is made ___ wax.', 1, 1),
(29, '___ is the most famous square in Moscow.', 1, 1),
(30, 'Did he ___ the book home with him?', 1, 1),
(31, 'Did you know that an American football field is 360 ___ long?', 1, 1),
(32, 'You like football, ___?', 1, 1),
(33, 'I\'d like a ___ of tea, please.', 1, 2),
(34, 'Dad told me to look ___ you.', 1, 2),
(35, 'Winter includes three ___ : December, January and February.', 1, 2),
(36, 'It\'s a ___ of time talking to them.', 1, 2),
(37, 'He has to ___ an appointment at the office.', 1, 2),
(38, 'My house is in the suburbs, so I have to ___ work every day.', 1, 2),
(39, 'The sun always ___ in the east.', 1, 2),
(40, 'Could you ___ me the sugar, please?', 1, 2),
(41, 'We bought a new table ___.', 1, 2),
(42, 'I put my bag on the ___.', 1, 2),
(43, 'You\'d better not pick the apple. It is not ___ yet.', 1, 2),
(44, 'The answer is incorrect. Give me the ___, please.', 1, 2),
(45, 'You can\'t see anything. Put on your ___ .', 1, 2),
(46, 'Do you ___ TV every day?', 1, 2),
(47, 'John suffered ___ in his leg for a long time.', 1, 2),
(48, 'Did you take ___ during the lecture?', 1, 2),
(49, 'You are tall ___ to touch the ceiling.', 1, 2),
(50, 'The company was ___ in 1999.', 1, 2),
(51, 'The issue ___ attention.', 1, 2),
(52, 'It is very rare that it rains in the ___.', 1, 2),
(53, 'The court is supposed to take all the factors into ___.', 1, 2),
(54, 'I\'m looking for a ___ to take on the plane.', 1, 2),
(55, 'He ___ on the couch and spent the rest of the day listening to music.', 1, 2),
(56, 'We ___ the pyramids 2 years ago.', 1, 2),
(57, 'He can\'t see anything, he ___ his glasses.', 1, 2),
(58, 'The road is under ___. We have to take a detour.', 1, 2),
(59, 'John is a talented ___. His cakes are great!', 1, 2),
(60, 'Her ___ experience helped her change her mind.', 1, 2),
(61, 'I woke up late and ___ the bus.', 1, 2),
(62, 'The sun was blazing. John was resting in the ___ of the tree.', 1, 2),
(63, 'audio1', 1, 3),
(64, 'audio2', 1, 3),
(65, 'audio3', 1, 3),
(66, 'audio4', 1, 3),
(67, 'audio5', 1, 3),
(68, 'audio6', 1, 3),
(69, 'audio7', 1, 3),
(70, 'audio8', 1, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `questions_texts`
--

CREATE TABLE `questions_texts` (
  `id_question_text` int(3) UNSIGNED NOT NULL,
  `text` int(3) UNSIGNED NOT NULL,
  `question_text` varchar(255) NOT NULL,
  `value` int(1) NOT NULL,
  `type` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `questions_texts`
--

INSERT INTO `questions_texts` (`id_question_text`, `text`, `question_text`, `value`, `type`) VALUES
(7001, 1, 'What is the name of the state?', 1, 0),
(7002, 1, 'What was Uncle Henry\'s occupation?', 1, 0),
(7003, 1, 'What objects inside the room were not mentioned?', 2, 1),
(7004, 2, 'When would Mr. Utterson fall asleep on Sundays?', 1, 0),
(7005, 2, 'What was in the safe?', 1, 0),
(7006, 2, 'What did Mr. Utterson\'s Sunday custom include?', 2, 1),
(7009, 3, 'Where is the Dorothy\'s house located?', 1, 0),
(7010, 3, 'What did the Dorothy see?', 1, 0),
(7011, 3, 'Which statements are true?', 2, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

CREATE TABLE `reviews` (
  `id_review` int(11) NOT NULL,
  `extension_file` varchar(255) NOT NULL,
  `type_file` varchar(10) NOT NULL,
  `id_subcategory` int(11) NOT NULL DEFAULT '1',
  `height_file` int(11) DEFAULT NULL,
  `position_review` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `reviews_admins`
--

CREATE TABLE `reviews_admins` (
  `id_admin` int(11) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `add_admins` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `reviews_admins`
--

INSERT INTO `reviews_admins` (`id_admin`, `login`, `password`, `add_admins`) VALUES
(13, 'Andrey999K', '$2y$10$68RLa.jdYqxwnxX/bTfEguholLiWCvTyStX77eoOw5NJePfeAT/5S', 0),
(19, 'Kutuzov', '$2y$10$zWkgqZ1kHPWxSbsJHSUvtuR9n9vZoTOfHiXEv7aVTkPN7IsqZ.DaC', 0),
(20, 'Andrey', '$2y$10$ljxHlA4dcIsx5UW325SMMusyWzZhABDlvG0nU7m4dMqt7K9SjHtma', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `reviews_categories`
--

CREATE TABLE `reviews_categories` (
  `id_category` int(11) NOT NULL,
  `name_category` varchar(50) NOT NULL,
  `position_category` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `reviews_categories`
--

INSERT INTO `reviews_categories` (`id_category`, `name_category`, `position_category`) VALUES
(141, 'Категория2', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `reviews_subcategories`
--

CREATE TABLE `reviews_subcategories` (
  `id_subcategory` int(11) NOT NULL,
  `name_subcategory` varchar(50) NOT NULL,
  `id_category` int(11) NOT NULL,
  `page_banner_title` varchar(255) NOT NULL,
  `banner_file_name` varchar(255) DEFAULT NULL,
  `position_subcategory` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `reviews_subcategories`
--

INSERT INTO `reviews_subcategories` (`id_subcategory`, `name_subcategory`, `id_category`, `page_banner_title`, `banner_file_name`, `position_subcategory`) VALUES
(30, 'цусцвц', 141, 'вцвцй', '30.png', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `reviews_subcategories_tags`
--

CREATE TABLE `reviews_subcategories_tags` (
  `id_subcategory_tag` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL,
  `id_subcategory` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `reviews_tags`
--

CREATE TABLE `reviews_tags` (
  `id_tag` int(11) NOT NULL,
  `name_tag` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `reviews_tags`
--

INSERT INTO `reviews_tags` (`id_tag`, `name_tag`) VALUES
(144, '222'),
(147, 'Тег2'),
(148, 'Тег3');

-- --------------------------------------------------------

--
-- Структура таблицы `test_results`
--

CREATE TABLE `test_results` (
  `id_results` int(11) NOT NULL,
  `number_of_questions` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `test_results`
--

INSERT INTO `test_results` (`id_results`, `number_of_questions`) VALUES
(1, 6),
(3, 6),
(4, 3),
(5, 3),
(6, 4),
(7, 4),
(8, 4),
(9, 2),
(10, 6),
(11, 4),
(12, 1),
(13, 5),
(14, 5),
(15, 5),
(16, 5),
(17, 5),
(18, 5),
(19, 5),
(20, 5),
(21, 5),
(22, 5),
(23, 5),
(24, 5),
(25, 5),
(26, 5),
(27, 5),
(28, 5),
(29, 5),
(30, 5),
(31, 5),
(32, 5),
(33, 5),
(34, 5),
(64, 6),
(67, 3),
(69, 6),
(73, 4),
(74, 2),
(76, 4),
(158, 2),
(159, 3),
(160, 3),
(161, 3),
(162, 3),
(163, 3),
(164, 3),
(165, 3),
(166, 3),
(167, 3),
(168, 3),
(169, 3),
(170, 3),
(171, 3),
(172, 2),
(173, 2),
(175, 1),
(177, 2),
(180, 2),
(192, 1),
(194, 5),
(197, 3),
(199, 7),
(200, 5),
(202, 1),
(204, 4),
(205, 1),
(206, 3),
(210, 2),
(212, 1),
(216, 7),
(218, 4),
(221, 2),
(222, 3),
(223, 7),
(224, 7),
(226, 4),
(228, 4),
(230, 3),
(234, 7),
(236, 2),
(237, 2),
(238, 2),
(239, 16),
(240, 2),
(242, 1),
(244, 2),
(245, 2),
(246, 2),
(247, 2),
(248, 3),
(249, 3),
(250, 7),
(251, 7),
(252, 1),
(253, 1),
(256, 1),
(257, 1),
(262, 2),
(263, 3),
(264, 3),
(275, 3),
(276, 3),
(277, 3),
(278, 3),
(279, 3),
(282, 4),
(283, 4),
(284, 5),
(285, 5),
(287, 4),
(288, 5),
(290, 4),
(294, 1),
(295, 1),
(296, 1),
(299, 1),
(301, 2),
(305, 5),
(306, 5),
(307, 5),
(308, 5),
(309, 5),
(310, 5),
(311, 5),
(314, 6),
(315, 6),
(316, 4),
(317, 4),
(318, 1),
(319, 1),
(320, 6),
(321, 2),
(323, 2),
(324, 2),
(328, 1),
(329, 1),
(330, 1),
(331, 1),
(332, 1),
(333, 4),
(334, 4),
(335, 4),
(336, 4),
(337, 4),
(338, 4),
(339, 4),
(340, 4),
(341, 1),
(342, 3),
(343, 3),
(354, 4),
(355, 1),
(356, 1),
(357, 1),
(358, 2),
(359, 2),
(360, 2),
(361, 2),
(362, 2),
(363, 2),
(364, 2),
(365, 2),
(376, 1),
(378, 1),
(385, 1),
(392, 1),
(396, 1),
(397, 1),
(398, 1),
(404, 2),
(405, 1),
(406, 2),
(407, 2),
(408, 1),
(409, 1),
(411, 1),
(413, 5),
(423, 2),
(425, 1),
(426, 1),
(428, 2),
(430, 1),
(431, 6),
(432, 5),
(433, 5),
(434, 5),
(435, 5),
(437, 6),
(439, 6),
(440, 5),
(441, 5),
(443, 5),
(444, 5),
(446, 2),
(447, 2),
(448, 2),
(449, 5),
(450, 2),
(451, 5),
(452, 0),
(453, 5),
(454, 0),
(455, 1),
(456, 0),
(457, 1),
(458, 0),
(459, 2),
(460, 4),
(461, 9),
(462, 4),
(463, 4),
(464, 0),
(465, 4),
(466, 9),
(467, 9);

-- --------------------------------------------------------

--
-- Структура таблицы `texts`
--

CREATE TABLE `texts` (
  `id_text` int(3) UNSIGNED NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `texts`
--

INSERT INTO `texts` (`id_text`, `text`) VALUES
(1, 'Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer\'s wife. Their house was small, for the lumber to build it had to be carried by wagon many miles. There were four walls, a floor and a roof, which made one room; and this room contained a rusty looking cookstove, a cupboard for the dishes, a table, three or four chairs, and the beds. Uncle Henry and Aunt Em had a big bed in one corner, and Dorothy a little bed in another corner. There was no garret at all, and no cellar--except a small hole dug in the ground, called a cyclone cellar, where the family could go in case one of those great whirlwinds arose, mighty enough to crush any building in its path. It was reached by a trap door in the middle of the floor, from which a ladder led down into the small, dark hole.'),
(2, 'That evening Mr. Utterson came home to his bachelor house in sombre spirits and sat down to dinner without relish. It was his custom of a Sunday, when this meal was over, to sit close by the fire, a volume of some dry divinity on his reading desk, until the clock of the neighbouring church rang out the hour of twelve, when he would go soberly and gratefully to bed. On this night however, as soon as the cloth was taken away, he took up a candle and went into his business room. There he opened his safe, took from the most private part of it a document endorsed on the envelope as Dr. Jekyll\'s Will and sat down with a clouded brow to study its contents.'),
(3, 'When Dorothy stood in the doorway and looked around, she could see nothing but the great gray prairie on every side. Not a tree nor a house broke the broad sweep of flat country that reached to the edge of the sky in all directions. The sun had baked the plowed land into a gray mass, with little cracks running through it. Even the grass was not green, for the sun had burned the tops of the long blades until they were the same gray color to be seen everywhere. Once the house had been painted, but the sun blistered the paint and the rains washed it away, and now the house was as dull and gray as everything else.');

-- --------------------------------------------------------

--
-- Структура таблицы `voices`
--

CREATE TABLE `voices` (
  `id_voice` int(11) NOT NULL,
  `voice_text` text NOT NULL,
  `voice_text_ru` text NOT NULL,
  `file_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `voices`
--

INSERT INTO `voices` (`id_voice`, `voice_text`, `voice_text_ru`, `file_name`) VALUES
(1, 'Why do you want to study in a language school?', 'Почему вы хотите обучаться в языковой школе?', 'Why ESL_.m4a'),
(2, 'Why this particular school?', 'Почему именно эта школа?', 'Why this particular school_.m4a'),
(3, ' What is your job?', 'Где вы работаете?', 'What is your job_.m4a'),
(4, 'Is your spouse going with you to America?', 'Ваш(а) супруг(а) едет с вами в Америку?', 'Is your spouse going with you to America_.m4a'),
(5, 'How long have you been working at this job?', 'Как долго вы работаете на этой работе?', 'How long have you been working at this job_.m4a'),
(6, 'Have you ever been to the USA?', 'Вы когда нибудь были в США?', 'Have you ever been to the USA_.m4a'),
(7, 'What cities in America have you visited?', 'Какие города в Америке вы посетили?', 'What cities in America have you visited_.m4a'),
(8, 'Are you going to see New York this time?', 'Вы планируете посетить Нью-Йорк в этот раз?', 'Are you going to see NY this time_.m4a'),
(9, 'Have you studied English before?', 'Вы изучали английский ранее?', 'Have you studied English before_.m4a'),
(10, 'Why have you chosen the USA to learn English?', 'Почему вы выбрали США для изучения английского?', 'Why USA for English_.m4a'),
(11, 'Have you ever been abroad?', 'Вы когда нибудь были заграницей?', 'Have you ever been abroad_.m4a'),
(12, ' Who pays for your trip?', 'Кто платит за вашу поездку?', 'Who pays for your trip_.m4a'),
(13, 'Are you married? Do you have any children?', 'Вы женаты / замужем? У вас есть дети?', 'Are you married_ Do you have any children_.m4a'),
(14, 'Do you have friends or relatives abroad?', 'У вас есть друзья или родственники заграницей?', 'Do you have friends or relatives abroad_.m4a'),
(15, 'How long have you been learning english?', 'Как долго вы учите аглийский язык?', 'How long have you been learning English_.m4a'),
(16, 'Have you ever been charged with anything in Russia or abroad?', 'Штрафовали ли вас в России / за границей?', 'Have_you_ever_been_charged_with_anything_in_Russia_or_abroad.m4a'),
(19, 'Where are you going to stay?', 'Где вы собираетесь жить?', 'Where are you going to stay_.m4a'),
(20, 'How much does it cost?', 'Сколько это стоит?', 'How much does it cost_.m4a'),
(21, 'How much money do you have?', 'Сколько у вас денег?', 'How much money do you have_.m4a'),
(22, 'Why do you need a higher education?', 'Для чего вам высшее образование?', 'Why do you need a higher education_.m4a'),
(23, 'For how long are you going to study?', 'Как долго вы планируете обучаться?', 'For how long are you going to study_.m4a'),
(24, 'Will your employer wait for you for three months?', 'Работадатель будет ждать вас 3 месяца?', 'Will your employer wait for you for three months_.m4a'),
(25, 'Why do you want to go to the USA?', 'Почему вы хотите поехать в США?', 'Why do you want to go to the USA_.m4a'),
(26, 'Why have you chosen this school?', 'Почему вы выбрали эту школу?', 'Why have you chosen this school_.m4a');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id_answer`),
  ADD KEY `question` (`question`);

--
-- Индексы таблицы `answers_texts`
--
ALTER TABLE `answers_texts`
  ADD PRIMARY KEY (`id_answer_text`),
  ADD KEY `question` (`question`);

--
-- Индексы таблицы `parts`
--
ALTER TABLE `parts`
  ADD PRIMARY KEY (`id_part`);

--
-- Индексы таблицы `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id_question`),
  ADD KEY `part` (`part`);

--
-- Индексы таблицы `questions_texts`
--
ALTER TABLE `questions_texts`
  ADD PRIMARY KEY (`id_question_text`),
  ADD KEY `text` (`text`);

--
-- Индексы таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id_review`),
  ADD KEY `id_subcategory` (`id_subcategory`);

--
-- Индексы таблицы `reviews_admins`
--
ALTER TABLE `reviews_admins`
  ADD PRIMARY KEY (`id_admin`);

--
-- Индексы таблицы `reviews_categories`
--
ALTER TABLE `reviews_categories`
  ADD PRIMARY KEY (`id_category`);

--
-- Индексы таблицы `reviews_subcategories`
--
ALTER TABLE `reviews_subcategories`
  ADD PRIMARY KEY (`id_subcategory`),
  ADD KEY `id_category` (`id_category`);

--
-- Индексы таблицы `reviews_subcategories_tags`
--
ALTER TABLE `reviews_subcategories_tags`
  ADD PRIMARY KEY (`id_subcategory_tag`),
  ADD KEY `id_tag` (`id_tag`),
  ADD KEY `reviews_subcategories_tags_ibfk_1` (`id_subcategory`);

--
-- Индексы таблицы `reviews_tags`
--
ALTER TABLE `reviews_tags`
  ADD PRIMARY KEY (`id_tag`);

--
-- Индексы таблицы `test_results`
--
ALTER TABLE `test_results`
  ADD PRIMARY KEY (`id_results`);

--
-- Индексы таблицы `texts`
--
ALTER TABLE `texts`
  ADD PRIMARY KEY (`id_text`);

--
-- Индексы таблицы `voices`
--
ALTER TABLE `voices`
  ADD PRIMARY KEY (`id_voice`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `answers`
--
ALTER TABLE `answers`
  MODIFY `id_answer` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=285;

--
-- AUTO_INCREMENT для таблицы `answers_texts`
--
ALTER TABLE `answers_texts`
  MODIFY `id_answer_text` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7036;

--
-- AUTO_INCREMENT для таблицы `parts`
--
ALTER TABLE `parts`
  MODIFY `id_part` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `questions`
--
ALTER TABLE `questions`
  MODIFY `id_question` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT для таблицы `questions_texts`
--
ALTER TABLE `questions_texts`
  MODIFY `id_question_text` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7012;

--
-- AUTO_INCREMENT для таблицы `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT для таблицы `reviews_admins`
--
ALTER TABLE `reviews_admins`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `reviews_categories`
--
ALTER TABLE `reviews_categories`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT для таблицы `reviews_subcategories`
--
ALTER TABLE `reviews_subcategories`
  MODIFY `id_subcategory` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT для таблицы `reviews_subcategories_tags`
--
ALTER TABLE `reviews_subcategories_tags`
  MODIFY `id_subcategory_tag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT для таблицы `reviews_tags`
--
ALTER TABLE `reviews_tags`
  MODIFY `id_tag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT для таблицы `test_results`
--
ALTER TABLE `test_results`
  MODIFY `id_results` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=468;

--
-- AUTO_INCREMENT для таблицы `texts`
--
ALTER TABLE `texts`
  MODIFY `id_text` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `voices`
--
ALTER TABLE `voices`
  MODIFY `id_voice` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question`) REFERENCES `questions` (`id_question`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `answers_texts`
--
ALTER TABLE `answers_texts`
  ADD CONSTRAINT `answers_texts_ibfk_1` FOREIGN KEY (`question`) REFERENCES `questions_texts` (`id_question_text`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`part`) REFERENCES `parts` (`id_part`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `questions_texts`
--
ALTER TABLE `questions_texts`
  ADD CONSTRAINT `questions_texts_ibfk_1` FOREIGN KEY (`text`) REFERENCES `texts` (`id_text`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`id_subcategory`) REFERENCES `reviews_subcategories` (`id_subcategory`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `reviews_subcategories`
--
ALTER TABLE `reviews_subcategories`
  ADD CONSTRAINT `reviews_subcategories_ibfk_1` FOREIGN KEY (`id_category`) REFERENCES `reviews_categories` (`id_category`);

--
-- Ограничения внешнего ключа таблицы `reviews_subcategories_tags`
--
ALTER TABLE `reviews_subcategories_tags`
  ADD CONSTRAINT `reviews_subcategories_tags_ibfk_1` FOREIGN KEY (`id_subcategory`) REFERENCES `reviews_subcategories` (`id_subcategory`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_subcategories_tags_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `reviews_tags` (`id_tag`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
