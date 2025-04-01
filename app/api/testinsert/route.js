import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";  // เชื่อมต่อฐานข้อมูล MySQL

// ตัวอย่างการทดสอบการส่งคำขอ POST ใน React หรือ JavaScript
const addNotitest = async () => {
    const response = await fetch('/api/testinsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sendDate: '2025-04-01 10:00:00',
        message: 'แจ้งเตือน: โปรดตรวจสอบการจองของคุณ',
        recipient: 'ลูกค้า A',
        CustomerID: 1,
      }),
    });
  
    const data = await response.json();
    console.log(data);
  };
  
  // เรียกฟังก์ชันเพื่อทดสอบ
  addNotitest();
  