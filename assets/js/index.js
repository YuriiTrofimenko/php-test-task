/* В этом файле вы пишете js код вашего приложения */
var lastPage = 0;
$(document).ready(function() {

	//init
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
            
            //process json-data
            //console.log(data)
            // console.log($('#pagination'))
            // 
            $('#pagination').pagination({
                items: data['articles_count'],
                itemsOnPage: data['articles_per_page']
            });

            $(document).on('DOMSubtreeModified', '#pagination', function (ev) {
                ev.preventDefault();
                //console.log(ev);
                const page = $(this).find('span.current').text().replace(/\D/g,'');

                // TODO exclude prev n next
                // console.log('parse: ' + parseInt(page, 10));
                if (page
                    && !page.includes('Next')
                    && lastPage != page) {
                    //console.log(page);
                    lastPage = page;

                    $.ajax({
                        url: "/",
                        dataType: 'json',
                        type: "POST",
                        data: { 
                            'page_number': lastPage
                        },
                        cache : false
                    }).done(function(data) {
                        console.log(data['authors']);
                        //Готовим шаблон при помощи библиотеки Hogan
                        var template = Hogan.compile(
                            '{{#authors}}'
                            + '<div class="card">'
                                + '<img class="card-img-top" src="{{image}}" alt="{{image_alt}}" style="max-height:485px;min-width:865px;object-fit: cover;">'
                                + '<div class="card-body">'
                                    + '<h5 class="card-title">{{title}}</h5>'
                                    + '<p class="card-text">{{text}}</p>'
                                + '</div>'
                            + '</div>'
                            + '{{/authors}}'
                        );
                        //Заполняем шаблон данными и помещаем на веб-страницу
                        $('#articles').html(template.render(data));
                    });
                }
                
                // $(this).click(onPageItemClick);
            });

            // console.log($('#pagination li a'));
            /*const onPageItemClick = function (ev) {
                ev.preventDefault();
                const page = $(this).text();
                console.log(page);
                $(this).click(onPageItemClick);
            };
            $('#pagination li a').click(onPageItemClick);*/

            /*$('#pagination').change(function () {
                $('#pagination li').addClass('sidebar-item__label');
            });*/

            

            /*var paginationView = "";//"<div>";
            for (var i = 1; i <= data['pages_count']; i++) {
                paginationView += `<a href="?page=${i}" class="sidebar-item__label">${i}</a>`;
            }*/
            // paginationTemplate += "</div>";
            //Готовим шаблон при помощи библиотеки Hogan
            /*var template = Hogan.compile(
                '<h3>'
                +   'Расписание'
                + '</h3>'
                + '<table class="table">'
                +  '<thead>'
                +    '<tr>'
                +      '<th>ID</th>'
                +       '<th>клиент</th>'
                +       '<th>время</th>'
                +       '<th>мастер</th>'
                +    '</tr>'
                +  '</thead>'
                +  '<tbody>'
                +       '{{#orders}}'
                +           '<tr>'
                +               '<th scope="row">{{id}}</th>'
                +               '<td>{{name}}</td>'
                +               '<td>{{hours}}</td>'
                +               '<td>{{manicurist_name}}</td>'
                +            '</tr>'
                +        '{{/orders}}'
                +   '</tbody>'
                + '</table>'
            );*/
            //Заполняем шаблон данными и помещаем на веб-страницу
            // $('#pagination').html(template.render(data));
            // $('#pagination').html(paginationView);
        });
    }
    //Вызываем функцию заполнения таблицы данными о заказах
    init();
});