from flask import Blueprint, render_template, request
from flask_socketio import SocketIO, emit

chat_blueprint = Blueprint('chat', __name__)
socketio = SocketIO()

usuarios_conectados = []

@chat_blueprint.route("/")
def sobre():
    return render_template("chat.html")

@socketio.on('message')
def handle_message(msg):  
    print(msg)
    emit('message', {'username': pegaUser(request.sid), 'msg': msg}, broadcast=True)

def pegaUser(sid):
    for user_info in usuarios_conectados:
        if user_info[1] == sid:
            return user_info[0]

@socketio.on('connect')
def handle_connect():
    print('Usuário conectado:', request.sid)
    usuarios_conectados.append(('Nome do Usuário', request.sid))

@socketio.on('disconnect')
def handle_disconnected():
    print('Usuário desconectado:', request.sid)
    for user_info in usuarios_conectados:
        if user_info[1] == request.sid:
            usuarios_conectados.remove(user_info)
            break
