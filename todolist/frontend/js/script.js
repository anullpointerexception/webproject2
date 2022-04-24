
(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );


    // Initialize WOW.js Scrolling Animations
    new WOW().init();

})(jQuery);

const appointments = [];

function loadAppointments(){
    var counter = -1;
    var items = 0;
    var container = 0;
    var item = 0;

    $.ajax({
        type: "GET",
        url: "../../todolist/backend/serviceHandler.php",
        cache: false,
        data: {
            method : "getAllAppointments"
        },
        dataType: "json",
        success: function (result){
            
            $.each(result, function (k,v){
                appointments.push(v);
                counter++;
            });

            // bisschen mathematik um den Count für die Tabelle zu ermitteln
            // Bedeutet: Falls die Division durch 3 einen Rest ergibt soll der integer part der anzahl genommen werden und + 1 addiert werden, damit auch keine
            // Datensätze fehlen.
            
            var n = counter / 3;
            var result = (n - Math.floor(n)) !== 0; 
            console.log("n = " + n);
            if (result){
                var newCount = Math.trunc(n) + 1; 
            } else {
                var newCount = n;
            }
            
            if((counter - 3) > 0){
                var limit = 3;
            } else {
                var limit = counter;
            }


            for(var i = 0; i < newCount; i++){
                if(container == 0){
                    var citem = document.createElement('div');
                    citem.setAttribute("class", "carousel-item active");
                    var table = document.createElement("table");
                    table.setAttribute("width", "100%");
                    var tableTop = document.createElement('thead');
                    tableTop.setAttribute("id", "calendar-top" + container);
                    tableTop.setAttribute("class", "calendar-top");
                    var tableBody = document.createElement('tbody');
                    tableBody.setAttribute("id", "calendar-body" + container);
                    var tr = document.createElement('tr');
                    tr.setAttribute('class',"calendar-widgets");
                    tableBody.appendChild(tr);
                    
                    console.log("Limit: " + limit);

                    for(var j = 0; j < limit; j++){
                        if(item <= counter){
                        
                        var th = document.createElement('th');
                        th.setAttribute("class", "calendar-item");
                        var thtext = document.createTextNode(appointments[item]["title"]);
                        th.setAttribute("id", "th" + appointments[item]["id"]);
                        
                        th.appendChild(thtext);
                        tableTop.appendChild(th);

                        var td = document.createElement('td');
                        td.setAttribute('class', "calendar-widget open");
                        td.setAttribute('id', 'calendar-widget' + item);
                        var div = document.createElement('div');
                        div.setAttribute("class", "calendar-widget-content");
                        var divTextNode = document.createTextNode(appointments[item]["expirationdate"]);
                        div.appendChild(divTextNode);
                        td.appendChild(div);
                        tr.appendChild(td);
                        item++;
                        } else {
                            break;
                        }
                    }
                    table.appendChild(tableTop);
                    table.appendChild(tableBody);
                    citem.appendChild(table);
                    $('#inner').append(citem);
                    container++;
                } else {
                    console.log("Limit: " + limit);

                    var citem = document.createElement('div');
                    citem.setAttribute("class", "carousel-item");
                    var table = document.createElement("table");
                    table.setAttribute("width", "100%");
                    var tableTop = document.createElement('thead');
                    tableTop.setAttribute("id", "calendar-top" + container);
                    tableTop.setAttribute("class", "calendar-top");
                    var tableBody = document.createElement('tbody');
                    tableBody.setAttribute("id", "calendar-body" + container);
                    var tr = document.createElement('tr');
                    tr.setAttribute('class',"calendar-widgets");
                    tableBody.appendChild(tr);
                    for(var j = 0; j < limit; j++){
                        console.log(item);
                        if(item <= counter){
                        
                            var th = document.createElement('th');
                            th.setAttribute("class", "calendar-item");
                            var thtext = document.createTextNode(appointments[item]["title"]);
                            th.setAttribute("id", "th" + appointments[item]["id"]);
                        
                            th.appendChild(thtext);
                            tableTop.appendChild(th);

                            var td = document.createElement('td');
                            td.setAttribute('class', "calendar-widget open");
                            td.setAttribute('id', 'calendar-widget' + item);
                            var div = document.createElement('div');
                            div.setAttribute("class", "calendar-widget-content");
                            var divTextNode = document.createTextNode(appointments[item]["expirationdate"]);
                            div.appendChild(divTextNode);
                            td.appendChild(div);
                            tr.appendChild(td);
                            item++;
                        } else {
                            break;
                        }
                    }
                    table.appendChild(tableTop);
                    table.appendChild(tableBody);
                    citem.appendChild(table);
                    $('#inner').append(citem);
                    container++;
                }
            }

        },
        error: function(error){
            console.log(error);
        }
    })

}
