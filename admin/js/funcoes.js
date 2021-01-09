
  var $overlay = $('.overlay'),
    resize = true;
  var map;
  var service;
  var marker = [];
  var pos;
  var infowindow;
  var mylocation;
  var placeLoc;
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var contador = 0;
  
  function initialize() {
    console.log('teste');
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
        var geocoder = new google.maps.Geocoder;
        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: pos,
          radius: 3000,
          types: ['cafe']
       


        }, callback);


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



    function callback(results, status) {
      var markers = [];
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          markers.push(createMarker(results[i]));
          /*guardaLocalStorage(results[i])*/
        }
      }
      $('#findMe').data('markers', markers);
    }
    carregarjogos();
    carregarmarkers();
  }

  function createMarker(place) {
    placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: "img/Marker_2.png",
      animation: google.maps.Animation.DROP
    });
    var placename = place.name;
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent('<div id="nome">' + placename + '</div>' + '<br>' + '<div id="lat">' + latitude + '</div>' + '<div id="lng">' + longitude + '</div>' + '<br>' + "<div><input type='submit' id='butSubmit' value='Placard' onclick='inserirMarker()'></div>");
      infowindow.open(map, this);
    });
    google.maps.event.addListener(marker,'dblclick', function(){
      infowindow.close();
    });
    return marker;
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: map,
      position: new google.maps.LatLng(),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
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

//Sair da Aplicação-------------------------------
function sair() {
  if (confirm("Deseja sair da Aplicação?")) {
    window.close();
  }
}

// Limpar o LocalStorage------------------------------
function clearlocalstorage() {

  localStorage.clear();
  location.reload();
}

var contador = 0;
var contadorjogos = 0;

function criarlocalXML() {

  alert(document.getElementById("nome").value);

  //Criar estrutura XML e guardar em LocalStorage com os dados das pessoas
  //pessoas->pessoa->nome/morada
}

function guardarmarker(placename_, latitude_, longitude_) {
  var doc = document.implementation.createDocument(null, "Mediador", null);

  var mediador = doc.createElement("Valores");

  var latitude_ = document.getElementById('lat').innerHTML;
  var longitude_ = document.getElementById('lng').innerHTML;
  var placename_ = document.getElementById('nome').innerHTML;

  var nom = doc.createElement("nome");
  var nomvalor = doc.createTextNode(placename_);
  nom.appendChild(nomvalor);

  var lat = doc.createElement("lat");
  var latvalor = doc.createTextNode(latitude_);
  lat.appendChild(latvalor);

  var lng = doc.createElement("lng");
  var lngvalor = doc.createTextNode(longitude_);
  lng.appendChild(lngvalor);

  //Para utilizar o appendChild na raiz, é necessário 
  //  aceder ao documentElement
  mediador.appendChild(nom);
  mediador.appendChild(lat);
  mediador.appendChild(lng);
  doc.documentElement.appendChild(mediador);

  var s = new XMLSerializer();
  var xmlString = s.serializeToString(doc);
  localStorage.setItem("Placard " + contador, xmlString);


}


function inserirMarker() {

  guardarmarker(document.getElementById("nome").value, document.getElementsByTagName("lat").value, document.getElementsByTagName("lng").value);
  contador++;

  var doc1 = document.implementation.createDocument(null, "Contador", null);
  var Contador = doc1.createElement("Valores");

  var local1 = doc1.createElement("valor");
  var loc = doc1.createTextNode(contador);
  local1.appendChild(loc);

  Contador.appendChild(local1);
  doc1.documentElement.appendChild(Contador);

  var s1 = new XMLSerializer();
  var xmlString1 = s1.serializeToString(doc1);
  localStorage.setItem("Contador", xmlString1);

  alert('Mediador Inserido com Sucesso');

  carregarmarkers();
}



