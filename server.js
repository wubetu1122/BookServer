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
const collection = db.collection("books");

// 📌 API Documentation
app.get("/", (req, res) => {
    res.json({
        message: "📚 Welcome to the Books API!",
        endpoints: {
            getAllBooks: { method: "GET", url: "/books" },
            getBookById: { method: "GET", url: "/books/:id" },
            createBook: { method: "POST", url: "/books", body: { title: "string", author: "string", year: "number" } },
            updateBook: { method: "PUT", url: "/books/:id", body: { title: "string", author: "string", year: "number" } },
            deleteBook: { method: "DELETE", url: "/books/:id" },
        },
    });
});

// 📌 Get all books
app.get("/books", async (req, res) => {
    try {
        const books = await collection.find({}).toArray();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books", error: err });
    }
});

// 📌 Get a single book by ID
app.get("/books/:id", async (req, res) => {
    try {
        const book = await collection.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        book ? res.json(book) : res.status(404).json({ message: "Book not found" });
    } catch (err) {
        res.status(500).json({ message: "Error fetching book", error: err });
    }
});

// 📌 Add a new book
app.post("/books", async (req, res) => {
    try {
        await collection.insertOne(req.body);
        res.status(201).send("book created successfully");
    } catch (err) {
        res.status(500).json({ message: "Error creating book", error: err });
    }
});

// 📌 Update a book
app.put("/books/:id", async (req, res) => {
    const {title,author,year}=req.body;
    const updatedBook= {
        title:title,
        author:author,
        year:year
    }
    try {
        await collection.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: updatedBook },
            { returnDocument: "after" }
        );
        res.send("book updated succefully");
    } catch (err) {
        res.status(500).json({ message: "Error updating book", error: err });
    }
});

// 📌 Delete a book
app.delete("/books/:id", async (req, res) => {
    try {
        const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        result.deletedCount ? res.json({ message: "Book deleted" }) : res.status(404).json({ message: "Book not found" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting book", error: err });
    }
});

// 📌 Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`📚 Server running on http://localhost:${PORT}`);
});
