import re
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import os
from datetime import datetime

class StructuredCVParser:
    def __init__(self):
        # Set Tesseract executable path
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    
    def extract_text_from_cv(self, pdf_path: str) -> str:
        """Extracts text from a CV PDF using optimized black and white conversion for better OCR results."""
        try:
            # Specify the poppler path explicitly
            images = convert_from_path(
                pdf_path,
                poppler_path=r"C:\poppler\Library\bin",
                dpi=300  # Higher DPI for better quality
            )
            extracted_text = []
            
            for img in images:
                # Step 1: Convert to grayscale
                gray_img = img.convert('L')
                
                # Step 2: Apply adaptive thresholding for better black and white conversion
                # This helps with different background colors and improves text contrast
                threshold_img = self.adaptive_threshold(gray_img)
                
                # Step 3: OCR with improved image and additional configuration
                custom_config = '--oem 3 --psm 1 -l eng'  # Set OCR engine mode and page segmentation mode
                text = pytesseract.image_to_string(threshold_img, config=custom_config)
                extracted_text.append(text)
            
            return "\n".join(extracted_text)
        except Exception as e:
            return f"Error processing file: {str(e)}"
    
    def adaptive_threshold(self, gray_img):
        """Apply adaptive thresholding to improve text extraction from various backgrounds."""
        try:
            import cv2
            import numpy as np
            
            # Convert PIL Image to numpy array for OpenCV processing
            img_np = np.array(gray_img)
            
            # Apply Gaussian blur to reduce noise
            blurred = cv2.GaussianBlur(img_np, (5, 5), 0)
            
            # Apply adaptive thresholding to get black and white image
            # This works better than simple thresholding for documents with varying backgrounds
            binary = cv2.adaptiveThreshold(
                blurred,
                255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY,
                11,  # Block size
                2    # Constant subtracted from mean
            )
            
            # Apply some morphological operations to clean up the text
            kernel = np.ones((1, 1), np.uint8)
            binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
            
            # Convert back to PIL Image
            return Image.fromarray(binary)
        except ImportError:
            # If OpenCV is not available, fall back to simple thresholding
            return gray_img.point(lambda x: 0 if x < 128 else 255, '1')
    
    def extract_email(self, text: str) -> list:
        """Extract email addresses from CV text."""
        # Pattern for email addresses
        email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        emails = re.findall(email_pattern, text)
        return list(set(emails))  # Remove duplicates
    
    def extract_name(self, text: str) -> str:
        """
        Extract candidate's name using a comprehensive scanning algorithm that focuses on first name + surname patterns.
        Uses multiple detection strategies and prioritizes common name positions in CVs.
        """
        # Pre-process the text
        cleaned_text = re.sub(r'\s+', ' ', text).strip()
        lines = text.split('\n')
        
        # Focus on the top where names typically appear
        top_lines = [line.strip() for line in lines[:10] if line.strip()]
        top_text = "\n".join(top_lines)
        
        # STRATEGY 1: Check for standalone name at the very top (most common format)
        if len(top_lines) > 0:
            first_line = top_lines[0]
            words = first_line.split()
            if 2 <= len(words) <= 4 and all(word and word[0].isupper() for word in words) and len(first_line) < 40:
                if first_line.lower() not in ["resume", "curriculum vitae", "cv", "personal details"]:
                    return first_line
            
            # Check if second line is name (common when CV/Resume is the first line)
            if len(top_lines) > 1 and first_line.lower() in ["resume", "curriculum vitae", "cv"]:
                second_line = top_lines[1]
                words = second_line.split()
                if 2 <= len(words) <= 4 and all(word and word[0].isupper() for word in words) and len(second_line) < 40:
                    if second_line.lower() not in ["personal details", "contact information"]:
                        return second_line
        
        # STRATEGY 2: Check for name patterns in the document
        name_patterns = [
            # Pattern for "Name: John Doe" format
            r"(?i)(?:name|candidate|applicant):?\s*([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){1,3})",
            
            # Pattern for CV/resume headers
            r"(?i)(?:curriculum\s+vitae|cv|resume)\s+(?:of|for|by):?\s*([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){1,3})",
            
            # Pattern for names at the beginning of documents
            r"^([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){1,3})(?:\s*$|\s*\n)",
            
            # Pattern for "JOHN DOE" (all caps) - very common in CVs
            r"(?:^|\n)([A-Z][A-Z'-]+(?:\s+[A-Z][A-Z'-]+){0,3})(?:\s*$|\s*\n)",
            
            # Pattern for name after "ABOUT ME" heading (like in the example CV)
            r"(?i)about\s+me\s*\n+\s*([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){1,3})",
            
            # Pattern for contact sections
            r"(?i)contact\s+(?:details|information):?\s*(?:\n+\s*)?([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){1,3})"
        ]
        
        # Apply patterns to top text first, then full text
        for text_to_check in [top_text, cleaned_text]:
            for pattern in name_patterns:
                matches = re.search(pattern, text_to_check)
                if matches:
                    candidate = matches.group(1).strip()
                    if len(candidate.split()) >= 2:  # Ensure it has at least a first and last name
                        if candidate.lower() not in ["resume", "curriculum vitae", "cv", "personal details"]:
                            return candidate
        
        # STRATEGY 3: Comprehensive scan for name patterns throughout the document
        # Look for patterns that match proper names (first name + surname)
        candidates = []
        
        # Pattern for typical name formats (First Last, FIRST LAST, etc.)
        name_scan_patterns = [
            # Standard name pattern (e.g., "John Smith")
            r"(?<!\w)([A-Z][a-z]+(?:[-'][A-Z][a-z]+)?\s+[A-Z][a-z]+(?:[-'][A-Z][a-z]+)?)(?!\w)",
            
            # ALL CAPS name (e.g., "JOHN SMITH")
            r"(?<!\w)([A-Z][A-Z]+\s+[A-Z][A-Z]+)(?!\w)",
            
            # Name with middle initial (e.g., "John A. Smith")
            r"(?<!\w)([A-Z][a-z]+\s+[A-Z]\.\s+[A-Z][a-z]+)(?!\w)",
            
            # Name with middle name (e.g., "John Alan Smith")
            r"(?<!\w)([A-Z][a-z]+\s+[A-Z][a-z]+\s+[A-Z][a-z]+)(?!\w)"
        ]
        
        # Scan top section first (more likely to contain the name)
        for i, line in enumerate(top_lines):
            for pattern in name_scan_patterns:
                matches = re.finditer(pattern, line)
                for match in matches:
                    name = match.group(1).strip()
                    # Skip common headers or titles
                    if name.lower() not in ["resume", "curriculum vitae", "cv", "personal details"]:
                        # Prioritize names at the beginning of line
                        if match.start() == 0:
                            candidates.append((name, 10 - i, 10))  # Higher score for earlier lines
                        else:
                            candidates.append((name, 10 - i, 5))   # Lower score for names not at start
        
        # If not found in top, scan the whole document with lower priority
        if not candidates:
            for i, line in enumerate(lines):
                if i >= 10:  # Already checked first 10 lines
                    for pattern in name_scan_patterns:
                        matches = re.finditer(pattern, line)
                        for match in matches:
                            name = match.group(1).strip()
                            # Calculate score based on position and context
                            score = max(1, 20 - i)
                            # Lower score for common words that might match name pattern
                            if name.lower() in ["project manager", "senior developer", "lead engineer"]:
                                score -= 5
                            candidates.append((name, score, 3 if match.start() == 0 else 1))
        
        # STRATEGY 4: Look for names near email addresses
        emails = self.extract_email(text)
        if emails:
            email_indices = []
            for email in emails:
                idx = text.find(email)
                if idx != -1:
                    email_indices.append(idx)
            
            # For each email, check lines around it for potential names
            for idx in email_indices:
                # Find the start of the line containing the email
                line_start = text.rfind('\n', 0, idx)
                if line_start == -1:
                    line_start = 0
                else:
                    line_start += 1
                
                # Find the end of the line containing the email
                line_end = text.find('\n', idx)
                if line_end == -1:
                    line_end = len(text)
                
                # Get surrounding text (3 lines before and after)
                surrounding_start = max(0, text.rfind('\n', 0, line_start - 20))
                surrounding_end = min(len(text), text.find('\n', line_end + 1, line_end + 100))
                if surrounding_end == -1:
                    surrounding_end = len(text)
                
                surrounding_text = text[surrounding_start:surrounding_end]
                
                # Look for name patterns in surrounding text
                for pattern in name_scan_patterns:
                    matches = re.finditer(pattern, surrounding_text)
                    for match in matches:
                        name = match.group(1).strip()
                        # Check if name part is in email (strong indicator)
                        name_parts = name.lower().split()
                        email_local = emails[0].split('@')[0].lower()
                        name_in_email = any(part in email_local for part in name_parts)
                        
                        score = 5  # Base score for names near email
                        if name_in_email:
                            score += 10  # Boost score if name part is in email
                        
                        candidates.append((name, score, 3))
        
        # Sort candidates by total score (line position score + context score)
        if candidates:
            sorted_candidates = sorted(candidates, key=lambda x: x[1] + x[2], reverse=True)
            
            # Return the highest-scoring name candidate
            return sorted_candidates[0][0]
        
        # STRATEGY 5: Fallback - try to extract name from email
        if emails:
            email = emails[0]
            local_part = email.split('@')[0]
            
            # Common email formats include firstname.lastname or firstname_lastname
            if '.' in local_part:
                parts = local_part.split('.')
                if len(parts) >= 2:
                    return " ".join(part.capitalize() for part in parts if part)
            elif '_' in local_part:
                parts = local_part.split('_')
                if len(parts) >= 2:
                    return " ".join(part.capitalize() for part in parts if part)
        
        # No name found
        return ""
        
        # Look for name around email addresses (common pattern)
        emails = self.extract_email(text)
        if emails:
            email_indices = []
            for email in emails:
                idx = text.find(email)
                if idx != -1:
                    email_indices.append(idx)
            
            # For each email, check lines around it for potential names
            for idx in email_indices:
                # Find the start of the line containing the email
                line_start = text.rfind('\n', 0, idx)
                if line_start == -1:
                    line_start = 0
                else:
                    line_start += 1
                
                # Find the end of the line containing the email
                line_end = text.find('\n', idx)
                if line_end == -1:
                    line_end = len(text)
                
                # Get the line and the lines before and after
                current_line = text[line_start:line_end]
                
                # Look for names in surrounding lines
                for offset in range(-3, 4):  # Check 3 lines before and after
                    target_idx = line_start
                    for _ in range(abs(offset)):
                        if offset < 0:
                            # Move to previous line
                            target_idx = text.rfind('\n', 0, target_idx - 1)
                            if target_idx == -1:
                                target_idx = 0
                                break
                        else:
                            # Move to next line
                            target_idx = text.find('\n', target_idx) + 1
                            if target_idx == 0 or target_idx >= len(text):
                                target_idx = len(text) - 1
                                break
                    
                    if target_idx < 0 or target_idx >= len(text):
                        continue
                    
                    line_end = text.find('\n', target_idx)
                    if line_end == -1:
                        line_end = len(text)
                    
                    line = text[target_idx:line_end].strip()
                    words = line.split()
                    
                    # Check if this line could be a name
                    if 1 <= len(words) <= 4 and all(word and word[0].isupper() for word in words) and len(line) < 40:
                        if line.lower() not in ["resume", "curriculum vitae", "cv", "personal details"]:
                            return line
        
        # Fallback: Try to extract name from email
        if emails:
            email = emails[0]
            local_part = email.split('@')[0]
            
            # Common email formats include firstname.lastname or firstname_lastname
            if '.' in local_part:
                parts = local_part.split('.')
                if len(parts) >= 2:
                    return " ".join(part.capitalize() for part in parts if part)
            elif '_' in local_part:
                parts = local_part.split('_')
                if len(parts) >= 2:
                    return " ".join(part.capitalize() for part in parts if part)
        
        return ""
    
    def extract_phone(self, text: str) -> list:
        """Extract phone numbers from CV text."""
        # Patterns for different phone number formats
        phone_patterns = [
            r"\+\d{1,4}[\s-]?\d{1,4}[\s-]?\d{4,10}",  # International format: +XX XXX XXXXXXX
            r"\(\d{3,4}\)[\s-]?\d{3,4}[\s-]?\d{3,4}",  # (XXX) XXX-XXXX
            r"\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4}"       # XXX-XXX-XXXX or XXX XXX XXXX
        ]
        
        phones = []
        for pattern in phone_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                # Clean up the phone number (remove extra spaces, standardize format)
                cleaned = re.sub(r'\s+', ' ', match).strip()
                phones.append(cleaned)
        
        return list(set(phones))  # Remove duplicates
    
    def extract_skills(self, text: str) -> list:
        """Extract skills from CV text."""
        skills = []
        
        # Common section headers for skills
        skill_section_patterns = [
            r"(?i)(?:technical\s+)?skills?(?:\s+and\s+competencies)?(?:\s*:|\s*\n)(.*?)(?:\n\n|\n[A-Z])",
            r"(?i)(?:technologies|programming\s+languages|languages|software)(?:\s*:|\s*\n)(.*?)(?:\n\n|\n[A-Z])",
            r"(?i)(?:core\s+competencies|expertise|proficiencies)(?:\s*:|\s*\n)(.*?)(?:\n\n|\n[A-Z])"
        ]
        
        # Look for skill section patterns
        for pattern in skill_section_patterns:
            matches = re.search(pattern, text, re.DOTALL)
            if matches:
                # Split the skills by common separators
                skill_text = matches.group(1).strip()
                skill_candidates = re.split(r'[,•|\n]', skill_text)
                for skill in skill_candidates:
                    if skill.strip() and len(skill.strip()) > 1:
                        skills.append(skill.strip())
        
        # If no skills section found, look for common technical skills
        if not skills:
            common_skills = [
                "Python", "JavaScript", "TypeScript", "Java", "C#", "C++", "Ruby", "PHP", "SQL",
                "HTML", "CSS", "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask",
                "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "Agile", "Scrum", 
                "Machine Learning", "AI", "Data Science", "Excel", "Word", "PowerPoint", 
                "Photoshop", "Illustrator", ".NET", "REST API", "GraphQL"
            ]
            
            for skill in common_skills:
                if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
                    skills.append(skill)
        
        # Find standalone skills in lists (common in CVs)
        skill_list_items = re.findall(r'(?:^|\n)(?:[\s•-]*)((?:[A-Z][a-z]+|[A-Z]+)(?:\s+[A-Za-z]+){0,2})(?=$|\n)', text)
        for item in skill_list_items:
            if 2 <= len(item) <= 25 and item.strip() not in ["Education", "Experience", "Skills", "Contact", "About"]:
                skills.append(item.strip())
        
        return list(set(skills))  # Remove duplicates
    
    def extract_education(self, text: str) -> list:
        """Extract education information from CV text."""
        education = []
        
        # Look for education section
        education_section_match = re.search(r'(?i)(?:education|qualifications|academic)(?:\s*:|\s*\n)(.*?)(?:(?:\n\n|\n[A-Z][a-z]+\s*:)|\Z)', text, re.DOTALL)
        if education_section_match:
            education_section = education_section_match.group(1)
            
            # Split by new lines and bullet points
            edu_items = re.split(r'(?:\n+|\s*•\s*)', education_section)
            for item in edu_items:
                if item.strip() and len(item.strip()) > 5:
                    education.append(item.strip())
        
        # Look for common education patterns throughout the document
        edu_patterns = [
            r"(?i)(?:Bachelor|Master|PhD|Diploma|Degree|BSc|MSc|MBA|B\.A\.|M\.A\.|certificate).*?(?:of|in).*?\d{4}",
            r"(?i)University\s+of\s+[\w\s]+",
            r"(?i)College\s+of\s+[\w\s]+",
            r"(?i)(?:Graduated|Completed|Obtained).*?\d{4}"
        ]
        
        for pattern in edu_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                if match.strip() not in education:
                    education.append(match.strip())
        
        return education
    
    def extract_experience(self, text: str) -> list:
        """Extract structured work experience from CV text."""
        experiences = []
        structured_experiences = []
        
        # Step 1: Find the experience section
        exp_section_match = re.search(r'(?i)(?:experience|employment|work history|career|professional background)(?:\s*:|\s*\n)(.*?)(?:(?:\n\n|\n[A-Z][a-z]+\s*:)|\Z)', text, re.DOTALL)
        if not exp_section_match:
            # Fallback: Try to find experience without a proper section header
            exp_section = text
        else:
            exp_section = exp_section_match.group(1)
        
        # Step 2: Identify individual job entries using date patterns and position titles
        # Common date patterns in resumes
        date_patterns = [
            r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s,]+\d{4}\s*[-–—]\s*(?:Present|Current|Now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s,]+\d{4})",
            r"\d{4}\s*[-–—]\s*(?:Present|Current|Now|\d{4})",
            r"\d{1,2}/\d{4}\s*[-–—]\s*(?:Present|Current|Now|\d{1,2}/\d{4})"
        ]
        
        # Common job title patterns
        job_title_patterns = [
            r"(?i)(?:^|\n)(?:[\s•*-]*)((?:[A-Z][a-z]+|[A-Z]+)(?:\s+[A-Za-z&,\-]+){0,4})\s*(?:[-–—]\s*|,\s+|at\s+|for\s+|with\s+)",
            r"(?i)(?:^|\n)(?:[\s•*-]*)(Senior|Junior|Lead|Chief|Principal|Head|Director|Manager|Engineer|Developer|Designer|Consultant|Analyst|Specialist|Coordinator)\s+(?:[A-Za-z&,\-]+\s*){1,5}",
            r"(?i)(?:Job Title|Position|Role|Title)\s*:?\s*([A-Za-z&,\-]+(?:\s+[A-Za-z&,\-]+){1,5})"
        ]
        
        # Company patterns
        company_patterns = [
            r"(?i)(?:at|with|for)\s+([A-Z][A-Za-z0-9\s&,.'-]+?(?:Inc|LLC|Ltd|GmbH|Company|Corp|Corporation|Group|Agency|Services)?)",
            r"(?i)(?:Company|Employer|Organization)\s*:?\s*([A-Z][A-Za-z0-9\s&,.'-]+)",
            r"(?i)(?:[A-Z][a-z]+\s*){1,3}[-–—,]\s*([A-Z][A-Za-z0-9\s&,.'-]+?(?:Inc|LLC|Ltd|GmbH|Company|Corp|Corporation|Group|Agency|Services))"
        ]
        
        # First, try to identify entries by date ranges
        date_matches = []
        for pattern in date_patterns:
            for match in re.finditer(pattern, exp_section, re.IGNORECASE):
                date_matches.append((match.start(), match.group()))
        
        date_matches.sort()
        
        # If we found date ranges, use them to identify job entries
        entry_blocks = []
        if date_matches:
            for i, (start_pos, date_range) in enumerate(date_matches):
                # Try to find the beginning of this entry (look backward for line break or paragraph break)
                start_idx = exp_section.rfind('\n\n', 0, start_pos)
                if start_idx == -1:
                    start_idx = exp_section.rfind('\n', 0, start_pos)
                if start_idx == -1:
                    start_idx = 0
                
                # Find the end of this entry (next date or end of section)
                if i < len(date_matches) - 1:
                    end_idx = date_matches[i+1][0]
                else:
                    end_idx = len(exp_section)
                
                # Extract the job entry text
                job_block = exp_section[start_idx:end_idx].strip()
                if job_block:
                    entry_blocks.append(job_block)
        
        # If no date patterns found, try to identify entries by job titles
        if not entry_blocks:
            job_title_matches = []
            for pattern in job_title_patterns:
                for match in re.finditer(pattern, exp_section, re.IGNORECASE):
                    job_title_matches.append((match.start(), match.group(1)))
            
            job_title_matches.sort()
            
            # Use job titles to extract experience entries
            if job_title_matches:
                for i, (start_pos, title) in enumerate(job_title_matches):
                    # Find the beginning of this entry
                    start_idx = exp_section.rfind('\n\n', 0, start_pos)
                    if start_idx == -1:
                        start_idx = exp_section.rfind('\n', 0, start_pos)
                    if start_idx == -1:
                        start_idx = 0
                    
                    # Find the end of this entry
                    if i < len(job_title_matches) - 1:
                        end_idx = job_title_matches[i+1][0]
                    else:
                        end_idx = len(exp_section)
                    
                    # Extract the job entry text
                    job_block = exp_section[start_idx:end_idx].strip()
                    if job_block:
                        entry_blocks.append(job_block)
        
        # Fall back to parsing by bullet points if no clear entries found
        if not entry_blocks:
            # Try splitting by paragraphs and bullet points
            bullet_pattern = r'(?:\n\s*•|\n\n)'
            entry_blocks = re.split(bullet_pattern, exp_section)
        
        # Process each entry block to extract structured information
        for block in entry_blocks:
            if len(block.strip()) < 20:  # Skip very short blocks
                continue
            
            entry = {"raw": block.strip()}
            
            # Extract dates
            for pattern in date_patterns:
                date_match = re.search(pattern, block, re.IGNORECASE)
                if date_match:
                    entry["dates"] = date_match.group().strip()
                    break
            
            # Extract job title
            for pattern in job_title_patterns:
                title_match = re.search(pattern, block, re.IGNORECASE)
                if title_match:
                    title = title_match.group(1).strip()
                    # Clean up title if it's followed by company or dates
                    title = re.sub(r'[-,–—]\s*$', '', title).strip()
                    entry["title"] = title
                    break
            
            # Extract company
            for pattern in company_patterns:
                company_match = re.search(pattern, block, re.IGNORECASE)
                if company_match:
                    company = company_match.group(1).strip()
                    # Clean up company name
                    company = re.sub(r'[-,–—]\s*$', '', company).strip()
                    entry["company"] = company
                    break
            
            # Try to extract responsibilities
            resp_patterns = [
                r"(?i)(?:responsibilities|duties|achievements):\s*(.*?)(?:\n\n|$)",
                r"(?i)(?:\n\s*•\s*|\n\s*-\s*|\n\s*\d+\.\s*)(.*?)(?:\n\s*•|\n\s*-|\n\s*\d+\.|\n\n|$)"
            ]
            
            responsibilities = []
            for pattern in resp_patterns:
                resp_matches = re.finditer(pattern, block, re.DOTALL)
                for match in resp_matches:
                    resp = match.group(1).strip()
                    if resp and len(resp) > 10:
                        responsibilities.append(resp)
            
            if responsibilities:
                entry["responsibilities"] = responsibilities
            
            # Format for display
            formatted_exp = []
            if "title" in entry:
                formatted_exp.append(entry["title"])
            
            if "company" in entry:
                if formatted_exp:
                    formatted_exp[-1] += f" at {entry['company']}"
                else:
                    formatted_exp.append(entry["company"])
            
            if "dates" in entry:
                if formatted_exp:
                    formatted_exp[-1] += f" ({entry['dates']})"
                else:
                    formatted_exp.append(entry["dates"])
            
            if formatted_exp:
                experiences.append(formatted_exp[0])
                structured_experiences.append(entry)
            else:
                # If we couldn't extract structured data, use the raw text
                experiences.append(block.strip().split('\n')[0])  # Just use the first line
        
        # If nothing was found, look for standalone job entries throughout the text
        if not experiences:
            for pattern in job_title_patterns:
                matches = re.findall(pattern, text, re.IGNORECASE)
                for match in matches:
                    if match.strip() not in experiences:
                        experiences.append(match.strip())
        
        return experiences, structured_experiences
    
    def extract_location(self, text: str) -> str:
        """Extract location information from CV text."""
        location_patterns = [
            r"(?i)(?:address|location|based in)[:.\s]\s*([A-Za-z0-9\s,.'-]+(?:,\s*[A-Za-z0-9\s,.'-]+){0,2})",
            r"(?i)(?:city|town|region|state|province|country)[:.\s]\s*([A-Za-z0-9\s,.'-]+)",
            r"(?i)([A-Za-z0-9\s,.'-]+,\s*[A-Za-z]{2,}(?:\s+\d{5,})?)",  # City, State ZIP
            r"(?i)(?:living|working|residing)\s+in\s+([A-Za-z0-9\s,.'-]+)"
        ]
        
        for pattern in location_patterns:
            match = re.search(pattern, text)
            if match:
                location = match.group(1).strip()
                # Clean up the location
                location = re.sub(r'(?i)(?:phone|email|mobile|tel|web|www).*', '', location).strip()
                location = re.sub(r'[,\s]+$', '', location).strip()
                
                if location and 3 < len(location) < 50:  # Reasonable length for a location
                    return location
        
        return ""
    
    def parse_cv(self, pdf_path: str):
        """Parse CV and extract structured information."""
        try:
            # Get the filename
            filename = os.path.basename(pdf_path)
            
            # Extract text
            text = self.extract_text_from_cv(pdf_path)
            if text.startswith("Error"):
                return {"filename": filename, "error": text}
            
            # Log the first few lines for debugging name extraction issues
            lines = text.split('\n')
            top_section = "\n".join([line for line in lines[:10] if line.strip()])
            print(f"Top section of CV for name extraction:\n{top_section}\n")
            
            # Extract structured information
            name = self.extract_name(text)
            email = self.extract_email(text)
            phone = self.extract_phone(text)
            location = self.extract_location(text)
            skills = self.extract_skills(text)
            education = self.extract_education(text)
            experience, structured_experience = self.extract_experience(text)
            
            print(f"Extracted name: {name}")
            
            # Format experience for better display
            formatted_experience = []
            for exp in experience:
                # Clean up and format experience entries
                exp = exp.strip()
                if exp:
                    formatted_experience.append(exp)
            
            # Return structured data
            return {
                "filename": filename,
                "cv_data": {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "location": location,
                    "skills": skills,
                    "education": education,
                    "experience": formatted_experience,
                    "structured_experience": structured_experience
                }
            }
        except Exception as e:
            import traceback
            print(f"Error parsing CV: {str(e)}")
            print(traceback.format_exc())
            return {"filename": os.path.basename(pdf_path), "error": str(e)}