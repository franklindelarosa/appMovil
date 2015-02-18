Lungo.init({
    name: 'FutbolCracks'
});
Lungo.ready(function() {
    Lungo.Notification.show();
    var environment = Lungo.Core.environment();
    // console.log(environment.os.name);
    if(typeof(environment.os) != "undefined" && environment.os !== null) {
        if(environment.os.name === "ios"){
            $$('section > header').style('margin-top', '20px');
            $$('section > div[data-control="pull"]').style('margin-top', '20px');
        }
    }
    // direccionBase = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/";
    direccionBase = "http://fcracks.com/fcapi/web/v1/";
    Lungo.Service.Settings.async = true;
    Lungo.Service.Settings.error = function(type, xhr){
        if(type === "QuoJS.ajax: Timeout exceeded"){
            mostrarError();
        }
        // console.log(type); /*------------------------------------------------------------------------------------*/
    };
    
    Lungo.Service.Settings.headers["Content-Type"] = "application/json";
    // Lungo.Service.Settings.headers["Access-Control-Allow-Origin"] = "*";
    Lungo.Service.Settings.crossDomain = false;
    Lungo.Service.Settings.timeout = 10000;
    if(localStorage["_chrome-rel-back"]){
        $$('#cerrar-sesion').show();
        var url = direccionBase+"usuario/quien-soy?access-token="+localStorage["_chrome-rel-back"];
        Lungo.Service.post(url, {cancha:cancha.id}, function(result){sessionStorage["id"] = result.id}, "json");
        imprimirPerfil();
    }else{
        $$('#cerrar-sesion').hide();
        sessionStorage.removeItem("id");
    }
    sessionStorage.removeItem("lanzadoDesdeHome");
    listadoDeEquipos = "no";
    var url = direccionBase+"site/listar-canchas";
    Lungo.Service.post(url, "id=1", imprimirCanchas, "json");
});



$$('#main').on('load', function(event) {
    document.activeElement.blur();
});
$$('#listado-canchas').on('load', function(event) {
    $$("#main h1.title").html("Canchas");
});
var refresh_canchas = new Lungo.Element.Pull('#listado-canchas', {
    onPull: "Desliza para actualizar",
    onRelease: "Suelta para recargar",
    onRefresh: "Recargando lista",
    callback: function() {
        // setTimeout(function(){refresh_canchas.hide();}, 3000);
        var url = direccionBase+"site/listar-canchas";
        Lungo.Service.post(url, "id=1", imprimirCanchas, "json");
    }
});
$$('#cancha').on('load', function(event) {
    $$("#main h1.title").html(cancha.nombre);
});
// $$('#cancha').on('swipeRight', function(event) {
//     Lungo.Router.article("main", "listado-canchas");
// });
$$('#listado-dias').on('load', function(event) {
    $$("#main h1.title").html("Dias Disponibles");
    $$('.sub-header > h5').html(cancha.nombre);
});
var refresh_dias = new Lungo.Element.Pull('#listado-dias', {
    onPull: "Desliza para actualizar",
    onRelease: "Suelta para recargar",
    onRefresh: "Recargando lista",
    callback: function() {
        // setTimeout(function(){refresh_dias.hide();}, 3000);
        var url = direccionBase+"site/cancha-dias";
        Lungo.Service.post(url, {cancha:cancha.id}, imprimirDias, "json");
    }
});
// $$('#listado-dias').on('swipeRight', function(event) {
//     Lungo.Router.article("main", "cancha");
// });
$$('#listado-horas').on('load', function(event) {
    $$("#main h1.title").html("Horas Disponibles");
    $$('.sub-header > h5').html(cancha.nombre+' - '+label_fecha);
});
var refresh_horas = new Lungo.Element.Pull('#listado-horas', {
    onPull: "Desliza para actualizar",
    onRelease: "Suelta para recargar",
    onRefresh: "Recargando lista",
    callback: function() {
        // setTimeout(function(){refresh_horas.hide();}, 3000);
        var url = direccionBase+"site/cancha-horas";
        Lungo.Service.post(url, {cancha: cancha.id, fecha: fecha}, imprimirHoras, "json");
    }
});
// $$('#listado-horas').on('swipeRight', function(event) {
//     Lungo.Router.article("main", "listado-dias");
// });
$$('#listado-equipos').on('load', function(event) {
    $$("#main h1.title").html("Equipos");
    // $$('#listado-equipos > ul > li > div').removeAttr('style');
    $$('#li-equipo-cancha').html(cancha.nombre);
    $$('#li-equipo-fecha').html(label_fecha);
    $$('#li-equipo-hora').html(label_hora);
});
var refresh_equipos = new Lungo.Element.Pull('#listado-equipos', {
    onPull: "Desliza para actualizar",
    onRelease: "Suelta para recargar",
    onRefresh: "Recargando lista",
    callback: function() {
        // setTimeout(function(){refresh_equipos.hide();}, 3000);
        var url = direccionBase+"site/equipos";
        Lungo.Service.post(url, {cancha: cancha.id, fecha: fecha, hora: hora}, imprimirEquipos, "json");
    }
});
$$('#perfil').on('load', function(event) {
    document.activeElement.blur();
    $$('#article_perfil div.fixer').remove();
    if(localStorage["_chrome-rel-back"]){
        setTimeout(function(){
            var resta = $$('#article_perfil').height() - 10 - $$('#contenido').height();
            if(resta > 0){
                $$('#article_perfil').append('<div class="fixer" style="height: '+resta+'px"></div>');
            }
        },500);
    }
});
var refresh_perfil = new Lungo.Element.Pull('#article_perfil', {
    onPull: "Desliza para actualizar",
    onRelease: "Suelta para recargar",
    onRefresh: "Recargando lista",
    callback: function() {
        imprimirPerfil();
    }
});
// $$('#listado-equipos').on('swipeRight', function(event) {
//     Lungo.Router.article("main", "listado-horas");
// });
$$('#login').on('unload', function(event) {
    setTimeout(function(){$$('#login div.form').find(':not(button)[id]').val('');}, 350);
});
$$('#registrar').on('unload', function(event) {
    setTimeout(function(){$$('#registrar div.form').find(':not(button)[id]').val('');}, 350);
});
$$('#invitar').on('unload', function(event) {
    setTimeout(function(){$$('#invitar div.form').find(':not(button)[id]').val('');}, 350);
});
// navigator.Backbutton.goHome(function() {
//     console.log('success')
// }, function() {
//     console.log('fail')
// });
$$('#lanzar-login').on('singleTap', function(event) {
    if(localStorage["_chrome-rel-back"]){
        Lungo.Notification.error("", "Ya has iniciado sesión", "warning-sign", function(){return});
    }else{
        sessionStorage["lanzadoDesdeHome"] = "_crfs";
        Lungo.Router.section("login");
    }
});

$$('#iniciar-sesion').on('singleTap', function(event) {
    var url = direccionBase+"site/login";
    document.activeElement.blur();
    Lungo.Notification.show();
    var correo = $$('#correo').val();
    var contrasena = $$('#contrasena').val();
    if(correo === "" || contrasena === ""){
        Lungo.Notification.error("Error", "Todos los campos son obligatorios", "remove", function(){return});
    }else{
        Lungo.Service.post(url, {correo: correo, contrasena: contrasena}, verificarLogin, "json");
    }
});

$$(document).on('singleTap', 'a#editar',function(event) {
    $$('#edit_nombres').val(usuario.nombres);
    $$('#edit_apellidos').val(usuario.apellidos);
    $$('#edit_correo').val(usuario.correo);
    $$('#edit_contrasena').val('');
    $$('#edit_sexo').val(usuario.sex);
    $$('#edit_telefono').val(usuario.telefono);
    Lungo.Router.section('editar-perfil');
});

$$('#cerrar-sesion').on('singleTap', function(event) {
    localStorage.removeItem("_chrome-rel-back");
    sessionStorage.removeItem("id");
    Lungo.Router.article("main", "listado-canchas");
    setTimeout(function(){
        $$('#cerrar-sesion').hide();
        $$('#article_perfil div#contenido').empty();
        $$('#article_perfil > div.empty').show();
    }, 400);
});

