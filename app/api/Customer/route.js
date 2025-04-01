import { db } from "@/lib/db";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const customers = await db.query("SELECT * FROM Customer");
            res.status(200).json(customers);
        } catch (error) {
            res.status(500).json({ message: "Error fetching customers", error });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}