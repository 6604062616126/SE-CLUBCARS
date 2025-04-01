"use client";

import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface Payment {
    id: string;
    customerName: string;
    customerEmail: string;
    bookingId: string;
    carModel: string;
    bookingDate: string;
    amount: number;
    paymentImage: string;
    status: "pending" | "verified" | "rejected";
    submittedAt: string;
}

const PaymentVerificationPage: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        // Mock data - ใน production ให้เรียก API จริง
        const mockPayments: Payment[] = [
            {
                id: "1",
                customerName: "สมชาย ใจดี",
                customerEmail: "somchai@example.com",
                bookingId: "BK001",
                carModel: "Toyota Camry",
                bookingDate: "2023-06-15",
                amount: 2500,
                paymentImage: "/payment-qr-sample.jpg",
                status: "pending",
                submittedAt: "2023-06-14T10:30:00",
            },
            {
                id: "2",
                customerName: "สุนิตา เก่งมาก",
                customerEmail: "sunita@example.com",
                bookingId: "BK002",
                carModel: "Honda Civic",
                bookingDate: "2023-06-16",
                amount: 1800,
                paymentImage: "/payment-qr-sample.jpg",
                status: "verified",
                submittedAt: "2023-06-15T14:45:00",
            },
            {
                id: "3",
                customerName: "อนุชา สบายดี",
                customerEmail: "anucha@example.com",
                bookingId: "BK003",
                carModel: "Ford Mustang",
                bookingDate: "2023-06-18",
                amount: 3500,
                paymentImage: "/payment-qr-sample.jpg",
                status: "pending",
                submittedAt: "2023-06-17T09:15:00",
            },
        ];
        setPayments(mockPayments);
    }, []);

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || payment.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleToggleVerification = async (paymentId: string) => {
        try {
            setPayments(payments.map(payment => {
                if (payment.id === paymentId) {
                    const newStatus = payment.status === 'verified' ? 'rejected' : 'verified';
                    return { ...payment, status: newStatus };
                }
                return payment;
            }));
        } catch (error) {
            console.error("Error toggling payment verification:", error);
        }
    };

    const openModal = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPayment(null);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    return (
        <main className=" px-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">ตรวจสอบการชำระเงิน</h1>
                <Link
                    href="/admin"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    ย้อนกลับ
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาด้วยชื่อลูกค้า, อีเมล, หรือรหัสการจอง"
                            className="pl-10 pr-4 py-2 border rounded-lg w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="p-2 border rounded-lg"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">สถานะทั้งหมด</option>
                        <option value="pending">รอตรวจสอบ</option>
                        <option value="verified">ยืนยันแล้ว</option>
                        <option value="rejected">ปฏิเสธ</option>
                    </select>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การจอง</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดชำระ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ส่ง</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{payment.customerName}</div>
                                        <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">#{payment.bookingId}</div>
                                        <div className="text-sm text-gray-500">{payment.carModel}</div>
                                        <div className="text-sm text-gray-500">วันที่จอง: {payment.bookingDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {payment.amount.toLocaleString('th-TH')} บาท
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${payment.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {payment.status === 'verified' ? 'ยืนยันแล้ว' :
                                                payment.status === 'rejected' ? 'ปฏิเสธ' : 'รอตรวจสอบ'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(payment.submittedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => openModal(payment)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            ดูสลิป
                                        </button>
                                        <button
                                            onClick={() => handleToggleVerification(payment.id)}
                                            className={`${payment.status === 'verified' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                        >
                                            {payment.status === 'verified' ? 'ยกเลิกการยืนยัน' : 'ยืนยันการชำระเงิน'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Payment Image */}
            {isModalOpen && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    หลักฐานการชำระเงิน #{selectedPayment.bookingId}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="border rounded-lg overflow-hidden">
                                        <Image
                                            src={selectedPayment.paymentImage}
                                            alt="Payment slip"
                                            width={500}
                                            height={300}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-3">รายละเอียดการจอง</h4>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">ลูกค้า:</span> {selectedPayment.customerName}</p>
                                        <p><span className="font-medium">อีเมล:</span> {selectedPayment.customerEmail}</p>
                                        <p><span className="font-medium">รหัสการจอง:</span> #{selectedPayment.bookingId}</p>
                                        <p><span className="font-medium">รถที่จอง:</span> {selectedPayment.carModel}</p>
                                        <p><span className="font-medium">วันที่จอง:</span> {selectedPayment.bookingDate}</p>
                                        <p><span className="font-medium">ยอดชำระ:</span> {selectedPayment.amount.toLocaleString('th-TH')} บาท</p>
                                        <p><span className="font-medium">สถานะ:</span>
                                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${selectedPayment.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                    selectedPayment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {selectedPayment.status === 'verified' ? 'ยืนยันแล้ว' :
                                                    selectedPayment.status === 'rejected' ? 'ปฏิเสธ' : 'รอตรวจสอบ'}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="mt-6 flex space-x-3">
                                        {selectedPayment.status === 'verified' ? (
                                            <button
                                                onClick={() => {
                                                    handleToggleVerification(selectedPayment.id);
                                                    closeModal();
                                                }}
                                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                <FaTimesCircle className="mr-2" /> ยกเลิกการยืนยัน
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    handleToggleVerification(selectedPayment.id);
                                                    closeModal();
                                                }}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                <FaCheckCircle className="mr-2" /> ยืนยันการชำระเงิน
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default PaymentVerificationPage;