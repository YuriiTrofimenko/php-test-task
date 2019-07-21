/* В этом файле вы пишете js код вашего приложения */
document.addEventListener("DOMContentLoaded", function () {
	
	/*var xhr = new XMLHttpRequest();
	var body = 'init=';
	xhr.open("POST", '/', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
	  if (this.readyState != 4) return;
	  var resp = this.responseText;
	  // resp = JSON.parse(decodeURIComponent(JSON.stringify(resp)));
	  // console.log(resp);
	  $('.articles-list').append(resp.author);
	};
	xhr.send(body);*/

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
            console.log(data)
            //Готовим шаблон таблицы заказов при помощи библиотеки Hogan
            /* var template = Hogan.compile(
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
            );
            //Заполняем шаблон данными и помещаем на веб-страницу
            $('#table-container').html(template.render(data)); */
        });
    }
    //Вызываем функцию заполнения таблицы данными о заказах
    init();
});