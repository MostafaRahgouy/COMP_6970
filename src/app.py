import json
from flask import Flask, render_template, jsonify, request, url_for, session
from werkzeug.utils import secure_filename
import os
app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('landing.html')





@app.route('/trainee')
def trainee():
    return render_template('trainee.html')


@app.route('/trainer')
def trainer():
    return render_template('trainer.html')


@app.route('/sign_in')
def sign_in():
    return render_template('sign_in.html')


@app.route('/sign_up')
def sign_up():
    return render_template('sign_up.html')


if __name__ == '__main__':
    app.run(debug=True)
