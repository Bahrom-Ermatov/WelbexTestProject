let tableData;
let rowOnPage = 3; //Количество строк, которая будет отображаться в одной странице
let activePage = 1; //Активная страница
let showPages = 3; //Количество кнопок пагинации которая будет отображаться
let cntPageBySide = 1; //Количество кнопок в каждой из сторон активной кнопки
let sortedColumnId = ""; //Колонка по которому идет сортировка
let sortedColumnText = ""; //Колонка по которому идет сортировка
let sortRoute = 0; //Направление сортировки


leftSidePage = 1;   //Самая левая кнопка которая будет отображаться
rightSidePage = 1; //Самая правая кнопка которая будет отображаться

//Объявляем переменные для фильтрации
let SelectColumnVal = 0;
let SelectConditionVal = 0;
let InputTextVal = "";

//Формируем данные в таблице
tableDataForm(activePage, SelectColumnVal, SelectConditionVal, InputTextVal);

//Создаем кнопки пагинации
drawPagination ();


//Нажатие кнопок сортировки
$("#table thead tr th").not("#thDate").on("click", function() {

    //Рисуем стрелочки
    if (!sortedColumnId) {
        sortRoute = 1;
        sortedColumnText = $(this).text();
        sortedColumnId = this.id;
        $(this).text(sortedColumnText + " ↑").html();
    } else if (this.id == sortedColumnId) {
        if (sortRoute == 1) {
            sortRoute = -1;
            $(this).text(sortedColumnText + " ↓").html();
        } else {
            sortRoute = 1;
            $(this).text(sortedColumnText + " ↑").html();
        }
    } else if (this.id != sortedColumnId) {
        console.log("okk");
        $("#" + sortedColumnId).text(sortedColumnText);
        sortRoute = 1;
        sortedColumnText = $(this).text();
        sortedColumnId = this.id;
        $(this).text(sortedColumnText + " ↑").html();
        
    }

    //Сортируем данные
    if (sortRoute==1) {
        if (this.id=="thName") {
            tableData.sort((a, b) => (a.name > b.name) ? 1 : -1);
        } else if (this.id=="thCount") {
            tableData.sort(function (a, b) {return a.count - b.count;});
        } else if (this.id=="thDistance") {
            tableData.sort(function (a, b) {return a.distance - b.distance;});
        }    
    } else {
        if (this.id=="thName") {
            tableData.sort((a, b) => (a.name < b.name) ? 1 : -1);
        } else if (this.id=="thCount") {
            tableData.sort(function (a, b) {return b.count - a.count;});
        } else if (this.id=="thDistance") {
            tableData.sort(function (a, b) {return b.distance - a.distance;});
        }    
    }

    //Рисуем таблицу
    drawTable(tableData);
});



//Выбор колонки фильтра
$("#SelectColumn").change(function() {
    SelectColumnVal = $("#SelectColumn option:selected").attr("value");

    if (SelectColumnVal != "0" && SelectConditionVal != "0") {
            getFilteredData(SelectColumnVal, SelectConditionVal, InputTextVal);
    }
});


//Выбор условия фильтра
$("#SelectCondition").change(function() {
    SelectConditionVal = $("#SelectCondition option:selected").attr("value");

    if (SelectColumnVal != "0" && SelectConditionVal != "0") {
            getFilteredData(SelectColumnVal, SelectConditionVal, InputTextVal);
    }
});

//Изменение текста фильтра
$("input").change(function(){
    InputTextVal = $(this).val();

    if (SelectColumnVal != "0" && SelectConditionVal != "0") {
            getFilteredData(SelectColumnVal, SelectConditionVal, InputTextVal);
    }
});

//Функция для получения отфильтрованных данных
function getFilteredData (SelectColumnVal, SelectConditionVal, InputTextVal) {
    //Валидация данных

    //Условие "Содержит" можно задать только для поля "Название"
    if (SelectConditionVal ==2 && SelectColumnVal!=2) {
        alert('Фильтр задан неверно');
        $("input").focus();
        return;
    }

    //Если выбрана колонка "Количество" и "Расстояние"
    if ((SelectColumnVal == 3 || SelectColumnVal == 4)  && InputTextVal.length>0) {
        if(!Number(InputTextVal))
        {
            alert('Указаны неверные данные');
            $("input").focus();
            return;
        }
    }

    //Если выбрана колонка "Дата"
    if (SelectColumnVal == 1 && InputTextVal.length>0) {
        if(isNaN(Date.parse(InputTextVal)))
        {
            alert('Указаны неверные данные');
            $("input").focus();
            return;
        }
    }

    //Если выбрана колонка "Название"
    if (SelectColumnVal == 2  && InputTextVal.length>0) {
        let letters = /^[A-Za-zА-Яа-я ]+$/;
        res = letters.test(InputTextVal);
        if(!res)
        {
            alert('Указаны неверные данные');
            $("input").focus();
            return;
        }
    }
    
    //Формируем таблицу
    tableDataForm(activePage, SelectColumnVal, SelectConditionVal, InputTextVal);

    //Рисуем пагинацию
    drawPagination ();
}

//Функция для формирования данных в таблице
function tableDataForm(page_id, SelectColumnVal, SelectConditionVal, InputTextVal) {
    $("#table tbody").html("");
    $.ajax({
        url: "http://127.0.0.1:8000/data",
        method: "GET",
        data: { "page_id": page_id, 
                "rows_on_page" : rowOnPage, 
                "select_column_val" : SelectColumnVal, 
                "select_conditional_val" : SelectConditionVal,
                "input_text_val" : InputTextVal
            },
        success: function (data) {
            tableData = data.data;
            //Рисуем таблицу
            drawTable(tableData);
        }
    });
}

