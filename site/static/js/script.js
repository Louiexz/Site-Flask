var socket;

function conectar() {
    document.getElementById("conexao").style.display = "none";
    socket = io.connect('http://' + document.domain + ":" + location.port);

    socket.on('message', function(data) {
        var p = document.createElement('p');
        p.innerHTML = '<strong>Estranho</strong>: ' + data['message'];
        document.getElementById('area-chat').appendChild(p);
    });
}

function enviarMensagem() {
    var message = document.getElementById('message').value;
    try {
        socket.emit('message', message);
        document.getElementById('message').value = '';
    } catch(err) {
        console.log("Algo deu errado: " + err);
    }
}
