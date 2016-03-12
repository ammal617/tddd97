import sqlite3
from flask import Flask, jsonify, g
from server import app


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('database.db')
    return db


# /\ and \/ taken from http://flask.pocoo.org/docs/0.10/patterns/sqlite3/
#def init_db():
#    with app.app_context():
#        db = get_db()
#        with app.open_resource('database.schema', mode='r') as f:
#           db.cursor().executescript(f.read())
#        db.commit()


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def check_email(email, password):
    valid_user = query_db('SELECT password, email FROM users WHERE email=? AND password=?', [email, password])
    if valid_user:
        return True
    else:
        return False


def userExist(email):
    # check if user exists (false if not, true if exists)
    valid_user = query_db('SELECT * FROM users WHERE email=?', [email])
    if valid_user:
        return True
    else:
        return False


def checkPassword(email, password):
    valid_pass = query_db('SELECT * FROM users WHERE email=? AND password=?', [email, password])
    if valid_pass:
        return True
    else:
        return False


def sign_up_user(email, password, first_name, family_name, gender, city, country):
    query_db('insert into users(email, password, firstname, familyname, gender, city, country, views) VALUES (?,?,?,?,?,?,?,?)',
             [email, password, first_name, family_name, gender, city, country, 1])
    get_db().commit()
    return True


def change_password(email, new_password):
    response = query_db('UPDATE users SET password=? WHERE email=?', [new_password, email])
    get_db().commit()
    return response


def get_user_data(email):
    # return all data
    user_data = query_db('SELECT email, firstname, familyname, gender, city, country FROM users WHERE email=?', [email])
    json_data = {"email": user_data[0][0], "firstname": user_data[0][1], "familyname": user_data[0][2],
                     "gender": user_data[0][3], "city": user_data[0][4], "country": user_data[0][5]}
    return json_data


def get_user_messages(email):
    # return all messages
    message_data = query_db('SELECT id, message, sender, reciver FROM messages WHERE reciver=? ORDER by id DESC', [email])
    tempsize = 0
    while tempsize < len(message_data):
        message_data[tempsize] = {"content": message_data[tempsize][1], "writer": message_data[tempsize][2],
                                          "reciver": message_data[tempsize][3]}
        tempsize = tempsize + 1
    return message_data


def post_message(sender, reciver, message):
    query_db('INSERT INTO messages(message, sender, reciver) VALUES (?,?,?)', [message, sender, reciver])
    get_db().commit()
    return True


def add_view(email):
    response = query_db('UPDATE users SET views = views + 1 WHERE email = ?', [email])
    get_db().commit()
    return response


def get_views(email):
    view_amount = query_db('SELECT views FROM users WHERE email=?', [email])
    return view_amount[0][0]


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
