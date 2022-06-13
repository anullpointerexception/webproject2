
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

var chosenTimes = [];

function calculateDuration(duration, time){
    var num = duration;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    var newHours = time.getHours() + rhours;
    var newMinutes = String(time.getMinutes() + rminutes).padStart(2, '0');
    var endDate = newHours + ":" + newMinutes;
    return endDate;
}

function addItem(){
   
    if($('#newTimeSlotDate').val().length === 0){
        alert("Please fill out the timeslot fields!");
    } else {
        let chosenTimeSlot = $('#newTimeSlotDate').val();
        chosenTimes.push(chosenTimeSlot);
        $('#timeslots').append("<li>" + chosenTimeSlot + "</li>");
        $("li:last-of-type").hide().slideDown();
        $('#chosenHour').val("");
        $('#chosenMin').val("");
    }
}


function addNewAppointment(){   

            var chosenTimesLength = chosenTimes.length;

            if(chosenTimesLength > 0){
                var appointmentObject= $('#appointmentCreateNew').serializeJSON();

                delete appointmentObject["chosenHour"];
                delete appointmentObject["chosenMin"];
                delete appointmentObject["chosenYear"];
                delete appointmentObject["chosenMonth"];
                delete appointmentObject["chosenDay"];



                var mySQLDate = appointmentObject["expirationDate"];




                appointmentObject.expirationdate = mySQLDate;

                delete appointmentObject["day"];
                delete appointmentObject["month"];
                delete appointmentObject["year"];
                delete appointmentObject["hour"];
                delete appointmentObject["min"];

                $.ajax({
                    type: 'POST',
                    url: "../backend/serviceHandler.php?method=addAppointment",
                    cache: false,
                    dataType: "json",
                    data: JSON.stringify(appointmentObject),
                    success: function (response){

                        var timeslot = {};

                        var timeSlotArray = [];


                        for(var s = 0; s < chosenTimesLength; s++){
                                timeslot.appointmentid = response.id;
                                timeslot.termin = chosenTimes[s];
                                timeSlotArray.push({...timeslot});
                        }
                        console.log("Hello");
                        console.log(timeSlotArray[0]);
                        for(var x = 0; x < chosenTimesLength; x++){
                            $.ajax({
                                type: "POST",
                                url: "../backend/serviceHandler.php?method=addChoice",
                                cache: false,
                                dataType: "json",
                                data: JSON.stringify(timeSlotArray[x]),
                                success: function(response){
                                    alert("Appointment successfully created!");
                                    location.reload();
                                },
                                error: function(error){
                                    console.log(error);
                                }
                            })
                        }


                    },
                    error: function(error){
                        console.log(error);
                    }
            });
        } else {
            console.log("Not enough timeslots present");

        }
        return false;
}

function loadVoteDetails(id){
    // to remove 'button' from id;
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

                    console.log(li);
   
                    $('.list-group').append("<li class='list-group-item d-flex justify-content-between align-items-center'>\
                    <div class='form-check'>\
                    <input class='form-check-input' name='terminid' type='radio' value='"+li["id"]+"' id='flexCheckDefault'>\
                    <label class='form-check-label darkFont' for='flexCheckDefault'>\
                    <i class='fa-solid fa-clock'></i>\
                    "+ dateOfAppointment.getHours() + ":" + minutes + " - " + endOfAppointment + "</label>\
                    </div>\
                    <span class='badge rounded-pill design'>"+ dateOfAppointment.getDate() + " / " + dateOfAppointment.getMonth() + " / " + dateOfAppointment.getFullYear() + "</span>\
                    </li>");

                })
                $('#appointmentCreateModal').modal('show');
                $('form').on('submit', function(){
                    var userChoice = $('form').serializeJSON();

                    delete userChoice["newTimeSlotDate"];
                    delete userChoice["duration"];
                    delete userChoice["expirationDate"];
                    delete userChoice["location"];
                    delete userChoice["title"];

                    console.log(userChoice);

                    $.ajax({
                        type: "POST",
                        url: "../backend/serviceHandler.php?method=addUserChoice",
                        cache: false,
                        dataType: "json",
                        data: JSON.stringify(userChoice),
                        success: function(response){
                            alert("Voting successful!");
                            location.reload();
                        },
                        error: function(error){
                            console.log(error);
                        }
                    });
                            
                    return false;
                });    
        }
    });

}
function groupBy(list, keyGetter) { // um die User zu den jeweiligen Terminen im Carousel zu gruppieren -> user mit der gleichen appointmentid werden in einem Carousel gruppiert. 
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
    var users = [];
    var paramID = parseInt(id.replace("div", ""));
    $('#accordion').children().remove();
    $('.errorDiv').children().remove();

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


            $('#headerModalNormal').text(result[0].title);
            $('#durationModalNormal').html("<i class='fa-solid fa-clock'></i> " + result[0].duration + " Minutes");
            $('#locationModalNormal').html("<i class='fa-solid fa-location-pin'></i> " + result[0].location);
            $('#titleModalNormal').html("<i class='fa-solid fa-diamond'></i> " + result[0].title);
            
            var currentDate = new Date();

            var dbExpirationDate = result[0].expirationdate;

            console.log(result[0].expirationdate);

            var s = dbExpirationDate.split(/[- :]/);

            var expirationdate = new Date(s[0], s[1], s[2], s[3], s[4], s[5]);

            if(currentDate > expirationdate){
                $('#statusModalNormal').html("<i class='fas fa-vote-yea'></i> Voting: closed <i class='fa-solid fa-lock'></i>");
            } else {
                $('#statusModalNormal').html("<i class='fas fa-vote-yea'></i> Voting: open <i class='fa-solid fa-lock-open'></i>");
            }

        }
    });
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        async: true,
        data: {
            method: "getAppointmentDetails_withUC",
            param: paramID
        },
        dataType: "json",
        success: function(result){
            $.each(result, function(x, user){
                users.push(user);
            });

            const grouped = groupBy(users, userX => userX.terminid);
                        
            for (var i = 0; i < grouped.size; i++) {
                
                var x = users[i].terminid;

                var userByGroup = grouped.get(x);

                var termin = userByGroup[0]["termin"].split(/[- :]/);

                var dateOfAppointment = new Date(termin[0], termin[1], termin[2], termin[3], termin[4], termin[5]);

                var endOfAppointment = calculateDuration(userByGroup[0]["duration"], dateOfAppointment);

                const minutes = String(dateOfAppointment.getMinutes()).padStart(2, '0');

                // Wir benützen das accordionChild um das HTML Gerüst vor dem Anhängen an accordion aufzubauen.
                // Brauchen wir deswegen, weil ansonsten das Browser-DOM div-Tags schließt, bevor die Loop beendet ist. => Wollen wir nicht. 
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

                    if(container === 0){
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
                accordionChild += "</a></div></div></div></div><br>";
                $('#accordion').append(accordionChild);
                $('.carousel').carousel()
            }
            
        },
        error: function(){

            $('.errorDiv').append("<p class='text-faded errorBox'>No current participants found!</p>");
        }
    });
    $('.delete-button').remove();
    $('.detailModal').append("<input type='button' id='delete"+paramID+"' class='btn btn-danger btn-lg btn-block delete-button' value='Delete appointment'>");
    $('.delete-button').on('click', function (){
                $.ajax({
                    type: 'DELETE',
                    url: "../backend/serviceHandler.php?method=deleteAppointment&param="+paramID+"",
                    cache: false,
                    success: function (result){
                        console.log("Removed successfully!");
                        setInterval('location.reload()', 7000);
                    }
                });
    });
    $('#appointmentModal').modal('show');
}

