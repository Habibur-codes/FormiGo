
        document.addEventListener('DOMContentLoaded', function() {
            const formTitle = document.getElementById('form-title');
            const formType = document.getElementById('form-type');
            const formDesign = document.getElementById('form-design');
            const formFields = document.getElementById('form-fields');
            const previewFields = document.getElementById('preview-fields');
            const formPreview = document.getElementById('form-preview');
            const addFieldBtn = document.getElementById('add-field');
            const downloadBtn = document.getElementById('download-form');
            document.getElementById('download-pdf').addEventListener('click', downloadPDF);
            
            let fieldCount = 0;
            
            // Update form preview when title changes
            formTitle.addEventListener('input', updatePreview);
            
            // Update form design when changed
            formDesign.addEventListener('change', function() {
                // Remove all design classes
                formPreview.className = 'form-preview';
                // Add selected design class
                formPreview.classList.add(this.value);
                updatePreview();
            });
            
            // Add field button click handler
            addFieldBtn.addEventListener('click', function() {
                addField();
            });
            
            // Download form button click handler
            downloadBtn.addEventListener('click', function() {
                downloadForm();
            });
            
            // Form type change handler to set default fields
            formType.addEventListener('change', function() {
                setDefaultFields(this.value);
            });
            
            // Function to add a new field
            function addField(fieldData = {}) {
                fieldCount++;
                const fieldId = 'field-' + fieldCount;
                
                const fieldItem = document.createElement('div');
                fieldItem.className = 'field-item';
                fieldItem.id = fieldId;
                
                const fieldTypeSelect = `
                    <label for="${fieldId}-type">Field Type</label>
                    <select id="${fieldId}-type" class="field-type">
                        <option value="text" ${fieldData.type === 'text' ? 'selected' : ''}>Text</option>
                        <option value="email" ${fieldData.type === 'email' ? 'selected' : ''}>Email</option>
                        <option value="number" ${fieldData.type === 'number' ? 'selected' : ''}>Number</option>
                        <option value="password" ${fieldData.type === 'password' ? 'selected' : ''}>Password</option>
                        <option value="textarea" ${fieldData.type === 'textarea' ? 'selected' : ''}>Text Area</option>
                        <option value="select" ${fieldData.type === 'select' ? 'selected' : ''}>Dropdown</option>
                        <option value="checkbox" ${fieldData.type === 'checkbox' ? 'selected' : ''}>Checkbox</option>
                        <option value="radio" ${fieldData.type === 'radio' ? 'selected' : ''}>Radio Buttons</option>
                        <option value="date" ${fieldData.type === 'date' ? 'selected' : ''}>Date</option>
                    </select>
                `;
                
                const fieldLabel = `
                    <label for="${fieldId}-label">Field Label</label>
                    <input type="text" id="${fieldId}-label" class="field-label" value="${fieldData.label || ''}" placeholder="Enter field label">
                `;
                
                const fieldName = `
                    <label for="${fieldId}-name">Field Name (for code)</label>
                    <input type="text" id="${fieldId}-name" class="field-name" value="${fieldData.name || ''}" placeholder="Enter field name (no spaces)">
                `;
                
                const fieldRequired = `
                    <label for="${fieldId}-required">
                        <input type="checkbox" id="${fieldId}-required" class="field-required" ${fieldData.required ? 'checked' : ''}>
                        Required Field
                    </label>
                `;
                
                const optionsField = `
                    <div class="options-container" id="${fieldId}-options" style="${fieldData.type === 'select' || fieldData.type === 'radio' ? '' : 'display: none;'}">
                        <label>Options (one per line)</label>
                        <textarea class="field-options" placeholder="Option 1\nOption 2\nOption 3">${fieldData.options ? fieldData.options.join('\n') : ''}</textarea>
                    </div>
                `;
                
                const removeButton = `<button class="remove-field" data-field="${fieldId}">×</button>`;
                
                fieldItem.innerHTML = `
                    ${removeButton}
                    ${fieldTypeSelect}
                    ${fieldLabel}
                    ${fieldName}
                    ${fieldRequired}
                    ${optionsField}
                `;
                
                formFields.appendChild(fieldItem);
                
                // Add event listener for field type change to show/hide options
                document.getElementById(`${fieldId}-type`).addEventListener('change', function() {
                    const showOptions = ['select', 'radio'].includes(this.value);
                    document.getElementById(`${fieldId}-options`).style.display = showOptions ? 'block' : 'none';
                    updatePreview();
                });
                
                // Add event listeners for input changes
                const inputs = fieldItem.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.addEventListener('input', updatePreview);
                    input.addEventListener('change', updatePreview);
                });
                
                // Add event listener for remove button
                fieldItem.querySelector('.remove-field').addEventListener('click', function() {
                    fieldItem.remove();
                    updatePreview();
                });
                
                updatePreview();
            }
            
            // Function to update the preview
            function updatePreview() {
                // Update form title
                const previewTitle = document.querySelector('.form-title-preview');
                previewTitle.textContent = formTitle.value || 'Form Preview';
                
                // Clear preview fields
                previewFields.innerHTML = '';
                
                // Get all field items
                const fieldItems = document.querySelectorAll('.field-item');
                
                if (fieldItems.length === 0) {
                    previewFields.innerHTML = '<p>Your form fields will appear here</p>';
                    return;
                }
                
                fieldItems.forEach(fieldItem => {
                    const fieldType = fieldItem.querySelector('.field-type').value;
                    const fieldLabel = fieldItem.querySelector('.field-label').value || 'Untitled Field';
                    const fieldName = fieldItem.querySelector('.field-name').value || 'field' + Math.floor(Math.random() * 1000);
                    const isRequired = fieldItem.querySelector('.field-required').checked;
                    
                    const fieldDiv = document.createElement('div');
                    fieldDiv.className = 'form-field';
                    
                    const label = document.createElement('label');
                    label.textContent = fieldLabel;
                    if (isRequired) {
                        label.innerHTML += ' <span style="color:red">*</span>';
                    }
                    label.htmlFor = fieldName;
                    
                    fieldDiv.appendChild(label);
                    
                    let inputElement;
                    
                    switch (fieldType) {
                        case 'text':
                        case 'email':
                        case 'number':
                        case 'password':
                        case 'date':
                            inputElement = document.createElement('input');
                            inputElement.type = fieldType;
                            inputElement.id = fieldName;
                            inputElement.name = fieldName;
                            inputElement.required = isRequired;
                            fieldDiv.appendChild(inputElement);
                            break;
                            
                        case 'textarea':
                            inputElement = document.createElement('textarea');
                            inputElement.id = fieldName;
                            inputElement.name = fieldName;
                            inputElement.required = isRequired;
                            inputElement.rows = 3;
                            fieldDiv.appendChild(inputElement);
                            break;
                            
                        case 'select':
                            inputElement = document.createElement('select');
                            inputElement.id = fieldName;
                            inputElement.name = fieldName;
                            inputElement.required = isRequired;
                            
                            const optionsText = fieldItem.querySelector('.field-options').value;
                            if (optionsText) {
                                optionsText.split('\n').forEach(optionText => {
                                    if (optionText.trim()) {
                                        const option = document.createElement('option');
                                        option.value = optionText.trim().toLowerCase().replace(/\s+/g, '_');
                                        option.textContent = optionText.trim();
                                        inputElement.appendChild(option);
                                    }
                                });
                            }
                            
                            fieldDiv.appendChild(inputElement);
                            break;
                            
                        case 'checkbox':
                            inputElement = document.createElement('input');
                            inputElement.type = 'checkbox';
                            inputElement.id = fieldName;
                            inputElement.name = fieldName;
                            fieldDiv.insertBefore(inputElement, label);
                            label.htmlFor = fieldName;
                            break;
                            
                        case 'radio':
                            const optionsContainer = document.createElement('div');
                            const optionsTextRadio = fieldItem.querySelector('.field-options').value;
                            
                            if (optionsTextRadio) {
                                optionsTextRadio.split('\n').forEach((optionText, index) => {
                                    if (optionText.trim()) {
                                        const radioId = `${fieldName}_${index}`;
                                        
                                        const radioDiv = document.createElement('div');
                                        
                                        const radioInput = document.createElement('input');
                                        radioInput.type = 'radio';
                                        radioInput.id = radioId;
                                        radioInput.name = fieldName;
                                        radioInput.value = optionText.trim().toLowerCase().replace(/\s+/g, '_');
                                        radioInput.required = isRequired;
                                        
                                        const radioLabel = document.createElement('label');
                                        radioLabel.htmlFor = radioId;
                                        radioLabel.textContent = optionText.trim();
                                        
                                        radioDiv.appendChild(radioInput);
                                        radioDiv.appendChild(radioLabel);
                                        optionsContainer.appendChild(radioDiv);
                                    }
                                });
                            }
                            
                            fieldDiv.appendChild(optionsContainer);
                            break;
                    }
                    
                    previewFields.appendChild(fieldDiv);
                });
            }
            
            // Function to set default fields based on form type
            function setDefaultFields(formType) {
                // Clear existing fields
                formFields.innerHTML = '';
                fieldCount = 0;
                
                switch (formType) {
                    case 'contact':
                        formTitle.value = 'Contact Us';
                        addField({ type: 'text', label: 'Name', name: 'name', required: true });
                        addField({ type: 'email', label: 'Email', name: 'email', required: true });
                        addField({ type: 'text', label: 'Subject', name: 'subject', required: true });
                        addField({ type: 'textarea', label: 'Message', name: 'message', required: true });
                        break;
                        
                    case 'survey':
                        formTitle.value = 'Customer Survey';
                        addField({ type: 'text', label: 'Name', name: 'name', required: false });
                        addField({ type: 'select', label: 'How satisfied are you?', name: 'satisfaction', required: true, 
                                 options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'] });
                        addField({ type: 'textarea', label: 'Comments', name: 'comments', required: false });
                        addField({ type: 'radio', label: 'Would you recommend us?', name: 'recommend', required: true, 
                                 options: ['Yes', 'No', 'Maybe'] });
                        break;
                        
                    case 'registration':
                        formTitle.value = 'Registration Form';
                        addField({ type: 'text', label: 'First Name', name: 'first_name', required: true });
                        addField({ type: 'text', label: 'Last Name', name: 'last_name', required: true });
                        addField({ type: 'email', label: 'Email', name: 'email', required: true });
                        addField({ type: 'password', label: 'Password', name: 'password', required: true });
                        addField({ type: 'checkbox', label: 'I agree to the terms and conditions', name: 'terms', required: true });
                        break;
                        
                    case 'feedback':
                        formTitle.value = 'Feedback Form';
                        addField({ type: 'text', label: 'Your Name', name: 'name', required: false });
                        addField({ type: 'select', label: 'Feedback Type', name: 'type', required: true, 
                                 options: ['Suggestion', 'Complaint', 'Bug Report', 'Compliment'] });
                        addField({ type: 'textarea', label: 'Your Feedback', name: 'feedback', required: true });
                        break;
                        
                    case 'custom':
                        formTitle.value = 'My Custom Form';
                        break;
                }
                
                updatePreview();
            }
            // Function to download form as PDF
            function downloadPDF() {
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    
    // Get the form preview element
    const element = document.getElementById('form-preview');
    const title = formTitle.value || 'My Form';
    
    // Add title to PDF
    doc.setFontSize(20);
    doc.text(title, 40, 40);
    
    // Use html2canvas to capture the form
    html2canvas(element, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = doc.internal.pageSize.getWidth() - 80;
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 70; // Start position after title
        
        // Add image to PDF
        doc.addImage(imgData, 'PNG', 40, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add new pages if content is too long
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 40, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Save the PDF
        doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_form.pdf`);
    });
            }
            
            // Function to download the form as HTML file
            function downloadForm() {
                const formTitleText = formTitle.value || 'My Form';
                const formDesignClass = formDesign.value;
                
                // Get all field data
                const fields = [];
                document.querySelectorAll('.field-item').forEach(fieldItem => {
                    const type = fieldItem.querySelector('.field-type').value;
                    const label = fieldItem.querySelector('.field-label').value || 'Untitled Field';
                    const name = fieldItem.querySelector('.field-name').value || 'field' + Math.floor(Math.random() * 1000);
                    const required = fieldItem.querySelector('.field-required').checked;
                    let options = [];
                    
                    if (['select', 'radio'].includes(type)) {
                        const optionsText = fieldItem.querySelector('.field-options').value;
                        if (optionsText) {
                            options = optionsText.split('\n').map(o => o.trim()).filter(o => o);
                        }
                    }
                    
                    fields.push({ type, label, name, required, options });
                });
                
                // Generate HTML for the form
                let formHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formTitleText}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .form-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .form-title {
            text-align: center;
            margin-bottom: 20px;
            color: #4285f4;
        }
        
        .form-field {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
        }
        
        input[type="text"],
        input[type="email"],
        input[type="number"],
        input[type="password"],
        input[type="date"],
        select,
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        
        textarea {
            min-height: 100px;
        }
        
        input[type="checkbox"],
        input[type="radio"] {
            margin-right: 10px;
        }
        
        .radio-option, .checkbox-option {
            margin-bottom: 5px;
        }
        
        button {
            background-color: #4285f4;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        
        button:hover {
            background-color: #3367d6;
        }
        
        .required {
            color: red;
        }
        
        /* Design-specific styles */
        ${getDesignStyles(formDesignClass)}
    </style>
</head>
<body>
    <div class="form-container ${formDesignClass}">
        <h1 class="form-title">${formTitleText}</h1>
        <form action="#" method="POST">`;
                
                // Add fields to the form HTML
                fields.forEach(field => {
                    formHtml += `\n            <div class="form-field">`;
                    formHtml += `\n                <label for="${field.name}">${field.label}${field.required ? ' <span class="required">*</span>' : ''}</label>`;
                    
                    switch (field.type) {
                        case 'text':
                        case 'email':
                        case 'number':
                        case 'password':
                        case 'date':
                            formHtml += `\n                <input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
                            break;
                            
                        case 'textarea':
                            formHtml += `\n                <textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}></textarea>`;
                            break;
                            
                        case 'select':
                            formHtml += `\n                <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
                            field.options.forEach(option => {
                                const value = option.toLowerCase().replace(/\s+/g, '_');
                                formHtml += `\n                    <option value="${value}">${option}</option>`;
                            });
                            formHtml += `\n                </select>`;
                            break;
                            
                        case 'checkbox':
                            formHtml += `\n                <div class="checkbox-option">`;
                            formHtml += `\n                    <input type="checkbox" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
                            formHtml += `\n                    <label for="${field.name}">${field.label}</label>`;
                            formHtml += `\n                </div>`;
                            break;
                            
                        case 'radio':
                            field.options.forEach((option, index) => {
                                const optionId = `${field.name}_${index}`;
                                const value = option.toLowerCase().replace(/\s+/g, '_');
                                formHtml += `\n                <div class="radio-option">`;
                                formHtml += `\n                    <input type="radio" id="${optionId}" name="${field.name}" value="${value}" ${index === 0 && field.required ? 'required' : ''}>`;
                                formHtml += `\n                    <label for="${optionId}">${option}</label>`;
                                formHtml += `\n                </div>`;
                            });
                            break;
                    }
                    
                    formHtml += `\n            </div>`;
                });
                
                // Add submit button
                formHtml += `\n            <div class="form-field">`;
                formHtml += `\n                <button type="submit">Submit</button>`;
                formHtml += `\n            </div>`;
                
                // Close the form HTML
                formHtml += `\n        </form>`;
                formHtml += `\n    </div>`;
                formHtml += `\n</body>`;
                formHtml += `\n</html>`;
                
                // Create download link
                const blob = new Blob([formHtml], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${formTitleText.toLowerCase().replace(/\s+/g, '_')}_form.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            
            // Function to get CSS styles for different designs
            function getDesignStyles(design) {
                switch (design) {
                    case 'modern':
                        return `
                            .form-container {
                                background-color: #f8f9fa;
                                border-left: 5px solid #34a853;
                            }
                            
                            .form-field {
                                background-color: white;
                                padding: 15px;
                                border-radius: 4px;
                                margin-bottom: 15px;
                                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                            }
                        `;
                        
                    case 'elegant':
                        return `
                            .form-container {
                                background-color: #fff;
                                border: 1px solid #e0e0e0;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                            }
                            
                            .form-field {
                                border-bottom: 1px solid #e0e0e0;
                                padding-bottom: 15px;
                                margin-bottom: 15px;
                            }
                            
                            .form-title {
                                color: #555;
                                font-weight: 300;
                            }
                            
                            button {
                                background-color: #555;
                            }
                            
                            button:hover {
                                background-color: #333;
                            }
                        `;
                        
                    case 'minimalist':
                        return `
                            .form-container {
                                background-color: white;
                                border: none;
                                box-shadow: none;
                                padding: 0;
                            }
                            
                            .form-title {
                                font-weight: normal;
                                font-size: 1.5rem;
                            }
                            
                            label {
                                font-weight: normal;
                                font-size: 0.9rem;
                            }
                            
                            input[type="text"],
                            input[type="email"],
                            input[type="number"],
                            input[type="password"],
                            input[type="date"],
                            select,
                            textarea {
                                border: none;
                                border-bottom: 1px solid #ddd;
                                border-radius: 0;
                                padding: 5px 0;
                            }
                            
                            button {
                                background-color: white;
                                color: #333;
                                border: 1px solid #ddd;
                            }
                            
                            button:hover {
                                background-color: #f5f5f5;
                            }
                        `;
                        
                    default: // default design
                        return `
                            .form-container {
                                border-top: 5px solid #4285f4;
                            }
                        `;
                }
            }
            
            // Initialize with default form type
            setDefaultFields('contact');
        });
    