
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
const users = [];

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

    // to remove 'div' from id;

    var paramID = parseInt(id.replace("button", ""));

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
                $('.list-group').children('.list-group-item').remove();

                $.each(result, function(s, li){


                    var termin = li["termin"].split(/[- :]/);

                    var dateOfAppointment = new Date(termin[0], termin[1], termin[2], termin[3], termin[4], termin[5]);

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
    });

}
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

function loadAppointmentsWithChoices(id){

    var paramID = parseInt(id.replace("div", ""));

    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {
            method: "getAppointmentDetails_withUC",
            param: paramID
        },
        dataType: "json",
        success: function(result){
            $('#headerModalNormal').text(result[0].title);
            $('#durationModalNormal').html("<i class='fa-solid fa-clock'></i> " + result[0].duration + " Minutes");
            $('#locationModalNormal').html("<i class='fa-solid fa-location-pin'></i> " + result[0].location);
            $('#titleModalNormal').html("<i class='fa-solid fa-diamond'></i> " + result[0].title);

            $.each(result, function(x, user){
                users.push(user);
            });
            const grouped = groupBy(users, userX => userX.terminid);
            $('#accordion').children().remove();
            console.log("groupby Length: " + groupBy.length);

            for (i = 1; i <= groupBy.length; i++) {

                var userByGroup = grouped.get(i);


                console.log("Users: ");
                console.log(userByGroup);

                var termin = userByGroup[0]["termin"].split(/[- :]/);

                var dateOfAppointment = new Date(termin[0], termin[1], termin[2], termin[3], termin[4], termin[5]);

                var endOfAppointment = calculateDuration(userByGroup[0]["duration"], dateOfAppointment);

                const minutes = String(dateOfAppointment.getMinutes()).padStart(2, '0');

                // Using += method to prepare the html code before appending it to the accordion
                // This is needed since some divs get closed automatically by the DOM before the loop is finished.
                var accordionChild = "<div class='card'>";
                accordionChild += "<div class='card-header' id='heading"+i+"'>";
                accordionChild += "<h5 class='mb-0'>"
                accordionChild += "<button class='btn btn-link' data-toggle='collapse' data-target='#collapse"+i+"' aria-expanded='true' aria-controls='collapseOne'>";
                accordionChild +=  "Timeslot: " + dateOfAppointment.getHours() + ":" + minutes + " - " + endOfAppointment;
                accordionChild +=  "</button></h5></div>";
                accordionChild +=  "<div id='collapse"+i+"' class='collapse' aria-labelledby='headingOne' data-parent='#accordion'>";
                accordionChild +=  "<div class='card-body'><div id='carouselParticipantControls"+i+"' class='carousel slide' data-ride='carousel'><div class='carousel-inner' id='carousel-inner"+i+"'>"


                var container = 0;


                for(j = 0; j < userByGroup.length; j++){
                    console.log("Length: " + userByGroup.length)
                    console.log("Group " + i + ": " + userByGroup[j]['name']);
                    var carousel = '#carousel-inner'+i;

                    if(container === 0){
                        // $(carousel).append(
                        accordionChild += "<div class='carousel-item active'><table width='100%' class='section-heading primary'><thead><th>" + userByGroup[j]['name'] +"</th></thead><tbody><td>" + userByGroup[j]['comment'] + "</td></tbody></table></div>";
                        container++;

                    } else {
                        
                        accordionChild += "<div class='carousel-item'><table width='100%' class='section-heading primary'><thead><th>" + userByGroup[j]['name'] +"</th></thead><tbody><td>" + userByGroup[j]['comment'] + "</td></tbody></table></div>";
                        container++;

                    }
                    
                    

                }
                accordionChild += "</div>";
                accordionChild += "<a class='carousel-control-prev indicatorsBlack' href='#carouselParticipantControls"+i+"' role='button' data-slide='prev'>";
                accordionChild += "<span class='carousel-control-prev-icon' aria-hidden='true'></span>";
                accordionChild += "<span class='sr-only darkFont'>Previous</span>";
                accordionChild += "</a>";
                accordionChild += "<a class='carousel-control-next indicatorsBlack' href='#carouselParticipantControls"+i+"' role='button' data-slide='next'>";
                accordionChild += "<span class='carousel-control-next-icon' aria-hidden='true'></span>";
                accordionChild += "<span class='sr-only darkFont'>Next</span>";
                accordionChild += "</a></div></div></div></div>";
                $('#accordion').append(accordionChild);

                
                $('.carousel').carousel()


            } 






            $('#appointmentModal').modal('show');



        }

    })
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
