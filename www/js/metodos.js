var mensajes = ["Anímate", "No lo pienses más", "Esta es la hora perfecta", "Qué estás esperando?"];

function mostrarError(){
    var html_error = '<h1>Error</h1><p class="centrar"><img src="images/error.png"/></p><p class="centrar">Problemas con el servidor, intenta mas tarde</p>';
    // Lungo.Notification.html(html_error, "Cerrar");
    Lungo.Notification.error("Error", "Problemas con el servidor, intenta mas tarde", "remove", function(){return});
}

// este método imprime el listado de las canchas en la primera vista
var imprimirCanchas = function (result){
    // console.log(result);
    $$('#canchas').empty();
    if(result.status === "ok"){
        $$.each(result['data'], function(index, val) {
            $$('#canchas').append('<li class="thumb selectable arrow" data-fc-id="'+
                val.id_cancha+'" data-fc-cupo="'+val.cupo_max+'" data-fc-tel="'+val.telefono+'" data-fc-logo="'+val.imagen_logo+'" data-fc-image="'+val.imagen_cancha+
                '"> <img src="http://elecsis.com.co/fcracks/web/images/logos/'+val.imagen_logo+'"/><div><strong>'+val.nombre+
                '</strong><small>'+val.direccion+'</small></div></li>');
        });
        Lungo.Notification.hide();
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
            $$('#dias').append('<li class="thumb selectable arrow" data-fc-fecha="'+
                val.fecha+'"><img src="http://elecsis.com.co/fcracks/web/images/logos/'+cancha.logo+'"/><div><strong>'+val.label+
                '</strong><small>'+val.fecha+'</small></div></li>');
        });
        Lungo.Router.article("main", "listado-dias");
        Lungo.Notification.hide();
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
            $$('#horas').append('<li class="thumb selectable arrow" data-fc-hora="'+
                val.hora+'" data-fc-blancos="'+val.blancos+'" data-fc-negros="'+val.negros+'"><img src="http://elecsis.com.co/fcracks/web/images/logos/'+cancha.logo+'"/><div><div class="on-right"><span class="icon money"></span>$'+Math.floor(val.venta.substr(0,(val.venta.length-3)))/cancha.cupo_max+' c/u</div><strong>'+val.label+
                '</strong><span>'+mensajes[Math.floor((Math.random() * mensajes.length))]+'</span><small>$'+val.venta.substr(0,(val.venta.length-3))+' Total por la cancha</small></div></li>');
        });
        Lungo.Router.article("main", "listado-horas");
        Lungo.Notification.hide();
    }else{
        mostrarError();
    }
}

