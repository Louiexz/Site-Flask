import os
import uuid
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

socketio = SocketIO(app)

users = 0
usuarios_conectados = []

@app.route("/")
def index(): return render_template("index.html")

@app.route("/chatzin/chat")
def chat(): return render_template("chatzin/chat.html")

@app.route("/chatzin/about")
def sobre(): return render_template("chatzin/about.html")

def enviar_mensagem(message, bol=True): emit('message', {'message': message}, broadcast=bol)

def pegaUser():
    for user_info in usuarios_conectados:
        if user_info[1] == request.sid: return user_info[0]

@socketio.on('connect')
def handle_connect(): enviar_mensagem('Usuário conectado')

@socketio.on('disconnect')
def handle_disconnected(): enviar_mensagem('Usuário desconectado ' + str(user_id), False)

@socketio.on('message')
def handle_message(data): enviar_mensagem(data)

if __name__ == "__main__":
    socketio.run(app)
