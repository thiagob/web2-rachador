function adicionarParticipanteEvento(idEvento, idParticipante) {

    if (idParticipante == undefined || idParticipante == '0') {
        return false;
    }

    $.ajax({
        url: '/assistente/evento/' + idEvento + '/participantes/' + idParticipante,
        method: 'POST',
        contentType: 'application/json',
        success: function (result) {
            document.location.reload(true);
        },
        error: function (request, msg, error) {
            alert('Ocorreu um ao adicionar participante');

            console.log(msg);
            console.log(error);
        }
    });
}

function removerParticipanteEvento(idEvento, idParticipante) {

    var resposta = confirm("Confirmação exclusão do participante?")
    if (resposta == true) {
        $.ajax({
            url: '/assistente/evento/' + idEvento + '/participantes/' + idParticipante,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (result) {
                document.location.reload(true);
            },
            error: function (request, msg, error) {
                alert('Ocorreu um ao excluir participante');

                console.log(msg);
                console.log(error);
            }
        });
    }
}

function removerDespesaEvento(idEvento, idDespesa) {

    var resposta = confirm("Confirmação exclusão da despesa?")
    if (resposta == true) {
        $.ajax({
            url: '/assistente/evento/' + idEvento + '/despesas/' + idDespesa,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (result) {
                document.location.reload(true);
            },
            error: function (request, msg, error) {
                alert('Ocorreu um ao excluir despesa');

                console.log(msg);
                console.log(error);
            }
        });
    }
}

removerDespesaEvento