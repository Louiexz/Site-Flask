var socket;

function conectar() {
    document.getElementById("conexao").style.display = "none";
    socket = io.connect('http://' + document.domain + ":" + location.port);

    socket.on('connect', function() {
        socket.send('Usuário conectado!');
    });

    socket.on('message', function(data) {
        var p = document.createElement('p');
        var username = (data.username === 'Eu') ? 'Eu': 'Estranho';
        p.innerHTML = '<strong>' + username + '</strong>: ' + data["message"];
        
        p.classList.add((username === 'Eu') ? 'eu': 'estranho');
        
        document.getElementById('area-chat').appendChild(p);
    });
}
function sendMessage() {
    var message = document.getElementById('message').value;
    try {
        socket.emit('message', message);
        document.getElementById('message').value = '';
    }catch(err){
        console.log("Algo errado" + err);
    }
}