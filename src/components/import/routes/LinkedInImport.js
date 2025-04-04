// File: routes/candidateRoutes.js
import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();

// @route   POST /api/candidates/save
// @desc    Save parsed candidate data to MongoDB
// @access  Public
router.post('/save', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const candidateData = req.body;

    // Basic validation
    if (!candidateData.name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    // Check if this candidate already exists (by email or LinkedIn URL)
    const existingCandidate = await db.collection('candidates').findOne({
      $or: [
        { email: { $in: candidateData.email || [] } },
        { linkedin_url: candidateData.linkedin_url }
      ]
    });

    let result;
    
    if (existingCandidate) {
      // Update existing candidate
      result = await db.collection('candidates').updateOne(
        { _id: existingCandidate._id },
        { 
          $set: { 
            ...candidateData,
            updatedAt: new Date().toISOString() 
          }
        }
      );
      
      res.status(200).json({ 
        success: true, 
        message: 'Candidate profile updated',
        candidateId: existingCandidate._id,
        isNewCandidate: false
      });
    } else {
      // Create new candidate
      result = await db.collection('candidates').insertOne({
        ...candidateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      res.status(201).json({ 
        success: true, 
        message: 'Candidate profile saved',
        candidateId: result.insertedId,
        isNewCandidate: true
      });
    }
  } catch (error) {
    console.error('Error saving candidate data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while saving candidate data',
      error: error.message 
    });
  }
});

export default router;