<?php

class Article
{
    public const PAGE_NUMBER_FILTER = 'PAGE_NUMBER_FILTER';
    public const ARTICLES_PER_PAGE = 'ARTICLES_PER_PAGE';

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
        // var_dump($db->query("SELECT DISTINCT YEAR(`created_at`) AS `year` FROM `articles`"));
        // var_dump(array_column($db->query("SELECT DISTINCT YEAR(`created_at`) AS `year` FROM `articles` ORDER BY `year`"), 'year'));
        // die();
        return array_column($db->query("SELECT DISTINCT YEAR(`created_at`) AS `year` FROM `articles` ORDER BY `year`"), 'year');
    }

    public static function getFiltered($filters)
    {
      $db = $GLOBALS['db'];

      $queryRoot = "SELECT `a`.`id` AS `id`, `a`.`title` AS `title`, `a`.`content` AS `text`, `a`.`annotation` AS `annotation`,  DATE_FORMAT(`a`.`created_at`, \"%d %M %Y\") AS `created_at`, `au`.`name` AS `author`, `p`.`link` AS `image`, `p`.`title` AS `image_alt` FROM `articles` AS `a` INNER JOIN `photos` AS `p` ON (`a`.`photo_id` = `p`.`id`) INNER JOIN `authors` AS `au` ON (`a`.`author_id` = `au`.`id`)";

      // $constrains = " ORDER BY `created_at` LIMIT {$filters['ARTICLES_PER_PAGE']}";
      $constrains = "LIMIT {$filters['ARTICLES_PER_PAGE']}";

      if (isset($filters['PAGE_NUMBER_FILTER'])) {
        $constrains .= " OFFSET {$filters['PAGE_NUMBER_FILTER']}";
      }

      return ['authors' => $db->getObjectsOf($queryRoot . $constrains, self::class)];
      //return $queryRoot . $constrains;
      //return $filters;
    }
}