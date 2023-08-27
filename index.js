const express = require('express');

const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
const axios = require('axios');

// Middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://xponent_task:8ewU2HUz8kmPkk6M@cluster0.qhdslp1.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
}
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const courseCollection = client.db('XponentTask').collection('courses');
    const studentCollection = client.db('XponentTask').collection('students');
    const instructorCollection = client.db('XponentTask').collection('instructors');
    app.get('/courses', async (req, res) => {
        try {
  
          const courses = await courseCollection.find().toArray();
          res.json(courses);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to retrieve products' });
        }
        
      });
      
      app.get('/students', async (req, res) => {
        try {
  
          const students = await studentCollection.find().toArray();
          res.json(students);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to retrieve products' });
        }
    });

    app.get('/instructors', async (req, res) => {
        try {
  
          const instructors = await instructorCollection.find().toArray();
          res.json(instructors);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to retrieve products' });
        }
    });

    
    app.get('/students/:id', async (req, res) => {
        try {
          const id = req.params.id;
  
          // Validate the id format
          if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid student ID' });
          }
  
          const student = await studentCollection.findOne({ _id: new ObjectId(id) });
          if (!student) {
            return res.status(404).json({ message: 'Student not found' });
          }
  
          res.json(student);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to retrieve student' });
        }
      });
  
  
      app.get('/courses/:id', async (req, res) => {
        try {
          const id = req.params.id;
  
          // Validate the id format
          if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid student ID' });
          }
  
          const course = await courseCollection.findOne({ _id: new ObjectId(id) });
          if (!course) {
            return res.status(404).json({ message: 'Course not found' });
          }
  
          res.json(course);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to retrieve course' });
        }
      });
  
      app.patch('/courses/:id', async (req, res) => {
        const id = req?.params?.id;
        const updatedCourse = req.body;
      
        try {
          if (id) {
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
              $set: {
                ...updatedCourse
              }
            };
      
            const result = await courseCollection.updateOne(filter, updateDoc);
            
            if (result.modifiedCount > 0) {
              res.json({ message: 'Course updated successfully', modifiedCount: result.modifiedCount });
            } else {
              res.status(404).json({ message: 'Course not found' });
            }
          } else {
            res.status(400).send('Invalid Course ID');
          }
        } catch (error) {
          res.status(500).send(error.message);
        }
      });
      
      app.get('/studentScores', async (req, res) => {
        try {
          const students = await studentCollection.find().toArray();
          const scoredStudents = students.map(student => ({
            ...student,
            totalScore: student.detailResult.reduce((total, result) => total + result.score, 0)
          }));
      
          const rankedStudents = scoredStudents.sort((a, b) => b.totalScore - a.totalScore);
          
          res.json(rankedStudents);
        } catch (error) {
          res.status(500).json({ message: 'Failed to retrieve student scores' });
        }
      });
      
     
     client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
  })
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })