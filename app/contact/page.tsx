"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Contact: React.FC = () => {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setSuccessMessage("ข้อความของคุณถูกส่งเรียบร้อยแล้ว!");
            setUsername("");
            setMessage("");
        }, 1500);
    };

    return (
        <div className="bg-blue-700 p-16">
            {/* Left Section - Title and Description */}
            <div className="flex flex-col items-center p-8 space-y-4">
                <h1 className="text-5xl font-extrabold text-center text-white ">ติดต่อเรา</h1>
                <p className="text-lg text-center text-white ">
                    "เรายินดีรับฟังความคิดเห็นและข้อสงสัยจากคุณ"</p>
            </div>

            <div className=" grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Contact Form */}
                <div className="bg-white p-9 rounded-3xl shadow-lg text-black space-y-6">
                    <h2 className="text-lg text-center text-gray-600 font-bold opacity-90r">ส่งข้อความถึงเรา</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                        <input
                            type="text"
                            placeholder="Username"
                            className="border-2 border-gray-300 p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="ระบุปัญหาของท่าน"
                            className="border-2 border-gray-300 p-4 rounded-xl w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-800 disabled:bg-blue-400 transition-colors duration-200"
                        >
                            {isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}
                        </button>
                    </form>

                    {successMessage && (
                        <div className="mt-4 text-green-600 text-center">{successMessage}</div>
                    )}
                    {errorMessage && (
                        <div className="mt-4 text-red-600 text-center">{errorMessage}</div>
                    )}
                </div>

                

                {/* Contact Information */}
                    
                <div className="bg-white p-9 rounded-3xl shadow-lg space-y-6">
                    <h2 className="text-lg text-center text-gray font-bold opacity-90">หรือ</h2>
                        <a
                            href="mailto:ClubCars999@gmail.com"
                            className="flex items-center justify-start bg-white p-3 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-200"
                        >
                            <Image
                                src="/images/email-icon.png"
                                alt="Email Icon"
                                width={24}
                                height={24}
                            />
                            <span className="text-blue-700 text-xl ml-3">ClubCars999@gmail.com</span>
                        </a>
                        <a
                            href="https://instagram.com/ClubCarsofficial_"
                            className="flex items-center justify-start bg-white p-3 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/instagram-icon.png"
                                alt="Instagram Icon"
                                width={24}
                                height={24}
                            />
                            <span className="text-blue-700 text-xl ml-3">ClubCarsofficial_</span>
                        </a>
                        <a
                            href="https://facebook.com/ClubCarsThailand"
                            className="flex items-center justify-start bg-white p-3 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/facebook-icon.png"
                                alt="Facebook Icon"
                                width={24}
                                height={24}
                            />
                            <span className="text-blue-700 text-xl ml-3">ClubCars Thailand</span>
                        </a>
                        <a
                            href="https://facebook.com/ClubCarsThailand"
                            className="flex items-center justify-start bg-white p-3 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/facebook-icon.png"
                                alt="Facebook Icon"
                                width={24}
                                height={24}
                            />
                            <span className="text-blue-700 text-xl ml-3">ClubCars Thailand</span>
                        </a>
                        <a
                            href="https://facebook.com/ClubCarsThailand"
                            className="flex items-center justify-start bg-white p-3 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/facebook-icon.png"
                                alt="Facebook Icon"
                                width={24}
                                height={24}
                            />
                            <span className="text-blue-700 text-xl ml-3">ClubCars Thailand</span>
                        </a>
                    </div>
                </div>
                <div className="text-white text-center w-full mt-12">
                    <p className="text-lg">"ขอบคุณที่ติดต่อเรา เราจะตอบกลับโดยเร็วที่สุด"</p>
                    <p className="text-sm text-white">เวลาทำการ จันทร์-ศุกร์ 9.00-18.00 น.</p>
                </div>
            </div>
    );
};

export default Contact;
