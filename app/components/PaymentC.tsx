// /components/PaymentC.tsx
import { mysqlPool } from "@/utils/db";
class Payment {
  paymentID: number;
  amount: number;
  receipt: string;
  paymentDate: string; // รับเป็น string ก่อน
  customerID: number;
  rentalID: number;

  constructor(data: any) {
    this.paymentID = data.paymentID || 0;
    this.amount = data.amount || 0.0;
    this.receipt = data.receipt;
    this.paymentDate = data.paymentDate; // รับเป็น string
    this.customerID = data.customerID;
    this.rentalID = data.rentalID;
  }

  // เมธอดสำหรับแปลงเป็น MySQL DATETIME format
  getFormattedDate(): string {
    const date = new Date(this.paymentDate);
    return date.toISOString().slice(0, 19).replace("T", " "); // แปลงเป็น "YYYY-MM-DD HH:MM:SS"
  }

  async saveToDatabase() {
    const query = `
      INSERT INTO Payments (amount, receipt, paymentDate, customerID, rentalID)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [
      this.amount,
      this.receipt,
      this.getFormattedDate(), // ใช้ค่าที่แปลงเป็น DATETIME
      this.customerID,
      this.rentalID,
    ];

    // ใช้ poolPromise เพื่อรองรับการทำงานแบบ async/await
    await mysqlPool.query(query, values);
  }
}


// 🔹 สมมติว่ามี database pool
// await payment.saveToDatabase(mysqlPool);

  export {Payment};