let objCount = {
    segundos: 99,
    minutos: 99,
    horas: 99,
    dias: 99,
    contador: 0,
    tempo_esgotado: false,
    data_atual: '',
    data: ''
};

$(function () {
    objCount.data_atual = $('#countdown-iniciovendas').attr('data-data_atual');
    objCount.data = $('#countdown-iniciovendas').attr('data-data');
    if (objCount.data != 'false' && objCount.data != undefined) {
        setInterval(atualizaContador, 1000)
    }
});

function atualizaContador() {
    let hoje = new Date(Date.parse(objCount.data_atual));
    let futuro = new Date(Date.parse(objCount.data));

    if (objCount.segundos == 0 && objCount.minutos == 0 && objCount.horas == 0 && objCount.dias == 0) {
        return fechar_countdown();
    }

    objCount.segundos = (parseInt((futuro - hoje) / 1000) - objCount.contador++);
    objCount.minutos = parseInt(objCount.segundos / 60);
    objCount.horas = parseInt(objCount.minutos / 60);
    objCount.dias = parseInt(objCount.horas / 24);
    objCount.segundos %= 60;
    objCount.minutos %= 60;
    objCount.horas %= 24;

    if (objCount.dias + objCount.horas + objCount.minutos + objCount.segundos >= 0) {
        if (!objCount.tempo_esgotado) {
            html = '<div><h1><b>';
            if (objCount.dias > 0) html += `${objCount.dias} dia${objCount.dias !== 1 ? 's, ' : ', '}`;
            if (objCount.horas > 0 || objCount.dias > 0) html += `${objCount.horas} hora${objCount.horas !== 1 ? 's, ' : ', '}`;
            if (objCount.minutos > 0 || objCount.horas > 0 || objCount.dias > 0) {
                html += `${objCount.minutos} minuto${objCount.minutos !== 1 ? 's' : ''} e `;
            }
            html += `${objCount.segundos} segundo${objCount.segundos !== 1 ? 's' : ''}`;
            html = `<div><h1><b>${html}</b></h1><h2>PARA O INÍCIO</h2></div>`;
        } else {
            html = '<div><h1>AGUARDE</h1></div>';
        }
        $('.countdown-body').html(html);
    } else {
        objCount.tempo_esgotado = true;
        fechar_countdown();
    }
}

function fechar_countdown() {
    html = $('.countdown-body').html();
    $('#countdown-iniciovendas').remove();
    $('#countdown-iniciovendas2').find('.countdown-body').html(html);
    $('#countdown-iniciovendas2').css({ 'display': '' });
}