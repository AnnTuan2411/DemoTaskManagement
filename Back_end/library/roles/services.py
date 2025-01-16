from library.extension import db
from library.library_ma import RoleSchema
from library.model import Roles
from flask import request, jsonify
role_schema =RoleSchema()
roles_schema = RoleSchema(many=True)

def add_role_service():
    rolename = request.json['rolename']
    try:
        new_role = Roles(rolename)
        db.session.add(new_role)
        db.session.commit()
        return "Add success"
    except IndentationError:
        db.session.rollback()
        return "Add failed"
    
def get_role_by_id_service(id):
    role = Roles.query.get(id)
    if role:
        return role_schema.jsonify(role)
    else:
        return "Not found role"
    
def get_all_role_service():
    roles = Roles.query.all()
    if roles:
        return roles_schema.jsonify(roles)
    else:
        return "Not found roles"


def update_role_service(id):
    role = Roles.query.get(id)
    if not role:
        return jsonify({"message": "role not found"}), 404

    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400

    try:
        # You can also validate the fields before updating
        role.rolename = data.get("rolename", role.rolename)       
        db.session.commit()
        return jsonify({"message": "Update success"}), 200
    except IndentationError:
        db.session.rollback()
        return jsonify({"message": "Update failed"}), 500