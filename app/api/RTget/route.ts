import { NextRequest, NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { getToken } from "@/api/getToken/route";

export async function GET(req: NextRequest) {
  const { decoded, error } = getToken(req);
  if (error) return error;

  const customerID = decoded?.CustomerID;
  if (!customerID) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

  try {
    const selectQuery = "SELECT * FROM Rental WHERE CustomerID = ?";
    const [rentalRows]: any = await mysqlPool.query(selectQuery, [customerID]);

    return NextResponse.json(rentalRows, { status: 200 });
  } catch (error) {
    console.error("Error fetching rental data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