// este método imprime el listado de los jugadores de cada equipo
var imprimirEquipos = function (result){
    // console.log(result);
    partido = result.partido;
    total_blancos = result.data[0][0].length + result.data[0][1].length;
    total_negros = result.data[1][0].length + result.data[1][1].length;
    if(total_blancos < cancha.cupo_max/2){
        $$('#unirse-blanco').show();
    }
    if(total_negros < cancha.cupo_max/2){
        $$('#unirse-negro').show();
    }
    $$('#unirse-blanco > span').attr('class', 'icon plus');
    $$('#unirse-blanco').attr('data-fc-estado', 'no');
    $$('#unirse-negro > span').attr('class', 'icon plus');
    $$('#unirse-negro').attr('data-fc-estado', 'no');

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
                                $$('#equipo-blanco').append('<li data-fc-id-usuario="'+jugador.id_usuario+'" data-fc-equipo="b" data-fc-entidad="usuario"><span class=" icon user"></span><a id="sacarme-blanco" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+jugador.nombre+'</strong><small>Usuario registrado</small></li>');
                                $$('#unirse-blanco > span').attr('class', 'icon minus');
                                $$('#unirse-blanco').attr('data-fc-estado', 'si');
                            }else{
                                $$('#equipo-blanco').append('<li data-fc-id-usuario="'+jugador.id_usuario+'" data-fc-equipo="b" data-fc-entidad="usuario"><strong>'+jugador.nombre+'</strong><small>Usuario registrado</small></li>');
                            }
                        });
                    }else{ //Usuarios Invitados
                        $$.each(perfil, function(index, jugador) {
                            // if(jugador.responsable === sessionStorage["id"]){
                                // $$('#equipo-blanco').append('<li data-fc-id-responsable="'+jugador.responsable+'" data-fc-id-invitado="'+jugador.id_invitado+'" data-fc-equipo="b" data-fc-entidad="invitado"><span class=" icon user"></span><a id="sacar-invitado-blanco" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+jugador.nombre+'</strong><small>Invitado</small></li>');
                            // }else{
                                $$('#equipo-blanco').append('<li data-fc-id-responsable="'+jugador.responsable+'" data-fc-id-invitado="'+jugador.id_invitado+'" data-fc-equipo="b" data-fc-entidad="invitado"><strong>'+jugador.nombre+'</strong><small>Invitado</small></li>');
                            // }
                        });
                    }
                });
            }else{ //Equipo negro
                $$.each(equipo, function(i, perfil) {
                    if(i === 0){ //Usuarios Registrados
                        $$.each(perfil, function(index, jugador) {
                            if(jugador.id_usuario === sessionStorage["id"]){
                                $$('#equipo-negro').append('<li data-fc-id-usuario="'+jugador.id_usuario+'" data-fc-equipo="n" data-fc-entidad="usuario"><span class=" icon user"></span><a id="sacarme-negro" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+jugador.nombre+'</strong><small>Usuario registrado</small></li>');
                                $$('#unirse-negro > span').attr('class', 'icon minus');
                                $$('#unirse-blanco').attr('data-fc-estado', 'si');
                            }else{
                                $$('#equipo-negro').append('<li data-fc-id-usuario="'+jugador.id_usuario+'" data-fc-equipo="n" data-fc-entidad="usuario"><strong>'+jugador.nombre+'</strong><small>Usuario registrado</small></li>');
                            }
                        });
                    }else{ //Usuarios Invitados
                        $$.each(perfil, function(index, jugador) {
                            // if(jugador.responsable === sessionStorage["id"]){
                                // $$('#equipo-negro').append('<li data-fc-id-responsable="'+jugador.responsable+'" data-fc-id-invitado="'+jugador.id_invitado+'" data-fc-equipo="n" data-fc-entidad="invitado"><span class=" icon user"></span><a id="sacar-invitado-negro" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+jugador.nombre+'</strong><small>Invitado</small></li>');
                            // }else{
                                $$('#equipo-negro').append('<li data-fc-id-responsable="'+jugador.responsable+'" data-fc-id-invitado="'+jugador.id_invitado+'" data-fc-equipo="n" data-fc-entidad="invitado"><strong>'+jugador.nombre+'</strong><small>Invitado</small></li>');
                            // }
                        });
                    }
                });
            }
        });
        Lungo.Router.article("main", "listado-equipos");
        Lungo.Notification.hide();
    }else{
        mostrarError();
    }
}

function adicionarJugador(entidad){
    var data_base = {
        equipo: equipo,
        partido: partido
    }
    if(entidad === "usuario"){
        // var url = "http://localhost/futbolcracksapi/web/v1/usuario/registrar-usuario";
        var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/usuario/registrar-usuario?access-token="+localStorage["_chrome-rel-back"];
        Lungo.Service.post(url, data_base, imprimirJugador, "json");
    }else{
        // var url = "http://localhost/futbolcracksapi/web/v1/usuario/registrar-invitado";
        var url = "http://elecsis.com.co/fcracks/futbolcracksapi/web/v1/usuario/registrar-invitado?access-token="+localStorage["_chrome-rel-back"];
        var complemento = {
            equipo: "",
            partido: partido,
            nombres: "",
            apellidos: "",
            correo: "",
            sexo: "",
            telefono: "",
        }
        Lungo.Service.post(url, Lungo.Core.mix(data_base,complemento), imprimirInvitado, "json");
    }
}

function sustraerJugador(entidad){
    if(entidad === "usuario"){

    }else{

    }
}

