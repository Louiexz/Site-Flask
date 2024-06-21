from flask import Blueprint, render_template, request

chat_blueprint = Blueprint('chat', __name__)

@chat_blueprint.route("/")
def sobre():
    return render_template("chat.html")
