var socket;
// Função para conectar ao SocketIO
function conectar() {
    // Inicializa o socket apenas se ainda não estiver conectado
    if (!socket || !socket.connected) {
        socket = io.connect('http://' + document.domain + ':' + location.port);
        // Esconde o botão de conexão após a conexão ser estabelecida
        $('#conexao').hide();
        // Envia uma mensagem indicando que o usuário se conectou
        socket.send('User has connected!');

        // Define a função de manipulação de eventos para mensagens recebidas
        socket.on('message', function(data) {
            $('#area-chat').append($('<strong>' + data.username + '</strong>: ' + data.msg));
            window.alert('Enviada');
        });
    }
}

function verificarConexao() {
    if ($('#conexao').is(':hidden')) {
        $('#envio').off('click').on('click', enviarMensagem);
    } else {
        $('#envio').off('click'); // Remove o evento de clique se o botão de conexão estiver visível
    }
}

// Função para enviar mensagem
function enviarMensagem() {
    // Verifica se o socket está conectado antes de enviar a mensagem
    if (socket && socket.connected) {
        var message = $('#mensagem').val().trim();  // Limpa a entrada
        // Verifica se a mensagem não está vazia
        if (message !== '') {
            // Envia a mensagem para o servidor
            socket.emit('message', message);
            // Limpa o campo de mensagem após o envio
            $('#mensagem').val('');
        }
    } else {
        console.log("A conexão com o servidor não está estabelecida.");
        // Exibir mensagem de erro ao usuário
    }
}

// Evento DOMContentLoaded para garantir que o código seja executado após o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Define o evento de clique para o botão de conexão
    $('#conexao').click(conectar);

    // Define o evento de clique para o botão de envio de mensagem
    $('#envio').click(enviarMensagem);
    
    // Define o evento de tecla pressionada para o campo de mensagem (tecla Enter)
    $('#mensagem').keypress(function(event) {
        if (event.keyCode === 13 && $('#conexao').is(':hidden')) {
            enviarMensagem();
        }
    });
});
