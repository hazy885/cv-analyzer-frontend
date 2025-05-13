import React from 'react';
import { useDarkMode } from '../ui/DarkModeContext';
import { CVData } from '../../store/useCVStore';
import { 
  Briefcase, GraduationCap, Hash, Award, Globe, 
  MessageCircle, Mail, Phone, MapPin, Heart, 
  Linkedin, LinkIcon, AlertCircle, User, FileText
} from 'lucide-react';

interface CVDisplayProps {
  cvData: CVData;
  source?: string;
}

// Section Header Component
const SectionHeader = ({ 
  icon, 
  title, 
  darkMode 
}: { 
  icon: React.ReactNode; 
  title: string; 
  darkMode: boolean 
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
      {icon}
    </div>
    <h3 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      {title}
    </h3>
  </div>
);

const CVDisplay: React.FC<CVDisplayProps> = ({ cvData, source = 'unknown' }) => {
  const { darkMode } = useDarkMode();
  
  // Check if the profile has any contact information
  const hasContact = (cvData.email?.length ?? 0) > 0 || 
                     (cvData.phone?.length ?? 0) > 0 || 
                     !!cvData.location;
  
  // Check if profile has any data at all
  const isEmpty = !cvData.name && 
                 (!cvData.skills || cvData.skills.length === 0) && 
                 (!cvData.education || cvData.education.length === 0) && 
                 (!cvData.experience || cvData.experience.length === 0) &&
                 !cvData.headline;
  
  // Display a message when no data was found
  if (isEmpty) {
    return (
      <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800/40 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} shadow-lg transition-all duration-300`}>
        <div className="mb-8 flex items-center gap-4">
          <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <User size={28} className={darkMode ? "text-blue-400" : "text-blue-600"} />
          </div>
          <div>
            <h2 className="text-2xl font-medium">CV Data</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Source: {source}
            </p>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-amber-900/10 text-amber-200 border border-amber-800/20' : 'bg-amber-50/80 text-amber-800 border border-amber-200/30'}`}>
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5" />
            <div>
              <p className="font-medium">Limited CV Data Available</p>
              <p className="text-sm mt-2">
                The system couldn't extract detailed information from this CV. This could be due to:
              </p>
              <ul className="list-disc ml-6 mt-3 text-sm space-y-2">
                <li>Non-standard CV format</li>
                <li>Limited text content</li>
                <li>Formatting issues in the source document</li>
              </ul>
            </div>
          </div>
        </div>
        
        {cvData.linkedin_url && (
          <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
            <div className="flex items-center gap-3">
              <LinkIcon size={18} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <a 
                href={cvData.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                {cvData.linkedin_url}
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800/40 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'} shadow-lg transition-all duration-300`}>
      {/* CV Banner */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <User size={28} className={darkMode ? "text-blue-400" : "text-blue-600"} />
          </div>
          <div>
            <h2 className="text-2xl font-medium">{cvData.name || 'CV Profile'}</h2>
            {cvData.headline && (
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{cvData.headline}</p>
            )}
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Source: {source}
            </p>
          </div>
        </div>
        {cvData.connections && (
          <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-blue-900/10 text-blue-300 border border-blue-800/20' : 'bg-blue-50/80 text-blue-700 border border-blue-200/30'}`}>
            {cvData.connections} connections
          </div>
        )}
      </div>
      
      {/* Contact Information */}
      {hasContact && (
        <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
          <div className="flex flex-wrap gap-6">
            {cvData.location && (
              <div className="flex items-center gap-3">
                <MapPin size={18} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span>{cvData.location}</span>
              </div>
            )}
            
            {(cvData.email?.length ?? 0) > 0 && (cvData.email ?? []).map((email, i) => (
              <div key={i} className="flex items-center gap-3">
                <Mail size={18} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span>{email}</span>
              </div>
            ))}
            
            {(cvData.phone?.length ?? 0) > 0 && (cvData.phone ?? []).map((phone, i) => (
              <div key={i} className="flex items-center gap-3">
                <Phone size={18} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span>{phone}</span>
              </div>
            ))}
            
            {cvData.linkedin_url && (
              <div className="flex items-center gap-3">
                <Linkedin size={18} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <a 
                  href={cvData.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Experience */}
      {(cvData.experience ?? []).length > 0 && (
        <div className="mb-8">
          <SectionHeader 
            icon={<Briefcase className="h-5 w-5 text-blue-500" />} 
            title="Experience" 
            darkMode={darkMode}
          />
          <div className="space-y-4">
            {(cvData.experience ?? []).map((exp, index) => (
              <div 
                key={index} 
                className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/40' : 'bg-gray-50/80 hover:bg-gray-100/80'} transition-colors`}
              >
                {exp}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Education */}
      {(cvData.education ?? []).length > 0 && (
        <div className="mb-8">
          <SectionHeader 
            icon={<GraduationCap className="h-5 w-5 text-blue-500" />}
            title="Education" 
            darkMode={darkMode}
          />
          <div className="space-y-4">
            {(cvData.education ?? []).map((edu, index) => (
              <div 
                key={index}
                className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/40' : 'bg-gray-50/80 hover:bg-gray-100/80'} transition-colors`}
              >
                {edu}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills */}
      {(cvData.skills ?? []).length > 0 && (
        <div className="mb-8">
          <SectionHeader 
            icon={<Hash className="h-5 w-5 text-blue-500" />}
            title="Skills" 
            darkMode={darkMode}
          />
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
            <div className="flex flex-wrap gap-3">
              {(cvData.skills ?? []).map((skill, i) => (
                <span key={i} className={`px-4 py-2 rounded-xl text-sm 
                  ${darkMode ? 'bg-blue-900/10 text-blue-300 border border-blue-800/20' : 'bg-blue-50/80 text-blue-700 border border-blue-200/30'}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Certifications */}
      {(cvData.certifications?.length ?? 0) > 0 && (
        <div className="mb-8">
          <SectionHeader 
            icon={<Award className="h-5 w-5 text-blue-500" />}
            title="Certifications" 
            darkMode={darkMode}
          />
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
            <ul className="space-y-3">
              {(cvData.certifications ?? []).map((cert, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Languages */}
      {(cvData.languages?.length ?? 0) > 0 && (
        <div className="mb-8">
          <SectionHeader 
            icon={<Globe className="h-5 w-5 text-blue-500" />}
            title="Languages" 
            darkMode={darkMode}
          />
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
            <div className="flex flex-wrap gap-3">
              {cvData.languages?.map((lang, i) => (
                <span key={i} className={`px-4 py-2 rounded-xl text-sm 
                  ${darkMode ? 'bg-indigo-900/10 text-indigo-300 border border-indigo-800/20' : 'bg-indigo-50/80 text-indigo-700 border border-indigo-200/30'}`}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Volunteering */}
      {cvData.volunteering && cvData.volunteering.length > 0 && (
        <div className="mb-8">
          <SectionHeader 
            icon={<Heart className="h-5 w-5 text-blue-500" />}
            title="Volunteering" 
            darkMode={darkMode}
          />
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'}`}>
            <ul className="space-y-3">
              {cvData.volunteering?.map((vol, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <span>{vol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Recommendations */}
      {cvData.recommendations && cvData.recommendations.length > 0 && (
        <div className="mb-8">
          <SectionHeader 
            icon={<MessageCircle className="h-5 w-5 text-blue-500" />}
            title="Recommendations" 
            darkMode={darkMode}
          />
          <div className="space-y-4">
            {cvData.recommendations.map((rec, i) => (
              <div key={i} className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'} italic`}>
                "{rec}"
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Raw Text (if available) */}
      {cvData.raw_text && (
        <div className="mb-0">
          <SectionHeader 
            icon={<FileText className="h-5 w-5 text-blue-500" />}
            title="Original Text" 
            darkMode={darkMode}
          />
          <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'} max-h-60 overflow-y-auto`}>
            <pre className="whitespace-pre-wrap text-sm">
              {cvData.raw_text}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVDisplay;