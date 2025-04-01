import { NextRequest, NextResponse } from "next/server";
const jwt = require("jsonwebtoken");
import { config } from "@/config";

export function getToken(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
  
    try {
      const decoded: any = jwt.verify(token, config.JWT_SECRET);
      return { decoded };
    } catch (error) {
      return { error: NextResponse.json({ error: "Invalid token" }, { status: 403 }) };
    }
  }
  