function loadAppointments(){
    var counter = 0;
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
            if(counter === 0){
                ('#inner').append('<div><h5>No current Appointments</h5></div>');
            } else {
            var currentDate = new Date();

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
                        var termin = appointments[item]["expirationdate"].split(/[- :]/);
                        var expirationdate = new Date(termin[0], termin[1], termin[2], termin[3], termin[4], termin[5]);

                        var td = document.createElement('td');
                        if(currentDate > expirationdate){
                            td.setAttribute('class', "calendar-widget closed");
                            var button = document.createElement("button");
                            button.setAttribute("class", "btn btn-default btn-xl");
                            button.setAttribute("type", "button");
                            button.setAttribute("id", "button" + appointments[item]["id"]);
                            button.innerHTML = "Expired <i class='fa-solid fa-x'></i></i>";

                        } else {
                            td.setAttribute('class', "calendar-widget open");
                            var button = document.createElement("button");
                            button.setAttribute("class", "btn btn-default btn-xl createAppoint");
                            button.setAttribute("type", "button");
                            button.setAttribute("id", "button" + appointments[item]["id"]);
                            button.innerHTML = "Vote <i class='fa-solid fa-check-to-slot'></i>";
                        }

                        td.setAttribute('id', 'calendar-widget' + item);

                        var div = document.createElement('div');

                        div.setAttribute("class", "calendar-widget-content");
                        div.setAttribute("id", "div" + appointments[item]["id"]);

                        const minutes = String(expirationdate.getMinutes()).padStart(2, '0');


                        div.innerHTML = "<br>Expires @ " + expirationdate.getDate() + "." +  expirationdate.getMonth() + "." + expirationdate.getFullYear() + " " + expirationdate.getHours() + ":" + minutes + "<br><br>";

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
                        var termin = appointments[item]["expirationdate"].split(/[- :]/);
                        var expirationdate = new Date(termin[0], termin[1], termin[2], termin[3], termin[4], termin[5]);

                        var td = document.createElement('td');
                        if(currentDate > expirationdate){
                            td.setAttribute('class', "calendar-widget closed");
                            var button = document.createElement("button");
                            button.setAttribute("class", "btn btn-default btn-xl");
                            button.setAttribute("type", "button");
                            button.setAttribute("id", "button" + appointments[item]["id"]);
                            button.innerHTML = "Expired <i class='fa-solid fa-x'></i></i>";

                        } else {
                            td.setAttribute('class', "calendar-widget open");
                            var button = document.createElement("button");
                            button.setAttribute("class", "btn btn-default btn-xl createAppoint");
                            button.setAttribute("type", "button");
                            button.setAttribute("id", "button" + appointments[item]["id"]);
                            button.innerHTML = "Vote <i class='fa-solid fa-check-to-slot'></i>";
                        }

                        td.setAttribute('id', 'calendar-widget' + item);

                        var div = document.createElement('div');

                        div.setAttribute("class", "calendar-widget-content");
                        div.setAttribute("id", "div" + appointments[item]["id"]);

                        const minutes = String(expirationdate.getMinutes()).padStart(2, '0');

                        div.innerHTML = "<br>Expires @ " + expirationdate.getDate() + "." +  expirationdate.getMonth() + "." + expirationdate.getFullYear() + " " + expirationdate.getHours() + ":" + minutes + "<br><br>";


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
        }
        },
        error: function(error){
            console.log(error);
            ('#inner').append('<div><h5>No current Appointments</h5></div>');
        }
    
    })
}
