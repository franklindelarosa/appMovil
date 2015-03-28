// este método imprime el listado de los días disponibles de la cancha seleccionada
var imprimirDiasR = function (result){
    // console.log(result);
    $$('#dias').empty();
    if(result.status === "ok"){
        $$.each(result['data'], function(index, val) {
            var name="";
            val.total > 1 ? name = "disponibles" : name = "disponible";
            $$('#dias').append('<li class="selectable arrow" data-fc-fecha="'+
                val.dia+'"><div><strong>'+val.label+
                '</strong><small>'+val.total+' '+name+'</small></div></li>');
        });
    }else{
        mostrarError();
    }
}

// este método imprime el listado de las horas disponibles de la cancha seleccionada
//en el día seleccionado
var imprimirHorasR = function (result){
    // console.log(result);
    $$('#horas').empty();
    if(result.status === "ok"){
        $$.each(result['data'], function(index, val) {
            var name="";
            val.disponibles === 1 ? name = "cupo" : name = "cupos";
            $$('#horas').append('<li class="selectable arrow" data-fc-hora="'+val.hora+'" data-fc-label_hora="'+
               val.label+'" data-fc-blancos="'+val.blancos+'" data-fc-negros="'+val.negros+'"><div><div class="derecha">'+Math.floor(val.venta.substr(0,(val.venta.length-3))/cancha.cupo_max).formatMoney(0,"$")+' c/u <small>'+val.disponibles+' '+name+'</small></div><strong>'+val.label+
                '</strong><small>'+Math.floor(val.venta.substr(0,(val.venta.length-3))).formatMoney(0,"$")+' Total</small></div></li>');
        });
    }else{
        mostrarError();
    }
}