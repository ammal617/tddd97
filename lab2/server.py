from flask import Flask, request, redirect
import sqlite3
import database_helper

app = Flask(__name__)

@app.route("/", method=['GET'])
def hello():
    return redirect('static/client.html')

@app.route("/sign_in", method=['POST'])
def sign_in():
        email = request.form['email']
        password = request.form['password']
        return

@app.route("/sign_out", method=['POST'])
def hola():
        return

@app.route("/change_password", method=['POST'])
def change_password():
    old_password = request.form['password']
    new_password = request.form['new_password']
    return ""

@app.route("/sign_up", method=['POST'])
def hola():

        email = request.form['email']
        password = request.form['password']
        First_name = request.form['First_name']
        Family_name = request.form['Family_name']
        gender = request.form['Gender']
        city = request.form['city']
        country = request.form['country']

        return

@app.route("/get_user_data_by_token/<token>", method=['GET'])
def hola():
        return "Hola worlda!"

@app.route("/get_user_data_by_email/<token>/<email>", method=['GET'])
def hola():
        return "Hola worlda!"

@app.route("/get_user_message_by_token/<token>", method=['GET'])
def hola():
        return "Hola worlda!"

@app.route("/get_user_message_by_email/<token>/<email>", method=['GET'])
def hola():
        return

@app.route("/post_message", method=['post'])
def hola():
        return "Hola worlda!"

if __name__ == "__main__":
    app.run()