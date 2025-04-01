"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useBooking } from '../context/bookingcontext';

const CarDetailPage = () => {
    const [days, setDays] = useState(1);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [car, setCar] = useState<any>(null);
    const router = useRouter();
    const params = useParams();
    const { selectedCar, setBooking } = useBooking();

    // ดึงข้อมูลรถจาก API ตาม carID
    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const res = await fetch(`/api/getcar/${params.carID}`);
                const data = await res.json();
                if (res.ok) {
                    setCar(data);
                    // บันทึกข้อมูลรถลง context
                    setBooking({
                        selectedCar: data,
                        pickupDate: "",
                        returnDate: "",
                        pickupLocation: ""
                    });
                    console.log("ข้อมูลรถที่ดึงมาจาก API:", data); // เพิ่ม log นี้
                } else {
                    console.error("Error fetching car data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching car data:", error);
            }
        };

        console.log("params.carID:", params.carID); // แสดง carID จาก URL
        console.log("selectedCar จาก context:", selectedCar); // แสดงข้อมูลจาก context

        if (selectedCar && selectedCar.carID === params.carID) {
            console.log("ใช้ข้อมูลจาก context");
            setCar(selectedCar);
        } else {
            console.log("ดึงข้อมูลจาก API");
            fetchCarData();
        }
    }, [params.carID, selectedCar, setBooking]);

    if (!car) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen ">
                <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">กำลังโหลดข้อมูลรถ...</h1>
                    <p className="text-gray-600 mb-6">กรุณารอสักครู่</p>
                </div>
            </div>
        );
    }

    const {
        carID,
        LPlate,
        model,
        brand,
        carType,
        rentalPrice,
        status,
        carImg = "/car1.png",
        additionalImages = []
    } = car;

    const deposit = 5000;
    const deliveryFee = 100;
    const pickupFee = 100;

    const images = [carImg, ...additionalImages];
    const specifications = [
        { icon: "/icon/caricon.png", label: "ป้ายทะเบียน", value: LPlate },
        { icon: "/icon/caricon.png", label: "ยี่ห้อ", value: brand },
        { icon: "/icon/caricon.png", label: "รุ่น", value: model },
        { icon: "/icon/caricon.png", label: "ประเภทรถ", value: carType },
        { icon: "/icon/caricon.png", label: "สถานะ", value: status },
        { icon: "/icon/caricon.png", label: "ราคาเช่าต่อวัน", value: `${rentalPrice.toLocaleString()} บาท` },
    ];

    const totalRentalCost = days * rentalPrice;
    const totalFees = deliveryFee + pickupFee;
    const grandTotal = totalRentalCost + totalFees;

    const handleImageClick = (image: string) => {
        setExpandedImage(image === expandedImage ? null : image);
    };

    const handleRentClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            router.push("/checkout");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 mt-16">
            {/* ส่วนหัว */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2">ย้อนกลับ</span>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">รายละเอียดรถเช่า</h1>
                        <div className="w-6"></div>
                    </div>
                </div>
            </header>

            {/* ส่วนเนื้อหา */}
            <main className="container mx-auto px-4 py-6">
                {/* ชื่อรถ */}
                <div className="mb-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {brand} {model}
                    </h2>
                    <p className="text-gray-500">{carType}</p>
                </div>

                {/* แกลเลอรี่รูปภาพ */}
                <div className="flex justify-center mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative aspect-video overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handleImageClick(image)}
                            >
                                <Image
                                    src={image || "/car1.png"}
                                    alt={`${brand} ${model} - ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/car1.png";
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* รูปภาพขยาย */}
                {expandedImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                        onClick={() => setExpandedImage(null)}
                    >
                        <div className="relative w-full max-w-4xl h-3/4">
                            <Image
                                src={expandedImage || "/car1.png"}
                                alt="Expanded car view"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}

                {/* รายละเอียดรถ */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* ข้อมูลรถ */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">ข้อมูลรถ</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {specifications.map((spec, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <Image
                                            src={spec.icon}
                                            alt={spec.label}
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{spec.label}</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {spec.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ฟอร์มจองรถ */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">รายละเอียดการจอง</h3>

                        {/* จำนวนวันเช่า */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนวันเช่า</label>
                            <div className="flex items-center">
                                <button
                                    onClick={() => setDays(Math.max(1, days - 1))}
                                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-l-lg"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={days}
                                    min="1"
                                    onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                                    className="border-t border-b border-gray-300 py-2 px-4 w-16 text-center"
                                />
                                <button
                                    onClick={() => setDays(days + 1)}
                                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* รายละเอียดราคา */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">ค่าเช่ารถ {days} วัน</span>
                                <span className="font-medium">฿{totalRentalCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">ค่ารับ-ส่งรถ</span>
                                <span className="font-medium">฿{totalFees.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">ค่ามัดจำ</span>
                                <span className="font-medium">฿{deposit.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold">รวมทั้งหมด</span>
                                    <span className="font-bold text-blue-600">฿{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleRentClick}
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังประมวลผล...
                                </span>
                            ) : (
                                'เช่ารถคันนี้'
                            )}
                        </button>

                        <p className="text-xs text-gray-500 mt-3 text-center">
                            *ราคานี้ยังไม่รวมส่วนลดและโปรโมชั่น
                        </p>
                    </div>
                </div>
            </main>

            {/* แถบการดำเนินการ */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">ราคาทั้งหมด</p>
                        <p className="text-xl font-bold text-blue-600">฿{grandTotal.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={handleRentClick}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-lg transition-colors"
                    >
                        {isLoading ? 'กำลังโหลด...' : 'เช่ารถคันนี้'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarDetailPage;