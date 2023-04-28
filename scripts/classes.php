<?php

// КЛАСС ШАБЛОНА
class template_class
{
    var $values = array(); // ПЕРЕМЕННЫЕ ШАБЛОНА
    var $html;

    // ФУНКЦИЯ ЗАГРУЗКИ ШАБЛОНА
    function get_tpl($tpl_name)
    {
        if (empty($tpl_name) || !file_exists($tpl_name)) {
            return false;
        } else {
            $this->html = join('', file($tpl_name));
        }
    }

    // ФУНКЦИЯ УСТАНОВКИ ЗНАЧЕНИЯ
    function set_value($key, $var)
    {
        $key = '{' . $key . "}";
        $this->values[$key] = $var;
    }

    // ПАРСИНГ ШАБЛОНА
    function tpl_parse()
    {
        foreach ($this->values as $find => $replace) {
            $this->html = str_replace($find, $replace, $this->html);
        }
    }
}