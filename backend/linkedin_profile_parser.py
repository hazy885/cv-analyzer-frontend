import re
import os
import json
import logging
import tempfile
from typing import Dict, List, Any, Optional, Union
import requests
from bs4 import BeautifulSoup
from PIL import Image
import pytesseract
from pdf2image import convert_from_path
from flask import request, jsonify

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class LinkedInProfileParser:
    """Enhanced parser for LinkedIn profiles via URL, screenshot, or PDF export."""
    
    def __init__(self):
        # Set Tesseract executable path for OCR if needed
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        # Headers to mimic browser for web requests
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }
    
    def parse_from_url(self, url: str) -> Dict[str, Any]:
        """
        Parse LinkedIn profile from URL with enhanced data extraction.
        
        Args:
            url: LinkedIn profile URL
            
        Returns:
            Dictionary with parsed profile data
        """
        logger.info(f"Parsing LinkedIn profile from URL: {url}")
        
        # Validate URL format
        if not self._validate_linkedin_url(url):
            return {"error": "Invalid LinkedIn profile URL"}
        
        try:
            # Use our implementation to extract data from the URL
            profile_data = self._extract_profile_data(url)
            
            # Structure the response to match CV parser format
            structured_data = self._format_profile_data(profile_data)
            
            # If structured data is empty except for URL, provide a minimal profile
            if len(structured_data) <= 1 and "linkedin_url" in structured_data:
                logger.warning("Failed to extract meaningful data from URL")
                username = url.split("/in/")[1].split("/")[0]
                structured_data["name"] = username.replace("-", " ").title()
                structured_data["note"] = "Limited profile data available. Access to LinkedIn profiles may be restricted. Consider uploading a screenshot or PDF export for better results."
            
            return {
                "source": "linkedin_url",
                "profile_url": url,
                "cv_data": structured_data
            }
        
        except Exception as e:
            logger.error(f"Error parsing LinkedIn profile from URL: {str(e)}", exc_info=True)
            # Provide a graceful fallback with minimal information
            username = url.split("/in/")[1].split("/")[0] if "/in/" in url else "unknown"
            return {
                "source": "linkedin_url",
                "profile_url": url,
                "cv_data": {
                    "name": username.replace("-", " ").title(),
                    "linkedin_url": url,
                    "note": f"Error parsing profile: {str(e)}. LinkedIn restricts automated access to profiles. Consider uploading a screenshot or PDF export instead."
                }
            }
    
    def parse_from_file(self, file_path: str) -> Dict[str, Any]:
        """
        Parse LinkedIn profile from screenshot or PDF export with enhanced data extraction.
        
        Args:
            file_path: Path to the screenshot or PDF file
            
        Returns:
            Dictionary with parsed profile data
        """
        logger.info(f"Parsing LinkedIn profile from file: {file_path}")
        
        try:
            # Extract text from the file
            if file_path.lower().endswith('.pdf'):
                text = self._extract_text_from_pdf(file_path)
            else:  # Assume it's an image
                text = self._extract_text_from_image(file_path)
            
            # Enhanced parsing for all key fields
            profile_data = self._parse_profile_text(text)
            
            # Structure the response to match CV parser format
            structured_data = self._format_profile_data(profile_data)
            
            return {
                "source": "linkedin_file",
                "filename": os.path.basename(file_path),
                "cv_data": structured_data
            }
        
        except Exception as e:
            logger.error(f"Error parsing LinkedIn profile from file: {str(e)}", exc_info=True)
            return {"error": f"Failed to parse LinkedIn profile from file: {str(e)}"}
    
    def _validate_linkedin_url(self, url: str) -> bool:
        """
        Validate that the URL is a proper LinkedIn profile URL.
        
        Args:
            url: URL to validate
            
        Returns:
            Boolean indicating if URL is valid
        """
        # Enhanced validation for LinkedIn profile URLs
        pattern = r"^https?:\/\/(?:www\.)?linkedin\.com\/(?:in\/[\w\-\_À-ÿ%]+|profile\/view\?id=\d+).*$"
        return re.match(pattern, url) is not None
    
    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Extract text from a PDF file.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Extracted text
        """
        try:
            logger.info(f"Converting PDF to images: {pdf_path}")
            
            # First try to use PDF specific extraction libraries if available
            try:
                import pdfplumber
                with pdfplumber.open(pdf_path) as pdf:
                    text_from_pdf = ""
                    for page in pdf.pages:
                        text_from_pdf += page.extract_text() + "\n\n"
                    
                    # If text was successfully extracted directly from the PDF
                    if text_from_pdf and len(text_from_pdf.strip()) > 100:
                        logger.info(f"Successfully extracted {len(text_from_pdf)} characters directly from PDF")
                        return text_from_pdf
                    else:
                        logger.info("Direct PDF text extraction yielded insufficient text, falling back to OCR")
            except ImportError:
                logger.info("pdfplumber not available, using image-based extraction")
            
            # Fall back to image-based extraction
            try:
                # Try using an appropriate poppler path for the system
                if os.name == 'nt':  # Windows
                    images = convert_from_path(
                        pdf_path,
                        poppler_path=r"C:\poppler\Library\bin",
                        dpi=300
                    )
                else:  # Unix/Linux/MacOS
                    images = convert_from_path(
                        pdf_path,
                        dpi=300
                    )
            except Exception as e:
                logger.error(f"Error with default poppler path: {str(e)}")
                # Try without specifying poppler path
                images = convert_from_path(
                    pdf_path,
                    dpi=300
                )
            
            logger.info(f"Converted PDF to {len(images)} images")
            
            extracted_text = []
            for i, img in enumerate(images):
                logger.info(f"Processing image {i+1}/{len(images)}")
                # Convert to grayscale and improve contrast for better OCR
                gray_img = img.convert('L')
                
                # Apply adaptive thresholding for better text extraction
                threshold_img = self._adaptive_threshold(gray_img)
                
                # Use OCR with optimized settings
                custom_config = '--oem 3 --psm 1 -l eng'  # Optimized OCR settings
                text = pytesseract.image_to_string(threshold_img, config=custom_config)
                extracted_text.append(text)
                logger.debug(f"Page {i+1} text length: {len(text)} characters")
            
            full_text = "\n".join(extracted_text)
            logger.info(f"Extracted {len(full_text)} characters from PDF via OCR")
            return full_text
        
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}", exc_info=True)
            raise
    
    def _adaptive_threshold(self, gray_img):
        """Apply adaptive thresholding to improve text extraction from various backgrounds."""
        try:
            import cv2
            import numpy as np
            
            # Convert PIL Image to numpy array for OpenCV processing
            img_np = np.array(gray_img)
            
            # Apply Gaussian blur to reduce noise
            blurred = cv2.GaussianBlur(img_np, (5, 5), 0)
            
            # Apply adaptive thresholding to get black and white image
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
    
    def _extract_text_from_image(self, image_path: str) -> str:
        """
        Extract text from an image file.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Extracted text
        """
        try:
            # Open image and convert to grayscale for better OCR
            image = Image.open(image_path).convert('L')
            
            # Apply adaptive thresholding for better text extraction
            processed_image = self._adaptive_threshold(image)
            
            # Perform OCR with optimized settings
            custom_config = '--oem 3 --psm 1 -l eng'  # Optimized OCR settings
            text = pytesseract.image_to_string(processed_image, config=custom_config)
            
            return text
        
        except Exception as e:
            logger.error(f"Error extracting text from image: {str(e)}", exc_info=True)
            raise
    
    def _parse_profile_text(self, text: str) -> Dict[str, Any]:
        """
        Enhanced parser for LinkedIn profile text to extract comprehensive information.
        
        Args:
            text: Text extracted from LinkedIn profile
            
        Returns:
            Dictionary with structured profile data
        """
        logger.info("Beginning text parsing of LinkedIn profile")
        logger.debug(f"Text length: {len(text)} characters")
        
        # Debug: Output first 500 chars to see what we're working with
        logger.debug(f"Text sample: {text[:500]}")
        
        # Initialize profile data structure with comprehensive fields
        profile_data = {
            "name": "",
            "headline": "",
            "location": "",
            "summary": "",
            "experience": [],
            "education": [],
            "skills": [],
            "skill_categories": {},  # Enhanced: categorized skills
            "certifications": [],
            "languages": [],
            "email": [],  # Try to find email if available
            "phone": [],  # Try to find phone if available
            "websites": [],  # Professional websites
            "connections": "",
            "accomplishments": [],
            "volunteering": [],
            "recommendations": [],
            "interests": []
        }
        
        # Extract name (usually at the beginning)
        # Try multiple patterns for name extraction since format can vary
        name_patterns = [
            r"^([A-Za-z\s\-\.]+)", # First line
            r"([A-Za-z\s\-\.]+)(?:\n|·)(?:.*?(?:profile|headline|about|summary))", # Name before profile/headline
            r"profile(?:\s+of|\s*:\s*)([A-Za-z\s\-\.]+)", # "Profile of [Name]"
            r"name(?:\s*:\s*)([A-Za-z\s\-\.]+)" # "Name: [Name]"
        ]
        
        for pattern in name_patterns:
            name_match = re.search(pattern, text, re.IGNORECASE)
            if name_match:
                profile_data["name"] = name_match.group(1).strip()
                logger.debug(f"Extracted name: {profile_data['name']} using pattern: {pattern}")
                break
                
        if not profile_data["name"]:
            logger.warning("Name extraction failed, trying first line as fallback")
            first_line = text.strip().split("\n")[0]
            if first_line and len(first_line) < 50:  # Reasonable name length
                profile_data["name"] = first_line.strip()
        
        # Extract headline (usually after name)
        headline_patterns = [
            r"(?:headline|title|position)(?:\s*:\s*)([^\n]{5,100})", # "Headline: [text]"
            r"([^\n]{5,100})(?:\n.*?(?:location|about|summary))", # Text before location/about/summary
        ]
        
        headline_found = False
        for pattern in headline_patterns:
            headline_match = re.search(pattern, text, re.IGNORECASE)
            if headline_match:
                candidate = headline_match.group(1).strip()
                if (not candidate.startswith("http") and 
                    not candidate.endswith(".com") and
                    len(candidate) > 5 and 
                    len(candidate) < 100):
                    profile_data["headline"] = candidate
                    logger.debug(f"Extracted headline: {profile_data['headline']}")
                    headline_found = True
                    break
        
        # Fallback to checking first few lines
        if not headline_found:
            headline_lines = text.strip().split("\n")[1:5]  # Check first few lines
            for line in headline_lines:
                if (line and len(line) > 5 and len(line) < 100 and 
                    not line.startswith("http") and 
                    not line.endswith(".com") and
                    line != profile_data["name"]):
                    profile_data["headline"] = line.strip()
                    logger.debug(f"Extracted headline from lines: {profile_data['headline']}")
                    break
        
        # Extract location
        location_pattern = r"(?:Location|Based in|Living in|Location:)[:\s]+([A-Za-z,\s]+)"
        location_match = re.search(location_pattern, text, re.IGNORECASE)
        if location_match:
            profile_data["location"] = location_match.group(1).strip()
        
        # Extract contact information (email and phone if available)
        # LinkedIn doesn't typically show email, but we'll look for patterns just in case
        email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        emails = re.findall(email_pattern, text)
        profile_data["email"] = list(set(emails))  # Remove duplicates
        
        # Look for phone numbers
        phone_patterns = [
            r"\+\d{1,4}[\s-]?\d{1,4}[\s-]?\d{4,10}",  # International format
            r"\(\d{3,4}\)[\s-]?\d{3,4}[\s-]?\d{3,4}",  # (XXX) XXX-XXXX
            r"\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4}"       # XXX-XXX-XXXX
        ]
        
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            if phones:
                profile_data["phone"].extend(phones)
        
        # Enhanced experience extraction
        experience_section = self._extract_section(text, ["Experience", "Work Experience", "Professional Experience"])
        if experience_section:
            # Enhanced pattern for experience entries
            experience_entries = re.findall(
                r"([A-Za-z0-9\s\&\.,]+)\s*(?:·|,|\n)\s*([A-Za-z0-9\s\&\.,]+)\s*(?:·|,|\n)?\s*"
                r"(\w+ \d{4}(?:\s*[-–]\s*(?:Present|Current|\w+ \d{4}))?)"
                r"(?:\s*(?:·|,|\n)\s*([A-Za-z0-9,\s]+))?",
                experience_section
            )
            
            for entry in experience_entries:
                company = entry[0].strip() if len(entry) > 0 else ""
                title = entry[1].strip() if len(entry) > 1 else ""
                dates = entry[2].strip() if len(entry) > 2 else ""
                location = entry[3].strip() if len(entry) > 3 and entry[3] else ""
                
                # Extract description/responsibilities if available
                description = ""
                exp_start = experience_section.find(company + " · " + title)
                if exp_start != -1:
                    next_exp_start = experience_section.find("\n\n", exp_start + len(company + title) + 5)
                    if next_exp_start != -1:
                        description_text = experience_section[exp_start + len(company + title) + 5:next_exp_start]
                        description = description_text.strip()
                
                profile_data["experience"].append({
                    "company": company,
                    "title": title,
                    "dates": dates,
                    "location": location,
                    "description": description
                })
        
        # Enhanced education extraction
        education_section = self._extract_section(text, ["Education"])
        if education_section:
            # Enhanced pattern for education entries
            education_entries = re.findall(
                r"([A-Za-z0-9\s\&\.,]+)\s*(?:·|,|\n)\s*([A-Za-z0-9\s\&\.,]+)?"
                r"(?:\s*(?:·|,|\n)\s*)?(\d{4}(?:\s*[-–]\s*\d{4})?)?",
                education_section
            )
            
            for entry in education_entries:
                school = entry[0].strip() if len(entry) > 0 else ""
                degree = entry[1].strip() if len(entry) > 1 and entry[1] else ""
                dates = entry[2].strip() if len(entry) > 2 and entry[2] else ""
                
                # Extract field of study if available
                field = ""
                if degree and "in " in degree.lower():
                    parts = degree.split("in ", 1)
                    if len(parts) > 1:
                        degree = parts[0].strip()
                        field = parts[1].strip()
                
                profile_data["education"].append({
                    "school": school,
                    "degree": degree,
                    "field": field,
                    "dates": dates
                })
        
        # Enhanced skills extraction with categories
        skills_section = self._extract_section(text, ["Skills"])
        if skills_section:
            # Extract skill categories if present
            category_pattern = r"([A-Za-z\s]+)(?:\s*·\s*\d+\s*(?:skills|endorsements))\s*((?:[A-Za-z0-9\+\#\s]{2,30}(?:\n|·|$))+)"
            category_matches = re.finditer(category_pattern, skills_section, re.IGNORECASE)
            
            for match in category_matches:
                category = match.group(1).strip()
                skills_text = match.group(2).strip()
                skills = re.findall(r"([A-Za-z0-9\+\#\s]{2,30})(?:\n|·|$)", skills_text)
                
                clean_skills = [skill.strip() for skill in skills if skill.strip()]
                profile_data["skill_categories"][category] = clean_skills
                profile_data["skills"].extend(clean_skills)
            
            # If no categories found, extract skills as a flat list
            if not profile_data["skill_categories"]:
                skills = re.findall(r"([A-Za-z0-9\+\#\s]{2,30})(?:\n|·|$)", skills_section)
                profile_data["skills"] = [skill.strip() for skill in skills if skill.strip()]
        
        # Extract summary/about
        summary_section = self._extract_section(text, ["About", "Summary"])
        if summary_section:
            # Take the first paragraph as summary
            paragraphs = re.split(r"\n\s*\n", summary_section)
            if paragraphs:
                profile_data["summary"] = paragraphs[0].strip()
        
        # Extract certifications
        certifications_section = self._extract_section(text, ["Certifications", "Licenses & Certifications"])
        if certifications_section:
            cert_entries = re.findall(r"([A-Za-z0-9\s\&\.,]+)(?:\s*·\s*([A-Za-z0-9\s\&\.,]+))?", certifications_section)
            
            for entry in cert_entries:
                cert = entry[0].strip()
                issuer = entry[1].strip() if len(entry) > 1 and entry[1] else ""
                
                if cert and cert not in ["Certifications", "Licenses & Certifications"]:
                    if issuer:
                        profile_data["certifications"].append(f"{cert} (Issued by {issuer})")
                    else:
                        profile_data["certifications"].append(cert)
        
        # Extract languages
        languages_section = self._extract_section(text, ["Languages"])
        if languages_section:
            languages = re.findall(r"([A-Za-z\s]+)(?:\s*·\s*(?:[A-Za-z\s]+))?", languages_section)
            for lang in languages:
                if lang.strip() and lang.strip() != "Languages":
                    profile_data["languages"].append(lang.strip())
        
        # Extract connections count
        connections_match = re.search(r"(\d+(?:,\d+)?)\s+connections", text, re.IGNORECASE)
        if connections_match:
            profile_data["connections"] = connections_match.group(1).strip()
        elif re.search(r"500\+\s+connections", text, re.IGNORECASE):
            profile_data["connections"] = "500+"
        
        # Extract accomplishments
        accomplishments_section = self._extract_section(text, ["Accomplishments"])
        if accomplishments_section:
            accomplishments = re.findall(r"(?:^|\n)([A-Za-z\s\d\.,]+?)(?:$|\n)", accomplishments_section)
            profile_data["accomplishments"] = [acc.strip() for acc in accomplishments if acc.strip() and len(acc.strip()) > 3]
        
        return profile_data
    
    def _extract_section(self, text: str, section_names: List[str]) -> str:
        """
        Extract a specific section from LinkedIn profile text.
        
        Args:
            text: Full profile text
            section_names: List of possible section names to look for
            
        Returns:
            Text of the extracted section
        """
        section_text = ""
        
        # Define all possible section names that could appear to mark the end of a section
        all_section_markers = [
            "About", "Experience", "Education", "Skills", "Languages", 
            "Certifications", "Licenses & Certifications", "Accomplishments", 
            "Interests", "Publications", "Projects", "Honors", "Courses", 
            "Recommendations", "Activity", "Volunteer", "Volunteering",
            "Contact", "Additional Information"
        ]
        
        # Create regex patterns for each possible section name
        for section_name in section_names:
            # Try different variants of section headers
            section_variants = [
                # Standard LinkedIn section header
                r"(?:^|\n)" + re.escape(section_name) + r"\s*(?:\n|:)(.*?)",
                # Header with bullet point or dash
                r"(?:^|\n)[•\-]\s*" + re.escape(section_name) + r"\s*(?:\n|:)(.*?)",
                # Header with leading numbers
                r"(?:^|\n)\d+\.\s*" + re.escape(section_name) + r"\s*(?:\n|:)(.*?)",
                # Uppercase variant
                r"(?:^|\n)" + re.escape(section_name.upper()) + r"\s*(?:\n|:)(.*?)",
                # With a trailing colon that's part of the header
                r"(?:^|\n)" + re.escape(section_name) + r":\s*(.*?)"
            ]
            
            # Create ending pattern - any of the section markers except the current one
            other_markers = [m for m in all_section_markers if m.lower() != section_name.lower()]
            end_pattern = r"(?:\n\s*(?:" + "|".join([re.escape(m) for m in other_markers]) + r")|$)"
            
            # Try each variant
            for variant_start in section_variants:
                pattern = variant_start + end_pattern
                match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
                if match:
                    section_text = match.group(1).strip()
                    logger.debug(f"Found section '{section_name}' with {len(section_text)} characters")
                    return section_text
        
        # If no section was found with the standard patterns, try a more aggressive approach
        # Look for any occurrence of the section name followed by text
        for section_name in section_names:
            anywhere_pattern = r"(?:^|\n|\s)" + re.escape(section_name) + r"(?:\s|\n|:)(.*?)(?:\n\n\n|\n\s*\n|$)"
            match = re.search(anywhere_pattern, text, re.DOTALL | re.IGNORECASE)
            if match:
                section_text = match.group(1).strip()
                logger.debug(f"Found section '{section_name}' using fallback pattern with {len(section_text)} characters")
                return section_text
                
        logger.debug(f"Section not found: {section_names}")
        return ""
    
    def _extract_profile_data(self, url: str) -> Dict[str, Any]:
        """
        Extract data from LinkedIn profile URL.
        
        Args:
            url: LinkedIn profile URL
            
        Returns:
            Profile data extracted from the URL
        """
        # Extract username from URL
        username_match = re.search(r"linkedin\.com/in/([^/]+)", url)
        if not username_match:
            raise ValueError("Could not extract username from URL")
        
        username = username_match.group(1)
        logger.info(f"Extracting profile data for username: {username}")
        
        try:
            # Attempt to fetch the profile page
            response = requests.get(url, headers=self.headers, timeout=30)
            if response.status_code != 200:
                logger.warning(f"Failed to fetch profile page, status code: {response.status_code}")
                raise ValueError(f"Failed to fetch profile page: HTTP {response.status_code}")
            
            # Parse the HTML
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract text from the page for our parser to process
            page_text = soup.get_text(separator='\n')
            
            # Use our existing text parsing logic to extract information
            profile_data = self._parse_profile_text(page_text)
            
            # Add the LinkedIn URL to the data
            profile_data["linkedin_url"] = url
            
            return profile_data
            
        except Exception as e:
            logger.error(f"Error scraping LinkedIn profile: {str(e)}", exc_info=True)
            # If scraping fails, try to use LinkedIn's public data export if available
            # This would be implemented in a real system
            logger.warning("Scraping failed. In a production system, would use alternative data sources.")
            
            # Return what we know at minimum
            return {
                "name": username.replace("-", " ").title(),  # Basic name from URL
                "linkedin_url": url
            }
    
    def _format_profile_data(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format LinkedIn profile data to match the CV parser response format.
        
        Args:
            profile_data: LinkedIn profile data
            
        Returns:
            Formatted data structure matching CV parser format
        """
        # Format experience entries
        formatted_experience = []
        for exp in profile_data.get("experience", []):
            if not exp.get('company') and not exp.get('title'):
                continue  # Skip empty entries
                
            exp_text = f"{exp.get('title', '')} at {exp.get('company', '')}"
            if "dates" in exp and exp.get('dates'):
                exp_text += f" ({exp.get('dates', '')})"
            if "location" in exp and exp.get('location'):
                exp_text += f" | {exp.get('location', '')}"
            if "description" in exp and exp.get('description'):
                # Add brief description, truncated if too long
                desc = exp.get('description', '')
                if len(desc) > 100:
                    desc = desc[:97] + "..."
                exp_text += f" - {desc}"
            formatted_experience.append(exp_text)
        
        # Format education entries
        formatted_education = []
        for edu in profile_data.get("education", []):
            if not edu.get('school') and not edu.get('degree') and not edu.get('field'):
                continue  # Skip empty entries
                
            edu_text = ""
            if "degree" in edu and edu.get('degree') and "field" in edu and edu.get('field'):
                edu_text = f"{edu.get('degree')} in {edu.get('field')}"
            elif "degree" in edu and edu.get('degree'):
                edu_text = edu.get('degree')
            
            if edu_text and "school" in edu and edu.get('school'):
                edu_text += f" at {edu.get('school')}"
            elif "school" in edu and edu.get('school'):
                edu_text = edu.get('school')
            
            if "dates" in edu and edu.get('dates'):
                edu_text += f" ({edu.get('dates')})"
            
            if edu_text:  # Only add if we have meaningful text
                formatted_education.append(edu_text)
        
        # Create structured result, only including non-empty fields
        result = {}
        
        # Add fields only if they contain data
        if profile_data.get("name"):
            result["name"] = profile_data.get("name")
            
        if profile_data.get("email"):
            result["email"] = profile_data.get("email")
            
        if profile_data.get("phone"):
            result["phone"] = profile_data.get("phone")
            
        if profile_data.get("location"):
            result["location"] = profile_data.get("location")
            
        if profile_data.get("skills"):
            result["skills"] = profile_data.get("skills")
            
        if formatted_education:
            result["education"] = formatted_education
            
        if formatted_experience:
            result["experience"] = formatted_experience
            
        if profile_data.get("headline"):
            result["headline"] = profile_data.get("headline")
            
        if profile_data.get("summary"):
            result["summary"] = profile_data.get("summary")
            
        if profile_data.get("linkedin_url"):
            result["linkedin_url"] = profile_data.get("linkedin_url")
            
        if profile_data.get("certifications"):
            result["certifications"] = profile_data.get("certifications")
            
        if profile_data.get("languages"):
            result["languages"] = profile_data.get("languages")
            
        if profile_data.get("connections"):
            result["connections"] = profile_data.get("connections")
            
        if profile_data.get("accomplishments"):
            result["accomplishments"] = profile_data.get("accomplishments")
            
        if profile_data.get("skill_categories") and any(profile_data.get("skill_categories").values()):
            result["skill_categories"] = profile_data.get("skill_categories")
            
        if profile_data.get("volunteering"):
            result["volunteering"] = profile_data.get("volunteering")
            
        if profile_data.get("websites"):
            result["websites"] = profile_data.get("websites")
            
        if profile_data.get("recommendations"):
            result["recommendations"] = [rec for rec in profile_data.get("recommendations") if rec]
            
        # Debug info about what was extracted
        logger.info(f"Extracted {len(result)} fields from profile")
        logger.debug(f"Extracted fields: {', '.join(result.keys())}")
        
        # If we got nothing but a URL, try to at least add the name from the URL
        if len(result) <= 1 and "linkedin_url" in result:
            username_match = re.search(r"linkedin\.com/in/([^/]+)", result["linkedin_url"])
            if username_match:
                username = username_match.group(1)
                result["name"] = username.replace("-", " ").title()
                logger.info(f"Added name from URL: {result['name']}")
                
        # Make sure we're returning real data
        has_real_data = False
        for key, value in result.items():
            if key != "linkedin_url" and value:
                if isinstance(value, list) and value:
                    has_real_data = True
                    break
                elif isinstance(value, str) and value.strip():
                    has_real_data = True
                    break
        
        if not has_real_data and "linkedin_url" in result:
            logger.warning("No real profile data was extracted, only URL")
            
        return result
            
        return result


