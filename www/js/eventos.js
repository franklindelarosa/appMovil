Lungo.init({
    name: 'FutbolCracks'
});
Lungo.ready(function() {
    Lungo.Notification.show();
    Lungo.Service.Settings.async = true;
    Lungo.Service.Settings.error = function(type, xhr){
        if(type === "QuoJS.ajax: Timeout exceeded"){
            mostrarError();
        }
        console.log(type); /*------------------------------------------------------------------------------------*/
    };
    // localStorage.prueba = {nombre: "Hello", twitter: "twitter"};
    // var x = localStorage.getItem("_chrome-rel-back");
    // console.log(localStorage["_chrome-rel-back"]);
    
    Lungo.Service.Settings.headers["Content-Type"] = "application/json";
    // Lungo.Service.Settings.headers["Access-Control-Allow-Origin"] = "*";
    Lungo.Service.Settings.crossDomain = false;
    Lungo.Service.Settings.timeout = 10000;
    if(localStorage["_chrome-rel-back"]){
        var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/usuario/quien-soy?access-token="+localStorage["_chrome-rel-back"];
        Lungo.Service.post(url, {cancha:cancha.id}, function(result){sessionStorage["id"] = result.id}, "json");
    }else{
        sessionStorage.removeItem("id");
    }
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/site/listar-canchas";
    // var url = "http://localhost/futbolcracksapi/web/v1/site/listar-canchas";
    // var url = "https://futbolcracksapi.herokuapp.com/web/v1/site/listar-canchas";
    Lungo.Service.post(url, "id=1", imprimirCanchas, "json");

});

$$('#listado-canchas').on('load', function(event) {
    $$("#main h1.title").html("Canchas");
});
$$('#cancha').on('load', function(event) {
    $$("#main h1.title").html(cancha.nombre);
});
$$('#listado-dias').on('load', function(event) {
    $$("#main h1.title").html("Dias Disponibles");
});
$$('#listado-horas').on('load', function(event) {
    $$("#main h1.title").html("Horas Disponibles");
});
$$('#listado-equipos').on('load', function(event) {
    $$("#main h1.title").html("Equipos");
});

$$('#listado-canchas ul').on('singleTap', 'li', function(event) {
	cancha = {
		id : $$(this).attr('data-fc-id'),
		nombre : $$(this).find("strong").html(),
		cupo_max : $$(this).attr('data-fc-cupo'),
		direccion : $$(this).find("small").html(),
        telefono : $$(this).attr('data-fc-tel'),
        logo : $$(this).attr('data-fc-logo'),
		imagen : $$(this).attr('data-fc-image'),
	};
    $$('article#cancha img').attr('src', 'http://elecsis.com.co/fcracks/web/images/canchas/'+cancha.imagen);
    $$('article#cancha h2').html(cancha.nombre);
    $$('#label-telefono').html("Tel: "+cancha.telefono);
    $$('#label-cupo').html("Cupo: "+cancha.cupo_max+" jugadores");
    $$('#label-direccion').html("Dirección: "+cancha.direccion);
    Lungo.Notification.show();
    setTimeout(function(){Lungo.Router.article("main", "cancha"); Lungo.Notification.hide()}, 500);
    
});

$$('#seleccionar-cancha').on('singleTap', function(event) {
    Lungo.Notification.show();
    // var url = "http://localhost/futbolcracksapi/web/v1/site/cancha-dias";
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/site/cancha-dias";
    Lungo.Service.post(url, {cancha:cancha.id}, imprimirDias, "json");
});

$$('#listado-dias ul').on('singleTap', 'li', function(event) {
    // var url = "http://localhost/futbolcracksapi/web/v1/site/cancha-horas";
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/site/cancha-horas";
    Lungo.Notification.show();
	fecha = $$(this).attr('data-fc-fecha');
	Lungo.Service.post(url, {cancha: cancha.id, fecha: fecha}, imprimirHoras, "json");
});

$$('#listado-horas ul').on('singleTap', 'li', function(event) {
    // var url = "http://localhost/futbolcracksapi/web/v1/site/equipos";
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/site/equipos";
    Lungo.Notification.show();
	hora = $$(this).attr('data-fc-hora');
	Lungo.Service.post(url, {cancha: cancha.id, fecha: fecha, hora: hora}, imprimirEquipos, "json");
});

