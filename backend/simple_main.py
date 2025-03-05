from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import tempfile
import uuid
import logging
from structured_cv_parser import StructuredCVParser
from linkedin_profile_parser import LinkedInProfileParser, add_linkedin_routes

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create upload directory
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize parsers
cv_parser = StructuredCVParser()
linkedin_parser = LinkedInProfileParser()

@app.route('/api/parse-cv', methods=['POST'])
def parse_cv():
    logger.info('Received request to /api/parse-cv')
    
    # Check if request contains files
    if 'files' not in request.files and 'file' not in request.files:
        if not request.files:
            logger.warning('No files in request')
            return jsonify({"error": "No files provided"}), 400
        # Try to find any file field
        file_field = next(iter(request.files))
        logger.info(f'Looking for file in alternate field: {file_field}')
        files = request.files.getlist(file_field)
    else:
        # Use the expected field name
        field_name = 'files' if 'files' in request.files else 'file'
        files = request.files.getlist(field_name)
    
    if not files or all(file.filename == '' for file in files):
        logger.warning('No selected files')
        return jsonify({"error": "No selected files"}), 400
    
    results = []
    
    for file in files:
        if file.filename == '':
            continue
        
        logger.info(f'Processing file: {file.filename}')
        
        # Save file to disk
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        logger.info(f'File saved to {file_path}')
        
        # Parse the CV
        logger.info('Parsing CV...')
        try:
            result = cv_parser.parse_cv(file_path)
            
            # Process the complex structured data for better display
            if 'cv_data' in result:
                cv_data = result['cv_data']
                
                # Format education data for display
                if 'education' in cv_data and isinstance(cv_data['education'], list):
                    formatted_education = []
                    for edu in cv_data['education']:
                        if isinstance(edu, dict):
                            # Extract the most important parts for display
                            edu_text = ""
                            if 'degree' in edu and 'field' in edu:
                                edu_text = f"{edu['degree']} in {edu['field']}"
                            elif 'degree' in edu:
                                edu_text = edu['degree']
                            elif 'raw' in edu:
                                edu_text = edu['raw']
                                
                            if 'institution' in edu:
                                edu_text += f", {edu['institution']}"
                                
                            if 'start_date' in edu and 'end_date' in edu:
                                edu_text += f" ({edu['start_date']} - {edu['end_date']})"
                            elif 'year' in edu:
                                edu_text += f" ({edu['year']})"
                                
                            formatted_education.append(edu_text)
                        else:
                            formatted_education.append(str(edu))
                    cv_data['education'] = formatted_education
                
                # Format experience data for display
                if 'experience' in cv_data and isinstance(cv_data['experience'], list):
                    formatted_experience = []
                    for exp in cv_data['experience']:
                        if isinstance(exp, dict):
                            # Extract the most important parts for display
                            exp_text = ""
                            if 'title' in exp:
                                exp_text = exp['title']
                                
                            if 'company' in exp:
                                exp_text += f", {exp['company']}"
                                
                            if 'start_date' in exp and 'end_date' in exp:
                                exp_text += f" ({exp['start_date']} - {exp['end_date']})"
                                
                            if 'description' in exp and exp['description']:
                                exp_text += f": {exp['description'][:150]}..."
                            
                            if not exp_text and 'raw' in exp:
                                exp_text = exp['raw']
                                
                            formatted_experience.append(exp_text)
                        else:
                            formatted_experience.append(str(exp))
                    cv_data['experience'] = formatted_experience
                
                # Remove raw text from response to keep it smaller
                if 'raw_text' in cv_data:
                    del cv_data['raw_text']
                
                # Use flat skills list for compatibility with frontend
                if 'skills_categorized' in cv_data:
                    # Keep the categorized skills for potential future use
                    # But make sure the 'skills' property is a flat list
                    if not cv_data.get('skills'):
                        # If no flat skills list, create one from categories
                        all_skills = []
                        for category, skills in cv_data['skills_categorized'].items():
                            all_skills.extend(skills)
                        cv_data['skills'] = list(set(all_skills))  # Remove duplicates
            
            logger.info(f'Parsing complete for {file.filename}')
            results.append(result)
        except Exception as e:
            logger.error(f'Error parsing {file.filename}: {str(e)}', exc_info=True)
            results.append({"filename": file.filename, "error": str(e)})
    
    return jsonify({"results": results})

