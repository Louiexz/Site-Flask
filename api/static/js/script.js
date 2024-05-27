var socket = io.connect(`http://${document.domain}:${location.port}`);

function conectar() {
    // Conectando ao servidor SocketIO
    // Função executada quando a conexão é estabelecida
        socket.on('connect', function() {
        // Envia uma mensagem indicando que o usuário se conectou
        socket.send({'username': '', 'msg': 'Usuário conectado!', 'sender_sid': socket.id});
        console.log('Conectado');

        $('#conectar').hide();
    });
    // Define a função de manipulação de eventos para mensagens recebidas
    socket.on('message', function(data) {
        console.log(data);
        $('#area-chat').append($('<p><strong>' + data.username + '</strong>: ' + data.msg + '</p>'));
    });
}

// Função para enviar mensagem
function enviarMensagem() {
    const mensagemInput = $('#mensagem').val().trim();
    
    // Verifica se a mensagem não está vazia
    if (mensagemInput !== '') {
        // Envia a mensagem para o servidor junto com o sender_sid
        socket.send({'username': 'Anônimo', 'msg': mensagemInput, 'sender_sid': socket.id});
        
        // Limpa o campo de mensagem após o envio
        $('#mensagem').val('');
    }
}

// Evento DOMContentLoaded para garantir que o código seja executado após o carregamento do DOM
$(document).ready(function() {
    // Evento de click para conectar-se
    $('#conectar').click(conectar);

    // Define o evento de clique para o botão de envio de mensagem
    $('#envio').click(enviarMensagem);
    
    // Define o evento de tecla pressionada para o campo de mensagem (tecla Enter)
    $('#mensagem').keypress(function(event) {
        if (event.which === 13) { // Verifica se a tecla pressionada foi Enter
            enviarMensagem();
        }
    });
});
