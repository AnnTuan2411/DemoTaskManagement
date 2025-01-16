from flask import Blueprint
from .services import (add_role_service, get_role_by_id_service, get_all_role_service, 
update_role_service)
roles = Blueprint("roles",__name__)

# add a new role
@roles.route("/role-managment/role", methods=['POST'])
def add_role():
    return add_role_service()

# get role by id
@roles.route("/role-managment/role/<int:id>", methods=['GET'])
def get_role_by_id(id):
    return get_role_by_id_service(id)

# get all role
@roles.route("/role-managment/roles", methods=['GET'])
def get_all_role():
    return get_all_role_service()

# Update role
@roles.route("/role-managment/role/<int:id>", methods=['PUT'])
def update_role(id):
    return update_role_service(id)