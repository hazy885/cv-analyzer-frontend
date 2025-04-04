import React, { useState } from 'react';
import { X, Check, AlertCircle, Upload } from 'lucide-react';
import { Job } from '../data/mockData';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  linkedIn: string;
  coverLetter: string;
  resume: File | null;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  resume?: string;
}

interface JobApplicationFormProps {
  job: Job;
  onClose: () => void;
  darkMode: boolean;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, onClose, darkMode }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    coverLetter: '',
    resume: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
      
      // Clear error when user uploads file
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: undefined }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call to submit application
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          onClose();
        }, 3000);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 ${
          darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
        }`}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          aria-label="Close application form"
        >
          <X size={20} />
        </button>
        
        {submitSuccess ? (
          <div className="text-center py-10">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
              darkMode ? 'bg-green-900/30' : 'bg-green-100'
            }`}>
              <Check size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Thank you for applying to the {job.title} position. We will review your application and get back to you soon.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1">Apply for {job.title}</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Complete the form below to submit your application
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block mb-1 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                    } ${errors.fullName ? 'border-red-500' : ''}`}
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.fullName}
                    </p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                    } ${errors.email ? 'border-red-500' : ''}`}
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block mb-1 font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                    } ${errors.phone ? 'border-red-500' : ''}`}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.phone}
                    </p>
                  )}
                </div>
                
                {/* LinkedIn */}
                <div>
                  <label htmlFor="linkedIn" className="block mb-1 font-medium">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="url"
                    id="linkedIn"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                  />
                </div>
                
                {/* Resume Upload */}
                <div>
                  <label htmlFor="resume" className="block mb-1 font-medium">
                    Resume <span className="text-red-500">*</span>
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                        : 'bg-gray-50/50 border-gray-300 hover:bg-gray-100'
                    } ${errors.resume ? 'border-red-500' : ''} transition-colors cursor-pointer`}
                    onClick={() => document.getElementById('resume')?.click()}
                  >
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      aria-invalid={errors.resume ? 'true' : 'false'}
                    />
                    <div className="flex flex-col items-center">
                      <Upload size={32} className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      {formData.resume ? (
                        <div>
                          <p className="font-medium">
                            {formData.resume.name}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">
                            Drop your resume here or click to browse
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            PDF, DOC, or DOCX up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.resume && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.resume}
                    </p>
                  )}
                </div>
                
                {/* Cover Letter */}
                <div>
                  <label htmlFor="coverLetter" className="block mb-1 font-medium">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Tell us why you're interested in this position and why you'd be a great fit."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                  />
                </div>
                
                <div className="flex justify-end mt-8 space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-6 py-3 rounded-lg ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg transition-all ${
                      darkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                    } text-white shadow-lg flex items-center justify-center min-w-[120px]`}
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default JobApplicationForm;