var verificarLogin = function (result){
    if(result.status === "ok"){
        localStorage["_chrome-rel-back"] = result.key[0].accessToken;
        imprimirPerfil(result);
        if(sessionStorage["lanzadoDesdeHome"]){
            Lungo.Router.section("perfil");
            Lungo.Notification.hide();
        }else{
            adicionarJugador("usuario");
            Lungo.Router.section("main");
        }
    }else{
        Lungo.Notification.error("Error", "El correo y/o la contraseña diligenciados, no coinciden", "remove", function(){return});
    }
}

var verificarRegistro = function (result){
    if(result.status === "ok"){
        localStorage["_chrome-rel-back"] = result.key;
        imprimirPerfil(result);
        if(sessionStorage["lanzadoDesdeHome"]){
            Lungo.Router.section("perfil");
            Lungo.Notification.hide();
        }else{
            adicionarJugador("invitado");
            Lungo.Router.section("main");
        }
    }else{
        Lungo.Notification.error("Error", "No se pudo registrar, verifique sus datos e intente nuevamente", "remove", function(){return});
    }
}

var imprimirJugador = function(result){
    // console.log(result);
    if(result.status === 'ok'){
        if(result.data.equipo === "b"){
            total_blancos += 1;
            if(total_blancos === cancha.cupo_max/2){
                $$('#unirse-blanco').hide();
            }
            $$('#unirse-blanco').attr('data-fc-estado', 'si');
            $$('#unirse-blanco > span').attr('class', 'icon minus');
            $$('#listado-equipos ul > li:first-child h2').html("Equipo Blanco\t"+total_blancos +"/"+(cancha.cupo_max/2));
            $$('#equipo-blanco').append('<li data-fc-id-usuario="'+result.data.id+'" data-fc-equipo="b" data-fc-entidad="usuario"><span class=" icon user"></span><a id="sacarme-blanco" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+result.data.nombre+'</strong><small>Usuario registrado</small></li>');
        }else{
            total_negros += 1;
            if(total_negros === cancha.cupo_max/2){
                $$('#unirse-negro').hide();
            }
            $$('#unirse-negro').attr('data-fc-estado', 'si');
            $$('#unirse-negro > span').attr('class', 'icon minus');
            $$('#listado-equipos ul > li:nth-child(2) h2').html("Equipo Negro\t"+total_negros +"/"+(cancha.cupo_max/2));
            $$('#equipo-negro').append('<li data-fc-id-usuario="'+result.data.id+'" data-fc-equipo="n" data-fc-entidad="usuario"><span class=" icon user"></span><a id="sacarme-negro" href="#" class="icono"><span style="color:#e74c3c" class="icon remove-sign"></span></a><strong>'+result.data.nombre+'</strong><small>Usuario registrado</small></li>');
        }
        Lungo.Notification.hide();
    }else{

    }
}

var imprimirInvitado = function(result){
    // console.log(result);
    if(result.status === 'ok'){
        if(result.data.equipo === "b"){
            total_blancos += 1;
            if(total_blancos === cancha.cupo_max/2){
                $$('#unirse-blanco').hide();
            }
            $$('#listado-equipos ul > li:first-child h2').html("Equipo Blanco\t"+total_blancos +"/"+(cancha.cupo_max/2));
            $$('#equipo-blanco').append('<li data-fc-id-usuario="'+result.data.id+'" data-fc-equipo="b" data-fc-entidad="usuario"><strong>'+result.data.nombre+'</strong><small>Usuario registrado</small></li>');
        }else{
            total_negros += 1;
            if(total_negros === cancha.cupo_max/2){
                $$('#unirse-negro').hide();
            }
            $$('#listado-equipos ul > li:nth-child(2) h2').html("Equipo Negro\t"+total_negros +"/"+(cancha.cupo_max/2));
            $$('#equipo-negro').append('<li data-fc-id-usuario="'+result.data.id+'" data-fc-equipo="n" data-fc-entidad="usuario"><strong>'+result.data.nombre+'</strong><small>Usuario registrado</small></li>');
        }
        Lungo.Notification.hide();
    }else{

    }
}

function imprimirPerfil(datos){
    return
}