//Рисуем таблицу
function drawTable (tableData) {
    $("#table tbody").html("");
    for (let row of tableData) {
        $("#table tbody").append( "<tr><td>" + row.date+"</td><td>" + row.name + "</td><td>" + row.count + "</td><td>" + row.distance + "</td></tr>" );
     }

}


//Создаем кнопки пагинации
function drawPagination () {
    $("nav #pagination").html(
        "<li class='page-item disabled' id='li_previous'>\
            <span class='page-link'>Previous</span>\
        </li>\
        <li class='page-item active' id='li_1'>\
            <span class='page-link'>1</span>\
        </li>"
    );

    $.ajax({
        url: "http://127.0.0.1:8000/rowCount",
        method: "GET",
        data: { "select_column_val" : SelectColumnVal, 
                "select_conditional_val" : SelectConditionVal,
                "input_text_val" : InputTextVal
            },
        success: function (data) {
            rowCount = data.rowCount;
            cntOfpage = Math.ceil(rowCount / rowOnPage) //Вычисляем количество страниц
            rightSidePage = Math.min(showPages, cntOfpage); //Самая правая кнопка которая будет отображаться

            for (let i = 2; i <= cntOfpage; i++) {
                $("nav #pagination").append("<li class='page-item' id='li_" + i + "'><a class='page-link' href='#'>" + i + "</a></li>"); 

                if (i > showPages) {
                    $("#li_" + i).css("display", "none");
                }
            }
            $("nav #pagination").append(
                "<li class='page-item' id='li_next'>\
                    <a class='page-link' href='#'>Next</a>\
                </li>"
            );
            
            if (cntOfpage==1) {
                $("#li_next").html("<span class='page-link'>Next</span>");
                $("#li_next").attr("class", "page-item disabled");
            }

            $("li").on("click", function() {
                clickPagination (this);
            });

        }
    });
}


//Событие нажатия кнопки пагинации
function clickPagination (el) {
    if (el.id == "li_previous" && activePage == 1) {
        return;
    }

    if (el.id == "li_next" && activePage == cntOfpage) {
        return;
    }

    if (el.id == "li_previous") {
        newPage = activePage - 1;
    } else if (el.id == "li_next") {
        newPage = activePage + 1;
    } else {
        newPage = Number(el.id.substr(3));

        if (newPage==activePage) {
            return;
        }
        elem = el;
    }

    //Обновляем данные в таблице
    tableDataForm(newPage, SelectColumnVal, SelectConditionVal, InputTextVal);

    //Обновляем кнопки пагинации
    RefreshPagination (activePage, newPage);

    activePage = newPage;
}


function RefreshPagination (oldPage, newPage) {
    //Отмечаем нажатую кнопку как активный
    $("#li_" + newPage).html("<span class='page-link'>"+ newPage +"</span>");
    $("#li_" + newPage).attr("class", "page-item active");

    //Убираем отметку активности с предыдущей кнопки
    $("#li_" + oldPage).html("<a class='page-link' href='#'>" + oldPage + "</a>");
    $("#li_" + oldPage).attr("class", "page-item");

    //Делаем неактиной кнопку "Previous" при выборе первой страницы
    if (newPage == 1) {
        $("#li_previous").html("<span class='page-link'>Previous</span>");
        $("#li_previous").attr("class", "page-item disabled");
    }

    //Делаем неактиной кнопку "Next" при выборе последней страницы    
    if (newPage==cntOfpage) {
        $("#li_next").html("<span class='page-link'>Next</span>");
        $("#li_next").attr("class", "page-item disabled");
    }

    //Делаем актиной кнопку "Previous" если предыдущая страница была 1
    if (oldPage == 1) {
        $("#li_previous").html("<a class='page-link' href='#'>Previous</a>");
        $("#li_previous").attr("class", "page-item");
    }

    //Делаем актиной кнопку "Next" если предыдущая страница была последней
    if (oldPage==cntOfpage) {
        $("#li_next").html("<a class='page-link' href='#'>Next</a>");
        $("#li_next").attr("class", "page-item");
    }

    //Обновляем видимость кнопок
    newLeftSidePage = newPage - cntPageBySide;
    newRightSidePage = newPage + cntPageBySide;

    if (newRightSidePage > cntOfpage) {
        newRightSidePage = cntOfpage;
        newLeftSidePage = cntOfpage - showPages + 1;
    }

    if (newLeftSidePage < 1) {
        newLeftSidePage = 1;
        newRightSidePage = showPages;
    }

    //Делаем видимыми кнопки расположенные слева
    for (let i = newLeftSidePage; i < newPage; i++) {
        $("#li_" + i).css("display", "inline");
    }

    //Делаем видимыми кнопки расположенные справа
    for (let i = newPage + 1; i <= newRightSidePage; i++) {
        $("#li_" + i).css("display", "inline");
    }

    //Делаем невидимыми остальные кнопки расположенные слева
    if (newPage > oldPage) {
        for (let i = leftSidePage; i < newLeftSidePage; i++) {
            $("#li_" + i).css("display", "none");
        }
    }

    //Делаем невидимыми остальные кнопки расположенные слева
    if (newPage < oldPage) {
        for (let i = newRightSidePage + 1; i <= rightSidePage; i++) {
            $("#li_" + i).css("display", "none");
        }
    }

    leftSidePage = newLeftSidePage;
    rightSidePage = newRightSidePage;
}




