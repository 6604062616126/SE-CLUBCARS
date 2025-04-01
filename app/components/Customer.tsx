class Customer {
    CustomerID: number;
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    password: string;
  
    constructor(
      CustomerID: number,
      firstName: string,
      lastName: string,
      userName: string,
      phoneNumber: string,
      password: string
    ) {
      this.CustomerID = CustomerID;
      this.firstName = firstName;
      this.lastName = lastName;
      this.userName = userName;
      this.phoneNumber = phoneNumber;
      this.password = password;
    }
  
    // ตัวอย่างการสร้าง customer จาก JWT payload
    static fromTokenPayload(payload: any): Customer {
      return new Customer(
        payload.id,
        payload.firstName,
        payload.lastName,
        payload.userName,
        payload.phone,
        '' // ไม่เก็บรหัสผ่านใน token
      );
    }
  
    // ใช้ในการเก็บข้อมูลผู้ใช้ใน JWT (ในกรณีนี้จะไม่มีการเก็บรหัสผ่าน)
  }
  export {Customer}
  