from flask import Flask, request, redirect, jsonify
from gevent.pywsgi import WSGIServer
from geventwebsocket import WebSocketServer, WebSocketApplication, Resource, WebSocketError
from geventwebsocket.handler import WebSocketHandler
import database_helper
import uuid
import json

app = Flask(__name__)

logged_in_users = {}
active_sockets = {}


@app.route("/")
def index():
    return redirect('static/client.html')


@app.route('/is_loggedin/<token>', methods=['GET'])
def is_loggedin(token):
    if token in logged_in_users:
        return jsonify({"success": True, "message": "You are logged in!"})
    else:
        return jsonify({"success": False, "message": "You are not logged in"})


@app.route('/sign_in', methods=['POST'])
def sign_in():
    email = request.form['email']
    password = request.form['password']
    if database_helper.check_email(email, password):
        userToken = str(uuid.uuid4())
        logged_in_users[userToken] = email
        tempdata = {
            "type": "curruseronline",
            "usersonline": len(logged_in_users)
        }
        for s in active_sockets:
            active_sockets[s].send(json.dumps(tempdata))
        return jsonify({"success": True, "message": "Signed in", "data": userToken})
    else:
        return jsonify({"success": False, "message": "Wrong credentials!"})


@app.route("/sign_out", methods=['POST'])
def sign_out():
    userToken = request.form['token']
    kick = request.form['kick']
    if kick == 'logout':
        del active_sockets[logged_in_users[userToken]]
        del logged_in_users[userToken]
    elif kick == 'kickout':
        del logged_in_users[userToken]
    tempdata = {
        "type": "curruseronline",
        "usersonline": len(logged_in_users)
    }
    for s in active_sockets:
        active_sockets[s].send(json.dumps(tempdata))
    return jsonify({"success": True, "message": "You have signed out"})


@app.route("/sign_up", methods=['POST'])
def sign_up():
    email = request.form['email']
    password = request.form['password']
    first_name = request.form['first_name']
    family_name = request.form['family_name']
    gender = request.form['gender']
    city = request.form['city']
    country = request.form['country']
    if database_helper.userExist(email):
        return jsonify({"success": False, "message": "User already exists!"})
    else:
        database_helper.sign_up_user(email, password, first_name, family_name, gender, city, country)
        return jsonify({"success": True, "message": "User created!"})


@app.route("/change_password", methods=['POST'])
def change_password():
    token = request.form['token']
    old_password = request.form['password']
    new_password = request.form['new_password']
    if token not in logged_in_users:
        return jsonify({"success": False, "message": "Not logged in!"})
    else:
        if database_helper.checkPassword(logged_in_users[token], old_password):
            database_helper.change_password(logged_in_users[token], new_password)
            return jsonify({"success": True, "message": "Password changed"})
        else:
            return jsonify({"success": False, "message": "Wrong password, try again!"})


@app.route("/get_user_data_by_token/<token>", methods=['GET'])
def get_user_data_by_token(token):
    if token in logged_in_users:
        data = database_helper.get_user_data(logged_in_users[token])
        return jsonify({"success": True, "message": "User data as data", "data": data})
    else:
        return jsonify({"success": False, "message": "Not signed in"})


@app.route("/get_user_data_by_email/<token>/<email>", methods=['GET'])
def get_user_data_by_email(token, email):
    if token not in logged_in_users:
        return jsonify({"success": False, "message": "You're not signed in"})
    else:
        if database_helper.userExist(email):
            data = database_helper.get_user_data(email)
            return jsonify({"success": True, "message": "Information retrieved", "data": data})
        else:
            return jsonify({"success": False, "message": "User don't exist"})


@app.route("/get_user_message_by_token/<token>", methods=['GET'])
def get_user_message_by_token(token):
    if token in logged_in_users:
        data = database_helper.get_user_messages(logged_in_users[token])
        return jsonify({"success": True, "message": "Messages retrieved", "data": data})
    else:
        return jsonify({"success": False, "message": "Not logged in!"})


@app.route("/get_user_message_by_email/<token>/<email>", methods=['GET'])
def get_user_message_by_email(token, email):
    if token not in logged_in_users:
        return jsonify({"success": False, "message": "Not logged in!"})
    else:
        if database_helper.userExist(email):
            data = database_helper.get_user_messages(email)
            return jsonify({"success": True, "message": "Messages retrieved", "data": data})
        else:
            return jsonify({"success": False, "message": "User don't exist"})


@app.route("/post_message", methods=['POST'])
def post_message():
    token = request.form['token']
    email = request.form['email']
    message = request.form['message']
    if token not in logged_in_users:
        return jsonify({"success": False, "message": "Not logged in!"})
    else:
        if database_helper.userExist(email):
            database_helper.post_message(logged_in_users[token], email, message)

        if email in active_sockets:
            return_data = {
                "type": "userdata",
                "views": database_helper.get_views(email),
                "usersonline": len(logged_in_users),
                "messagecount": len(database_helper.get_user_messages(email))
            }
            active_sockets[email].send(json.dumps(return_data))

            return jsonify({"success": True, "message": "Message posted"})
        else:
            return jsonify({"success": False, "message": "User don't exist"})


@app.route("/add_views", methods=['POST'])
def add_views():
    user_token = request.form['token']
    user_email = request.form['email']
    if user_token in logged_in_users and database_helper.userExist(user_email):
        database_helper.add_view(user_email)
        if user_email in active_sockets:
            return_data = {
                "type": "userdata",
                "views": database_helper.get_views(user_email),
                "usersonline": len(logged_in_users),
                "messagecount": len(database_helper.get_user_messages(user_email))
            }
            active_sockets[user_email].send(json.dumps(return_data))
        return jsonify({"success": True, "messages": "Added view"})
    else:
        return jsonify({"success": False, "messages": "Non added"})


@app.route('/socket_connect')
def socket_connect():
    # wsock = request.environ.get('wsgi.websocket')
    if request.environ.get('wsgi.websocket'):
        wsock = request.environ['wsgi.websocket']
        while True:
            try:
                message = wsock.receive()
                message_type = json.loads(message)["type"]
                message_data = json.loads(message)["data"]

                if message_type == "login":
                    token = message_data
                    if logged_in_users[token] in active_sockets:
                        return_data = {"type": "logout"}
                        active_sockets[logged_in_users[token]].send(json.dumps(return_data))
                    active_sockets[logged_in_users[token]] = wsock

                elif message_type == "userdata":
                    email = logged_in_users[message_data]
                    data = {
                        "type": "userdata",
                        "views": database_helper.get_views(email),
                        "usersonline": len(logged_in_users),
                        "messagecount": len(database_helper.get_user_messages(email))
                    }
                    wsock.send(json.dumps(data))

            except WebSocketError:
                break


if __name__ == "__main__":
    # app.run()
    app.debug = True
    http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
