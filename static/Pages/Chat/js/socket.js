class Socket {
    constructor() {
        this.socket; // Inicializa o socket
        this.audio = new Audio('/static/sound/level-up.mp3');
    }

    conectar() {
        $("#conectar").hide();
        try {
            this.socket = io.connect(`//${document.domain}:${location.port}`);

            // Função executada quando a conexão é estabelecida
            this.socket.on("connect", () => {
                $("#envio").click(() => this.enviarMensagem()); // Corrigido para usar arrow function
                $("#mensagem").keypress((event) => { // Corrigido para usar arrow function
                    if (event.which === 13) {
                        // Verifica se a tecla pressionada foi Enter
                        this.enviarMensagem();
                    }
                });
                // Envia uma mensagem indicando que o usuário se conectou
                this.socket.send({
                    username: "Anônimo", // Adicione um nome de usuário, se necessário
                    msg: "Usuário conectado!",
                    sender_sid: this.socket.id,
                });
            });

            this.socket.on("disconnect", () => {
                // Envia uma mensagem indicando que o usuário se desconectou
                this.socket.send({
                    username: "Anônimo",
                    msg: "Usuário desconectado!",
                    sender_sid: this.socket.id,
                });
            });

            // Define a função de manipulação de eventos para mensagens recebidas
            this.socket.on("message", (data) => {
                $("#area-chat").append(
                    $("<p><strong>" + data.username + "</strong>: " + data.msg + "</p>")
                );

                // Rolagem para o último elemento
                $("#area-chat")[0].scrollTop = $("#area-chat")[0].scrollHeight;

                // T toca um som se a aba estiver oculta
                if (document.hidden) {
                    this.audio.play();
                }
            });
        } catch (e) {
            console.log("Erro encontrado: " + e);
        }
    }

    // Função para enviar mensagem
    enviarMensagem() {
        const mensagemInput = $("#mensagem").val().trim();

        // Verifica se a mensagem não está vazia
        if (mensagemInput !== "" && this.socket) { // Verifica se o socket está definido
            // Envia a mensagem para o servidor junto com o sender_sid
            this.socket.send({
                username: "Anônimo", // Adicione um nome de usuário, se necessário
                msg: mensagemInput,
                sender_sid: this.socket.id,
            });
            $("#mensagem").val("");
        }
    }
}

export default Socket;
