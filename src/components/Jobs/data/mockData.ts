// Types
export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

// Mock data
export const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    salary: '$80,000 - $110,000',
    description: 'We are looking for a Frontend Developer proficient in React to join our engineering team. You will be responsible for building user interfaces and implementing new features.',
    responsibilities: [
      'Develop new user-facing features using React.js',
      'Build reusable components and front-end libraries for future use',
      'Translate designs and wireframes into high-quality code',
      'Optimize components for maximum performance across a vast array of web-capable devices and browsers'
    ],
    requirements: [
      'Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model',
      'Thorough understanding of React.js and its core principles',
      'Experience with popular React.js workflows (such as Flux or Redux)',
      'Familiarity with newer specifications of ECMAScript'
    ]
  },
  {
    id: 2,
    title: 'Backend Developer',
    department: 'Engineering',
    location: 'New York, NY',
    salary: '$90,000 - $120,000',
    description: 'We are seeking a Backend Developer experienced in Python and Django to strengthen our engineering team. Your primary focus will be developing server-side logic and APIs.',
    responsibilities: [
      'Design and implement robust APIs',
      'Build efficient back-end services and databases',
      'Integrate user-facing elements with server-side logic',
      'Improve the stability and security of our infrastructure'
    ],
    requirements: [
      'Strong knowledge of Python',
      'Experience with Django or similar frameworks',
      'Understanding of databases and SQL',
      'Knowledge of server architecture and RESTful APIs'
    ]
  },
  {
    id: 3,
    title: 'UX Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    salary: '$75,000 - $100,000',
    description: 'We are looking for a UX Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills, and be able to translate high-level requirements into interaction flows and artifacts.',
    responsibilities: [
      'Create user flows, wireframes, prototypes and mockups',
      'Conduct user research and testing',
      'Identify and troubleshoot UX problems',
      'Collaborate with other team members and stakeholders'
    ],
    requirements: [
      'Proven experience as a UX Designer, UI Designer or similar role',
      'Proficiency in design software (Sketch, Figma, Adobe XD)',
      'Understanding of interaction design and information architecture',
      'Knowledge of HTML, CSS, and JavaScript is a plus'
    ]
  },
  {
    id: 4,
    title: 'Product Manager',
    department: 'Product',
    location: 'Chicago, IL',
    salary: '$95,000 - $130,000',
    description: 'We are seeking an experienced Product Manager to join our team. The successful candidate will be responsible for the strategy, roadmap, and feature definition for our product lines.',
    responsibilities: [
      'Define the product vision, strategy, and roadmap',
      'Work closely with engineering, design, and marketing teams',
      'Gather and prioritize product and customer requirements',
      'Define product release plans and evaluate success metrics'
    ],
    requirements: [
      'Proven experience as a Product Manager or Product Owner',
      'Strong problem-solving abilities and analytical skills',
      'Excellent communication and presentation skills',
      'Technical background is a plus'
    ]
  },
  {
    id: 5,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    salary: '$65,000 - $85,000',
    description: 'We are looking for a Marketing Specialist to join our growing team. You will be responsible for developing and implementing marketing strategies to increase brand awareness and drive customer acquisition.',
    responsibilities: [
      'Plan and execute marketing campaigns across various channels',
      'Create engaging content for social media and website',
      'Analyze campaign performance and optimize strategies',
      'Collaborate with design and product teams'
    ],
    requirements: [
      'Experience in digital marketing and content creation',
      'Knowledge of SEO and social media marketing',
      'Excellent written and verbal communication skills',
      'Analytical mindset with attention to detail'
    ]
  },
  {
    id: 6,
    title: 'HR Manager',
    department: 'Human Resources',
    location: 'Boston, MA',
    salary: '$85,000 - $115,000',
    description: 'We are seeking an HR Manager to oversee all aspects of human resources practices and processes. The ideal candidate will have experience in developing and implementing HR strategies and initiatives aligned with the overall business strategy.',
    responsibilities: [
      'Manage the recruitment and selection process',
      'Develop and implement HR policies and procedures',
      'Oversee employee benefits programs',
      'Handle employee relations, including conflict resolution'
    ],
    requirements: [
      'Proven experience as an HR Manager or similar role',
      'Knowledge of HR systems and databases',
      'Understanding of labor laws and regulations',
      'Excellent organizational and leadership skills'
    ]
  }
];