@app.route('/api/parse-linkedin', methods=['POST'])
def parse_linkedin():
    """
    Parse LinkedIn profile from URL.
    
    Request JSON format:
    {
        "url": "https://www.linkedin.com/in/username"
    }
    
    Returns:
        JSON with parsed LinkedIn profile data
    """
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
    """
    Parse LinkedIn profile from uploaded file (screenshot or PDF).
    
    Returns:
        JSON with parsed LinkedIn profile data
    """
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

@app.route('/api/combine-data', methods=['POST'])
def combine_data():
    """
    Combine resume and LinkedIn data for a candidate.
    
    Request JSON format:
    {
        "resume_data": {...},
        "linkedin_data": {...}
    }
    
    Returns:
        JSON with combined candidate data
    """
    logger.info('Received request to /api/combine-data')
    
    if not request.json:
        return jsonify({"error": "No data provided"}), 400
    
    if 'resume_data' not in request.json and 'linkedin_data' not in request.json:
        return jsonify({"error": "At least one data source is required"}), 400
    
    try:
        resume_data = request.json.get('resume_data', {})
        linkedin_data = request.json.get('linkedin_data', {})
        
        # Simple combining logic - in a real app, this would be more sophisticated
        combined_data = resume_data.copy()
        
        # If there's LinkedIn data, enhance the resume data
        if linkedin_data:
            # Add LinkedIn-specific fields
            combined_data['linkedin_url'] = linkedin_data.get('profile_url')
            combined_data['headline'] = linkedin_data.get('headline')
            combined_data['summary'] = linkedin_data.get('summary')
            combined_data['certifications'] = linkedin_data.get('certifications')
            combined_data['languages'] = linkedin_data.get('languages')
            combined_data['connections'] = linkedin_data.get('connections')
            
            # Combine array fields while removing duplicates
            if 'skills' in linkedin_data and 'skills' in combined_data:
                combined_data['skills'] = list(set(combined_data['skills'] + linkedin_data['skills']))
            
            if 'education' in linkedin_data and 'education' in combined_data:
                combined_data['education'] = list(set(combined_data['education'] + linkedin_data['education']))
            
            if 'experience' in linkedin_data and 'experience' in combined_data:
                combined_data['experience'] = list(set(combined_data['experience'] + linkedin_data['experience']))
        
        return jsonify({"combined_data": combined_data})
    
    except Exception as e:
        logger.error(f"Error combining data: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """Handle feedback on extraction quality"""
    logger.info('Received feedback submission')
    
    if not request.json:
        return jsonify({"error": "No data provided"}), 400
    
    if 'field' not in request.json or 'is_correct' not in request.json:
        return jsonify({"error": "Missing required fields"}), 400
    
    # This would typically store feedback and update a training dataset
    # For demo purposes, we're just returning a confirmation
    return jsonify({
        "message": "Thank you for your feedback! This helps improve the model.",
        "training_count": 42  # Placeholder count
    })

@app.route('/api/train-model', methods=['POST'])
def train_model():
    """Train the model with accumulated feedback data"""
    logger.info('Received request to train model')
    
    # This would typically trigger model training
    # For demo purposes, we're just returning a confirmation
    return jsonify({
        "message": "Model training completed successfully",
        "accuracy": 0.92,
        "training_time_seconds": 120
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "CV Parser API"})

if __name__ == '__main__':
    logger.info("Starting CV Parser API server...")
    app.run(host='0.0.0.0', port=5000, debug=True)