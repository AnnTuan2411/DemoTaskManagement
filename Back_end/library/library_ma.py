from .extension import ma

class EmployeeSchema(ma.Schema):
    class Meta:
        fields = ('employee_id','fullname','username','password','startdate','enddate','status','role_id')

class ETaskSchema(ma.Schema):
    class Meta:
        fields = ('etask_id','taskname','startdate','target_enddate','created_by','completed_date','status','employee_id')


class RoleSchema(ma.Schema):
    class Meta:
        fields = ('role_id','rolename')