# Add these routes to your Flask app
def add_linkedin_routes(app):
    """Add LinkedIn parsing routes to the Flask app."""
    linkedin_parser = LinkedInProfileParser()
    
    @app.route('/api/parse-linkedin', methods=['POST'])
    def parse_linkedin():
        """Parse LinkedIn profile from URL."""
        logger.info('Received request to /api/parse-linkedin')
        
        if not request.json or 'url' not in request.json:
            return jsonify({"error": "URL is required"}), 400
        
        url = request.json['url']
        
        try:
            result = linkedin_parser.parse_from_url(url)
            
            if "error" in result:
                return jsonify(result), 400
            
            return jsonify(result)
        
        except Exception as e:
            logger.error(f"Error parsing LinkedIn profile: {str(e)}", exc_info=True)
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/parse-linkedin-file', methods=['POST'])
    def parse_linkedin_file():
        """Parse LinkedIn profile from uploaded file (screenshot or PDF)."""
        logger.info('Received request to /api/parse-linkedin-file')
        
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        try:
            # Create a temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1])
            file_path = temp_file.name
            temp_file.close()
            
            # Save the uploaded file
            file.save(file_path)
            logger.info(f"File saved to {file_path}")
            
            # Parse the file
            result = linkedin_parser.parse_from_file(file_path)
            
            # Clean up
            os.unlink(file_path)
            
            if "error" in result:
                return jsonify(result), 400
            
            return jsonify(result)
        
        except Exception as e:
            logger.error(f"Error parsing LinkedIn file: {str(e)}", exc_info=True)
            # Clean up in case of error
            if 'file_path' in locals() and os.path.exists(file_path):
                os.unlink(file_path)
            return jsonify({"error": str(e)}), 500