$$('#unirse-blanco').on('singleTap', function(event) {
    equipo = "blancos"; //se envía en plurarl porque la Api la necesita así.
    if(sessionStorage["lanzadoDesdeHome"]){
        sessionStorage.removeItem("lanzadoDesdeHome");
    }
    if(localStorage["_chrome-rel-back"]){
        if($$(this).attr('data-fc-estado') === 'no'){
            adicionarJugador("usuario");
            Lungo.Notification.show();
        }else{
            // Lungo.Notification.error("Ya estás en el partido", "Para salir del partido presiona el botón rojo junto a tu nombre","warning-sign", function(){return});
            Lungo.Router.section("invitar");
        }
    }else{
        Lungo.Router.section("login");
    }
});

$$('#unirse-negro').on('singleTap', function(event) {
    equipo = "negros"; //se envía en plurarl porque la Api la necesita así.
    if(sessionStorage["lanzadoDesdeHome"]){
        sessionStorage.removeItem("lanzadoDesdeHome");
    }
    if(localStorage["_chrome-rel-back"]){
        if($$(this).attr('data-fc-estado') === 'no'){
            adicionarJugador("usuario");
            Lungo.Notification.show();
        }else{
            // Lungo.Notification.error("Ya estás en el partido", "Para salir del partido presiona el botón rojo junto a tu nombre","warning-sign", function(){return});
            Lungo.Router.section("invitar");
        }
    }else{
        Lungo.Router.section("login");
    }
});

$$('#iniciar-sesion').on('singleTap', function(event) {
    // var url = "http://localhost/futbolcracksapi/web/v1/site/login";
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/site/login";
    Lungo.Notification.show();
    var correo = $$('#correo').val();
    var contrasena = $$('#contrasena').val();
    if(correo === "" || contrasena === ""){
        Lungo.Notification.error("Error", "Todos los campos son obligatorios", "remove", function(){return});
    }else{
        Lungo.Service.post(url, {correo: correo, contrasena: contrasena}, verificarLogin, "json");
    }
});

$$('#btn_registrar').on('singleTap', function(event) {
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/site/registrar-perfil";
    Lungo.Notification.show();
    var datos = {
        nombres: $$('#campo_nombres').val(),
        apellidos: $$('#campo_apellidos').val(),
        correo: $$('#campo_correo').val(),
        contrasena: $$('#campo_contrasena').val(),
        sexo: $$('#campo_sexo').val(),
        telefono: $$('#campo_telefono').val()
    };
    if(datos.nombres === "" || datos.apellidos === "" || datos.correo === "" || datos.contrasena === "" || datos.sexo === "" || datos.telefono === ""){
        Lungo.Notification.error("Error", "Todos los campos son obligatorios", "remove", function(){return});
    }else{
        Lungo.Service.post(url, datos, verificarRegistro, "json");
    }
});

$$(document).on('singleTap', '#sacarme-blanco', function(event) {
    Lungo.Notification.show();
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
    var datos = {
        partido: partido,
        equipo: "blancos",
        entidad: "usuario"
    };
    current = $$(this).parent("li").first();
    Lungo.Service.post(url, datos, verificarEliminacion, "json");
});

$$(document).on('singleTap', '#sacarme-negro', function(event) {
    Lungo.Notification.show();
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
    var datos = {
        partido: partido,
        equipo: "negros",
        entidad: "usuario"
    };
    current = $$(this).parent("li").first();
    Lungo.Service.post(url, datos, verificarEliminacion, "json");
});

$$(document).on('singleTap', '#sacar-invitado-blanco', function(event) {
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
    current = $$(this).parent("li").first();
    Lungo.Service.post(url, {equipo: "blancos", partido: partido, jugador: current.attr('data-fc-id-invitado')}, verificarEliminacion, "json");
});

$$(document).on('singleTap', '#sacar-invitado-negro', function(event) {
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
    current = $$(this).parent("li").first();
    Lungo.Service.post(url, {equipo: "negros", partido: partido, jugador: current.attr('data-fc-id-invitado')}, verificarEliminacion, "json");
});

$$(document).on('singleTap', '#btn_invitar', function(event) {
    var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/usuario/registrar-invitado?access-token="+localStorage["_chrome-rel-back"];
    Lungo.Notification.show();
    var datos = {
        nombres: $$('#inv_nombres').val(),
        apellidos: $$('#inv_apellidos').val(),
        correo: $$('#inv_correo').val(),
        sexo: $$('#inv_sexo').val(),
        telefono: $$('#inv_telefono').val(),
        equipo: equipo,
        partido: partido
    };
    if(datos.nombres === "" || datos.apellidos === "" || datos.correo === "" || datos.sexo === "" || datos.telefono === ""){
        Lungo.Notification.error("Error", "Todos los campos son obligatorios", "remove", function(){return});
    }else{
        Lungo.Service.post(url, datos, verificarInvitacion, "json");
    }
});

