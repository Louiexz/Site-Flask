import os
from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

secret_key = os.urandom(24)

app = Flask(__name__)
app.config['SECRET_KEY'] = secret_key.hex()
socketio = SocketIO(app)

@app.route("/")
def index(): return render_template("index.html")

@app.route("/subtemplates/chat")
def chat(): return render_template("subtemplates/chat.html")

@app.route("/subtemplates/about")
def sobre(): return render_template("subtemplates/about.html")

@socketio.on('message')
def handle_message(message):
    print(message)
    emit('message', {'username': 'Estranho', 'message': message}, broadcast=True)

if __name__ == "__main__": socketio.run(app)