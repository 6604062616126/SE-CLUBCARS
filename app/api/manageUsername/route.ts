import { NextRequest, NextResponse } from "next/server";
const jwt = require("jsonwebtoken");
import { mysqlPool } from "@/utils/db";
import { config } from "@/config"; // ดึง secret key
const SECRET_KEY = config.JWT_SECRET;

export async function PUT(req: NextRequest) {
  try {
     // ดึง Token จาก Header
     const token = req.headers.get("authorization")?.split(" ")[1];

     // เช็คว่า Token มีค่าหรือไม่
     if (!token) {
       console.error("🚨 No token provided");
       return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
     }
 
     // แสดงค่า Token ที่ได้รับ เพื่อการตรวจสอบ
     console.log("🔑 Received Token: ", token);
 
     // ตรวจสอบ Token โดยใช้ try-catch เพื่อไม่ให้เกิดการ crash
     let decoded;
   try {
       decoded = jwt.verify(token, SECRET_KEY);
       console.log("Decoded token:", decoded);
     } catch (err) {
       console.error("🚨 Invalid or expired token:", err);
       return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }
 
     // ตรวจสอบว่ามี id ใน Token หรือไม่
     const CustomerID = decoded.id;
     if (!CustomerID) {
       console.error("🚨 Token does not contain valid ID");
       return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
     }
 
     // รับค่าจาก Body
     const { userName, phoneNumber } = await req.json();
 
     // ถ้าไม่ได้ส่งค่าอะไรมาเลย
     if (!userName && !phoneNumber) {
       return NextResponse.json({ error: "โปรดใส่ username หรือเบอร์โทรศัพท์" }, { status: 400 });
     }
 
     

    let errors: string[] = [];

    // เช็ค userName ซ้ำ ถ้ามีการส่งมา
    if (userName) {
      const checkUserQuery = `SELECT CustomerID FROM Customer WHERE userName = ? AND CustomerID != ?`;
      const [existingUser]: any = await mysqlPool.promise().query(checkUserQuery, [userName, CustomerID]);

      if (existingUser.length > 0) {
        errors.push("มีคนใช้ชื่อนี้แล้ว");
      } else {
        // อัปเดต userName
        const updateUserQuery = `UPDATE Customer SET userName = ? WHERE CustomerID = ?`;
        await mysqlPool.promise().query(updateUserQuery, [userName, CustomerID]);
      }
    }

    // เช็ค phoneNumber ซ้ำ ถ้ามีการส่งมา
    if (phoneNumber) {
      const checkphoneQuery = `SELECT CustomerID FROM Customer WHERE phoneNumber = ? AND CustomerID != ?`;
      const [existingPhone]: any = await mysqlPool.promise().query(checkphoneQuery, [phoneNumber, CustomerID]);

      if (existingPhone.length > 0) {
        errors.push("มีเบอร์นี้ในระบบแล้ว");
      } else if (!/^\d+$/.test(phoneNumber)) {
        errors.push("กรุณากรอกตัวเลข");
      } else {
        // อัปเดต phoneNumber
        const updatePhoneQuery = `UPDATE Customer SET phoneNumber = ? WHERE CustomerID = ?`;
        await mysqlPool.promise().query(updatePhoneQuery, [phoneNumber, CustomerID]);
      }
    }

    // ถ้ามีข้อผิดพลาด ให้ส่งกลับทั้งหมด
    if (errors.length > 0) {
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    return NextResponse.json({ message: "อัพเดทโปรไฟล์สำเร็จ ✅" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
