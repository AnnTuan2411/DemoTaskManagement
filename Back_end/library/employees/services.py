from library.extension import db
from library.library_ma import EmployeeSchema
from library.model import Employees
from flask import request, jsonify
import json
employee_schema =EmployeeSchema()
employees_schema = EmployeeSchema(many=True)

def add_employee_service():
    fullname = request.json['fullname']
    username = request.json['username']
    password = request.json['password']
    startdate = request.json['startdate']
    enddate = request.json['enddate']
    status = request.json['status']
    role_id = request.json['role_id']
    try:
        new_employee = Employees(fullname,username,password,startdate,enddate,status,role_id)
        db.session.add(new_employee)
        db.session.commit()
        return "Add success"
    except IndentationError:
        db.session.rollback()
        return "Add failed"
    
def get_employee_by_id_service(id):
    employee = Employees.query.get(id)
    if employee:
        return employee_schema.jsonify(employee)
    else:
        return "Not found Employee"
    
def get_all_employee_service():
    employees = Employees.query.all()
    if employees:
        return employees_schema.jsonify(employees),200
    else:
        return jsonify({"message": "Not found Employees"}), 404


def update_employee_service(id):
    employee = Employees.query.get(id)
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400

    try:
        # You can also validate the fields before updating
        employee.fullname = data.get("fullname", employee.fullname)
        employee.username = data.get("username", employee.username)
        employee.password = data.get("password", employee.password)
        employee.startdate = data.get("startdate", employee.startdate)
        employee.enddate = data.get("enddate", employee.enddate)
        employee.status = data.get("status", employee.status)
        employee.role_id = data.get("role_id", employee.role_id)
        
        db.session.commit()
        return jsonify({"message": "Update success"}), 200
    except IndentationError:
        db.session.rollback()
        return jsonify({"message": "Update failed"}), 500

def delete_employee_service(id):
    employee = Employees.query.get(id)
    if not employee:
        return jsonify({"message": "Employee not found"}), 404
    try:
        db.session.delete(employee)
        db.session.commit()
        return jsonify({"message": "Delete success"}), 200
    except IndentationError:
        db.session.rollback()
        return jsonify({"message": "Delete failed"}), 500
