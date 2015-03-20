// var mensajes = ["Anímate", "No lo pienses más", "Esta es la hora perfecta", "Qué estás esperando?"];

// esta función combierte un número en formato de dinero
Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this, 
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};
function mostrarError(){
    // var html_error = '<h1>Error</h1><p class="centrar"><img src="images/error.png"/></p><p class="centrar">Problemas con el servidor, intenta mas tarde</p>';
    // Lungo.Notification.html(html_error, "Cerrar");
    Lungo.Notification.error("Error de conexión", "Por favor verifica que tengas acceso a internet", "remove", function(){return});
}

//esta función calcula la edad a partir de la fecha de nacimiento
function calcular_edad(fecha) {
        var values = fecha.split("-");  var dia = values[2];  var mes = values[1];  var ano = values[0];
        var fecha_hoy = new Date();     var ahora_ano = fecha_hoy.getYear();    var ahora_mes = fecha_hoy.getMonth()+1;
        var ahora_dia = fecha_hoy.getDate();    var edad = (ahora_ano + 1900) - ano;
        if (ahora_mes < mes){
            edad--;
        }
        if ((mes === ahora_mes) && (ahora_dia < dia)){
            edad--;
        }
        if (edad > 1900){
            edad -= 1900;
        }
        return edad;
    }

// este método capitaliza la primera palabra de un string
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// esta función devuelve un string capitalizado en CamelCase
function capitalizarTexto(texto){
    var palabras = texto.split(' ');
    var capitalizado = '';
    $$.each(palabras, function(index, palabra) {
        capitalizado += palabra.charAt(0).toUpperCase() + palabra.slice(1);
        if(index < palabras.length-1){
            capitalizado += ' ';
        }
    });
    return capitalizado;
}

// este método imprime el listado de las canchas en la primera vista
var imprimirCanchas = function (result){
    // console.log(result);
    $$('#canchas').empty();
    // $$('#canchas').append('<li class="contrast pullable"><strong class="centrar">Desliza para recargar</strong><li/>');
    if(result.status === "ok"){
        posiciones = result.posiciones;
        if (result.data.length > 0) {
            $$.each(result['data'], function(index, val) {
                $$('#canchas').append('<li class="thumb selectable arrow" data-fc-id="'+
                    val.id_cancha+'" data-fc-cupo="'+val.cupo_max+'" data-fc-tel="'+val.telefono+'" data-fc-logo="'+val.imagen_logo+'" data-fc-image="'+val.imagen_cancha+
                    '"> <img src="http://fcracks.com/fcadm/web/images/logos/'+val.imagen_logo+'"/><div><strong>'+val.nombre+
                    '</strong><small>'+val.direccion+'</small></div></li>');
            });
            Lungo.Notification.hide();
        }else{
            var html_error = '<br><p class="centrar"><img src="images/info.png"/></p><br><small class="centrar">No hay canchas disponibles en el momento</small>';
            Lungo.Notification.html(html_error, "Cerrar");
        }
        $$('#listado-canchas div[style]').remove();
        setTimeout(function(){
            var resta = $$('#listado-canchas').height() - $$('#canchas').height();
            if(resta > 0){
                $$('#listado-canchas').append('<div style="height: '+resta+'px"></div>');
            }
        },500);
        refresh_canchas.hide();
    }else{
        mostrarError();
    }
}

// este método imprime el listado de los días disponibles de la cancha seleccionada
var imprimirDias = function (result){
    // console.log(result);
    $$('#dias').empty();
    if(result.status === "ok"){
        $$.each(result['data'], function(index, val) {
            var name="";
            val.total > 1 ? name = "disponibles" : name = "disponible";
            $$('#dias').append('<li class="selectable arrow" data-fc-fecha="'+
                val.dia+'"><div><strong>'+capitaliseFirstLetter(val.label)+
                '</strong><small>'+val.total+' '+name+'</small></div></li>');
        });
        $$('#listado-dias div.fixer').remove();
        setTimeout(function(){
            var resta = $$('#listado-dias').height() - ($$('#listado-dias .sub-header').height() + $$('#dias').height());
            if(resta > 0){
                $$('#listado-dias').append('<div class="fixer" style="height: '+resta+'px"></div>');
            }
        },500);
        Lungo.Router.article("main", "listado-dias");
        Lungo.Notification.hide();
        refresh_dias.hide();
    }else{
        mostrarError();
    }
}

