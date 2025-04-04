import { useState, useEffect } from 'react';
import { Job, mockJobs } from './mockData';

interface UseJobDataReturn {
  jobs: Job[];
  departments: string[];
  loading: boolean;
  error: string | null;
}

export const useJobData = (): UseJobDataReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchJobs = async () => {
      try {
        // In a real app, you would replace this with an actual API call
        // const response = await fetch('/api/jobs');
        // const data = await response.json();
        
        // Simulate network delay
        setTimeout(() => {
          setJobs(mockJobs);
          
          // Extract unique departments
          const uniqueDepartments = [...new Set(mockJobs.map(job => job.department))];
          setDepartments(uniqueDepartments);
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch job data');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, departments, loading, error };
};