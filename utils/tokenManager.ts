import { config } from "@/config";
const jwt = require("jsonwebtoken");
import { mysqlPool } from "@/utils/db"; 

// Define the interface for user data
interface UserData {
  phoneNumber?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
}

// TokenManager class definition
class TokenManager {
  private static instance: TokenManager;
  private secret: string;

  private constructor() {
    this.secret = config.JWT_SECRET; // JWT Secret key
  }

  // Ensure singleton pattern for TokenManager
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Sign JWT token
  public signToken(payload: object, expiresIn: string = "1h"): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  // Verify JWT token
  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  // Update user data and refresh JWT token
  public async updateToken(userId: number, newData: UserData): Promise<string> {
    try {
      // Update user data in the database and return the updated user info
      const updatedUser = await updateUser(userId, newData);

      // If update is successful, generate a new JWT token
      const newToken = this.signToken({
        id: updatedUser.CustomerID,
        phone: updatedUser.phoneNumber,
        role: updatedUser.role,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userName: updatedUser.userName,
      });

      return newToken; // Return the new token
    } catch (error) {
      throw new Error("Failed to update user or generate token");
    }
  }
}

// Helper function to update user data in the database
async function updateUser(userId: number, newData: UserData): Promise<any> {
  try {
    // Prepare SQL query for updating user data
    const query = `UPDATE Customer SET ? WHERE CustomerID = ?`;
    const [result] = await mysqlPool.promise().query(query, [newData, userId]);

     // Check the affectedRows in the result (which is actually an array of ResultSetHeader)
     const affectedRows = (result as any)[0]?.affectedRows;

     // Ensure affectedRows is valid and check if any row was updated
     if (!affectedRows || affectedRows === 0) {
       throw new Error("User not found or no changes made");
     }

    // Return the updated user data
    return {
      CustomerID: userId,
      phoneNumber: newData.phoneNumber , // Ensure phoneNumber is provided
      role: newData.role || 'user',            // Default role is 'user'
      firstName: newData.firstName ,
      lastName: newData.lastName ,
      userName: newData.userName ,
    };
  } catch (error) {
    const e = error as Error;
    throw new Error("Database update failed: " + e.message);
  }
}

export default TokenManager; // Export the singleton instance of TokenManager
