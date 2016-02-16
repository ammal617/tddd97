from flask import Flask, request, redirect, jsonify
import database_helper
import uuid

app = Flask(__name__)

logged_in_users = {}


@app.route("/", method=['GET'])
def hello():
    return redirect('static/client.html')


@app.route("/sign_in", method=['POST'])
def sign_in():
    email = request.form['email']
    password = request.form['password']
    if database_helper.check_email(email, password):
        userToken = str(uuid.uuid4())
        logged_in_users[userToken] = email
        return jsonify({"success": True, "message": "Signed in", "data": userToken})
    else:
        return jsonify({"success": False, "message": "Wrong credentials!"})


@app.route("/sign_out", method=['POST'])
def sign_out():
    userToken = request.form['token']
    if userToken in logged_in_users:
        del logged_in_users[userToken]
    return jsonify({"success": True, "message": "You have signed out"})


@app.route("/sign_up", method=['POST'])
def sign_up():
    email = request.form['email']
    password = request.form['password']
    first_name = request.form['First_name']
    family_name = request.form['Family_name']
    gender = request.form['Gender']
    city = request.form['city']
    country = request.form['country']
    if database_helper.userExist(email):
        return jsonify({"success": False, "message": "User already exists!"})
    else:
        database_helper.sign_up_user(email, password, first_name, family_name, gender, city, country)
        return jsonify({"success": True, "message": "User created!"})


@app.route("/change_password", method=['POST'])
def change_password():
    token = request.form['token']
    old_password = request.form['password']
    new_password = request.form['new_password']
    if token not in logged_in_users:
        return jsonify({"success": False, "message": "Not logged in!"})
    else:
        if database_helper.try_change_password(logged_in_users[token], old_password, new_password):
            return jsonify({"success": True, "message": "Password changed"})
        else:
            return jsonify({"success": False, "message": "Wrong password, try again!"})


@app.route("/get_user_data_by_token/<token>", method=['GET'])
def get_user_data_by_token(token):
    if token in logged_in_users:
        data = database_helper.get_user_data(logged_in_users[token])
        return jsonify({"success": True, "message": "User data as data", "data": data})
    else:
        return jsonify({"success": False, "message": "Not signed in"})


@app.route("/get_user_data_by_email/<token>/<email>", method=['GET'])
def get_user_data_by_email(token, email):
    if token not in logged_in_users:
        return jsonify({"success": False, "message": "You're not signed in"})
    else:
        if database_helper.userExist(email):
            data = database_helper.get_user_data(email)
            return jsonify({"success": True, "message": "Information retrieved", "data": data})
        else:
            return jsonify({"success": False, "message": "User don't exist"})


@app.route("/get_user_message_by_token/<token>", method=['GET'])
def get_user_message_by_token(token):
    if token in logged_in_users:
        data = database_helper.get_user_message(logged_in_users[token])
        return jsonify({"success": True, "message": "Messages retrieved", "data": data})
    else:
        return jsonify({"success": False, "message": "Not logged in!"})


@app.route("/get_user_message_by_email/<token>/<email>", method=['GET'])
def get_user_message_by_email(token, email):
    if token not in logged_in_users:
        return jsonify({"success": False, "message": "Not logged in!"})
    else:
        if database_helper.userExist(email):
            data = database_helper.get_user_message(email)
            return jsonify({"success": True, "message": "Messages retrieved", "data": data})
        else:
            return jsonify({"success": False, "message": "User don't exist"})


@app.route("/post_message", method=['POST'])
def post_message():
    token = request.form['token']
    email = request.form['email']
    message = request.form['message']
    if token not in logged_in_users:
        return jsonify({"success": False, "message": "Not logged in!"})
    else:
        if database_helper.userExist(email):
            database_helper.post_message(email, message)
            return jsonify({"success": True, "message": "Message posted"})
        else:
            return jsonify({"success": False, "message": "User don't exist"})


if __name__ == "__main__":
    app.run()
