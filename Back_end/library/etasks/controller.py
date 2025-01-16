from flask import Blueprint
from flask_cors import cross_origin
from .services import (add_etask_service, get_etask_by_id_service, get_all_etask_service, 
update_etask_service,get_etask_by_employee_id_service,delete_etask_service)
etasks = Blueprint("etasks",__name__)

# add a new etask
@etasks.route("/etask-managment/etask", methods=['POST'])
@cross_origin()
def add_etask():
    return add_etask_service()

# get etask by id
@etasks.route("/etask-managment/etask/<int:id>", methods=['GET'])
@cross_origin()
def get_etask_by_id(id):
    return get_etask_by_id_service(id)

# get etask by employee id
@etasks.route("/etask-managment/etasks/<int:employee_id>", methods=['GET'])
@cross_origin()
def get_etask_by_employee_id(employee_id):
    return get_etask_by_employee_id_service(employee_id)

# get all etask
@etasks.route("/etask-managment/etasks", methods=['GET'])
@cross_origin()
def get_all_etask():
    return get_all_etask_service()

# Update etask
@etasks.route("/etask-managment/etask/<int:id>", methods=['PUT'])
@cross_origin()
def update_etask(id):
    return update_etask_service(id)

@etasks.route("/etask-managment/etask/<int:id>", methods=['DELETE'])
@cross_origin()
def delete_etask(id):
    return delete_etask_service(id)