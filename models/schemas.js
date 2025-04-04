// Define schema validation rules for MongoDB collections

export const candidateSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'role'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        email: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        role: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        experience: {
          bsonType: 'number',
          description: 'must be a number'
        },
        status: {
          bsonType: 'string',
          enum: ['Active', 'Inactive', 'Interviewing', 'Hired'],
          description: 'can only be one of the enum values'
        },
        salary: {
          bsonType: 'number',
          description: 'must be a number'
        },
        location: {
          bsonType: 'string',
          description: 'must be a string'
        },
        skills: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          }
        },
        applied: {
          bsonType: 'string',
          description: 'must be a string representing a date'
        },
        lastActive: {
          bsonType: 'string',
          description: 'must be a string'
        },
        avatar: {
          bsonType: 'string',
          description: 'must be a string URL'
        },
        matchScore: {
          bsonType: 'number',
          description: 'must be a number between 0 and 100'
        }
      }
    }
  }
};

export const positionSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'department', 'location'],
      properties: {
        title: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        department: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        location: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        requiredSkills: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          }
        }
      }
    }
  }
};

// Function to create collections with validation if they don't exist
export const ensureCollections = async (db) => {
  // Get list of existing collections
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  // Create candidates collection if it doesn't exist
  if (!collectionNames.includes('candidates')) {
    await db.createCollection('candidates', candidateSchema);
    console.log('Created candidates collection with validation');
  }

  // Create positions collection if it doesn't exist
  if (!collectionNames.includes('positions')) {
    await db.createCollection('positions', positionSchema);
    console.log('Created positions collection with validation');
  }
};