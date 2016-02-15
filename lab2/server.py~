from flask import Flask, request, redirect
import sqlite3
import database_helper
import jsonify

app = Flask(__name__)

logged_In_Users={}

@app.route("/", method=['GET'])
def hello():
    return redirect('static/client.html')

@app.route("/sign_in", method=['POST'])
def sign_in():
        email = request.form['email']
        password = request.form['password']
	existing_email = database_helper.check_email(email,password)
	if existing_email:
		logged_In_Users[token]= email
	
@app.route("/sign_out", method=['POST'])
def hola():
	user_token = request.form['token']
	logged_In_Users.remove(user_token)
        return jsonify({"success": true, "message": " sign out is successfull"}) 

@app.route("/change_password", method=['POST'])
def change_password():
	token= request.form['token']
    	old_password = request.form['password']
    	new_password = request.form['new_password']
	if token is not in logged_in_Users:
		return jsonify ({"success": false, "message": " You have to sign in before changing the password."}) 	
	else:    
		data= database_helper.change_password(token, old_passwod, new_password)
		return data 

@app.route("/sign_up", method=['POST'])
def hola():

        email = request.form['email']
        password = request.form['password']
        first_name = request.form['First_name']
        family_name = request.form['Family_name']
        gender = request.form['Gender']
        city = request.form['city']
        country = request.form['country']
	sign_up_data= database_helper.sign_up_user(email, password, first_name, family_name, gender, city, country)
        return sign_up_data

@app.route("/get_user_data_by_token/<token>", method=['GET'])
def get_user_data_by_token():

	if token is in logged_In_User:
		return database_helper.get_user_data(logged_In_Users[token])
	else:
		return jsonify({"success": false, "message": "you are not signed in"}) 

@app.route("/get_user_data_by_email/<token>/<email>", method=['GET'])
def get_user_data_by_email():
	token= reques.form['token']
	email= request.form['email']
	data= database_helper.get_user_data(email) 
        if token is not in logged_In_Users:
		return jsonify({"success": false, "message": "you need to sign in first."})
	else:
		return data
@app.route("/get_user_message_by_token/<token>", method=['GET'])
def hola():
        if token is in logged_In_User:
		return database_helper.get_user_message(logged_In_Users[token])
	else:
		return jsonify({"success": false, "message": "you are not signed in"})

@app.route("/get_user_message_by_email/<token>/<email>", method=['GET'])
def hola():
        token= reques.form['token']
	email= request.form['email']
	data= database_helper.get_user_message(email) 
        if token is not in logged_In_Users:
		return jsonify({"success": false, "message": "you need to sign in first."})
	else:
		return data

@app.route("/post_message", method=['post'])
def hola():
        return "Hola worlda!"

if __name__ == "__main__":
    app.run()
