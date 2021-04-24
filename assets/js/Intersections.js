//valiable
var geoJSON = L.geoJSON([]);
const Slider = document.getElementById('slider-date');
var geoJSONlayers = {};
var targetIntersection= {};

// var map = L.map('mapid').setView([8.75,42.19], 3);
const map = L.map('mapid').setView([51.505, -0.09], 4);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 4,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    mixZoom: 4,
}).addTo(map);


 

// Create a new date from a string, return as a timestamp.
/**
 * @param string 
 * @return int
 */
function timestamp(str) {
    if(typeof str === 'number') {
        str += "";
    }
    return parseInt(new Date(str).getTime());
}

/**
 * 
 * @param int
 * @return  string // "m YYYY"
 */
function convertTimestamp(milliseconds) {
    return new Date(parseInt(milliseconds)).toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric'
    });
}

/**
 *
 * @param int
 * @return  string // "m YYYY"
 */
function convertTimestampNumber(date) {
    var date = new Date(date);

    var year = date.getFullYear();
    if(year === undefined || isNaN(year) ){
        return undefined;
    }
    var month = date.getMonth();
    
    if(month === undefined){
        month = "0";
    }

    date = year + "" + ("0" + (month + 1)).slice(-2);
    return parseInt(date);
}

/* ========================================================================
*
* ========================================================================
*/

//init slider range
$(function () {
    // slider range
    const range_all_sliders = {
        'min': [timestamp(minDateRange)],
        "8.333333333%": [timestamp(minDateRange + 10)],
        "16.6667%": [timestamp(minDateRange + 20)],
        "25%": [timestamp( minDateRange + 30)],
        "33.3333%": [timestamp( minDateRange + 40)],
        "41.6667%": [timestamp(minDateRange + 50)],
        "50%": [timestamp(minDateRange + 60)],
        "58.3333%%": [timestamp(minDateRange + 70)],
        "66.6667%": [timestamp(minDateRange + 80)],
        "75%": [timestamp(minDateRange + 90)],
        "83.3333%": [timestamp(minDateRange + 100)],
        "91.6667%": [timestamp(minDateRange + 110)],
        'max': [timestamp(minDateRange + 120)]
    }

    //create a slider
    noUiSlider.create(Slider, {
        range: range_all_sliders,
        orientation: 'vertical',
        connect: true,
        // Two more timestamps indicate the handle starting positions.
        start: [range_all_sliders.min, range_all_sliders.max],
        behaviour: 'tap',
        pips: {
            mode: 'range',
            density: 12
        },
    });


    // date minisecound to year "YYYY" // 2000
    $(".noUi-value").each(function () {
        try {
            $(this).html(
                new Date(parseInt($(this).html()))
                    .toLocaleDateString('en-GB', { year: 'numeric' })
            );
        } catch (error) {
            // console.log("invalid date");
        }
    });

    // remoev marker
    $(".noUi-marker-vertical").each(function () {
        $(this).remove();
    });

    // fixed top spacing issue
    $(".noUi-handle-lower").css('top', '-12px');

    currentIntersection();
    InsertLayout()

    // currentIntersection();

    // set start point and end point
    Slider.noUiSlider.on('update', function (values, handle) {
        var date = new Date(parseInt(values[handle]))
            .toLocaleDateString('default', {
            month: 'short',
            year: 'numeric'
        })
        if (handle) {
            $('.date-start').html(date);
        } else {
            $('.date-end').html(date);
        }
    });


    Slider.noUiSlider.on('change', function () {

        currentIntersection();
        removeGeoJSONlayout();
        InsertLayout();
    });

    

});

function currentIntersection() {

    var value = Slider.noUiSlider.get();
    var start_date = convertTimestampNumber(parseInt(value[0]));
    var end_date = convertTimestampNumber(parseInt(value[1]));

    var intersectionTemp = intersectionData;

    for (let key in intersectionTemp) {
        // end_date > dataIndex &&
        for (var PlaceKey in intersectionTemp[key]) {
            for (let authorKey in intersectionTemp[key][PlaceKey]) {

                if(targetIntersection[PlaceKey] === undefined){
                    targetIntersection[PlaceKey] = [];
                }

                var authPlace = intersectionTemp[key][PlaceKey][authorKey]['PlaceID'];
                var authorEnd = convertTimestampNumber(intersectionTemp[key][PlaceKey][authorKey]['EndDate']);
                var authorStart = convertTimestampNumber(intersectionTemp[key][PlaceKey][authorKey]['StartDate']);

                // console.dir( authorEnd + " = " + end_date);
                if( authorEnd < end_date && PlaceKey === authPlace 
                    || authorEnd === undefined && PlaceKey === authPlace ){

                        targetIntersection[PlaceKey].push(intersectionTemp[key][PlaceKey][authorKey]);   
                        delete  intersectionTemp[key][PlaceKey][authorKey];
                            
                        if(authorStart < start_date ){
                            
                        }
                    }
                }
        }    
    }

    for (const key in targetIntersection) {
        // remove array empty 
        if (targetIntersection[key].length === 0) {
            delete targetIntersection[key];
        }
    }

    // console.dir(targetIntersection);

    return targetIntersection;
}

