// pages/api/addNotifications/route.js
import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";  // เชื่อมต่อฐานข้อมูล

export async function POST(req, res) {    
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // ดึงข้อมูลจาก body ที่ส่งมา
        const { sendDate, message, recipient, CustomerID } = req.body;

        // ตรวจสอบว่าไม่ได้ขาดข้อมูล
        if (!sendDate || !message || !recipient || !CustomerID) {
            return res.status(400).json({ message: "⚠️ กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        // คำสั่ง SQL สำหรับการแทรกข้อมูลลงในตาราง Notifications
        const query = `
            INSERT INTO Notifications (sendDate, message, recipient, CustomerID)
            VALUES (?, ?, ?, ?)
`                           ;

        try {
            await mysqlPool.promise().query(query, [sendDate, message, recipient, CustomerID]);
            return res.status(200).json({ message: "✅ เพิ่มการแจ้งเตือนสำเร็จ!" });
        } catch (err) {
            console.error("🚨 ERROR:", err.message, err.stack);
            return res.status(500).json({ message: `ล้มเหลว: ${err.message}` });
        }


    } catch (err) {
        console.error("🚨 ERROR:", err.message, err.stack);
        return res.status(500).json({ message: `ล้มเหลว: ${err.message}` });
    }
}