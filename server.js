import express, { text } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import env from 'dotenv';
import connectDB from './db.js'; // Import MongoDB connection

const app = express();
app.use(cors());
app.use(express.json());
env.config();

// 📌 Connect to MongoDB
connectDB();

// 📌 Directly Access the MongoDB Collection (No Schema)
const db = mongoose.connection;
const collection = db.collection("students");

// 📌 API Documentation
app.get("/", (req, res) => {
    res.json({
        message: "📚 Welcome to the students API!",
        endpoints: {
            getAllstudents: { method: "GET", url: "/students" },
            getsudentById: { method: "GET", url: "/students/:id" },
            createstudent: { method: "POST", url: "/students", body: { Name: "string", Age: "number", Grade: "number" } },
            updatestudent: { method: "PUT", url: "/students/:id", body: { Name: "string", Age: "number", Grade: "number" } },
            deletestudent: { method: "DELETE", url: "/students/:id" },
        },
    });
});

// 📌 Get all students
app.get("/students", async (req, res) => {
    try {
        const students = await collection.find({}).toArray();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching students", error: err });
    }
});

// 📌 Get a single sudent by ID
app.get("/students/:id", async (req, res) => {
    try {
        const student = await collection.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        student ? res.json(student) : res.status(404).json({ message: "student not found" });
    } catch (err) {
        res.status(500).json({ message: "Error fetching student", error: err });
    }
});

// 📌 Add a new student
app.post("/students", async (req, res) => {
    try {
        await collection.insertOne(req.body);
        res.status(201).send("student Added successfully");
    } catch (err) {
        res.status(500).json({ message: "Error Adding student", error: err });
    }
});

// 📌 Update a student
app.put("/students/:id", async (req, res) => {
    const {Name,Age,Grade}=req.body;
    const updatedstudent= {
        Name:Name,
        Age:Age,
        Grade:Grade,
    }
    try {
        await collection.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: updatedstudent },
            { returnDocument: "after" }
        );
        res.send("student updated succefully");
    } catch (err) {
        res.status(500).json({ message: "Error updating student", error: err });
    }
});

// 📌 Delete a student
app.delete("/students/:id", async (req, res) => {
    try {
        const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        result.deletedCount ? res.json({ message: "student deleted" }) : res.status(404).json({ message: "student not found" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting student", error: err });
    }
});

// 📌 Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`📚 Server running on http://localhost:${PORT}`);
});
