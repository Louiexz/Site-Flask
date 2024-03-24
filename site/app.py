import click
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route("/")
def index(): return render_template("index.html")

@app.route("/user/create", methods=["GET", "POST"])
def user_create():
    if request.method == "POST":
        new_user = [request.form["name"], request.form["email"], request.form["senha"]]
        for x in new_user: print(x + " ")
    return render_template("user/create.html")

if __name__ == "__main__": app.run()