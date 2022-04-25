
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

function calculateDuration(duration, time){

    var num = duration;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);

    console.log(rhours + " hours" + rminutes + " minutes");

    var newHours = time.getHours() + rhours;

    var newMinutes = String(time.getMinutes() + rminutes).padStart(2, '0');

    var endDate = newHours + ":" + newMinutes;
    return endDate;
}




function loadVoteDetails(id){

    // to remove 'button' from id;


    var paramID = parseInt(id.replace("div", ""));


    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {
            method: "getAppointmentDetails",
            param: paramID
        },
        dataType: "json",
        success: function(result){
                $('#sectionTitle').text(result[0].title);
                $('#createModalDuration').html("<i class='fa-solid fa-clock'></i> " + result[0].duration + " Minutes");
                $('#createModalLocation').html("<i class='fa-solid fa-location-pin'></i> " + result[0].location);
                $('#createModalTitle').html("<i class='fa-solid fa-diamond'></i> " + result[0].title);

                $.ajax({
                    type: "GET",
                    url: "../backend/serviceHandler.php",
                    cache: false,
                    data: {
                        method: "getAppointmentDetails_withUC",
                        param: result[0].id
                    },
                    dataType: "json",
                    success: function(res){
                        $('.list-group').children('.list-group-item').remove();
                        $.each(res, function(s, li){

                            var termin = li["termin"].split(/[- :]/);

                            var dateOfAppointment = new Date(Date.UTC(termin[0], termin[1]-1, termin[2], termin[3], termin[4], termin[5]));

                            const minutes = String(dateOfAppointment.getMinutes()).padStart(2, '0');

                            var endOfAppointment = calculateDuration(li["duration"], dateOfAppointment);
                        
                            $('.list-group').append("<li class='list-group-item d-flex justify-content-between align-items-center'>\
                            <div class='form-check'>\
                            <input class='form-check-input' name='appointmentNumber' type='checkbox' value='1' id='flexCheckDefault'>\
                            <label class='form-check-label darkFont' for='flexCheckDefault'>\
                            <i class='fa-solid fa-clock'></i>\
                             "+ dateOfAppointment.getHours() + ":" + minutes + " - " + endOfAppointment + "</label>\
                             </div>\
                             <span class='badge rounded-pill design'>"+ dateOfAppointment.getDate() + " / " + dateOfAppointment.getMonth() + " / " + dateOfAppointment.getFullYear() + "</span>\
                             </li>");
                            
                
                        })
                        $('#appointmentCreateModal').modal('show');
                        $('form').on('submit', function(){
                            var obj = $('form').serializeJSON()

                             console.log(obj);
                            
                             return false;
                         });

                    }

                    
                })
        }
    });


    



}

function loadAppointments(){
    var counter = 0;
    var items = 0;
    var container = 0;
    var item = 0;


    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
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
            if (result){
                var newCount = Math.trunc(n) + 1; 
            } else {
                var newCount = n;
            }

            
            for(var i = 0; i < newCount; i++){
                if((counter - 3) > 0){
                    var limit = 3;
                } else {
                    var limit = counter;
                }
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
                    
                    for(var j = 0; j < limit; j++){
                        var th = document.createElement('th');
                        th.setAttribute("class", "calendar-item");
                        th.innerHTML = appointments[item]["title"];
                        th.setAttribute("id", "th" + appointments[item]["id"]);
                        
                        tableTop.appendChild(th);

                        var td = document.createElement('td');

                        td.setAttribute('class', "calendar-widget open");

                        td.setAttribute('id', 'calendar-widget' + item);

                        var div = document.createElement('div');

                        div.setAttribute("class", "calendar-widget-content");
                        div.setAttribute("id", "div" + appointments[item]["id"]);

                        //div.appendChild(br);
                        //div.appendChild(divTextNode);
                        div.innerHTML = "<br>" + appointments[item]["expirationdate"] + "<br><br>";

                        var button = document.createElement("button");
                        button.setAttribute("class", "btn btn-default btn-xl createAppoint");
                        button.setAttribute("type", "button");
                        button.setAttribute("id", "button" + appointments[item]["id"]);
                        button.innerHTML = "Vote <i class='fa-solid fa-check-to-slot'></i>";
                        var br = document.createElement("br");
                        var br2 = document.createElement("br");

                        td.appendChild(div);
                        td.appendChild(button);
                        td.appendChild(br);
                        td.appendChild(br2);
                        tr.appendChild(td);

                        item++;
                    }
                    table.appendChild(tableTop);
                    table.appendChild(tableBody);
                    citem.appendChild(table);
                    $('#inner').append(citem);
                    container++;
                    counter = counter - limit;
                } else {

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

                        var th = document.createElement('th');
                        th.setAttribute("class", "calendar-item");
                        th.innerHTML = appointments[item]["title"];

                        th.setAttribute("id", "th" + appointments[item]["id"]);
                        
                        tableTop.appendChild(th);

                        var td = document.createElement('td');

                        td.setAttribute('class', "calendar-widget open");
                        td.setAttribute('id', 'calendar-widget' + item);

                        var div = document.createElement('div');
                        div.setAttribute("class", "calendar-widget-content");
                        div.setAttribute("id", "div" + appointments[item]["id"]);

                        div.innerHTML = "<br>" + appointments[item]["expirationdate"] + "<br><br>";

                        var button = document.createElement("button");
                        button.setAttribute("class", "btn btn-default btn-xl createAppoint");
                        button.setAttribute("type", "button");
                        button.setAttribute("id", "button" + appointments[item]["id"]);

                        button.innerHTML = "Vote <i class='fa-solid fa-check-to-slot'></i>";
                        var br = document.createElement("br");
                        var br2 = document.createElement("br");

                        td.appendChild(div);
                        td.appendChild(button);
                        td.appendChild(br);
                        td.appendChild(br2);

                        tr.appendChild(td);

                        item++;
                    }
                    table.appendChild(tableTop);
                    table.appendChild(tableBody);
                    citem.appendChild(table);
                    $('#inner').append(citem);
                    counter = counter - limit;
                    container++;
                }
            }

           

        },
        error: function(error){
            console.log(error);
        }
    })

}
