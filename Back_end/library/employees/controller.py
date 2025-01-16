from flask import Blueprint
from flask_cors import cross_origin
from .services import (add_employee_service, get_employee_by_id_service, get_all_employee_service, 
update_employee_service, delete_employee_service)
employees = Blueprint("employees",__name__)



@employees.route("/get-all-employees")
def get_all_employees():
    return "All employee"

# add a new Employee
@employees.route("/employee-managment/employee", methods=['POST'])
@cross_origin()
def add_employee():
    return add_employee_service()

# get Employee by id
@employees.route("/employee-managment/employee/<int:id>", methods=['GET'])
@cross_origin()
def get_employee_by_id(id):
    return get_employee_by_id_service(id)

# get all Employee
@employees.route("/employee-managment/employees", methods=['GET'])
@cross_origin()
def get_all_employee():
    return get_all_employee_service()

# Update Employee
@employees.route("/employee-managment/employee/<int:id>", methods=['PUT'])
@cross_origin()
def update_employee(id):
    return update_employee_service(id)
@employees.route("/employee-managment/employee/<int:id>", methods=['DELETE'])
@cross_origin()
def delete_employee(id):
    return delete_employee_service(id)