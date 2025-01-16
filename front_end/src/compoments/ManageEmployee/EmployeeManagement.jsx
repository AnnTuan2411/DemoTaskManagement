import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFilter, FaPlusCircle } from "react-icons/fa";
import "./em.css";
import { getEmployees, AddEmployees, UpdateEmployees } from "../service/employeeservice";
import Sidebar from "../Sidebar/Sidebar";
import EditIcon from "../assets/icon/edit.svg";
import DeleteIcon from "../assets/icon/delete-2.svg";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredemployees, setFilteredemployees] = useState([]);
    const [filterKeyword, setFilterKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        password: "",
        startdate: "",
        enddate: "",
        status: true,
        role_id: 2,
    });
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const fetchemployees = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response);
            setFilteredemployees(response);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error);
        }
    };

    useEffect(() => {
        fetchemployees();
    }, []);

    useEffect(() => {
        const filtered = employees.filter((employee) => {
            const matchesKeyword = employee.fullname
                ?.toLowerCase()
                .includes(filterKeyword.toLowerCase());
            const matchesStatus =
                statusFilter === "" || employee.status === (statusFilter === "true");
            return matchesKeyword && matchesStatus;
        });
        setFilteredemployees(filtered);
    }, [filterKeyword, statusFilter, employees]);


    const handleEdit = (row) => {
        setCurrentRow(row); // Gán dữ liệu của hàng vào state
        setIsEditPopupOpen(true); // Hiển thị popup
    }
    const handleClosePopup = () => {
        setIsEditPopupOpen(false); // Đóng popup
        setCurrentRow(null); // Xóa dữ liệu hàng hiện tại
    };
    const handleSave = async (currentRow) => {
        const currentDate = new Date();
        const endDate = currentRow.enddate ? new Date(currentRow.enddate) : null;
        const isActive = endDate && endDate > currentDate ? true : currentRow.status;
        currentRow.status = isActive;
        await UpdateEmployees(currentRow.employee_id, currentRow)
        // Thực hiện logic lưu dữ liệu sau khi chỉnh sửa
        setIsEditPopupOpen(false); // Đóng popup sau khi lưu
        window.location.reload();
    };
    const handleDetail = () => {

    }

    const handlePopupSubmit = async (e) => {

        e.preventDefault();
        //console.log("Form Data Submitted: ", formData);
        try {
            await AddEmployees(formData);
            setIsPopupOpen(false);
            setFormData({
                fullname: "",
                username: "",
                password: "",
                startdate: "",
                enddate: "",
                status: true,
                role_id: 2,
            }); // Reset form
            window.location.reload();
        } catch (error) {
            console.error("Failed to save book rate:", error);
        }

    };

    const columns = [
        { name: "#", cell: (row, index) => <span>{index + 1}</span>, width: "50px" },
        { name: "Full Name", selector: (row) => row.fullname || "Chưa xác định", sortable: true },
        {
            name: "Start Date",
            selector: (row) =>
                row.startdate
                    ? new Date(row.startdate).toLocaleDateString("vi-VN")
                    : "Unknow",
            sortable: true,
        },
        {
            name: "End date",
            selector: (row) =>
                row.enddate
                    ? new Date(row.enddate).toLocaleDateString("vi-VN")
                    : "Unknow",
            sortable: true,
        },
        {
            name: "Status",
            cell: (row) => {
                // Lấy ngày hiện tại
                const currentDate = new Date();

                // Kiểm tra điều kiện
                const endDate = row.enddate ? new Date(row.enddate) : null;
                const isActive = endDate && endDate < currentDate ? false : row.status;

                // Hiển thị trạng thái
                return isActive ? "Active" : "Non-Active";
            },
            sortable: true,
        },
        {
            name: "Role",
            cell: (row) => {
                const roles = { 1: "Admin", 2: "Employee" };
                return roles[row.role_id] || "Unknow";
            },
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <>
                    <button onClick={() => handleEdit(row)} className="btn-edit">
                        <img src={EditIcon} alt="Edit Icon" />
                    </button>
                    <button onClick={() => handleDetail(row)} className="btn-detail">
                        <img src={DeleteIcon} alt="Edit Icon" />
                    </button>
                </>
            ),
            sortable: true,
        }
    ];

    return (
        <div className="employee-manager w-full h-screen flex flex-col">
            <Sidebar />
            <div className="content w-full h-full p-4 overflow-auto">
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center"
                    >
                        <FaPlusCircle className="mr-2" />
                        Add Employee
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
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Enter employee name"
                                        value={formData.fullname}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fullname: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        UserName
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Enter employee email"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({ ...formData, username: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Enter employee email"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
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
                                        value={formData.enddate}
                                        min={
                                            formData.startdate
                                                ? new Date(new Date(formData.startdate).getTime() + 86400000)
                                                    .toISOString()
                                                    .split("T")[0]
                                                : new Date().toISOString().split("T")[0]
                                        }
                                        onChange={(e) =>
                                            setFormData({ ...formData, enddate: e.target.value })
                                        }
                                    />
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



                <div className="mb-4 flex items-center">
                    <button
                        className="flex items-center text-blue-500 hover:text-blue-700"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <FaFilter className="mr-2" />
                        Bộ lọc
                    </button>
                </div>

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
                            <option value="true" >Active</option>
                            <option value="false">Non-Active</option>
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

                <div className="overflow-x-auto">
                    <DataTable
                        title="Danh sách nhân viên"
                        columns={columns}
                        data={filteredemployees}
                        pagination
                        highlightOnHover
                        pointerOnHover
                        responsive
                    />

                    {isEditPopupOpen && (
                        <div className="popupedit">
                            <div className="popupedit-content">
                                <h1>Edit Employee</h1>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSave(currentRow);
                                    }}
                                >
                                    <label>
                                        Full Name:
                                        <input
                                            type="text"
                                            value={currentRow.fullname || ""}
                                            onChange={(e) =>
                                                setCurrentRow({ ...currentRow, fullname: e.target.value })
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
                                                currentRow.enddate
                                                    ? new Date(currentRow.enddate)
                                                        .toLocaleDateString("en-CA")
                                                    : ""
                                            }
                                            min={new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString("en-CA")}
                                            onChange={(e) =>
                                                setCurrentRow({ ...currentRow, enddate: e.target.value })
                                            }
                                        />
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

export default EmployeeList;
