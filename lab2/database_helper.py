import sqlite3
from flask import Flask, jsonify, g, jsonify
from server import app


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('database.db')
    return db


# /\ and \/ taken from http://flask.pocoo.org/docs/0.10/patterns/sqlite3/
def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def check_email(email, password):
    # check if password and user
    return True


def userExist(email):
    # check if user exists (false if not, true if exists)
    return True


def sign_up_user(email, password, first_name, family_name, gender, city, country):
    # sign up the user
    return True


def try_change_password(email, old_password, new_password):
    # TRY change password from old one to new one return true/false
    return True


def get_user_data(email):
    # return all data
    return True


def get_user_messages(email):
    # return all messages
    return True


def post_message(email, message):
    #post message, return nothing


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
