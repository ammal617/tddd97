from flask import Flask
app = Flask(__name__)

@app.route("/", method=['GET'])
def hello():
    return "Hello World!"

@app.route("/signIn")
def hola():
        return "Hola worlda!"

@app.route("/signOut")
def hola():
        return "Hola worlda!"

@app.route("/changePass")
def hola():
        return "Hola worlda!"

@app.route("/signIn")
def hola():
        return "Hola worlda!"

@app.route("/signIn")
def hola():
        return "Hola worlda!"

@app.route("/signIn")
def hola():
        return "Hola worlda!"

if __name__ == "__main__":
    app.run()
