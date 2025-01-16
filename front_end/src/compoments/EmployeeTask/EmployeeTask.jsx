import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFilter } from "react-icons/fa";
//import { useNavigate } from "react-router-dom";
import { getEtaskbyEmployeeId, UpdateEtasks } from "../service/etaskservice";
import "./em.css"
import EditIcon from "../assets/icon/edit.svg";
import Swal from 'sweetalert2';

const EtaskList = () => {
    const [etasks, setetasks] = useState([]);
    const [filteredetasks, setFilteredetasks] = useState([]);
    const [filterKeyword, setFilterKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilter, setShowFilter] = useState(false); // Trạng thái hiển thị bộ lọc
    const employeeId = sessionStorage.getItem('employee_id');
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
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
        const targetEndDate = new Date(currentRow.target_enddate);

        if (currentDate > targetEndDate) {
            Swal.fire({
                icon: "error",
                title: "Unable to complete",
                text: "The deadline has expired and cannot be complete",
                confirmButtonText: "OK",
            });
            return;
        }
        try {
            // Gán ngày hoàn thành
            currentRow.completed_date = currentDate; // Sử dụng định dạng ISO cho đồng bộ
            currentRow.status=true;
    
            // Gọi API để cập nhật task
            await UpdateEtasks(currentRow.etask_id, currentRow);
    
            // Cập nhật state etasks
            setetasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.etask_id === currentRow.etask_id
                        ? { ...task, completed_date: currentRow.completed_date }
                        : task
                )
            );
            setIsEditPopupOpen(false);
        }catch(error){

        }

    };

    const fetchetasks = async () => {
        try {
            const response = await getEtaskbyEmployeeId(employeeId);
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
                if (new Date(row.completed_date) < new Date(row.startdate)) {
                    return "Unfinished";
                }
                const completedDate = new Date(row.completed_date);
                const formattedDate = completedDate.toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });

                return formattedDate;
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
            name: "Action",
            cell: (row) => (
                <>
                    <button onClick={() => handleEdit(row)} className="btn-edit mr-2">
                        <img src={EditIcon} alt="Edit Icon" />
                    </button>
                </>
            ),
            sortable: true,
        }
    ];

    return (
        <div className="etask-manager w-full h-screen flex flex-col">
            <div className="content w-full h-full p-4 overflow-auto">

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
                                <h1>Complete Task</h1>
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
                                            disabled
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
                                            disabled
                                        />
                                    </label>
                                    <div className="flex justify-end">
                                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" >Complete</button>
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
