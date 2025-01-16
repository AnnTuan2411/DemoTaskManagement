from flask import Flask, Blueprint
from .employees.controller import employees
from .etasks.controller import etasks
from .roles.controller import roles
from .extension import db, ma
from .model import Employees, ETasks, Roles

import os

def create_db(app):
    # Ensure the path is correctly formed and exists
    db_path = os.path.join(app.instance_path, "library", "library.db")
    if not os.path.exists(db_path):
        with app.app_context():  # Ensure DB is created within app context
            db.create_all()
            print("Created DB at:", db_path)

def create_app(config_file="config.py"):
    app = Flask(__name__)
    app.config.from_pyfile(config_file)
    
    # Ensure app instance path exists
    if not os.path.exists(app.instance_path):
        os.makedirs(app.instance_path)

    db.init_app(app)
    ma.init_app(app)
    create_db(app)
    app.register_blueprint(employees)
    app.register_blueprint(etasks)
    app.register_blueprint(roles)
    return app