var continentDataTarget = continentData;

// var continentDataTarget = continentData;
function InsertLayout() {

    function onEachFeature(feature, layer) {


        var latlng = layer._latlng;

        // var d=  L.circle(latlng, 70000, {
        //     color: 'red',
        //     fillColor: '#f03',
        //     fillOpacity: 0.5
        // }).addTo(map).bindPopup("I am a circle.");

        // console.log(d);


        // var layers = {};
        //
        // var index  = feature['id'];
        // layers.push(Intersections.prototype.Layers);
        //
        // Intersections.prototype.Layers = layers;
        // console.log(layers);

        // [feature['id']] = layer;
    }



    L.geoJSON(continentDataTarget, {

        pointToLayer: function (feature, latlng) {

            var users = getIntersectionUsers(feature.properties.PlaceID);
            if( Object.keys(users).length == 0){
                return false;
            }
            var likes = getMaxLikelihood(users);

            if(likes[3] != 0){
                var layer3 =  L.circle(latlng, 50000, {
                    radius: 8,
                    className: "point_03"
                });
                geoJSONlayers[parseInt(3 + ""+ feature['id'])] = layer3;
                layer3.on('click', function(e){

                    $(e.target._path).parent().find(".focus_point").removeClass("focus_point");
                    $(e.target._path).addClass("focus_point");

                    showAuthors(feature);
                });
                layer3.addTo(map);
            }

            // $( "#mapid" ).on( "click", "path.leaflet-interactive", function() {
            //     $(this).parent().find('.focus_point').removeClass('focus_point');
            // });

            if(likes[2] != 0){
                var layer2 =  L.circle([latlng.lat, latlng.lng+.01], 70000, {
                    radius: 8,
                    className: "point_02"
                });
                geoJSONlayers[parseInt(2 + ""+ feature['id'])] = layer2;
                layer2.on('click', function(e){

                    $(e.target._path).parent().find(".active").removeClass("active");
                    $(e.target._path).addClass("active");

                    showAuthors(feature);
                });
                layer2.addTo(map);
            }

            if(likes[1] != 0){
                var layer1 =  L.circleMarker([latlng.lat, latlng.lng +.02], 90000, {
                    radius: 8,
                    className: "point_01"
                });
                layer1.on('click', function(e){
                    
                    $(e.target._path).parent().find(".focus_point").removeClass("focus_point");
                    $(e.target._path).addClass("focus_point");
                    showAuthors(feature);
                });
                geoJSONlayers[parseInt(1 + ""+ feature['id'])] = layer1;
                layer1.addTo(map);
            }

            return false;

        },
        onEachFeature: onEachFeature,
    }).addTo(map);
}

function getIntersectionUsers(placeID){
    
    var users = {};    
    var start_range = convertTimestampNumber(Slider.noUiSlider.get()[0]);
    var end_range = convertTimestampNumber(Slider.noUiSlider.get()[1]);
    

    var data = targetIntersection[placeID];


    if(data === undefined){
        return {};
    }
    var i = 0;
    for (const key in data) {
        //check start date
        var StartDate = convertTimestampNumber(data[key]['StartDate']);
        var EndDate = convertTimestampNumber(data[key]['EndDate']);
        

        // compre start range 
        if(start_range > StartDate){
            continue;
        } 

        // end date compre 
        if(data[key]['EndDate'] == ""){
            users[i] = data[key];
            i++;
        }
        
        if(end_range> EndDate){
            users[i] = data[key];
            i++;
        }

    }

    if(users === undefined || Object.keys(users).length ==0 ){
        return {};
    }
    return users;
}

// return void
function removeGeoJSONlayout() {

    for (let index in geoJSONlayers) {
        geoJSONlayers[index].remove();
    }
    $(".results .title").html("");
    $("#intersections-results").html("");
}

// show authors
function showAuthors(feature){

    var title = feature['properties']['city'] + ", " + feature['properties']['country'];
    var users = getIntersectionUsers(feature.properties.PlaceID);

    var html = "";
    var id = 1;
    for (const key in users) {

        var author_name = authorData[users[key].AuthorID];
        // start date
        var StartDate = "" + users[key].StartDate;
        // end date
        var EndDate =  "";
        if(users[key].EndDate !== ''){
            EndDate = "&nbsp;–&nbsp;" + users[key].EndDate;
        }

        html += '<div class="item id_'+id+'">'+ author_name +
                    '<div class="item_date">'+  StartDate + "" + EndDate + '</div>'+
                '</div>';
        id++;
    }


    $(".results .title").html(title);
    $("#intersections-results").html(html);
}


function getMaxLikelihood(users) {
    var like = {
        1: 0,
        2: 0,
        3: 0
    };
    
    for (const key in users) {

        switch (users[key].Likelihood) {
            case 1:
                like[1]++; 
                break;
            case 2:
                like[2]++;
                break;
            case 3:
                like[3]++;
                break;
        }
    }
    return like;
}

// remove legend popup
$(".legend").on('click', function () {
    $(this).fadeOut(300);
});



