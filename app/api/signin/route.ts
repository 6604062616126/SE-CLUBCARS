import { NextRequest, NextResponse } from "next/server";  // เพิ่ม NextRequest
import { mysqlPool } from "@/utils/db";
import bcrypt from "bcryptjs"; 

export async function POST(req: NextRequest) {  // กำหนดประเภทของ req
  console.log("📌 API signin hit");

  try {
      const body = await req.json();  // อ่าน JSON request body
      const { firstName, lastName, username, phone, password } = body;

      // ตรวจสอบข้อมูลที่กรอก
      if (!firstName || !lastName || !username || !phone || !password) {
          return NextResponse.json({ message: "⚠️ กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
      }
      // เข้ารหัสรหัสผ่านก่อนเก็บในฐานข้อมูล
      const hashedPassword = await bcrypt.hash(password, 10);  // 10 คือจำนวน salt rounds
      const query = `
          INSERT INTO Customer (firstName, lastName, userName, phoneNumber, password)
          VALUES (?, ?, ?, ?, ?)
      `;

      await mysqlPool.promise().query(query, [firstName, lastName, username, phone, hashedPassword]);

      return NextResponse.json({ message: "✅ สมัครสมาชิกสำเร็จ!" }, { status: 200 });

  } catch (err) {
      console.error("🚨 Error inserting customer data:", err);
      return NextResponse.json({ message: "❌ ล้มเหลวในการสมัครสมาชิก" }, { status: 500 });
  }
}
