// /api/PMget
import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { getToken } from "@/api/getToken/route";

export async function GET(req: NextRequest) {
  try {
    // ดึงข้อมูลจาก Token เพื่อเช็ค CustomerID และ role
    const { decoded, error } = getToken(req);
    if (error) return error;

    const customerID = decoded?.CustomerID;
    const role = decoded?.role; // ตรวจสอบบทบาท (role) ของผู้ใช้จาก Token

    // ถ้าเป็น admin ให้ดึงข้อมูลการชำระเงินทั้งหมด
    let selectQuery;
    let queryParams: any[] = [];

    if (role === "admin") {
      // ถ้าเป็น admin ให้ดึงข้อมูลทั้งหมด
      selectQuery = `
        SELECT paymentID, amount, reciept, paymentDate, rentalID, CustomerID 
        FROM Payment
      `;
    } else if (customerID) {
      // ถ้าไม่ใช่ admin ให้ดึงข้อมูลเฉพาะของลูกค้าคนนั้น
      selectQuery = `
        SELECT paymentID, amount, reciept, paymentDate, rentalID 
        FROM Payment 
        WHERE CustomerID = ?
      `;
      queryParams = [customerID];
    } else {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Execute Query
    const [rows] = await mysqlPool.query(selectQuery, queryParams);

    return NextResponse.json({ success: true, data: rows }, { status: 200 });

  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
