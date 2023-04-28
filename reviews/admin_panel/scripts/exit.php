<?php

if ($_POST['exit'] == 'true') {
    session_destroy();
    echo json_encode(true);
}