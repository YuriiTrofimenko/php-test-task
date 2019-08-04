<?php

class Article
{
    public const PAGE_NUMBER_FILTER = 'PAGE_NUMBER_FILTER';
    public const ARTICLES_PER_PAGE = 'ARTICLES_PER_PAGE';
    public const ARTICLES_YEAR = 'ARTICLES_YEAR';

    public $id;
    public $title;
    public $annotation;
    public $author;
    public $text;
    public $image;
    public $created_at;


    /**
     * @return mixed
     */
    public static function getAll()
    {
        $db = $GLOBALS['db'];

        $authors = $db->getObjectsOf('SELECT * FROM `authors`', Author);
        $articles = $db->getObjectsOf('SELECT * FROM `articles`', self::class);

        foreach ($articles as &$article) {
            $author = array_values(
                          array_filter(
                              $authors,
                              function ($a) use ($article) {
                                  return $a->id == $article->author_id;
                              }
                          )
                      )[0];
            $article->author = $author;
        }

        return $articles;
    }

    /**
     * @param $title
     * @return mixed
     */
    public static function getByTitle($title)
    {
        $db = $GLOBALS['db'];
        return $db->getOne("SELECT * FROM `articles` WHERE `title` = '{$title}'");
    }

    /**
     * @param $id
     * @return mixed
     */
    public static function getById($id)
    {
        $db = $GLOBALS['db'];
        return $db->getOne("SELECT * FROM `articles` WHERE `id` = '{$id}'");
    }

    /**
     * @param Author $author
     * @return String json
     */
    public static function getByAuthor(Author $author)
    {
        // todo: your code here
    }

    /**
     * @return String json
     */
    public static function getByDate()
    {
        // todo: your code here
    }

    public static function getCount()
    {
        $db = $GLOBALS['db'];
        return intval($db->getOne('SELECT COUNT(*) FROM `articles`'));
    }

    public static function getYears()
    {
        $db = $GLOBALS['db'];
        return array_column($db->query("SELECT DISTINCT YEAR(`created_at`) AS `year` FROM `articles` ORDER BY `year`"), 'year');
    }

    public static function getFiltered($filters)
    {
      // Получение контекста БД
      $db = $GLOBALS['db'];
      // Фрагмент запроса к БД с правилами сортировки и желаемым количеством результатов
      $orderByNPagination = "ORDER BY `created_at` DESC LIMIT {$filters['ARTICLES_PER_PAGE']}";
      // Фрагмент запроса к БД со смещением от начала списка результатов
      if (isset($filters['PAGE_NUMBER_FILTER'])) {
        $orderByNPagination .= " OFFSET {$filters['PAGE_NUMBER_FILTER']}";
      }
      // Начало формирования фрагмента запроса с правилами фильтрации
      $whereClouse = "";
      if (isset($filters['ARTICLES_YEAR'])) {
        $whereClouse .= "WHERE YEAR(`created_at`) = {$filters['ARTICLES_YEAR']}";
      }
      // Корень основного запроса к БД с интерполяцией сформированных выше фрагментов
      $queryRoot = "SELECT `a`.`id` AS `id`, `a`.`title` AS `title`, `a`.`content` AS `text`, `a`.`annotation` AS `annotation`,  DATE_FORMAT(`a`.`created_at`, \"%d %M %Y\") AS `created_at`, `au`.`name` AS `author`, `p`.`link` AS `image`, `p`.`title` AS `image_alt` FROM (SELECT `id` FROM `articles` {$whereClouse} {$orderByNPagination}) AS `aids` INNER JOIN `articles` AS `a` ON (`a`.`id` = `aids`.`id`) INNER JOIN `photos` AS `p` ON (`a`.`photo_id` = `p`.`id`) INNER JOIN `authors` AS `au` ON (`a`.`author_id` = `au`.`id`)";
      // Запрос для получения числа результатов при заданных правилах фильтрации
      $countQuery = "(SELECT COUNT(`id`) FROM `articles` {$whereClouse})";
      // Возврат контроллеру массива статей для указанного номера страницы и общего числа результатов при заданном фильтре
      return ['articles' => $db->getObjectsOf($queryRoot . $constrains, self::class), 'count' => $db->getOne($countQuery)];
      //return $queryRoot . $constrains;
      //return $filters;
    }
}