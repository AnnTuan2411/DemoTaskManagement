from library.extension import db
from library.library_ma import ETaskSchema
from library.model import ETasks
from flask import request, jsonify
import json
etask_schema =ETaskSchema()
etasks_schema = ETaskSchema(many=True)

def add_etask_service():
    taskname = request.json['taskname']
    startdate = request.json['startdate']
    target_enddate = request.json['target_enddate']
    created_by = request.json['created_by']
    completed_date = request.json['completed_date']
    status = request.json['status']
    employee_id = request.json['employee_id']
    try:
        new_etask = ETasks(taskname,startdate,target_enddate,created_by,completed_date,status,employee_id)
        db.session.add(new_etask)
        db.session.commit()
        return "Add success"
    except IndentationError:
        db.session.rollback()
        return "Add failed"
    
def get_etask_by_id_service(id):
    etask = ETasks.query.get(id)
    if etask:
        return etask_schema.jsonify(etask)
    else:
        return "Not found etask"
    
def get_all_etask_service():
    etasks = ETasks.query.all()
    if etasks:
        return etasks_schema.jsonify(etasks)
    else:
        return "Not found etasks"


def update_etask_service(id):
    etask = ETasks.query.get(id)
    if not etask:
        return jsonify({"message": "etask not found"}), 404

    data = request.json
    if not data:
        return jsonify({"message": "No data provided"}), 400

    try:
        # You can also validate the fields before updating
        etask.taskname = data.get("taskname", etask.taskname)
        etask.startdate = data.get("startdate", etask.startdate)
        etask.target_enddate = data.get("target_enddate", etask.target_enddate)
        etask.created_by = data.get("created_by", etask.created_by)
        etask.completed_date = data.get("completed_date", etask.completed_date)
        etask.status = data.get("status", etask.status)
        etask.employee_id = data.get("employee_id", etask.employee_id)
        
        db.session.commit()
        return jsonify({"message": "Update success"}), 200
    except IndentationError:
        db.session.rollback()
        return jsonify({"message": "Update failed"}), 500
    
def delete_etask_service(id):
    etask = ETasks.query.get(id)
    if not etask:
        return jsonify({"message": "Etask not found"}), 404
    try:
        db.session.delete(etask)
        db.session.commit()
        return jsonify({"message": "Delete success"}), 200
    except IndentationError:
        db.session.rollback()
        return jsonify({"message": "Delete failed"}), 500
    
def get_etask_by_employee_id_service(employee_id):
    etasks = ETasks.query.filter_by(employee_id = employee_id).all()
    if etasks:
        return etasks_schema.jsonify(etasks)
    else:
        return {"message": "No tasks found for the given employee_id"}, 404

