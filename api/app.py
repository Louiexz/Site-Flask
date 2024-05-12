import os
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

socketio = SocketIO(app)

from api.routes.home import home_blueprint
from api.routes.chat import chat_blueprint
from api.routes.about import about_blueprint

app.register_blueprint(home_blueprint, url_prefix="/")
app.register_blueprint(chat_blueprint, url_prefix="/chat")
app.register_blueprint(about_blueprint, url_prefix="/about")

if __name__ == "__main__":
    socketio.run(app)