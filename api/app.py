import os
from flask import Flask, request
from flask_socketio import SocketIO, send

# Criação de uma instância do aplicativo Flask
app = Flask(__name__)

# Configuração de uma chave secreta para o aplicativo Flask
app.config['SECRET_KEY'] = os.urandom(24)

# Inicialização do SocketIO associado ao aplicativo Flask
socketio = SocketIO(app)

# Importação e registro de blueprints para rotas diferentes
from api.routes.home import home_blueprint
from api.routes.chat import chat_blueprint
from api.routes.about import about_blueprint

app.register_blueprint(home_blueprint, url_prefix="/")
app.register_blueprint(chat_blueprint, url_prefix="/chat")
app.register_blueprint(about_blueprint, url_prefix="/about")

from collections import defaultdict

# Dicionário para armazenar os usuários conectados e o valor associado a "Anonymous"
usuarios_conectados = {}
# Contador para atribuir valores únicos em "Anonymous"
contador_anonymous = 1

# Definição de um manipulador de eventos para mensagens SocketIO
@socketio.on('message')
def handle_message(data):
    sender_sid = data.get('sender_sid')
    username_slice_start = data.get('username_slice_start')
    username_slice_end = data.get('username_slice_end')
    username = usuarios_conectados.get(sender_sid, f'Anônimo{contador_anonymous}')[username_slice_start:username_slice_end]
    message = data.get('msg')
    send({'username': username, 'msg': message}, broadcast=True, include_self=True)

# Função para manipular conexões de cliente
@socketio.on('connect')
def handle_connect():
    global contador_anonymous
    global usuarios_conectados
    username = f'Anônimo{contador_anonymous}'
    usuarios_conectados[request.sid] = username
    contador_anonymous += 1

# Função para manipular desconexões de cliente
@socketio.on('disconnect')
def handle_disconnected():
    global usuarios_conectados
    if request.sid in usuarios_conectados: del usuarios_conectados[request.sid]

# Verifica se o script está sendo executado diretamente
if __name__ == "__main__":
    # Inicia o servidor de desenvolvimento Flask-SocketIO
    socketio.run(app)
