// /app/api/RTdetailadd.ts
import { getToken } from "../getToken/route"; // /app/api/getToken/route.ts
import { mysqlPool } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
const { Rental } = require("../../components/RentalC");
const { Payment } = require("../../components/PaymentC");
const { sendrentalNotification } = require("../../components/NotificationC");

export async function POST(req: NextRequest) {
    try {
      // ✅ ดึง customerID จาก คลาสCustomer
      
      // ใช้ customerID เป็นค่าทดสอบ
  
       //✅ สุ่ม staffID จากฐานข้อมูล
     const [staffRows]: any = await mysqlPool.query(
        "SELECT staffID FROM Staff ORDER BY RAND() LIMIT 1"
      );
      if (!staffRows.length) {
        console.error("No staff available in the database.");
        return NextResponse.json({ error: "No staff available" }, { status: 500 });
      }
      const staffID = staffRows[0].staffID;
  
      // ✅ รับค่าข้อมูลจาก Body
      const body = await req.json();
      let { rentalData, paymentData, formData } = body;
  
      // ✅ แปลง `pickupDate` และ `returnDate` เป็น `YYYY-MM-DD HH:mm:ss`
      const formatDate = (date: string) => new Date(date).toISOString().slice(0, 19).replace("T", " ");
  
      rentalData = {
        ...rentalData,
        pickupDate: formatDate(rentalData.pickupDate),
        returnDate: formatDate(rentalData.returnDate),
      };

      //  สร้าง Rental และบันทึกข้อมูล
      const rental = new Rental({
        rentalPrice: rentalData.selectedCar.rentalPrice, // ใช้ราคาจากรถที่เลือก
        startDate: new Date(rentalData.pickupDate),
        endDate: new Date(rentalData.returnDate),
        location: rentalData.pickupLocation,
        carID: rentalData.selectedCar.id,
        customerID,
        staffID
      });
  
      console.log(rental);
      //const rentalID = await rental.saveToDatabase();
     // if (!rentalID) {
        //console.log("Failed to save rental record.");
        //return NextResponse.json({ error: "Failed to save rental record" }, { status: 500 });
     // }
  
      //  สร้าง Payment และบันทึกข้อมูล
      const payment = new Payment({
        amount: rentalData.rentalPrice, // ใช้ rentalPrice จาก Rental
        receipt: formData.file, // ใช้ URL ของไฟล์
        paymentDate: rentalData.pickupDate,
        //rentalID
        customerID
      });
  
      console.log(payment);
      //await payment.saveToDatabase();
  
      // ส่งแจ้งเตือน (Noti) หากต้องการ
      // await sendrentalNotification({ token, rentalData, paymentData, formData });
  
      console.log("Booking successful.");
      return NextResponse.json(
        { message: "Booking successful!"},
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in booking process:", error);
      return NextResponse.json({ error: "Booking failed"}, { status: 500 });
    }
  }


  