// este método imprime el listado de las horas disponibles de la cancha seleccionada
//en el día seleccionado
var imprimirHoras = function (result){
    // console.log(result);
    $$('#horas').empty();
    if(result.status === "ok"){
        $$.each(result['data'], function(index, val) {
            var name="";
            val.disponibles === 1 ? name = "cupo" : name = "cupos";
            $$('#horas').append('<li class="selectable arrow" data-fc-hora="'+val.hora+'" data-fc-label_hora="'+
               val.label+'" data-fc-blancos="'+val.blancos+'" data-fc-negros="'+val.negros+'"><div><div class="derecha">'+Math.floor(val.venta.substr(0,(val.venta.length-3))/cancha.cupo_max).formatMoney(0,"$")+' c/u</div><strong>'+val.label+
                '</strong><small>'+val.disponibles+' '+name+'</small></div></li>');/*<small>'+Math.floor(val.venta.substr(0,(val.venta.length-3))).formatMoney(0,"$")+' Total</small>*/
        });
        $$('#listado-horas div.fixer').remove();
        setTimeout(function(){
            var resta = $$('#listado-horas').height() - ($$('#horas').height() + $$('#listado-horas .sub-header').height());
            if(resta > 0){
                $$('#listado-horas').append('<div class="fixer" style="height: '+resta+'px"></div>');
            }
        },500);
        Lungo.Router.article("main", "listado-horas");
        Lungo.Notification.hide();
        refresh_horas.hide();
    }else{
        mostrarError();
    }
}

