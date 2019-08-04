/* В этом файле вы пишете js код вашего приложения */

//1 выводить дату в карточку +
//2 устанавливать страницу в 1 в адресной строке при сбросе фильтра +
//3 сохранять год фильтра при переходах по страницам результатов +
//4 помещать год при выборе в поле ввода года,
// а при его удалении оттуда пользователем - сбрасывать год в фильтре
// Номер страницы, установившийся как текущий в представлении постраничности
var lastPage = 0;
// Модель данных фильтрации
var filterData = {};
// Флаг разрешения переключения страницы
var switchPagePermitted = true;
// Флаг состояния фильтрации
var filtering = true;
// Данные настроек постраничности
var paginationSettings = {};
// Ф-ция установки данных фильтра по умолчанию
const resetFilterData = function () {

    filterData = {'page_number': 1};
}
// Ф-ция создания представления постраничности
const resetPaginationView = function () {
    // Переключение страницы запретить
    switchPagePermitted = false;
    // Вызов ф-ции создания представления постраничности из библиотеки jquery.simplePagination.js
    $('#pagination').pagination({
        items: paginationSettings['articles_count'],
        itemsOnPage: paginationSettings['articles_per_page']
    });
    // Установить номер страницы в 1 в адресной строке
    if(history.pushState) {
        // ... в современных браузерах
        history.pushState(null, null, '#page-1');
    }
    else {
        // ... в старинных браузерах
        location.hash = '#page-1';
    }
}
// Когда веб-страница готова ...
$(document).ready(function() {
    // Ф-ция заполнения сетки статей
    const populateArticlesGrid = function () {
        // Асинхронный запрос на сервер: получить список статей
        $.ajax({
            url: "/",
            dataType: 'json',
            type: "POST",
            data: filterData,
            cache : false
        }).done(function(data) {
            // Когда данные получены
            // console.log(data);
            // Готовим шаблон 'article' при помощи библиотеки Hogan
            var template = Hogan.compile(
                '{{#articles}}'
                + '<div class="card">'
                    + '<img class="card-img-top" src="{{image}}" alt="{{image_alt}}" style="max-height:485px;min-width:865px;object-fit: cover;">'
                    + '<div class="card-body">'
                        + '<h5 class="card-title">{{title}}</h5>'
                        + '<span>{{author}}</span> / <span class="text-secondary">{{created_at}}</span>'
                        + '<p class="card-text">{{text}}</p>'
                    + '</div>'
                + '</div>'
                + '{{/articles}}'
            );
            // Заполняем шаблон данными и помещаем на веб-страницу
            $('#articles').html(template.render(data));
            // Если перерисока статей вызвана действием фильтрации
            if (filtering) {
                // Сбрасывается флаг режима фильтрации
                filtering = false;
                // Вычисление и сохранение в настройки числа полученных статей
                paginationSettings['articles_count'] = (data['count']) ? data['count'] : 0;
                // Вызов пересоздания представления постраничности
                resetPaginationView();
            }
            // Переключение страницы разрешить
            switchPagePermitted = true;
        });
    };
	// Ф-ция получения и отображения начальных данных
    function init() {
        //TODO begin preloader
        //send init post
        $.ajax({
            url: "/",
            dataType: 'json',
            type: "POST",
            data: { 
                'init': ''
            },
            cache : false
        }).done(function(data) {
            
            // Готовим шаблон 'years' при помощи библиотеки Hogan
            var yearsTemplate = Hogan.compile(
                '{{#years}}'
                + '<a href="#" class="sidebar-item__label">{{y}}</a>'
                + '{{/years}}'
                + '<a href="#" class="sidebar-item__label">All</a>'
            );
            // Заполняем шаблон 'years' данными и помещаем на веб-страницу
            $('#years .sidebar-item__content').html(yearsTemplate.render(data));
            // Обработчик клика по одному из тегов "год" на панели фильтрации
            $(document).on('click', '#years .sidebar-item__content > a', function (ev) {
                // Отмена стандартного обработчика
                ev.preventDefault();
                // 
                $(this).addClass("active").siblings().removeClass("active");
                //console.log(ev);
                // Чтение года, по которому был клик
                const year = $(this).text();
                // Вызов сброса данных фильтрации
                // resetFilterData();
                if (year != 'All') {
                    // Установка выбранного года в модель фильтра
                    filterData['year'] = year;
                } else {
                    // Удаление выбранного года из модели фильтра
                    delete filterData['year'];
                    // Установка номера страницы в модели данных фильтра в 1  
                    filterData['page_number'] = 1;
                }
                // Установка флага "фильтрация", чтобы требовалось пересоздания представления постраничности
                filtering = true;
                // Вызов заполнения сетки статей
                populateArticlesGrid();
            });
            // Заполнение объекта настроек постраничности
            paginationSettings['articles_count'] = data['articles_count'];
            paginationSettings['articles_per_page'] = data['articles_per_page'];
            // Вызов пересоздания представления постраничности
            // resetPaginationView();
            // Вызов сброса данных фильтрации
            resetFilterData();
            // Вызов заполнения сетки статей
            populateArticlesGrid();
            // Обработчик любых изменений дерева узлов внутри контейнера постраничности 
            $(document).on('DOMSubtreeModified', '#pagination', function (ev) {
                // Отмена стандартного обработчика
                ev.preventDefault();
                //console.log(ev);
                // Чтение номера страницы, по которой был клик
                const page = $(this).find('span.current').text().replace(/\D/g,'');

                // Если клик выполнен не по гиперссылке prev или next
                if (page
                    && !page.includes('Next')
                    && lastPage != page) {
                    //  Если переключение страницы разрешено
                    if (switchPagePermitted) {
                        // Запоминание номера выьранной страницы
                        lastPage = page;
                        // resetFilterData();
                        // Установка выбранного номера страницы в модель фильтра
                        filterData['page_number'] = lastPage;
                        // Вызов заполнения сетки статей
                        populateArticlesGrid();
                    }
                }                
            });
        });
    }
    //Вызов функции получения и отображения начальных данных
    init();
});