function carregarmarkers() {
  var xmlString1 = localStorage.getItem("Contador");
  if (!xmlString1) return;

  var parser1 = new DOMParser();

  var doc1 = parser1.parseFromString(xmlString1, "text/xml");

  contador = parseInt(doc1.getElementsByTagName("valor")[0].childNodes[0].nodeValue);



  var str = "" + "<br/>";

  for (var i = 0; i <= contador; i++) {

    var xmlString = localStorage.getItem("Placard " + i);

    if (!xmlString) return;

    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlString, "text/xml");
    str += "<br/>" + doc.getElementsByTagName("nome")[0].childNodes[0].nodeValue;
    var latit = parseFloat(doc.getElementsByTagName("lat")[0].childNodes[0].nodeValue);
    var lngg = parseFloat(doc.getElementsByTagName("lng")[0].childNodes[0].nodeValue);

    document.getElementById("Mediadores").innerHTML = str + "<br/>";
  }

}

function addjogo() {

  if (contadorjogos < 3) {
    guardarjogo(document.getElementById("jogo").value, document.getElementById("odds").value, document.getElementById("horas").value);
    contadorjogos++;

    var doc3 = document.implementation.createDocument(null, "Contadorjogos", null);
    var Contador = doc3.createElement("Counter");
    var local1 = doc3.createElement("numero");
    var loc = doc3.createTextNode(contadorjogos);
    local1.appendChild(loc);

    Contador.appendChild(local1);
    doc3.documentElement.appendChild(Contador);

    var s3 = new XMLSerializer();
    var xmlString3 = s3.serializeToString(doc3);
    localStorage.setItem("Contadorjogos", xmlString3);

    alert("Jogo Adicionado");
    carregarjogos();  

  } else {
    alert("Limite de jogos atingido");
  }


}

function guardarjogo(jogo_, odds_, horas_) {
  var doc2 = document.implementation.createDocument(null, "Lista", null);
  var jogos = doc2.createElement("jogos");

  var jogo = doc2.createElement("jogo");
  var jogovalor = doc2.createTextNode(jogo_);
  jogo.appendChild(jogovalor);

  var odds = doc2.createElement("odds");
  var oddsvalor = doc2.createTextNode(odds_);
  odds.appendChild(oddsvalor);

  var horas = doc2.createElement("horas");
  var horasvalor = doc2.createTextNode(horas_);
  horas.appendChild(horasvalor);

  //Para utilizar o appendChild na raiz, é necessário 
  //  aceder ao documentElement
  jogos.appendChild(jogo);
  jogos.appendChild(odds);
  jogos.appendChild(horas);
  doc2.documentElement.appendChild(jogos);


  var s2 = new XMLSerializer();
  var xmlString2 = s2.serializeToString(doc2);
  localStorage.setItem("Game " + contadorjogos, xmlString2);

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
    str += "<br/>" + doc2.getElementsByTagName("horas")[0].childNodes[0].nodeValue;

    document.getElementById("jogos").innerHTML = str;
  }

}
function limparmediadores() {
  
  
    var xmlString1 = localStorage.getItem("Contador");
    if (!xmlString1) return;
  
    var parser1 = new DOMParser();
  
    var doc1 = parser1.parseFromString(xmlString1, "text/xml");
  
    contador = parseInt(doc1.getElementsByTagName("valor")[0].childNodes[0].nodeValue);
  for(var i =0;i<=contador;i++){
    localStorage.removeItem(("Placard " + i));
  }
  localStorage.removeItem("Contador");
    $('#Mediadores').empty();
    return contador = 0;
  }
  
  function limparjogos() {
    
    
      var xmlString3 = localStorage.getItem("Contadorjogos");
      if (!xmlString3) return;
    
      var parser3 = new DOMParser();
    
      var doc3 = parser3.parseFromString(xmlString3, "text/xml");
    
      contador = parseInt(doc3.getElementsByTagName("numero")[0].childNodes[0].nodeValue);
    for(var i =0;i<=contador;i++){
    localStorage.removeItem(("Game " + i));
    }
    localStorage.removeItem("Contadorjogos");
      $('#jogos').empty();
      return contadorjogos=0;
    }

$('#sairbt').click(function () {
  alert("Volte Sempre!")
  window.location = "../utilizador/index.html"
});