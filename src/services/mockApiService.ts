import { ParsedCV } from '../store/useCVStore';

// Mock data for testing
const mockLinkedInData: ParsedCV = {
  source: 'linkedin',
  profile_url: 'https://www.linkedin.com/in/johndoe',
  cv_data: {
    name: 'John Doe',
    headline: 'Senior Software Engineer at Tech Company',
    location: 'San Francisco, CA',
    connections: '500+',
    linkedin_url: 'https://www.linkedin.com/in/johndoe',
    email: ['john.doe@example.com'],
    phone: ['+1 (555) 123-4567'],
    skills: [
      'JavaScript', 'React', 'Node.js', 'TypeScript', 'GraphQL', 
      'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Agile Methodologies'
    ],
    experience: [
      'Senior Software Engineer at Tech Company (2020 - Present)',
      'Software Engineer at Previous Company (2017 - 2020)',
      'Junior Developer at First Job Inc. (2015 - 2017)'
    ],
    education: [
      'Master of Computer Science, Stanford University (2013 - 2015)',
      'Bachelor of Science in Computer Engineering, MIT (2009 - 2013)'
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional Developer',
      'Microsoft Certified: Azure Developer Associate'
    ],
    languages: ['English (Native)', 'Spanish (Professional)', 'French (Basic)'],
    volunteering: [
      'Code for America - Volunteer Developer (2018 - Present)',
      'Tech Mentor at Local Community College (2019 - Present)'
    ],
    recommendations: [
      'John is an exceptional developer with a keen eye for detail and a passion for clean code. Working with him was a pleasure!',
      'One of the most dedicated engineers I\'ve worked with. John consistently delivers high-quality solutions on time.'
    ]
  }
};

const mockResumeData: ParsedCV = {
  source: 'pdf_upload',
  cv_data: {
    name: 'Jane Smith',
    headline: 'Product Manager with 8+ years of experience',
    location: 'New York, NY',
    email: ['jane.smith@example.com'],
    phone: ['+1 (555) 987-6543'],
    skills: [
      'Product Management', 'User Research', 'Agile', 'Scrum', 'JIRA',
      'Product Strategy', 'A/B Testing', 'Data Analysis', 'SQL', 'Tableau'
    ],
    experience: [
      'Senior Product Manager at Product Co (2019 - Present)',
      'Product Manager at Tech Solutions Inc. (2016 - 2019)',
      'Associate Product Manager at Startup XYZ (2014 - 2016)'
    ],
    education: [
      'MBA, Harvard Business School (2012 - 2014)',
      'Bachelor of Business Administration, NYU (2008 - 2012)'
    ],
    certifications: [
      'Certified Scrum Product Owner (CSPO)',
      'Professional Scrum Master I (PSM I)'
    ],
    languages: ['English (Native)', 'Mandarin (Fluent)'],
    raw_text: 'Jane Smith\nProduct Manager with 8+ years of experience\nNew York, NY | jane.smith@example.com | +1 (555) 987-6543\n\nEXPERIENCE\nSenior Product Manager at Product Co (2019 - Present)\nProduct Manager at Tech Solutions Inc. (2016 - 2019)\nAssociate Product Manager at Startup XYZ (2014 - 2016)\n\nEDUCATION\nMBA, Harvard Business School (2012 - 2014)\nBachelor of Business Administration, NYU (2008 - 2012)\n\nSKILLS\nProduct Management, User Research, Agile, Scrum, JIRA, Product Strategy, A/B Testing, Data Analysis, SQL, Tableau\n\nCERTIFICATIONS\nCertified Scrum Product Owner (CSPO)\nProfessional Scrum Master I (PSM I)\n\nLANGUAGES\nEnglish (Native), Mandarin (Fluent)'
  }
};

const mockTextData: ParsedCV = {
  source: 'text_input',
  cv_data: {
    name: 'Michael Johnson',
    headline: 'Marketing Director',
    location: 'Chicago, IL',
    email: ['michael.johnson@example.com'],
    phone: ['+1 (555) 234-5678'],
    skills: [
      'Digital Marketing', 'Brand Strategy', 'Content Marketing', 'SEO/SEM',
      'Social Media Marketing', 'Email Campaigns', 'Google Analytics', 'Adobe Creative Suite'
    ],
    experience: [
      'Marketing Director at Marketing Agency (2018 - Present)',
      'Senior Marketing Manager at Brand Inc. (2015 - 2018)',
      'Marketing Specialist at Media Group (2012 - 2015)'
    ],
    education: [
      'Master of Business Administration, Marketing, University of Chicago (2010 - 2012)',
      'Bachelor of Arts in Communications, Northwestern University (2006 - 2010)'
    ],
    raw_text: 'Michael Johnson\nMarketing Director\nChicago, IL | michael.johnson@example.com | +1 (555) 234-5678\n\nEXPERIENCE\nMarketing Director at Marketing Agency (2018 - Present)\nSenior Marketing Manager at Brand Inc. (2015 - 2018)\nMarketing Specialist at Media Group (2012 - 2015)\n\nEDUCATION\nMaster of Business Administration, Marketing, University of Chicago (2010 - 2012)\nBachelor of Arts in Communications, Northwestern University (2006 - 2010)\n\nSKILLS\nDigital Marketing, Brand Strategy, Content Marketing, SEO/SEM, Social Media Marketing, Email Campaigns, Google Analytics, Adobe Creative Suite'
  }
};

// Mock API service
export const mockCvApiService = {
  // Parse LinkedIn profile
  parseLinkedIn: async (url: string): Promise<{ data?: ParsedCV; error?: string }> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        if (url.includes('error')) {
          resolve({ error: 'Failed to parse LinkedIn profile' });
        } else {
          resolve({ data: mockLinkedInData });
        }
      }, 1500);
    });
  },
  
  // Upload and parse CV files
  uploadCV: async (files: File[], onProgress?: (progress: number) => void): Promise<{ data?: ParsedCV; error?: string }> => {
    return new Promise((resolve) => {
      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (onProgress) onProgress(progress);
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 300);
      
      // Simulate API delay
      setTimeout(() => {
        if (files.some(file => file.name.includes('error'))) {
          resolve({ error: 'Failed to parse CV file' });
        } else {
          resolve({ data: mockResumeData });
        }
      }, 3000);
    });
  },
  
  // Parse CV from text
  parseText: async (text: string): Promise<{ data?: ParsedCV; error?: string }> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        if (text.includes('error')) {
          resolve({ error: 'Failed to parse CV text' });
        } else {
          resolve({ data: mockTextData });
        }
      }, 1500);
    });
  }
};