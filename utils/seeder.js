import dotenv from 'dotenv';
import { connectToDatabase } from '../config/db.js';

// Load environment variables
dotenv.config();

// Sample candidate data
const candidates = [
  {
    name: "John Doe",
    role: "Frontend Developer",
    experience: 5,
    status: "Active",
    salary: 95000,
    location: "Remote",
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
    applied: "2023-05-15",
    email: "john.doe@example.com",
    lastActive: "2 days ago",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Jane Smith",
    role: "Backend Developer",
    experience: 4,
    status: "Interviewing",
    salary: 90000,
    location: "San Francisco",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    applied: "2023-06-10",
    email: "jane.smith@example.com",
    lastActive: "1 day ago",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Alex Johnson",
    role: "Full Stack Developer",
    experience: 7,
    status: "Active",
    salary: 110000,
    location: "New York",
    skills: ["React", "Node.js", "MongoDB", "Express", "AWS"],
    applied: "2023-05-20",
    email: "alex.johnson@example.com",
    lastActive: "3 days ago",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample position data
const positions = [
  { 
    title: "Senior Frontend Developer", 
    department: "Engineering", 
    location: "Remote",
    requiredSkills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    title: "UX Designer", 
    department: "Design", 
    location: "New York",
    requiredSkills: ["Figma", "UI Design", "User Research", "Wireframing"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    title: "Product Manager", 
    department: "Product", 
    location: "San Francisco",
    requiredSkills: ["Agile", "Roadmapping", "User Stories", "Prioritization"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Seed data function
const seedData = async () => {
  try {
    // Connect to database
    const db = await connectToDatabase();
    
    if (process.argv[2] === '-d') {
      // Delete all data
      await db.collection('candidates').deleteMany({});
      await db.collection('positions').deleteMany({});
      console.log('All data deleted from database!');
    } else {
      // Insert data
      await db.collection('candidates').deleteMany({});
      await db.collection('positions').deleteMany({});
      
      await db.collection('candidates').insertMany(candidates);
      await db.collection('positions').insertMany(positions);
      
      console.log(`Data imported! ${candidates.length} candidates and ${positions.length} positions added.`);
    }
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeder
seedData();