$$('#listado-canchas ul').on('singleTap', 'li.selectable', function(event) {
    Lungo.Notification.show();
    cancha = {
        id : $$(this).attr('data-fc-id'),
        nombre : $$(this).find("strong").html(),
        cupo_max : $$(this).attr('data-fc-cupo'),
        direccion : $$(this).find("small").html(),
        telefono : $$(this).attr('data-fc-tel'),
        logo : $$(this).attr('data-fc-logo'),
        imagen : $$(this).attr('data-fc-image'),
    };
    $$('article#cancha img').attr('src', 'http://fcracks.com/fcadm/web/images/canchas/'+cancha.imagen);
    $$('article#cancha h2').html(cancha.nombre);
    // $$('#label-telefono').html("Tel: "+cancha.telefono);
    $$('#label-cupo').html("Cupo: "+cancha.cupo_max+" jugadores");
    $$('#label-direccion').html("Dirección: "+cancha.direccion);
    setTimeout(function(){Lungo.Router.article("main", "cancha"); Lungo.Notification.hide()}, 500);
    
});

$$('#seleccionar-cancha').on('singleTap', function(event) {
    Lungo.Notification.show();
    var url = direccionBase+"site/cancha-dias";
    Lungo.Service.post(url, {cancha:cancha.id}, imprimirDias, "json");
});

$$('#listado-dias ul').on('singleTap', 'li.selectable', function(event) {
    Lungo.Notification.show();
    var url = direccionBase+"site/cancha-horas";
    fecha = $$(this).attr('data-fc-fecha');
	label_fecha = capitaliseFirstLetter($$(this).find('strong').html());
	Lungo.Service.post(url, {cancha: cancha.id, fecha: fecha}, imprimirHoras, "json");
});

$$('#listado-horas ul').on('singleTap', 'li.selectable', function(event) {
    Lungo.Notification.show();
    var url = direccionBase+"site/equipos";
	hora = $$(this).attr('data-fc-hora');
    label_hora = $$(this).attr('data-fc-label_hora');
	Lungo.Service.post(url, {cancha: cancha.id, fecha: fecha, hora: hora}, imprimirEquipos, "json");
});

$$('#unirse-blanco').on('singleTap', function(event) {
    equipo = "blancos"; //se envía en plurarl porque la Api la necesita así.
    if(sessionStorage["lanzadoDesdeHome"]){
        sessionStorage.removeItem("lanzadoDesdeHome");
    }
    if(localStorage["_chrome-rel-back"]){
        if($$(this).attr('data-fc-estado') === 'no'){
            adicionarJugador();
            Lungo.Notification.show();
        }else{
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
            adicionarJugador();
            Lungo.Notification.show();
        }else{
            Lungo.Router.section("invitar");
        }
    }else{
        Lungo.Router.section("login");
    }
});