// este método imprime el listado de los jugadores de cada equipo
var imprimirEquipos = function (result){
    // console.log(result);
    listadoDeEquipos = result;
    partido = result.partido;
    total_blancos = result.data[0][0].length + result.data[0][1].length;
    total_negros = result.data[1][0].length + result.data[1][1].length;

    $$('#unirse-negro > div span').html('');

    if(total_blancos < cancha.cupo_max/2){
        $$('#unirse-blanco .derecha-equipos').show();
    }else{
        $$('#unirse-blanco .derecha-equipos').hide();
    }
    if(total_negros < cancha.cupo_max/2){
        $$('#unirse-negro .derecha-equipos').show();
    }else{
        $$('#unirse-negro .derecha-equipos').hide();
    }
    $$('#unirse-blanco > div span').attr('class', 'icon plus');
    $$('#unirse-blanco').attr('data-fc-estado', 'no');
    $$('#unirse-blanco > div span').html('');
    $$('#unirse-negro > div span').attr('class', 'icon plus');
    $$('#unirse-negro').attr('data-fc-estado', 'no');
    $$('#unirse-negro > div span').html('');

    $$('#listado-equipos ul > li:first-child h2').html("Equipo Blanco\t"+total_blancos +"/"+(cancha.cupo_max/2));
    $$('#listado-equipos ul > li:nth-child(2) h2').html("Equipo Negro\t"+total_negros +"/"+(cancha.cupo_max/2));
    $$('#equipo-blanco').empty();
    $$('#equipo-negro').empty();
    if(result.status === "ok"){
        $$.each(result.data, function(index, equipo) {
            if(index === 0){ //Equipo blanco
                $$.each(equipo, function(i, perfil) {
                    if(i === 0){ //Usuarios Registrados
                        $$.each(perfil, function(index, jugador) {
                            if(jugador.id_usuario === sessionStorage["id"]){
                                $$('#equipo-blanco').prepend('<li data-fc-id-usuario="'+jugador.id_usuario+'" data-fc-equipo="b" data-fc-entidad="usuario" class="selectable"><span class="icon user"></span><a id="sacarme-blanco" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+jugador.nombre+'</strong><small>Usuario registrado</small></li>');
                                $$('#unirse-blanco > div span').removeClass();
                                $$('#unirse-blanco > div span').html('<h4>Invitar</h4>');
                                $$('#unirse-blanco').attr('data-fc-estado', 'si');
                                $$('#unirse-negro > div span').removeClass();
                                $$('#unirse-negro > div span').html('<h4>Invitar</h4>');
                                $$('#unirse-negro').attr('data-fc-estado', 'si');
                            }else{
                                $$('#equipo-blanco').append('<li data-fc-id-usuario="'+jugador.id_usuario+'" data-fc-equipo="b" data-fc-entidad="usuario" class="selectable"><strong>'+jugador.nombre+'</strong><small>Usuario registrado</small></li>');
                            }
                        });
                    }else{ //Usuarios Invitados
                        $$.each(perfil, function(index, jugador) {
                            if(jugador.responsable === sessionStorage["id"]){
                                $$('#equipo-blanco').append('<li data-fc-id-responsable="'+jugador.responsable+'" data-fc-id-invitado="'+jugador.id_invitado+'" data-fc-equipo="b" data-fc-entidad="invitado" class="selectable"><span class="icon group"></span><a id="sacar-invitado-blanco" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+jugador.nombre+'</strong><small>Invitado</small></li>');
                            }else{
                                $$('#equipo-blanco').append('<li data-fc-id-responsable="'+jugador.responsable+'" data-fc-id-invitado="'+jugador.id_invitado+'" data-fc-equipo="b" data-fc-entidad="invitado" class="selectable"><strong>'+jugador.nombre+'</strong><small>Invitado</small></li>');
                            }
                        });
                    }
                });
            }else{ //Equipo negro
                $$.each(equipo, function(i, perfil) {
                    if(i === 0){ //Usuarios Registrados
                        $$.each(perfil, function(index, jugador) {
                            if(jugador.id_usuario === sessionStorage["id"]){
                                $$('#equipo-negro').prepend('<li data-fc-id-usuario="'+jugador.id_usuario+'" data-fc-equipo="n" data-fc-entidad="usuario" class="selectable"><span class="icon user"></span><a id="sacarme-negro" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+jugador.nombre+'</strong><small>Usuario registrado</small></li>');
                                $$('#unirse-negro > div span').removeClass();
                                $$('#unirse-negro > div span').html('<h4>Invitar</h4>');
                                $$('#unirse-negro').attr('data-fc-estado', 'si');
                                $$('#unirse-blanco > div span').removeClass();
                                $$('#unirse-blanco > div span').html('<h4>Invitar</h4>');
                                $$('#unirse-blanco').attr('data-fc-estado', 'si');
                            }else{
                                $$('#equipo-negro').append('<li data-fc-id-usuario="'+jugador.id_usuario+'" data-fc-equipo="n" data-fc-entidad="usuario" class="selectable"><strong>'+jugador.nombre+'</strong><small>Usuario registrado</small></li>');
                            }
                        });
                    }else{ //Usuarios Invitados
                        $$.each(perfil, function(index, jugador) {
                            if(jugador.responsable === sessionStorage["id"]){
                                $$('#equipo-negro').append('<li data-fc-id-responsable="'+jugador.responsable+'" data-fc-id-invitado="'+jugador.id_invitado+'" data-fc-equipo="n" data-fc-entidad="invitado" class="selectable"><span class="icon group"></span><a id="sacar-invitado-negro" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+jugador.nombre+'</strong><small>Invitado</small></li>');
                            }else{
                                $$('#equipo-negro').append('<li data-fc-id-responsable="'+jugador.responsable+'" data-fc-id-invitado="'+jugador.id_invitado+'" data-fc-equipo="n" data-fc-entidad="invitado" class="selectable"><strong>'+jugador.nombre+'</strong><small>Invitado</small></li>');
                            }
                        });
                    }
                });
            }
        });
        $$('#listado-equipos div.fixer').remove();
        setTimeout(function(){
            var resta = $$('#listado-equipos').height() - ($$('#listado-equipos > div.fondo-equipos').height() + $$('ul#equipos').height());
            if(resta > 0){
                $$('#listado-equipos').append('<div class="fixer" style="height: '+resta+'px"></div>');
            }
        },500);
        Lungo.Router.article("main", "listado-equipos");
        Lungo.Notification.hide();
        refresh_equipos.hide();
    }else{
        mostrarError();
    }
}

// esta variable almacena la función de verificación del login
var verificarLogin = function (result){
    if(result.status === "ok"){
        localStorage["_chrome-rel-back"] = result.key[0].accessToken;
        sessionStorage["id"] = result.key[0].id_usuario;
        $$('#cerrar-sesion').show();
        imprimirPerfil();
        if(sessionStorage["lanzadoDesdeHome"]){
            Lungo.Router.section("perfil");
            if(listadoDeEquipos !== "no") {
                imprimirEquipos(listadoDeEquipos);
            }
            Lungo.Notification.hide();
        }else{
            adicionarJugador();
            Lungo.Router.section("main");
        }
    }else{
        Lungo.Notification.error("Error", "El correo y/o la contraseña diligenciados, no coinciden", "remove", function(){return});
    }
}

// esta variable almacena la función de verificación de registro de un nuevo usuario
var verificarRegistro = function (result){
    if(result.status === 'ok'){
        if(result.key === 'no'){
            facebookConnectPlugin.logout(function(response){return}, function(response){return});
            var html_telefono =
            '<div class="form"><p class="centrar margin-top margin-bottom">Debes ingresar tu número de teléfono para poder continuar</p>'+
                '<fieldset data-icon="phone">'+
                    '<input id="face_telefono" class="text align_center border" type="tel" placeholder="Teléfono">'+
                '</fieldset>'+
                '<button class="button-window-html" id="btn_continuar_face">Continuar</button>'+
            '</div>';
            Lungo.Notification.html(html_telefono, 'Cancelar');
        }else{
            localStorage["_chrome-rel-back"] = result.key;
            sessionStorage["id"] = result.id;
            $$('#cerrar-sesion').show();
            imprimirPerfil();
            if(sessionStorage["lanzadoDesdeHome"]){
                Lungo.Router.section("perfil");
                if(listadoDeEquipos !== 'no'){
                    imprimirEquipos(listadoDeEquipos);
                }
                Lungo.Notification.hide();
            }else{
                adicionarJugador();
                Lungo.Router.section("main");
            }
        }
    }else{
        Lungo.Notification.error("Error", result.mensaje, "remove", function(){return});
    }
}

// esta función solicita la adición de el usuario en un partido y llama a la función de imprimir jugador
function adicionarJugador(){
    var data = {
        equipo: equipo,
        partido: partido
    }
    // var url = "http://localhost/futbolcracksapi/web/v1/usuario/registrar-usuario";
    var url = direccionBase+"usuario/registrar-usuario?access-token="+localStorage["_chrome-rel-back"];
    Lungo.Service.post(url, data, imprimirJugador, "json");
}

// esta variable almacena la función de validación para la impresión de un jugador en un partido específico
var imprimirJugador = function(result){
    // console.log(result);
    if(result.status === 'ok'){
        if(result.data.equipo === "b"){
            total_blancos += 1;
            if(total_blancos === cancha.cupo_max/2){
                $$('#unirse-blanco .derecha-equipos').hide();
            }
            $$('#unirse-blanco').attr('data-fc-estado', 'si');
            $$('#unirse-blanco > div span').removeClass();
            $$('#unirse-blanco > div span').html('<h4>Invitar</h4>');
            $$('#unirse-negro').attr('data-fc-estado', 'si');
            $$('#unirse-negro > div span').removeClass();
            $$('#unirse-negro > div span').html('<h4>Invitar</h4>');
            $$('#listado-equipos ul > li:first-child h2').html("Equipo Blanco\t"+total_blancos +"/"+(cancha.cupo_max/2));
            $$('#equipo-blanco').prepend('<li class="selectable" data-fc-id-usuario="'+result.data.id+'" data-fc-equipo="b" data-fc-entidad="usuario"><span class="icon user"></span><a id="sacarme-blanco" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+result.data.nombre+'</strong><small>Usuario registrado</small></li>');
        }else{
            total_negros += 1;
            if(total_negros === cancha.cupo_max/2){
                $$('#unirse-negro .derecha-equipos').hide();
            }
            $$('#unirse-negro').attr('data-fc-estado', 'si');
            $$('#unirse-negro > div span').removeClass();
            $$('#unirse-negro > div span').html('<h4>Invitar</h4>');
            $$('#unirse-blanco').attr('data-fc-estado', 'si');
            $$('#unirse-blanco > div span').removeClass();
            $$('#unirse-blanco > div span').html('<h4>Invitar</h4>');
            $$('#listado-equipos ul > li:nth-child(2) h2').html("Equipo Negro\t"+total_negros +"/"+(cancha.cupo_max/2));
            $$('#equipo-negro').prepend('<li class="selectable" data-fc-id-usuario="'+result.data.id+'" data-fc-equipo="n" data-fc-entidad="usuario"><span class="icon user"></span><a id="sacarme-negro" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+result.data.nombre+'</strong><small>Usuario registrado</small></li>');
        }
        imprimirPerfil();
        Lungo.Notification.hide();
    }else{
        if(result.data.tipo === 1){
            Lungo.Notification.error("Error", result.mensaje, "remove", function(){return});
        }else{
            if(result.data.tipo === 2){
                imprimirEquipos(listadoDeEquipos);
                Lungo.Notification.hide();
            }else{
                Lungo.Notification.error("Error", result.mensaje, "remove", function(){return});
            }
        }
    }
}

// esta funcion es llamada por el evento "sacarme-blanco" o "sacarme-negro" quienes
// mandan el valor del parámetro "equipo"
function sacarme(equipo, this_entorno){
    setTimeout(function(){Lungo.Notification.show()},300);
    var url = direccionBase+"usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
    var datos = {
        partido: partido,
        equipo: equipo,
        entidad: "usuario"
    };
    current = $$(this_entorno).parent("li").first();
    Lungo.Service.post(url, datos, verificarEliminacion, "json");
}

// esta variable almacena la función de verificación de eliminación del usuario en un partido específico
var verificarEliminacion = function(result){
    // console.log(result);
    if(result.status === "ok"){
        current.remove();
        total_blancos -= $$('li[data-fc-equipo="b"][data-fc-id-responsable="'+result.yo+'"]').length;
        total_negros -= $$('li[data-fc-equipo="n"][data-fc-id-responsable="'+result.yo+'"]').length;
        $$('li[data-fc-id-responsable="'+result.yo+'"]').remove();
        if(result.equipo === "blancos"){
            total_blancos -= 1;
        }else{
            total_negros -= 1;
        }
        $$('#unirse-blanco').attr('data-fc-estado', 'no');
        $$('#unirse-blanco > div span').attr('class', 'icon plus');
        $$('#unirse-blanco > div span').html('');
        $$('#unirse-negro').attr('data-fc-estado', 'no');
        $$('#unirse-negro > div span').attr('class', 'icon plus');
        $$('#unirse-negro > div span').html('');
        if(total_blancos < cancha.cupo_max/2){
            $$('#unirse-blanco .derecha-equipos').show();
        }
        if(total_negros < cancha.cupo_max/2){
            $$('#unirse-negro .derecha-equipos').show();
        }
        $$('#listado-equipos ul > li:first-child h2').html("Equipo Blanco\t"+total_blancos +"/"+(cancha.cupo_max/2));
        $$('#listado-equipos ul > li:nth-child(2) h2').html("Equipo Negro\t"+total_negros +"/"+(cancha.cupo_max/2));
        imprimirPerfil();
        Lungo.Notification.hide();
    }else{
        //Error
    }
}

// esta funcion es llamada por el evento "sacarme-blanco" o "sacarme-negro" quienes
// mandan el valor del parámetro "equipo"
function sacarInvitado(equipo, this_entorno){
    setTimeout(function(){Lungo.Notification.show()},300);
    var url = direccionBase+"usuario/sacar-jugador?access-token="+localStorage["_chrome-rel-back"];
    current = $$(this_entorno).parent("li").first();
    var datos = {
        entidad: current.attr('data-fc-entidad'),
        equipo: equipo,
        partido: partido,
        jugador: current.attr('data-fc-id-invitado')
    }
    Lungo.Service.post(url, datos, verificarEliminacionInvitado, "json");
}

// esta variable almacena la función de verificación de eliminación de un invitado en un partido específico
var verificarEliminacionInvitado = function(result){
    // console.log(result);
    if(result.status === "ok"){
        current.remove();
        if(result.equipo === "blancos"){
            total_blancos -= 1;
            $$('#listado-equipos ul > li:first-child h2').html("Equipo Blanco\t"+total_blancos +"/"+(cancha.cupo_max/2));
        }else{
            total_negros -= 1;
            $$('#listado-equipos ul > li:nth-child(2) h2').html("Equipo Negro\t"+total_negros +"/"+(cancha.cupo_max/2));
        }
        if(total_blancos < cancha.cupo_max/2){
            $$('#unirse-blanco .derecha-equipos').show();
        }
        if(total_negros < cancha.cupo_max/2){
            $$('#unirse-negro .derecha-equipos').show();
        }
        Lungo.Notification.hide();
    }else{
        //Error
    }
}

// esta variable almacena la función de verificación para la impresión de un invitado en un determinado partido
var verificarInvitacion = function(result){
    if(result.status === "ok"){
        if(result.data.equipo === "blancos"){
            total_blancos += 1;
            if(total_blancos === cancha.cupo_max/2){
                $$('#unirse-blanco .derecha-equipos').hide();
            }
            $$('#equipo-blanco').append('<li class="selectable" data-fc-id-responsable="'+result.data.responsable+'" data-fc-id-invitado="'+result.data.id+'" data-fc-equipo="b" data-fc-entidad="invitado"><span class="icon group"></span><a id="sacar-invitado-blanco" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+result.data.nombre+'</strong><small>Invitado</small></li>');
            $$('#listado-equipos ul > li:first-child h2').html("Equipo Blanco\t"+total_blancos +"/"+(cancha.cupo_max/2));
        }else{
            total_negros += 1;
            if(total_negros === cancha.cupo_max/2){
                $$('#unirse-negro .derecha-equipos').hide();
            }
            $$('#equipo-negro').append('<li class="selectable" data-fc-id-responsable="'+result.data.responsable+'" data-fc-id-invitado="'+result.data.id+'" data-fc-equipo="n" data-fc-entidad="invitado"><span class="icon group"></span><a id="sacar-invitado-negro" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+result.data.nombre+'</strong><small>Invitado</small></li>');
            $$('#listado-equipos ul > li:nth-child(2) h2').html("Equipo Negro\t"+total_negros +"/"+(cancha.cupo_max/2));
        }
        Lungo.Router.section("main");
    }else{
        Lungo.Notification.error("Error", "No se pudo registrar el invitado, verifique los datos e intente nuevamente", "remove", function(){return});
    }
    Lungo.Notification.hide();
}

// esta función recibe los nombres y apellidos y devuelve el nombre completo recortado
function recortarNombre(nombres, apellidos){
    var custom_nombre = nombres.split(' ');
    var custom_apellido = apellidos.split(' ');
    var result = custom_nombre[0]+' ';
    if(custom_apellido.length > 2){
        if(custom_apellido[0].length < 4){
            if(custom_apellido[1].length < 4){
                result += custom_apellido[0]+' '+custom_apellido[1]+' '+custom_apellido[2];
            }else{
                result += custom_apellido[0]+' '+custom_apellido[1];
            }
        }else{
            result += custom_apellido[0]+' '+custom_apellido[1];
        }
    }else{
        result += custom_apellido[0];
    }
    return result;
}

// esta función imprime el perfil del usuario logueado en la aplicación
function imprimirPerfil(){
    if(localStorage["_chrome-rel-back"]){
        $$('#article_perfil > div.empty').hide();
        var url = direccionBase+"usuario/info-perfil?access-token="+localStorage["_chrome-rel-back"];
        Lungo.Service.post(url, "id=1", function(result){
            // console.log(result);
            if(result.status === 'ok'){
                usuario = result.data;
                if(usuario.facebook === 'si'){
                    $$('#edit_contrasena').attr('disabled');
                    $$('#fieldset_edit_contrasena').hide();
                }else{
                    $$('#edit_contrasena').removeAttr('disabled');
                    $$('#fieldset_edit_contrasena').show();
                }
                var articulo = $$('#article_perfil div#contenido');
                var custom_nombre = recortarNombre(usuario.nombres, usuario.apellidos);
                articulo.empty();
                articulo.append(
                    '<div class="layout horizontal">'+
                        '<div data-layout="quarter">'+
                            '<p class="centrar"><img id="foto" class="img-perfil" src="'+direccionBase+'../fotos/'+usuario.foto+'"/></p>'+
                            '<p class="centrar"><a href="#" id="eliminar_foto" class="enlace" style="font-size:0.8em">Eliminar foto</a></p>'+
                        '</div>'+
                        '<div style="margin-left:10px" data-layout="primary"><h4>'+custom_nombre+'</h4>'+
                            '<small><span class="icon envelope"></span> '+usuario.correo+'</small><br>'+
                            '<small><span class="icon phone"></span> '+usuario.telefono+'</small>'+
                            '<a href="#" id="editar" class="editar-perfil"> Editar Perfil </a><br>'+
                            '<small><span class="icon group"></span> '+usuario.posicion+'</small><br/>'+
                            '<small><span class="icon ok"></span> '+result.total+' partidos</small>'+
                        '</div>'+
                    '</div>'+
                    '<div class="list"><ul id="history"><li><p class="centrar">Partidos reservados</p></li></ul></div>');
                if(result.pendientes.length > 0){
                    $$.each(result.pendientes, function(index, val) {
                        $$('#history').append('<li class="selectable" data-fc-id="'+val.id_cancha+'" data-fc-cancha="'+val.nombre+'" '+
                        'data-fc-cupo="'+val.cupo_max+'" data-fc-dir="'+val.direccion+'" data-fc-tel="'+val.telefono+'" '+
                        'data-fc-logo="'+val.imagen_logo+'" data-fc-image="'+val.imagen_cancha+'" data-fc-fecha="'+val.fecha+'" data-fc-hora="'+val.hora+'">'+
                        '<div style="width:100%;">'+
                            '<div style="display:inline-block; width:50%;">'+
                                '<strong>'+val.nombre+'</strong>'+
                            '</div>'+
                            '<div style="display:inline-block; width:50%;">'+
                                '<small data-fc-label-fecha>'+capitaliseFirstLetter(val.label_fecha)+'</small>'+
                            '</div>'+
                        '</div>'+
                        '<div style="width:100%;">'+
                            '<div style="display:inline-block; width:50%;">'+
                                '<small>'+val.direccion+'</small>'+
                            '</div>'+
                            '<div style="display:inline-block; width:50%;">'+
                                '<small data-fc-label-hora> '+val.label_hora+'</small>'+
                            '</div>'+
                        '</div>'+
                        '</li>');
                    });
                }else{
                    $$('#history').append('<li><p class="centrar"><small>No tienes partidos reservados</small></p></li>');
                }
            }else{
                //Error con retorno de perfil
            }
        }, "json");
    }
    refresh_perfil.hide();
}

// esta función muestra la información de un jugador cuando se selecciona de la lista de jugadores de un partido
var imprimirInfoJugador = function (result){
    // console.log(result);
    if(result.status === 'ok' && !fixer){
        // var html_info = '<h2>Información del jugador</h2><br/>';
        var html_info = '<div class="texto-detalle"><img class="foto_detalle" src="'+direccionBase+'../fotos/'+result.data.foto+'"/><br>';
        html_info += '<h4 class="margin-top">'+result.data.nombres+' '+result.data.apellidos+'</h4>';
        html_info += '<h5 class="margin-top">Sexo: '+result.data.sexo+'</h5>';
        if(result.entidad !== 'invitado'){
            if(result.data.fecha_nacimiento !== null){
                html_info += '<h5>Edad: '+calcular_edad(result.data.fecha_nacimiento)+' años</h5>';
            }else{
                html_info += '<h5>Edad: Sin definir</h5>';
            }
        }
        html_info += '<h5>Posición: '+result.data.posicion+'</h5>';
        html_info += '<h5>Pierna hábil: ';
        result.data.pierna_habil !== null ? html_info +=result.data.pierna_habil+'</h5>' : html_info +='Sin definir</h5>';
        if(result.entidad === 'invitado'){
            html_info += '<h5>Responsable: '+result.data.resp_nombres+' '+result.data.resp_apellidos+'</h5>';
        }
        html_info += '</div>';
        Lungo.Notification.html(html_info, "CERRAR");
    }
    fixer = false;
}

// esta función actualiza el campo "posicion" de los formularios de la app
// las posiciones se actualizan junto con el listado de las canchas disponibles
function imprimirPosiciones(select){
    var campo_select = $$(select);
    campo_select.empty();
    $$.each(posiciones, function(index, val) {
        campo_select.append('<option value="'+val.id_posicion+'">'+val.posicion+'</option>');
    });
    campo_select.find('option').first().html('Selecciona una posición');
}

var eliminarFoto = function(result){
    if(result.status === 'ok'){
        $$('#foto').attr('src', result.url);
        Lungo.Notification.success("Correcto", result.mensaje, "ok", function(){return});
    }else{
        Lungo.Notification.error("Error", result.mensaje, "remove", function(){return});
    }
}



