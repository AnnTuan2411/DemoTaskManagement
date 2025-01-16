from .extension import db

class Employees(db.Model):
    employee_id= db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String, nullable=False)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    startdate = db.Column(db.DateTime)
    enddate = db.Column(db.DateTime)
    status = db.Column(db.Boolean, default=True)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.role_id")) 
    def __init__(self, fullname, username, password, startdate, enddate, status, role_id):
        self.fullname=fullname
        self.username=username
        self.password=password
        self.startdate=startdate
        self.enddate=enddate
        self.status=status
        self.role_id=role_id

class ETasks(db.Model):
    etask_id= db.Column(db.Integer, primary_key=True)
    taskname = db.Column(db.String, nullable=False)
    startdate = db.Column(db.DateTime)
    target_enddate = db.Column(db.DateTime)
    created_by = db.Column(db.String, nullable=False)
    completed_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.Boolean, default=False)
    employee_id = db.Column(db.Integer, db.ForeignKey("employees.employee_id"))
    def __init__(self, taskname, startdate, target_enddate, created_by, completed_date, status,employee_id):
        self.taskname=taskname
        self.startdate=startdate
        self.target_enddate=target_enddate
        self.created_by=created_by
        self.completed_date=completed_date
        self.status=status
        self.employee_id=employee_id

class Roles(db.Model):
    role_id= db.Column(db.Integer, primary_key=True)
    rolename = db.Column(db.String, nullable=False)
    def __init__(self, rolename):
        self.rolename=rolename