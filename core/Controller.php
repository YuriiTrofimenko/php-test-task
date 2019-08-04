<?php

include_once __DIR__ . '/DB.php';
include_once __DIR__ . '/../models/Article.php';
include_once __DIR__ . '/../models/Author.php';

class Controller
{
    private $db;
    private $articlesPerPage;

    function __construct()
    {
        $this->db = isset($GLOBALS['db'])
            ? $GLOBALS['db']
            : new DB(include __DIR__ . '/../config.php');
        $this->articlesPerPage = isset($GLOBALS['articlesPerPage'])
            ? $GLOBALS['articlesPerPage']
            : (include __DIR__ . '/../config.php')['pagination']['articlesPerPage'];
    }

    public function actionIndex()
    {
        // $data = Article::getAll();
        require __DIR__ . '/../view/index.view.php';
    }

    public function actionInit()
    {
        
        $data = [];
        $data['articles_count'] = Article::getCount();
        $data['articles_per_page'] = $this->articlesPerPage;
        $data['authors'] = Author::getAll();
        $data['months'] = [1 => 'Январь' , 'Февраль' , 'Март' , 'Апрель' , 'Май' , 'Июнь' , 'Июль' , 'Август' , 'Сентябрь' , 'Октябрь' , 'Ноябрь' , 'Декабрь'];
        // Нумерованый массив превращается в массив объектов, чтобы в шаблоне для Hogan.js можно было задавть вывод его значений
        $data['years'] = [];
        foreach (Article::getYears() as $year) {
            $data['years'][] = (object) ['y' => $year];
        }
        echo json_encode($data);
    }

    /**
     * @param Array $request
     */
    public function actionFiltration($request)
    {
        // Массив для данных, которые будут отправлены клиенту
        $data = [];
        // Массив для ключей фильтра, который будет указан методу модели для формирования селективного запроса к БД
        $filters = [];
        // Задание числа статей на одну страницу
        $filters[Article::ARTICLES_PER_PAGE] = $this->articlesPerPage;
        // todo: получение списка всех авторов

        if (isset($request['year'])) {
            // todo: получение всех месяцев выбранного года, для которых есть статьи
        }

        // Фильтрация
        // Если есть параметр "год"
        if (isset($request['year']) /*&& $request['year'] != 'All'*/) {
            // Добавление фильтра по выбранному году
            $filters[Article::ARTICLES_YEAR] = $request['year'];

            if (isset($request['month'])) {
                // todo: Добавление фильтра по месяцу
            }
        }

        if (isset($request['author'])) {
            // todo: Добавление фильтра по выбранному автору
        }

        // todo: Подсчет количества страниц, для создания пагинации
        // Если есть номер страницы
        if (isset($request['page_number'])) {
            // todo: Добавление фильтра по номеру страницы
            $filters[Article::PAGE_NUMBER_FILTER] =
                ($request['page_number'] - 1) * $this->articlesPerPage;
        }

        // todo: Выборка всех статей по набранным фильтрам
        $data = Article::getFiltered($filters);
        // Отправка клиенту данных в формате json
        echo json_encode($data);
    }
}