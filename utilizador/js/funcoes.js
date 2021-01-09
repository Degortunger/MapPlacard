var $overlay = $('.overlay'),
  resize = true;
var map;
var service;
var pos;
var infowindow;
var placeLoc;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var contador = 0;
var markers = [];

function initialize() {

  var mapOptions = {
    zoom: 15
  };
  map = new google.maps.Map(document.getElementById('map'),
    mapOptions);
  directionsDisplay.setMap(map);

  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {

      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $('#findMe').data('pos', pos);
      var request = {
        location: pos,
        radius: 1000,

      };

      mylocation = new google.maps.Marker({
        map: map,
        position: pos,
        title: 'Está Aqui',
        icon: 'img/Marker_1.png',
        draggable: false,
        animation: google.maps.Animation.BOUNCE
      });

      map.setCenter(pos);
    }, function () {
      handleNoGeolocation(true);
    });

  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }


  carregarmarkers();
  carregarjogos();
}


google.maps.event.addDomListener(window, 'load', initialize);

$('#show').click(function () {

  $overlay.show();

  if (resize) {
    google.maps.event.trigger(map, 'resize');
    resize = false;
  }

});

$('.overlay-bg').click(function () {

  $overlay.hide();

});

$("#findMe").click(function () {
  var pos = $(this).data('pos'),
    markers = $(this).data('markers'), //trabalhar codigo ir buscar markers ao local storage em vez do places
    closest;

  if (!pos || !markers) {
    alert('pos or markers not set yet');
    return;
  }

  $.each(markers, function () {
    var distance = google.maps.geometry.spherical
      .computeDistanceBetween(this.getPosition(), pos);
    if (!closest || closest.distance > distance) {
      closest = {
        marker: this,
        distance: distance,


      }

    }
  });
  if (closest) {
    //closest.marker will be the nearest marker, do something with it
    //here we simply trigger a click, which will open the InfoWindow
    google.maps.event.trigger(closest.marker, 'click')


  }


  function drivingRoute(origin, destination, selectedMode) {


    var request = {
      origin: pos,
      destination: closest.marker.position,
      unitSystem: google.maps.UnitSystem.METRIC,
      travelMode: google.maps.TravelMode[selectedMode]

    };



    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        $('#directionsPanel').empty();
        var total = Math.round(response.routes[0].legs[0].distance.value);
        var distanceText = total + ' metros';
        var totalmins = (response.routes[0].legs[0].duration.value / 60);
        var totalminutos = Math.round(totalmins);
        var durationText = totalminutos + 'mins';
        $('p').text(distanceText);
        $('p2').text(durationText);
        directionsDisplay.setDirections(response);
      }
      var d = new Date();
      var dn = d.toLocaleTimeString('en-GB', {
        hour: "numeric",
        minute: "numeric"
      });
      var getlocal = ((d.getHours() * (3600)) + d.getMinutes() * (60));


      var hms = document.getElementById("time").value;
      var a = hms.split(':'); // split it at the colons
      var seconds = (+a[0]) * 3600 + (+a[1]) * 60;

      var tempo = ((seconds - getlocal) / 60);

      var comparar = tempo - totalminutos;


      if (comparar < 2) {
        alert("UPS JÁ NÃO VAIS A TEMPO")
      } else if (comparar >= 2 && comparar <= 5) {
        alert("COM JEITINHO AINDA LÁ CHEGAS")
      }
      else if (comparar > 5 && comparar <= 10) {
        alert("TENS TEMPO MAS APRESSA-TE")
      }
      else if (comparar > 10) {

        alert("PENSA BEM!! APOSTA EM GRANDE")

      }
      else {
        alert("NÃO TE ESQUEÇAS DA HORA DO ULTIMO JOGO")
      }

    });
  }
  $("#btn_driving").click(function () {


    selectedMode = "DRIVING";
    drivingRoute($('input[name=origin]').val(), $('input[name=destination]').val(), selectedMode);
  });


  $('#btn_walking').click(function () {


    selectedMode = "WALKING";
    drivingRoute($('input[name=value]').val(), $('input[name=destination]').val(), selectedMode);
  });

  $("#limparota").click(function () {
    directionsDisplay.setDirections({
      routes: []
    });
    $('p').text(null);
    $('p2').text(null);
  });
});

var contador = 0;
var map;

function carregarmarkers() {

  var xmlString1 = localStorage.getItem("Contador");
  if (!xmlString1) return;

  var parser1 = new DOMParser();

  var doc1 = parser1.parseFromString(xmlString1, "text/xml");

  contador = parseInt(doc1.getElementsByTagName("valor")[0].childNodes[0].nodeValue);

  for (var i = 0; i <= contador; i++) {

    var xmlString = localStorage.getItem("Placard " + i);

    if (!xmlString) return;

    var parser = new DOMParser();

    var doc = parser.parseFromString(xmlString, "text/xml");
    var nomem = doc.getElementsByTagName("nome")[0].childNodes[0].nodeValue;
    var latit = parseFloat(doc.getElementsByTagName("lat")[0].childNodes[0].nodeValue);
    var lngg = parseFloat(doc.getElementsByTagName("lng")[0].childNodes[0].nodeValue);
    var opah = {
      lat: latit,
      lng: lngg
    };
    var nomep = nomem;
    var n = i;

    createload(opah, nomem, n);

  }

}

function createload(pos, nom, n) {
  var sim = pos;
  var nome = nom;
  var num = n;
  var marker = new google.maps.Marker({
    position: sim,
    animation: google.maps.Animation.DROP,
    icon: "img/Marker_2.png",
    map: map
  });
  var infoWindowContent = nome;
  var infoWindow = new google.maps.InfoWindow(),
    marker, num;

  google.maps.event.addListener(marker, 'click', (function (marker, num) {
    return function () {
      infoWindow.setContent(infoWindowContent);
      infoWindow.open(map, marker);
    }
  })(marker, num));
  google.maps.event.addListener(marker, 'dblclick', function (marker, num) {
    infoWindow.close();
  });

  markers.push(marker);


  $('#findMe').data('markers', markers);


}
function carregarjogos() {
  var xmlString3 = localStorage.getItem("Contadorjogos");
  if (!xmlString3) return;

  var parser3 = new DOMParser();

  var doc3 = parser3.parseFromString(xmlString3, "text/xml");

  contador = parseInt(doc3.getElementsByTagName("numero")[0].childNodes[0].nodeValue);

  var str = "" + "<br/>";

  for (var i = 0; i <= contador; i++) {

    var xmlString2 = localStorage.getItem("Game " + i);

    if (!xmlString2) return;

    var parser2 = new DOMParser();
    var doc2 = parser2.parseFromString(xmlString2, "text/xml");
    str += "<br/>" + doc2.getElementsByTagName("jogo")[0].childNodes[0].nodeValue;
    str += "<br/>" + doc2.getElementsByTagName("odds")[0].childNodes[0].nodeValue;
    str += "<br/>" + doc2.getElementsByTagName("horas")[0].childNodes[0].nodeValue + "<br/>"

    document.getElementById("jogos").innerHTML = str;
  }
}
function sair() {
  if (confirm("Deseja sair da Aplicação?")) {
    window.close();
  }
}