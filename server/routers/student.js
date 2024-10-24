import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { database } from '../database/connection.js';
import jwt from 'jsonwebtoken';

const router = Router();

// Create the student collection with validation and a unique index
async function setupStudentCollection() {
  const studentCollection = database.collection('student');

  // Create a unique index on the email field
  await studentCollection.createIndex({ email: 1 }, { unique: true });
}

// Call the setup function to ensure the collection is configured correctly
setupStudentCollection().catch(console.error);

// POST route for student login/signup
router.post('/student', async (req, res) => {
  console.log('Request received:', req.body);
  try {
    const { action, name, email, password } = req.body;

    // Check if action is provided
    if (!action || !email || !password) {
      return res.status(400).json({ error: 'Action, email, and password are required' });
    }

    // Get the student collection
    const studentCollection = database.collection('student');

    // Check if the action is login or signup
    if (action === 'login') {
      // Login logic
      const student = await studentCollection.findOne({ email });
      if (!student) {
        return res.status(404).json({ error: 'No user found with this email' });
      }

      // Compare the hashed password
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      // Generate JWT after login
      const token = jwt.sign({ email: student.email, _id: student._id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
      // Return the token in the response
      return res.status(200).json({ message: 'Login successful', token });
    } else if (action === 'signup') {
      // Signup logic
      if (!name) {
        return res.status(400).json({ error: 'Name is required for signup' });
      }

      // Check if email already exists in the database
      const existingStudent = await studentCollection.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ error: 'Email already in use' }); // JSON error format
      }
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);
      const newStudent = {
        name,
        email,
        password: hashedPassword,
      };

      try {
        await studentCollection.insertOne(newStudent);
        // Generate JWT after signup
        const token = jwt.sign(
          { email: newStudent.email, _id: newStudent._id },
          process.env.SECRET_KEY,
          { expiresIn: '1h' },
        );
        return res.status(201).json({ message: 'Signup successful', token });
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error code
          return res.status(400).json({ error: 'Email already in use' });
        }
      }
    }
  } catch (error) {
    console.error('Error during login/signup:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
