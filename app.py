import os
import re

from flask import Flask, render_template, request
from flask_socketio import SocketIO, send

# Dicionário para armazenar os usuários conectados
usuarios_conectados = {}
# Contador para atribuir valores únicos a "Anônimo"
contador_anonymous = 1

app = Flask(__name__)

# Configuração de uma chave secreta para o aplicativo Flask
app.config['SECRET_KEY'] = os.urandom(24)

# Inicialização do SocketIO associado ao aplicativo Flask
socketio = SocketIO(app)

from routes.home import home_blueprint
from routes.chat import chat_blueprint
from routes.about import about_blueprint

app.register_blueprint(home_blueprint, url_prefix="/")
app.register_blueprint(chat_blueprint, url_prefix="/chat")
app.register_blueprint(about_blueprint, url_prefix="/about")

# Manipulador de eventos para mensagens SocketIO
@socketio.on('message')
def handle_message(data):
    sender_sid = request.sid  # Obtenha o ID da sessão
    username = usuarios_conectados.get(sender_sid, f'Anônimo{contador_anonymous}')
    message = data.get('msg')
    send({'username': username, 'msg': message}, broadcast=True, include_self=True)

@socketio.on('connect')
def handle_connect():
    global contador_anonymous
    global usuarios_conectados
    
    username = f'Anônimo{contador_anonymous}'

    # Verifica se o nome já está em uso
    while username in usuarios_conectados.values():
        contador_anonymous += 1
        username = f'Anônimo{contador_anonymous}'

    usuarios_conectados[request.sid] = username

@socketio.on('disconnect')
def handle_disconnect():
    global contador_anonymous
    global usuarios_conectados

    if request.sid in usuarios_conectados:
        del usuarios_conectados[request.sid]
        # Remove o usuário atual da lista de conectados
        valores = [re.sub('[^0-9]', '', x) for x in usuarios_conectados.values()]
        
        # Atualiza o contador_anonymous
        if valores:
            contador_anonymous = min(map(int, valores)) + 1
        else:
            contador_anonymous = 1  # Reinicia o contador se não houver usuários

if __name__ == "__main__":
    socketio.run(app, debug=True)
