"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// รูปแบบข้อมูลการจอง
interface BookingData {
  customerID : string ;
  pickupDate: string;
  pickupLocation: string;
  returnDate: string;
  Days: string;
  amount : string ;
  selectedCar: any;
  checkoutData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    additionalInfo: string;
  };
  file: string | null; // ไฟล์ภาพที่อัปโหลด
  setBooking: (data: Partial<BookingData>) => void;
}
//เก็บข้อมูลลูกค้าตอน login

// สร้าง Context
const BookingContext = createContext<BookingData | undefined>(undefined);

// สร้าง Provider
export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBookingState] = useState<BookingData>({
    customerID : "" ,
    pickupDate: "",
    pickupLocation: "",
    returnDate: "",
    Days: "",
    amount: "" ,
    selectedCar: null,
    checkoutData: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      additionalInfo: "",
    },
    file: null,
    setBooking: () => {},
  });

  const setBooking = (data: Partial<BookingData>) => {
    setBookingState((prev) => {
      const updatedBooking = { ...prev, ...data };
      console.log("Updated Booking Data:", updatedBooking); // Log ข้อมูลที่ถูกอัปเดต
      return updatedBooking;
    });
  };

  useEffect(() => {
    // ทดสอบการตั้งค่า booking โดยตรงใน useEffect
    setBooking({
      customerID: "1",
      pickupDate: "2024-04-10T10:00:00", // เป็น string
      returnDate: "2024-04-15T18:00:00", // เป็น string
      pickupLocation: "Bangkok",
      selectedCar: { id: 1, name: "Toyota Camry" ,rentalPrice : "500",model : "JoJo" },
      checkoutData: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
        address: "123 Street",
        additionalInfo: "Test booking",
      },
      file: "https://example.com/receipt.jpg",
      setBooking: () => {}, // ฟังก์ชันนี้อาจจะไม่จำเป็น
    });
  }, []); // useEffect จะทำงานแค่ครั้งเดียวเมื่อโหลดหน้าเว็บ

  return (
    <BookingContext.Provider value={{ ...booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

// Hook สำหรับใช้งาน
export function useBooking() {
  const context = useContext(BookingContext);

  // แสดงค่าที่ได้รับจาก context
  console.log("Booking Context:", context);

  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }

  return context;
}