$$('#btn_registrar').on('singleTap', function(event) {
    var url = direccionBase+"site/registrar-perfil";
    document.activeElement.blur();
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

$$('#btn_editar').on('singleTap', function(event) {
    var url = direccionBase+"usuario/actualizar-perfil?access-token="+localStorage["_chrome-rel-back"];
    document.activeElement.blur();
    Lungo.Notification.show();
    var datos = {
        nombres: $$('#edit_nombres').val(),
        apellidos: $$('#edit_apellidos').val(),
        correo: $$('#edit_correo').val(),
        contrasena: $$('#edit_contrasena').val(),
        sexo: $$('#edit_sexo').val(),
        telefono: $$('#edit_telefono').val()
    };
    if(datos.nombres === "" || datos.apellidos === "" || datos.correo === "" || datos.sexo === "" || datos.telefono === ""){
        Lungo.Notification.error("Error", "Todos los campos son obligatorios", "remove", function(){return});
    }else{
        Lungo.Service.post(url, datos, function(result){
            if(result.status === 'ok'){
                localStorage["_chrome-rel-back"] = result.key;
                imprimirPerfil();
                Lungo.Notification.success("Correcto", result.mensaje, "ok", function(){return});
                Lungo.Router.section("perfil");
            }else{
                Lungo.Notification.error("Error", result.mensaje, "remove", function(){return});
            }
        }, "json");
    }
});

$$(document).on('singleTap', '#sacarme-blanco', function(event) {
    Lungo.Notification.show();
    var url = direccionBase+"usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
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
    var url = direccionBase+"usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
    var datos = {
        partido: partido,
        equipo: "negros",
        entidad: "usuario"
    };
    current = $$(this).parent("li").first();
    Lungo.Service.post(url, datos, verificarEliminacion, "json");
});

$$(document).on('singleTap', '#sacar-invitado-blanco', function(event) {
    Lungo.Notification.show();
    var url = direccionBase+"usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
    current = $$(this).parent("li").first();
    Lungo.Service.post(url, {entidad: current.attr('data-fc-entidad'), equipo: "blancos", partido: partido, jugador: current.attr('data-fc-id-invitado')}, verificarEliminacionInvitado, "json");
});

$$(document).on('singleTap', '#sacar-invitado-negro', function(event) {
    Lungo.Notification.show();
    var url = direccionBase+"usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
    current = $$(this).parent("li").first();
    Lungo.Service.post(url, {entidad: current.attr('data-fc-entidad'), equipo: "negros", partido: partido, jugador: current.attr('data-fc-id-invitado')}, verificarEliminacionInvitado, "json");
});

$$(document).on('singleTap', '#btn_invitar', function(event) {
    var url = direccionBase+"usuario/registrar-invitado?access-token="+localStorage["_chrome-rel-back"];
    document.activeElement.blur();
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
        Lungo.Notification.show();
        Lungo.Service.post(url, datos, verificarInvitacion, "json");
    }
});

$$(document).on('singleTap', '#equipos li.selectable', function(event) {
    Lungo.Notification.show();
    var jugador = {
        entidad: $$(this).attr('data-fc-entidad'),
        equipo: $$(this).attr('data-fc-equipo'),
        partido: partido
    }
    if(jugador.entidad === 'invitado'){
        jugador.id = $$(this).attr('data-fc-id-invitado');
        jugador.responsable = $$(this).attr('data-fc-id-responsable');
    }else{
        jugador.id = $$(this).attr('data-fc-id-usuario');
    }
    var url = direccionBase+"site/informacion-jugador";
    Lungo.Service.post(url, jugador, imprimirInfoJugador, "json");
});

$$(document).on('singleTap', '#history li.selectable', function(event) {
    Lungo.Notification.show();
    cancha = {
        id : $$(this).attr('data-fc-id'),
        nombre : $$(this).attr('data-fc-cancha'),
        cupo_max : $$(this).attr('data-fc-cupo'),
        direccion : $$(this).attr('data-fc-dir'),
        telefono : $$(this).attr('data-fc-tel'),
        logo : $$(this).attr('data-fc-logo'),
        imagen : $$(this).attr('data-fc-image'),
    }
    fecha = $$(this).attr('data-fc-fecha');
    label_fecha = $$(this).find('small[data-fc-label-fecha]').html();
    hora = $$(this).attr('data-fc-hora');
    label_hora = $$(this).find('small[data-fc-label-hora]').html();
    $$('article#cancha img').attr('src', 'http://fcracks.com/fcadm/web/images/canchas/'+cancha.imagen);
    $$('article#cancha h2').html(cancha.nombre);
    // $$('#label-telefono').html("Tel: "+cancha.telefono);
    $$('#label-cupo').html("Cupo: "+cancha.cupo_max+" jugadores");
    $$('#label-direccion').html("Dirección: "+cancha.direccion);
    var url = direccionBase+"site/cancha-horas";
    Lungo.Service.post(url, {cancha: cancha.id, fecha: fecha}, imprimirHorasR, "json");
    var url = direccionBase+"site/cancha-dias";
    Lungo.Service.post(url, {cancha:cancha.id}, imprimirDiasR, "json");
    var url = direccionBase+"site/equipos";
    Lungo.Service.post(url, {cancha: cancha.id, fecha: fecha, hora: hora}, imprimirEquipos, "json");
});

