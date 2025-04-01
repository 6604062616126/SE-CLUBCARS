"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";

const StaffManagementPage: React.FC = () => {
    const [staffs, setStaffs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const router = useRouter();

    const filteredStaffs = (staffs || []).filter(staff => {
        return staff.staffID?.toString().includes(searchTerm) ||
            staff.firstName?.includes(searchTerm) ||
            staff.lastName?.includes(searchTerm) ||
            staff.phoneNumber?.includes(searchTerm);
    });

    useEffect(() => {
        const fetchStaffs = async () => {
            try {
                const res = await fetch("/api/getstaff");
                const data = await res.json();
                setStaffs(data);
            } catch (error) {
                console.error("Error fetching staffs:", error);
            }
        };
        fetchStaffs();
    }, []);

    const handleDelete = async (staffID: number) => {
        try {
            const response = await fetch(`/api/deletestaff`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ staffID }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setStaffs((prevStaffs) => prevStaffs.filter((staff) => staff.staffID !== staffID));
                return true;
            } else {
                alert(data.message);
                return false;
            }
        } catch (error) {
            console.error("🚨 Error deleting car: ", error);
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
            return false;
        }
    };

    // ไปหน้าเพิ่มพนักงาน
    const goToAddStaff = () => {
        router.push("/admin/staff-management/addstaff");
    };

    return (
        <div className=" min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">การจัดการพนักงาน</h1>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <button
                        onClick={goToAddStaff}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        เพิ่มพนักงาน
                    </button>
                    <Link href="/admin">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            ย้อนกลับ
                        </button>
                    </Link>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <input
                        type="text"
                        placeholder="ค้นหาจากรหัสพนักงาน, ชื่อ, อีเมล, เบอร์โทร..."
                        className="p-2 border rounded-lg md:w-96"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === "all" ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            ทั้งหมด
                        </button>
                    </div>
                </div>
            </div>

            {/* Staff List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 bg-gray-100 p-4 font-semibold text-gray-700">
                    <div className="col-span-2">ชื่อ-นามสกุล</div>
                    <div className="col-span-1">เบอร์โทร</div>
                    <div className="col-span-1">การจัดการ</div>
                </div>

                {filteredStaffs.length > 0 ? (
                    filteredStaffs.map((staff) => (
                        <div key={staff.staffID} className="grid grid-cols-4 p-4 border-b hover:bg-gray-50">
                            {/* ชื่อ-สกุล */}
                            <div className="col-span-2 truncate">
                                {staff.firstName} {staff.lastName}
                            </div>

                            {/* เบอร์โทร */}
                            <div className="col-span-1 truncate">{staff.phoneNumber}</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDelete(staff.staffID)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                    title="ลบ"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        ไม่พบข้อมูลพนักงานที่ค้นหา
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-200 rounded-lg">ย้อนกลับ</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg">2</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg">3</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg">ถัดไป</button>
                </div>
            </div>
        </div>
    );
};

export default StaffManagementPage;