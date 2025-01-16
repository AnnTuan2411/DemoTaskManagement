import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFilter, FaPlusCircle } from "react-icons/fa";
//import { useNavigate } from "react-router-dom";
import { getEtasks, AddEtasks, UpdateEtasks, DeleteEtasks } from "../service/etaskservice";
import { getEmployees, getEmployeebyId } from "../service/employeeservice";
import "./em.css"
import Sidebar from '../Sidebar/Sidebar'
import EditIcon from "../assets/icon/edit.svg";
import DeleteIcon from "../assets/icon/delete-2.svg";
import Swal from 'sweetalert2';

const EtaskList = () => {
    const [etasks, setetasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredetasks, setFilteredetasks] = useState([]);
    const [filterKeyword, setFilterKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilter, setShowFilter] = useState(false); // Trạng thái hiển thị bộ lọc
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const employeeId = sessionStorage.getItem('employee_id');
    const [formData, setFormData] = useState({
        taskname: "",
        startdate: "",
        target_enddate: "",
        created_by: "",
        completed_date: "",
        status: false,
        employee_id: "",
    });

    const handlePopupSubmit = async (e) => {
        e.preventDefault();
        try {
            const emp = await getEmployeebyId(employeeId)
            const updatedFormData = {
                ...formData,
                created_by: emp.fullname, // Gán fullname vào created_by
            };
            setFormData(updatedFormData);
            await AddEtasks(updatedFormData);
            setIsPopupOpen(false);
            setFormData({
                taskname: "",
                startdate: "",
                target_enddate: "",
                created_by: "",
                completed_date: "",
                status: false,
                employee_id: "",
            });
            window.location.reload();
        } catch (error) {
            console.error("Failed to save etasks:", error);
        }

    };
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const handleEdit = (row) => {
        if(row.status===true){
            Swal.fire({
                icon: "error",
                title: "Unable to edit",
                text: "The deadline has been completed, You can not edit",
                confirmButtonText: "OK",
            });
            return;
        }
        setCurrentRow(row); // Gán dữ liệu của hàng vào state
        setIsEditPopupOpen(true); // Hiển thị popup
    }
    const handleClosePopup = () => {
        setIsEditPopupOpen(false); // Đóng popup
        setCurrentRow(null); // Xóa dữ liệu hàng hiện tại
    };
    const handleSave = async (currentRow) => {
        
        await UpdateEtasks(currentRow.etask_id, currentRow)
        setIsEditPopupOpen(false); // Đóng popup sau khi lưu
        window.location.reload();
    };
    const handleDelete = (currentRow) => {
        Swal.fire({
            text: "Do you really want to delete this task?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete!",
            cancelButtonText: "No"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await DeleteEtasks(currentRow.etask_id);
                window.location.reload();
            }
        });

    }

    const fetchetasks = async () => {
        try {
            const employeedata = await getEmployees();
            setEmployees(employeedata);
            const response = await getEtasks();
            setetasks(response);
            setFilteredetasks(response);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error);
        }
    };

    useEffect(() => {
        fetchetasks();
    }, []);

    useEffect(() => {
        const filtered = etasks.filter((etask) => {
            const matchesKeyword =
                etask.taskname
                    ?.toLowerCase()
                    .includes(filterKeyword.toLowerCase())

            const matchesStatus =
                statusFilter === "" || etask.status === (statusFilter === "true");

            return matchesKeyword && matchesStatus;
        });
        setFilteredetasks(filtered);
    }, [filterKeyword, statusFilter, etasks]);


    const columns = [
        {
            name: "#",
            cell: (row, index) => <span>{index + 1}</span>,
            width: "50px",
        },
        {
            name: "Task Name",
            selector: (row) => row.taskname || "Chưa xác định",
            sortable: true,
        },
        {
            name: "Start Date",
            selector: (row) => row.startdate ? new Date(row.startdate).toLocaleDateString('vi-VN') : "Chưa xác định",
            sortable: true,
        },
        {
            name: "End Date",
            selector: (row) => row.target_enddate ? new Date(row.target_enddate).toLocaleDateString('vi-VN') : "Chưa xác định",
            sortable: true,
        },
        {
            name: "Create by",
            selector: (row) => row.created_by || "Chưa xác định",
            sortable: true,
        },
        {
            name: "Complete Date",
            selector: (row) => {
                // Kiểm tra nếu completed_date nhỏ hơn startdate hoặc không có completed_date
                if (!row.completed_date || new Date(row.completed_date) < new Date(row.startdate)) {
                    return "Chưa hoàn thành";
                }
                return row.completed_date;
            },
            sortable: true,
        }
        ,
        {
            name: "Status",
            cell: (row) => (
                <>
                    {row.status === false && (
                        "New"
                    )}
                    {row.status === true && (
                        "Completed"
                    )}
                </>
            ),
            sortable: true,
        },
        {
            name: "Made by",
            selector: (row) => {
                const employee = employees.find(emp => emp.employee_id === row.employee_id);
                return employee ? employee.fullname : "Unknown";
            },
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <>
                    <button onClick={() => handleEdit(row)} className="btn-edit mr-2">
                        <img src={EditIcon} alt="Edit Icon" />
                    </button>
                    <button onClick={() => handleDelete(row)} className="btn-detail">
                        <img src={DeleteIcon} alt="Edit Icon" />
                    </button>
                </>
            ),
            sortable: true,
        }
    ];

    return (
        <div className="etask-manager w-full h-screen flex flex-col">
            <Sidebar />
            <div className="content w-full h-full p-4 overflow-auto">
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center"
                    >
                        <FaPlusCircle className="mr-2" />
                        Add Task
                    </button>
                </div>
                {isPopupOpen && (
                    <>
                        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}></div>
                        <div className="popup-container">
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="popup-close-btn"
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-bold mb-4">Add Employee</h2>
                            <form onSubmit={handlePopupSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Task Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Enter employee name"
                                        value={formData.taskname}
                                        onChange={(e) =>
                                            setFormData({ ...formData, taskname: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={formData.startdate}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => {
                                            const newStartDate = e.target.value;
                                            setFormData({
                                                ...formData,
                                                startdate: newStartDate,
                                                enddate: newStartDate > formData.enddate ? "" : formData.enddate // Reset enddate nếu không hợp lệ
                                            });
                                        }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Enter employee email"
                                        value={formData.target_enddate}
                                        min={
                                            formData.startdate
                                                ? new Date(new Date(formData.startdate).getTime() + 86400000)
                                                    .toISOString()
                                                    .split("T")[0]
                                                : new Date().toISOString().split("T")[0]
                                        }
                                        onChange={(e) =>
                                            setFormData({ ...formData, target_enddate: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Made by
                                    </label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={formData.employee_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, employee_id: e.target.value })
                                        }
                                    >
                                        <option value="" disabled>
                                            Select an employee
                                        </option>
                                        {employees
                                            .filter(
                                                (employee) =>
                                                    employee.status === true &&
                                                    new Date(employee.enddate) > new Date(formData.target_enddate)
                                            )
                                            .map((employee) => (
                                                <option key={employee.employee_id} value={employee.employee_id}>
                                                    {employee.fullname}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsPopupOpen(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
                {/* Nút hiển thị/ẩn bộ lọc */}
                <div className="mb-4 flex items-center">
                    <button
                        className="flex items-center text-blue-500 hover:text-blue-700"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <FaFilter className="mr-2" />
                        Bộ lọc
                    </button>
                </div>

                {/* Phần bộ lọc */}
                {showFilter && (
                    <div className="flex flex-wrap items-center mb-4 gap-4 bg-gray-100 p-4 rounded-md">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên nhân viên "
                            className="border p-2 rounded flex-1 min-w-[200px]"
                            value={filterKeyword}
                            onChange={(e) => setFilterKeyword(e.target.value)}
                        />
                        <select
                            className="border p-2 rounded flex-1 min-w-[200px]"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="true" >Completed</option>
                            <option value="false">New</option>
                        </select>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={() => {
                                setFilterKeyword("");
                                setStatusFilter("");
                            }}
                        >
                            Xóa lọc
                        </button>
                    </div>
                )}

                {/* DataTable */}
                <div className="overflow-x-auto">
                    <DataTable
                        title="Danh sách nhiệm vụ"
                        columns={columns}
                        data={filteredetasks}
                        pagination
                        highlightOnHover
                        pointerOnHover
                        responsive
                    />
                    {isEditPopupOpen && (
                        <div className="popupedit">
                            <div className="popupedit-content">
                                <h1>Edit Task</h1>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSave(currentRow);
                                    }}
                                >
                                    <label>
                                        Task Name:
                                        <input
                                            type="text"
                                            value={currentRow.taskname || ""}
                                            onChange={(e) =>
                                                setCurrentRow({ ...currentRow, taskname: e.target.value })
                                            }
                                            readOnly
                                        />
                                    </label>
                                    <label>
                                        Start Date:
                                        <input
                                            type="date"
                                            value={
                                                currentRow.startdate
                                                    ? new Date(currentRow.startdate)
                                                        .toLocaleDateString("en-CA")
                                                    : ""
                                            }
                                            min={new Date().toLocaleDateString("en-CA")} // Chỉ chọn được ngày hiện tại
                                            onChange={(e) =>
                                                setCurrentRow({ ...currentRow, startdate: e.target.value })
                                            }
                                            onFocus={(e) => {

                                                if (!formData.startdate) {
                                                    e.target.value = new Date().toLocaleDateString("en-CA");
                                                }
                                            }}
                                        />
                                    </label>
                                    <label>
                                        End Date:
                                        <input
                                            type="date"
                                            value={
                                                currentRow.target_enddate
                                                    ? new Date(currentRow.target_enddate)
                                                        .toLocaleDateString("en-CA")
                                                    : ""
                                            }
                                            min={new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString("en-CA")}
                                            onChange={(e) =>
                                                setCurrentRow({ ...currentRow, target_enddate: e.target.value })
                                            }
                                        />
                                    </label>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Made by
                                        <select
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            value={currentRow.employee_id}
                                            onChange={(e) =>
                                                setCurrentRow({ ...currentRow, employee_id: e.target.value })
                                            }
                                        >
                                            {employees.map((employee) => (
                                                <option key={employee.employee_id} value={employee.employee_id}>
                                                    {employee.fullname}  {/* Hiển thị fullname của nhân viên */}
                                                </option>
                                            ))}
                                        </select>
                                    </label>


                                    <div className="flex justify-end">
                                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" >Save</button>
                                        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md " onClick={handleClosePopup}>
                                            Cancel
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default EtaskList;
