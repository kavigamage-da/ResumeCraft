// ===== ResumeCraft Application =====

// State Management
const state = {
    currentPage: 'landing',
    currentResumeId: null,
    currentSection: 'personal',
    resumes: [],
    customization: {
        template: 'executive',
        accentColor: '#6366f1',
        font: 'inter',
        fontSize: 'medium',
        spacing: 'normal'
    }
};

// Sample Resume Data
const sampleResume = {
    id: null,
    name: 'Alex Johnson',
    title: 'Software Engineer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    portfolio: 'alexjohnson.dev',
    profileImage: null,
    summary: 'Information Technology undergraduate interested in product thinking, business analysis, data analytics, and digital solutions. Passionate about building user-centric products and solving complex problems through technology.',
    education: [
        {
            id: 1,
            institution: 'Stanford University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2020-09',
            endDate: '2024-05',
            gpa: '3.8',
            description: 'Graduated with honors. Specialized in software engineering and machine learning.'
        }
    ],
    experience: [
        {
            id: 1,
            title: 'Software Engineering Intern',
            company: 'Google',
            location: 'Mountain View, CA',
            startDate: '2023-06',
            endDate: '2023-09',
            responsibilities: 'Developed features for Google Cloud Platform using Python and Go. Collaborated with cross-functional teams to improve system performance by 25%.'
        },
        {
            id: 2,
            title: 'Full Stack Developer',
            company: 'Tech Startup',
            location: 'San Francisco, CA',
            startDate: '2022-06',
            endDate: '2023-05',
            responsibilities: 'Built and maintained web applications using React and Node.js. Implemented CI/CD pipelines and automated testing.'
        }
    ],
    projects: [
        {
            id: 1,
            name: 'ResumeCraft',
            description: 'AI-powered resume builder with real-time preview and ATS optimization',
            technologies: 'JavaScript, HTML, CSS, localStorage',
            link: 'https://resumecraft.dev',
            achievement: 'Helped 500+ users create professional resumes'
        },
        {
            id: 2,
            name: 'TaskFlow',
            description: 'Project management tool for remote teams',
            technologies: 'React, Node.js, MongoDB',
            link: 'https://taskflow.app',
            achievement: 'Featured on Product Hunt'
        }
    ],
    skills: ['JavaScript', 'Python', 'HTML', 'CSS', 'React', 'Node.js', 'SQL', 'Git', 'GitHub', 'AWS', 'Docker', 'TypeScript'],
    certifications: [
        {
            id: 1,
            name: 'AWS Certified Developer',
            organization: 'Amazon Web Services',
            date: '2023-08',
            link: 'https://aws.amazon.com/certification/'
        },
        {
            id: 2,
            name: 'Google Cloud Professional',
            organization: 'Google',
            date: '2023-06',
            link: 'https://cloud.google.com/certification'
        }
    ],
    achievements: [
        {
            id: 1,
            title: 'Hackathon Winner',
            description: 'First place at Stanford TreeHacks 2023',
            date: '2023-02'
        },
        {
            id: 2,
            title: 'Dean\'s List',
            description: 'Achieved Dean\'s List for 6 consecutive quarters',
            date: '2020-2024'
        }
    ],
    languages: [
        { id: 1, language: 'English', proficiency: 'Native' },
        { id: 2, language: 'Spanish', proficiency: 'Intermediate' }
    ],
    customization: {
        template: 'executive',
        accentColor: '#6366f1',
        font: 'inter',
        fontSize: 'medium',
        spacing: 'normal'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

// ===== Utility Functions =====

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== LocalStorage Functions =====

function saveToLocalStorage() {
    try {
        localStorage.setItem('resumecraft_resumes', JSON.stringify(state.resumes));
        localStorage.setItem('resumecraft_customization', JSON.stringify(state.customization));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const resumes = localStorage.getItem('resumecraft_resumes');
        const customization = localStorage.getItem('resumecraft_customization');
        
        if (resumes) {
            state.resumes = JSON.parse(resumes);
        }
        
        if (customization) {
            state.customization = JSON.parse(customization);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// ===== Toast Notifications =====

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ===== Modal Functions =====

function showModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.classList.add('show');
    
    modalConfirm.onclick = () => {
        modal.classList.remove('show');
        if (onConfirm) onConfirm();
    };
    
    modalCancel.onclick = () => {
        modal.classList.remove('show');
    };
}

// ===== Page Navigation =====

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    document.getElementById(`${pageId}-page`).classList.remove('hidden');
    state.currentPage = pageId;
}

function navigateToLanding() {
    showPage('landing');
}

function navigateToDashboard() {
    showPage('dashboard');
    renderDashboard();
}

function navigateToBuilder(resumeId = null) {
    if (resumeId) {
        state.currentResumeId = resumeId;
        const resume = state.resumes.find(r => r.id === resumeId);
        if (resume) {
            state.customization = resume.customization || state.customization;
        }
    } else {
        state.currentResumeId = null;
    }
    
    showPage('builder');
    renderBuilder();
}

// ===== Dashboard Functions =====

function renderDashboard() {
    const resumesGrid = document.getElementById('resumes-grid');
    const emptyState = document.getElementById('resumes-empty');
    const statResumes = document.getElementById('stat-resumes');
    const statStrength = document.getElementById('stat-strength');
    const statUpdated = document.getElementById('stat-updated');
    
    // Update stats
    statResumes.textContent = state.resumes.length;
    
    if (state.resumes.length > 0) {
        const latestResume = state.resumes[state.resumes.length - 1];
        const strength = calculateResumeStrength(latestResume);
        statStrength.textContent = `${strength}%`;
        statUpdated.textContent = formatDate(latestResume.updatedAt);
    } else {
        statStrength.textContent = '0%';
        statUpdated.textContent = '-';
    }
    
    // Render resume cards
    if (state.resumes.length === 0) {
        resumesGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        resumesGrid.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        resumesGrid.innerHTML = state.resumes.map(resume => {
            const strength = calculateResumeStrength(resume);
            return `
                <div class="resume-card">
                    <div class="resume-card-header">
                        <div>
                            <div class="resume-card-name">${resume.name || 'Untitled Resume'}</div>
                            <div class="resume-card-template">${resume.customization?.template || 'Executive'} Template</div>
                        </div>
                        <div class="resume-card-strength">${strength}%</div>
                    </div>
                    <div class="resume-card-meta">
                        <span>Last edited: ${formatDate(resume.updatedAt)}</span>
                    </div>
                    <div class="resume-card-actions">
                        <button class="btn btn-secondary" onclick="editResume('${resume.id}')">Edit</button>
                        <button class="btn btn-secondary" onclick="duplicateResume('${resume.id}')">Duplicate</button>
                        <button class="btn btn-secondary" onclick="deleteResume('${resume.id}')">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function createNewResume() {
    const newResume = JSON.parse(JSON.stringify(sampleResume));
    newResume.id = generateId();
    newResume.createdAt = new Date().toISOString();
    newResume.updatedAt = new Date().toISOString();
    newResume.name = `Resume ${state.resumes.length + 1}`;
    
    state.resumes.push(newResume);
    saveToLocalStorage();
    
    navigateToBuilder(newResume.id);
    showToast('New resume created!');
}

function editResume(resumeId) {
    navigateToBuilder(resumeId);
}

function duplicateResume(resumeId) {
    const resume = state.resumes.find(r => r.id === resumeId);
    if (resume) {
        const duplicated = JSON.parse(JSON.stringify(resume));
        duplicated.id = generateId();
        duplicated.name = `${resume.name} (Copy)`;
        duplicated.createdAt = new Date().toISOString();
        duplicated.updatedAt = new Date().toISOString();
        
        state.resumes.push(duplicated);
        saveToLocalStorage();
        
        renderDashboard();
        showToast('Resume duplicated!');
    }
}

function deleteResume(resumeId) {
    showModal(
        'Delete Resume',
        'Are you sure you want to delete this resume? This action cannot be undone.',
        () => {
            state.resumes = state.resumes.filter(r => r.id !== resumeId);
            saveToLocalStorage();
            renderDashboard();
            showToast('Resume deleted!');
        }
    );
}

// ===== Resume Builder Functions =====

function renderBuilder() {
    const resume = getCurrentResume();
    if (!resume) {
        createNewResume();
        return;
    }
    
    renderSection(state.currentSection);
    renderPreview();
    updateCustomizationPanel();
    updateStrengthIndicator();
}

function getCurrentResume() {
    if (state.currentResumeId) {
        return state.resumes.find(r => r.id === state.currentResumeId);
    }
    return null;
}

function updateCurrentResume(updates) {
    const resumeIndex = state.resumes.findIndex(r => r.id === state.currentResumeId);
    if (resumeIndex !== -1) {
        state.resumes[resumeIndex] = {
            ...state.resumes[resumeIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
            customization: state.customization
        };
        saveToLocalStorage();
        showAutoSaveIndicator();
        renderPreview();
        updateStrengthIndicator();
    }
}

function showAutoSaveIndicator() {
    const indicator = document.getElementById('auto-save-indicator');
    const saveText = indicator.querySelector('.save-text');
    saveText.textContent = 'Saving...';
    
    setTimeout(() => {
        saveText.textContent = 'Saved';
    }, 500);
}

// ===== Section Rendering =====

function renderSection(section) {
    state.currentSection = section;
    
    // Update active button
    document.querySelectorAll('.section-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === section) {
            btn.classList.add('active');
        }
    });
    
    // Update title
    const titles = {
        personal: 'Personal Information',
        summary: 'Professional Summary',
        education: 'Education',
        experience: 'Experience',
        projects: 'Projects',
        skills: 'Skills',
        certifications: 'Certifications',
        achievements: 'Achievements',
        languages: 'Languages'
    };
    
    document.getElementById('editor-title').textContent = titles[section] || section;
    
    // Render form content
    const editorContent = document.getElementById('editor-content');
    const resume = getCurrentResume();
    
    switch (section) {
        case 'personal':
            editorContent.innerHTML = renderPersonalForm(resume);
            break;
        case 'summary':
            editorContent.innerHTML = renderSummaryForm(resume);
            break;
        case 'education':
            editorContent.innerHTML = renderEducationForm(resume);
            break;
        case 'experience':
            editorContent.innerHTML = renderExperienceForm(resume);
            break;
        case 'projects':
            editorContent.innerHTML = renderProjectsForm(resume);
            break;
        case 'skills':
            editorContent.innerHTML = renderSkillsForm(resume);
            break;
        case 'certifications':
            editorContent.innerHTML = renderCertificationsForm(resume);
            break;
        case 'achievements':
            editorContent.innerHTML = renderAchievementsForm(resume);
            break;
        case 'languages':
            editorContent.innerHTML = renderLanguagesForm(resume);
            break;
    }
    
    // Add event listeners
    addFormListeners(section);
}

function renderPersonalForm(resume) {
    return `
        <div class="profile-image-upload">
            <div class="profile-image-preview" id="profile-preview">
                ${resume.profileImage ? `<img src="${resume.profileImage}" alt="Profile">` : '👤'}
            </div>
            <input type="file" id="profile-input" class="profile-image-input" accept="image/*">
            <label for="profile-input" class="profile-image-label">Upload Photo</label>
        </div>
        
        <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" id="input-name" value="${resume.name || ''}" placeholder="John Doe">
        </div>
        
        <div class="form-group">
            <label class="form-label">Professional Title *</label>
            <input type="text" class="form-input" id="input-title" value="${resume.title || ''}" placeholder="Software Engineer">
        </div>
        
        <div class="form-group">
            <label class="form-label">Email *</label>
            <input type="email" class="form-input" id="input-email" value="${resume.email || ''}" placeholder="john@example.com">
        </div>
        
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="tel" class="form-input" id="input-phone" value="${resume.phone || ''}" placeholder="+1 (555) 123-4567">
        </div>
        
        <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input" id="input-location" value="${resume.location || ''}" placeholder="San Francisco, CA">
        </div>
        
        <div class="form-group">
            <label class="form-label">LinkedIn</label>
            <input type="url" class="form-input" id="input-linkedin" value="${resume.linkedin || ''}" placeholder="linkedin.com/in/johndoe">
        </div>
        
        <div class="form-group">
            <label class="form-label">GitHub</label>
            <input type="url" class="form-input" id="input-github" value="${resume.github || ''}" placeholder="github.com/johndoe">
        </div>
        
        <div class="form-group">
            <label class="form-label">Portfolio</label>
            <input type="url" class="form-input" id="input-portfolio" value="${resume.portfolio || ''}" placeholder="johndoe.dev">
        </div>
    `;
}

function renderSummaryForm(resume) {
    const charCount = (resume.summary || '').length;
    return `
        <div class="form-group">
            <label class="form-label">Professional Summary</label>
            <textarea class="form-textarea" id="input-summary" placeholder="Information Technology undergraduate interested in product thinking, business analysis, data analytics, and digital solutions.">${resume.summary || ''}</textarea>
            <div class="character-counter">${charCount} / 500 characters</div>
            <p class="form-hint">Write a compelling summary that highlights your key strengths and career goals.</p>
        </div>
        
        <button class="btn btn-secondary" id="improve-summary-btn">✨ Improve Summary</button>
        
        <div id="summary-suggestions" style="margin-top: 1rem; display: none;">
            <p class="form-label">Suggestions:</p>
            <div class="form-hint" id="suggestions-list"></div>
        </div>
    `;
}

function renderEducationForm(resume) {
    const educationItems = (resume.education || []).map(edu => `
        <div class="dynamic-item" data-id="${edu.id}">
            <div class="dynamic-item-header">
                <div class="dynamic-item-title">${edu.institution || 'New Education'}</div>
                <div class="dynamic-item-actions">
                    <button class="btn-icon delete" onclick="deleteEducation('${edu.id}')">✕</button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Institution *</label>
                <input type="text" class="form-input edu-institution" value="${edu.institution || ''}" placeholder="Stanford University">
            </div>
            <div class="form-group">
                <label class="form-label">Degree *</label>
                <input type="text" class="form-input edu-degree" value="${edu.degree || ''}" placeholder="Bachelor of Science">
            </div>
            <div class="form-group">
                <label class="form-label">Field of Study</label>
                <input type="text" class="form-input edu-field" value="${edu.field || ''}" placeholder="Computer Science">
            </div>
            <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="month" class="form-input edu-start" value="${edu.startDate || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="month" class="form-input edu-end" value="${edu.endDate || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">GPA</label>
                <input type="text" class="form-input edu-gpa" value="${edu.gpa || ''}" placeholder="3.8">
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea edu-description" placeholder="Graduated with honors. Specialized in software engineering.">${edu.description || ''}</textarea>
            </div>
        </div>
    `).join('');
    
    return `
        ${educationItems}
        <button class="btn-add" id="add-education-btn">+ Add Education</button>
        ${educationItems.length === 0 ? '<p class="form-hint">No education added yet. Add your academic background.</p>' : ''}
    `;
}

function renderExperienceForm(resume) {
    const experienceItems = (resume.experience || []).map(exp => `
        <div class="dynamic-item" data-id="${exp.id}">
            <div class="dynamic-item-header">
                <div class="dynamic-item-title">${exp.company || 'New Experience'}</div>
                <div class="dynamic-item-actions">
                    <button class="btn-icon delete" onclick="deleteExperience('${exp.id}')">✕</button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Job Title *</label>
                <input type="text" class="form-input exp-title" value="${exp.title || ''}" placeholder="Software Engineer">
            </div>
            <div class="form-group">
                <label class="form-label">Company *</label>
                <input type="text" class="form-input exp-company" value="${exp.company || ''}" placeholder="Google">
            </div>
            <div class="form-group">
                <label class="form-label">Location</label>
                <input type="text" class="form-input exp-location" value="${exp.location || ''}" placeholder="Mountain View, CA">
            </div>
            <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="month" class="form-input exp-start" value="${exp.startDate || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="month" class="form-input exp-end" value="${exp.endDate || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Responsibilities *</label>
                <textarea class="form-textarea exp-responsibilities" placeholder="Describe your key responsibilities and achievements.">${exp.responsibilities || ''}</textarea>
            </div>
        </div>
    `).join('');
    
    return `
        ${experienceItems}
        <button class="btn-add" id="add-experience-btn">+ Add Experience</button>
        ${experienceItems.length === 0 ? '<p class="form-hint">No experience added yet. Add internships, jobs, or volunteer work.</p>' : ''}
    `;
}

function renderProjectsForm(resume) {
    const projectItems = (resume.projects || []).map(proj => `
        <div class="dynamic-item" data-id="${proj.id}">
            <div class="dynamic-item-header">
                <div class="dynamic-item-title">${proj.name || 'New Project'}</div>
                <div class="dynamic-item-actions">
                    <button class="btn-icon delete" onclick="deleteProject('${proj.id}')">✕</button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Project Name *</label>
                <input type="text" class="form-input proj-name" value="${proj.name || ''}" placeholder="My Awesome Project">
            </div>
            <div class="form-group">
                <label class="form-label">Description *</label>
                <textarea class="form-textarea proj-description" placeholder="Describe what the project does and its purpose.">${proj.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Technologies</label>
                <input type="text" class="form-input proj-technologies" value="${proj.technologies || ''}" placeholder="JavaScript, React, Node.js">
            </div>
            <div class="form-group">
                <label class="form-label">Project Link</label>
                <input type="url" class="form-input proj-link" value="${proj.link || ''}" placeholder="https://github.com/username/project">
            </div>
            <div class="form-group">
                <label class="form-label">Key Achievement</label>
                <input type="text" class="form-input proj-achievement" value="${proj.achievement || ''}" placeholder="Featured on Product Hunt">
            </div>
        </div>
    `).join('');
    
    return `
        ${projectItems}
        <button class="btn-add" id="add-project-btn">+ Add Project</button>
        ${projectItems.length === 0 ? '<p class="form-hint">No projects added yet. Showcase your personal or academic projects.</p>' : ''}
    `;
}

function renderSkillsForm(resume) {
    const skills = resume.skills || [];
    const skillTags = skills.map(skill => `
        <span class="skill-tag">
            ${skill}
            <button class="skill-tag-remove" onclick="removeSkill('${skill}')">×</button>
        </span>
    `).join('');
    
    return `
        <div class="skills-container">
            ${skillTags}
        </div>
        <div class="skills-input-container">
            <input type="text" class="form-input skills-input" id="skill-input" placeholder="Type a skill and press Enter">
            <button class="btn btn-primary" id="add-skill-btn">Add</button>
        </div>
        <p class="form-hint">Add relevant skills for your target position. Press Enter or click Add to add a skill.</p>
    `;
}

function renderCertificationsForm(resume) {
    const certItems = (resume.certifications || []).map(cert => `
        <div class="dynamic-item" data-id="${cert.id}">
            <div class="dynamic-item-header">
                <div class="dynamic-item-title">${cert.name || 'New Certification'}</div>
                <div class="dynamic-item-actions">
                    <button class="btn-icon delete" onclick="deleteCertification('${cert.id}')">✕</button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Certification Name *</label>
                <input type="text" class="form-input cert-name" value="${cert.name || ''}" placeholder="AWS Certified Developer">
            </div>
            <div class="form-group">
                <label class="form-label">Issuing Organization *</label>
                <input type="text" class="form-input cert-organization" value="${cert.organization || ''}" placeholder="Amazon Web Services">
            </div>
            <div class="form-group">
                <label class="form-label">Date</label>
                <input type="month" class="form-input cert-date" value="${cert.date || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Credential Link</label>
                <input type="url" class="form-input cert-link" value="${cert.link || ''}" placeholder="https://aws.amazon.com/certification/">
            </div>
        </div>
    `).join('');
    
    return `
        ${certItems}
        <button class="btn-add" id="add-certification-btn">+ Add Certification</button>
        ${certItems.length === 0 ? '<p class="form-hint">No certifications added yet. Add your professional certifications.</p>' : ''}
    `;
}

function renderAchievementsForm(resume) {
    const achievementItems = (resume.achievements || []).map(ach => `
        <div class="dynamic-item" data-id="${ach.id}">
            <div class="dynamic-item-header">
                <div class="dynamic-item-title">${ach.title || 'New Achievement'}</div>
                <div class="dynamic-item-actions">
                    <button class="btn-icon delete" onclick="deleteAchievement('${ach.id}')">✕</button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Achievement Title *</label>
                <input type="text" class="form-input ach-title" value="${ach.title || ''}" placeholder="Hackathon Winner">
            </div>
            <div class="form-group">
                <label class="form-label">Description *</label>
                <textarea class="form-textarea ach-description" placeholder="Describe your achievement.">${ach.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Date</label>
                <input type="month" class="form-input ach-date" value="${ach.date || ''}">
            </div>
        </div>
    `).join('');
    
    return `
        ${achievementItems}
        <button class="btn-add" id="add-achievement-btn">+ Add Achievement</button>
        ${achievementItems.length === 0 ? '<p class="form-hint">No achievements added yet. Add awards, competitions, or academic achievements.</p>' : ''}
    `;
}

function renderLanguagesForm(resume) {
    const languageItems = (resume.languages || []).map(lang => `
        <div class="dynamic-item" data-id="${lang.id}">
            <div class="dynamic-item-header">
                <div class="dynamic-item-title">${lang.language || 'New Language'}</div>
                <div class="dynamic-item-actions">
                    <button class="btn-icon delete" onclick="deleteLanguage('${lang.id}')">✕</button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Language *</label>
                <input type="text" class="form-input lang-language" value="${lang.language || ''}" placeholder="English">
            </div>
            <div class="form-group">
                <label class="form-label">Proficiency *</label>
                <select class="form-select lang-proficiency">
                    <option value="Native" ${lang.proficiency === 'Native' ? 'selected' : ''}>Native</option>
                    <option value="Fluent" ${lang.proficiency === 'Fluent' ? 'selected' : ''}>Fluent</option>
                    <option value="Advanced" ${lang.proficiency === 'Advanced' ? 'selected' : ''}>Advanced</option>
                    <option value="Intermediate" ${lang.proficiency === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                    <option value="Basic" ${lang.proficiency === 'Basic' ? 'selected' : ''}>Basic</option>
                </select>
            </div>
        </div>
    `).join('');
    
    return `
        ${languageItems}
        <button class="btn-add" id="add-language-btn">+ Add Language</button>
        ${languageItems.length === 0 ? '<p class="form-hint">No languages added yet. Add languages you speak.</p>' : ''}
    `;
}

// ===== Form Event Listeners =====

function addFormListeners(section) {
    const resume = getCurrentResume();
    
    switch (section) {
        case 'personal':
            addPersonalListeners(resume);
            break;
        case 'summary':
            addSummaryListeners(resume);
            break;
        case 'education':
            addEducationListeners(resume);
            break;
        case 'experience':
            addExperienceListeners(resume);
            break;
        case 'projects':
            addProjectsListeners(resume);
            break;
        case 'skills':
            addSkillsListeners(resume);
            break;
        case 'certifications':
            addCertificationsListeners(resume);
            break;
        case 'achievements':
            addAchievementsListeners(resume);
            break;
        case 'languages':
            addLanguagesListeners(resume);
            break;
    }
}

function addPersonalListeners(resume) {
    const inputs = ['name', 'title', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio'];
    
    inputs.forEach(field => {
        const input = document.getElementById(`input-${field}`);
        if (input) {
            input.addEventListener('input', debounce(() => {
                updateCurrentResume({ [field]: input.value });
            }, 300));
        }
    });
    
    // Profile image upload
    const profileInput = document.getElementById('profile-input');
    if (profileInput) {
        profileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('profile-preview');
                    preview.innerHTML = `<img src="${event.target.result}" alt="Profile">`;
                    updateCurrentResume({ profileImage: event.target.result });
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function addSummaryListeners(resume) {
    const summaryInput = document.getElementById('input-summary');
    if (summaryInput) {
        summaryInput.addEventListener('input', debounce(() => {
            const value = summaryInput.value;
            const counter = document.querySelector('.character-counter');
            counter.textContent = `${value.length} / 500 characters`;
            updateCurrentResume({ summary: value });
        }, 300));
    }
    
    // Improve summary button
    const improveBtn = document.getElementById('improve-summary-btn');
    if (improveBtn) {
        improveBtn.addEventListener('click', () => {
            const suggestions = [
                'Add specific achievements or metrics',
                'Include relevant keywords for your target role',
                'Mention your unique value proposition',
                'Keep it concise (2-3 sentences)',
                'Tailor it to the job description'
            ];
            
            const suggestionsDiv = document.getElementById('summary-suggestions');
            const suggestionsList = document.getElementById('suggestions-list');
            
            suggestionsList.innerHTML = suggestions.map(s => `• ${s}`).join('<br>');
            suggestionsDiv.style.display = 'block';
        });
    }
}

function addEducationListeners(resume) {
    // Add education button
    const addBtn = document.getElementById('add-education-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const newEducation = {
                id: generateId(),
                institution: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                gpa: '',
                description: ''
            };
            
            const updatedEducation = [...(resume.education || []), newEducation];
            updateCurrentResume({ education: updatedEducation });
            renderSection('education');
        });
    }
    
    // Education item listeners
    document.querySelectorAll('.dynamic-item[data-id]').forEach(item => {
        const id = item.dataset.id;
        
        const institution = item.querySelector('.edu-institution');
        const degree = item.querySelector('.edu-degree');
        const field = item.querySelector('.edu-field');
        const startDate = item.querySelector('.edu-start');
        const endDate = item.querySelector('.edu-end');
        const gpa = item.querySelector('.edu-gpa');
        const description = item.querySelector('.edu-description');
        
        const updateEducation = () => {
            const educationIndex = resume.education.findIndex(e => e.id === id);
            if (educationIndex !== -1) {
                resume.education[educationIndex] = {
                    ...resume.education[educationIndex],
                    institution: institution?.value || '',
                    degree: degree?.value || '',
                    field: field?.value || '',
                    startDate: startDate?.value || '',
                    endDate: endDate?.value || '',
                    gpa: gpa?.value || '',
                    description: description?.value || ''
                };
                updateCurrentResume({ education: resume.education });
            }
        };
        
        [institution, degree, field, startDate, endDate, gpa, description].forEach(input => {
            if (input) {
                input.addEventListener('input', debounce(updateEducation, 300));
            }
        });
    });
}

function addExperienceListeners(resume) {
    const addBtn = document.getElementById('add-experience-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const newExperience = {
                id: generateId(),
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                responsibilities: ''
            };
            
            const updatedExperience = [...(resume.experience || []), newExperience];
            updateCurrentResume({ experience: updatedExperience });
            renderSection('experience');
        });
    }
    
    document.querySelectorAll('.dynamic-item[data-id]').forEach(item => {
        const id = item.dataset.id;
        
        const title = item.querySelector('.exp-title');
        const company = item.querySelector('.exp-company');
        const location = item.querySelector('.exp-location');
        const startDate = item.querySelector('.exp-start');
        const endDate = item.querySelector('.exp-end');
        const responsibilities = item.querySelector('.exp-responsibilities');
        
        const updateExperience = () => {
            const experienceIndex = resume.experience.findIndex(e => e.id === id);
            if (experienceIndex !== -1) {
                resume.experience[experienceIndex] = {
                    ...resume.experience[experienceIndex],
                    title: title?.value || '',
                    company: company?.value || '',
                    location: location?.value || '',
                    startDate: startDate?.value || '',
                    endDate: endDate?.value || '',
                    responsibilities: responsibilities?.value || ''
                };
                updateCurrentResume({ experience: resume.experience });
            }
        };
        
        [title, company, location, startDate, endDate, responsibilities].forEach(input => {
            if (input) {
                input.addEventListener('input', debounce(updateExperience, 300));
            }
        });
    });
}

function addProjectsListeners(resume) {
    const addBtn = document.getElementById('add-project-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const newProject = {
                id: generateId(),
                name: '',
                description: '',
                technologies: '',
                link: '',
                achievement: ''
            };
            
            const updatedProjects = [...(resume.projects || []), newProject];
            updateCurrentResume({ projects: updatedProjects });
            renderSection('projects');
        });
    }
    
    document.querySelectorAll('.dynamic-item[data-id]').forEach(item => {
        const id = item.dataset.id;
        
        const name = item.querySelector('.proj-name');
        const description = item.querySelector('.proj-description');
        const technologies = item.querySelector('.proj-technologies');
        const link = item.querySelector('.proj-link');
        const achievement = item.querySelector('.proj-achievement');
        
        const updateProject = () => {
            const projectIndex = resume.projects.findIndex(p => p.id === id);
            if (projectIndex !== -1) {
                resume.projects[projectIndex] = {
                    ...resume.projects[projectIndex],
                    name: name?.value || '',
                    description: description?.value || '',
                    technologies: technologies?.value || '',
                    link: link?.value || '',
                    achievement: achievement?.value || ''
                };
                updateCurrentResume({ projects: resume.projects });
            }
        };
        
        [name, description, technologies, link, achievement].forEach(input => {
            if (input) {
                input.addEventListener('input', debounce(updateProject, 300));
            }
        });
    });
}

function addSkillsListeners(resume) {
    const skillInput = document.getElementById('skill-input');
    const addBtn = document.getElementById('add-skill-btn');
    
    const addSkill = () => {
        const skill = skillInput.value.trim();
        if (skill && !resume.skills.includes(skill)) {
            const updatedSkills = [...(resume.skills || []), skill];
            updateCurrentResume({ skills: updatedSkills });
            renderSection('skills');
            skillInput.value = '';
        }
    };
    
    if (skillInput) {
        skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', addSkill);
    }
}

function addCertificationsListeners(resume) {
    const addBtn = document.getElementById('add-certification-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const newCertification = {
                id: generateId(),
                name: '',
                organization: '',
                date: '',
                link: ''
            };
            
            const updatedCertifications = [...(resume.certifications || []), newCertification];
            updateCurrentResume({ certifications: updatedCertifications });
            renderSection('certifications');
        });
    }
    
    document.querySelectorAll('.dynamic-item[data-id]').forEach(item => {
        const id = item.dataset.id;
        
        const name = item.querySelector('.cert-name');
        const organization = item.querySelector('.cert-organization');
        const date = item.querySelector('.cert-date');
        const link = item.querySelector('.cert-link');
        
        const updateCertification = () => {
            const certIndex = resume.certifications.findIndex(c => c.id === id);
            if (certIndex !== -1) {
                resume.certifications[certIndex] = {
                    ...resume.certifications[certIndex],
                    name: name?.value || '',
                    organization: organization?.value || '',
                    date: date?.value || '',
                    link: link?.value || ''
                };
                updateCurrentResume({ certifications: resume.certifications });
            }
        };
        
        [name, organization, date, link].forEach(input => {
            if (input) {
                input.addEventListener('input', debounce(updateCertification, 300));
            }
        });
    });
}

function addAchievementsListeners(resume) {
    const addBtn = document.getElementById('add-achievement-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const newAchievement = {
                id: generateId(),
                title: '',
                description: '',
                date: ''
            };
            
            const updatedAchievements = [...(resume.achievements || []), newAchievement];
            updateCurrentResume({ achievements: updatedAchievements });
            renderSection('achievements');
        });
    }
    
    document.querySelectorAll('.dynamic-item[data-id]').forEach(item => {
        const id = item.dataset.id;
        
        const title = item.querySelector('.ach-title');
        const description = item.querySelector('.ach-description');
        const date = item.querySelector('.ach-date');
        
        const updateAchievement = () => {
            const achIndex = resume.achievements.findIndex(a => a.id === id);
            if (achIndex !== -1) {
                resume.achievements[achIndex] = {
                    ...resume.achievements[achIndex],
                    title: title?.value || '',
                    description: description?.value || '',
                    date: date?.value || ''
                };
                updateCurrentResume({ achievements: resume.achievements });
            }
        };
        
        [title, description, date].forEach(input => {
            if (input) {
                input.addEventListener('input', debounce(updateAchievement, 300));
            }
        });
    });
}

function addLanguagesListeners(resume) {
    const addBtn = document.getElementById('add-language-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const newLanguage = {
                id: generateId(),
                language: '',
                proficiency: 'Intermediate'
            };
            
            const updatedLanguages = [...(resume.languages || []), newLanguage];
            updateCurrentResume({ languages: updatedLanguages });
            renderSection('languages');
        });
    }
    
    document.querySelectorAll('.dynamic-item[data-id]').forEach(item => {
        const id = item.dataset.id;
        
        const language = item.querySelector('.lang-language');
        const proficiency = item.querySelector('.lang-proficiency');
        
        const updateLanguage = () => {
            const langIndex = resume.languages.findIndex(l => l.id === id);
            if (langIndex !== -1) {
                resume.languages[langIndex] = {
                    ...resume.languages[langIndex],
                    language: language?.value || '',
                    proficiency: proficiency?.value || 'Intermediate'
                };
                updateCurrentResume({ languages: resume.languages });
            }
        };
        
        [language, proficiency].forEach(input => {
            if (input) {
                input.addEventListener('input', updateLanguage);
            }
        });
    });
}

// ===== Delete Functions =====

function deleteEducation(id) {
    const resume = getCurrentResume();
    if (resume) {
        resume.education = resume.education.filter(e => e.id !== id);
        updateCurrentResume({ education: resume.education });
        renderSection('education');
    }
}

function deleteExperience(id) {
    const resume = getCurrentResume();
    if (resume) {
        resume.experience = resume.experience.filter(e => e.id !== id);
        updateCurrentResume({ experience: resume.experience });
        renderSection('experience');
    }
}

function deleteProject(id) {
    const resume = getCurrentResume();
    if (resume) {
        resume.projects = resume.projects.filter(p => p.id !== id);
        updateCurrentResume({ projects: resume.projects });
        renderSection('projects');
    }
}

function deleteCertification(id) {
    const resume = getCurrentResume();
    if (resume) {
        resume.certifications = resume.certifications.filter(c => c.id !== id);
        updateCurrentResume({ certifications: resume.certifications });
        renderSection('certifications');
    }
}

function deleteAchievement(id) {
    const resume = getCurrentResume();
    if (resume) {
        resume.achievements = resume.achievements.filter(a => a.id !== id);
        updateCurrentResume({ achievements: resume.achievements });
        renderSection('achievements');
    }
}

function deleteLanguage(id) {
    const resume = getCurrentResume();
    if (resume) {
        resume.languages = resume.languages.filter(l => l.id !== id);
        updateCurrentResume({ languages: resume.languages });
        renderSection('languages');
    }
}

function removeSkill(skill) {
    const resume = getCurrentResume();
    if (resume) {
        resume.skills = resume.skills.filter(s => s !== skill);
        updateCurrentResume({ skills: resume.skills });
        renderSection('skills');
    }
}

// ===== Resume Preview Rendering =====

function renderPreview() {
    const resume = getCurrentResume();
    if (!resume) return;
    
    const preview = document.getElementById('resume-preview');
    const template = state.customization.template;
    
    preview.className = `resume-document resume-template-${template}`;
    
    switch (template) {
        case 'executive':
            preview.innerHTML = renderExecutiveTemplate(resume);
            break;
        case 'modern':
            preview.innerHTML = renderModernTemplate(resume);
            break;
        case 'ats':
            preview.innerHTML = renderATSTemplate(resume);
            break;
    }
    
    // Apply customization
    applyCustomization(preview);
}

function renderExecutiveTemplate(resume) {
    return `
        <div class="resume-header">
            <div class="resume-name">${resume.name || 'Your Name'}</div>
            <div class="resume-title">${resume.title || 'Professional Title'}</div>
            <div class="resume-contact">
                ${resume.email ? `📧 ${resume.email}` : ''} 
                ${resume.phone ? `| 📱 ${resume.phone}` : ''} 
                ${resume.location ? `| 📍 ${resume.location}` : ''} 
                ${resume.linkedin ? `| 🔗 ${resume.linkedin}` : ''} 
                ${resume.github ? `| 💻 ${resume.github}` : ''}
            </div>
        </div>
        
        ${resume.summary ? `
        <div class="resume-section">
            <div class="resume-section-title">Professional Summary</div>
            <div class="resume-item-description">${resume.summary}</div>
        </div>
        ` : ''}
        
        ${resume.experience && resume.experience.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Experience</div>
            ${resume.experience.map(exp => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${exp.title}</div>
                        <div class="resume-item-date">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
                    </div>
                    <div class="resume-item-subtitle">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                    <div class="resume-item-description">${exp.responsibilities}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.education && resume.education.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Education</div>
            ${resume.education.map(edu => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                        <div class="resume-item-date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
                    </div>
                    <div class="resume-item-subtitle">${edu.institution}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
                    ${edu.description ? `<div class="resume-item-description">${edu.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.projects && resume.projects.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Projects</div>
            ${resume.projects.map(proj => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${proj.name}</div>
                    </div>
                    <div class="resume-item-description">${proj.description}</div>
                    ${proj.technologies ? `<div class="resume-item-description"><strong>Technologies:</strong> ${proj.technologies}</div>` : ''}
                    ${proj.link ? `<div class="resume-item-description"><strong>Link:</strong> ${proj.link}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.skills && resume.skills.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Skills</div>
            <div class="resume-skills">
                ${resume.skills.map(skill => `<span class="resume-skill">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        ${resume.certifications && resume.certifications.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Certifications</div>
            ${resume.certifications.map(cert => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${cert.name}</div>
                        <div class="resume-item-date">${formatDate(cert.date)}</div>
                    </div>
                    <div class="resume-item-subtitle">${cert.organization}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.achievements && resume.achievements.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Achievements</div>
            ${resume.achievements.map(ach => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${ach.title}</div>
                        <div class="resume-item-date">${formatDate(ach.date)}</div>
                    </div>
                    <div class="resume-item-description">${ach.description}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.languages && resume.languages.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Languages</div>
            ${resume.languages.map(lang => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${lang.language}</div>
                        <div class="resume-item-subtitle">${lang.proficiency}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;
}

function renderModernTemplate(resume) {
    return `
        <div class="resume-header">
            <div class="resume-name">${resume.name || 'Your Name'}</div>
            <div class="resume-title">${resume.title || 'Professional Title'}</div>
            <div class="resume-contact">
                ${resume.email ? `${resume.email}` : ''} 
                ${resume.phone ? `• ${resume.phone}` : ''} 
                ${resume.location ? `• ${resume.location}` : ''} 
                ${resume.linkedin ? `• ${resume.linkedin}` : ''} 
                ${resume.github ? `• ${resume.github}` : ''}
            </div>
        </div>
        
        ${resume.summary ? `
        <div class="resume-section">
            <div class="resume-section-title">About</div>
            <div class="resume-item-description">${resume.summary}</div>
        </div>
        ` : ''}
        
        ${resume.experience && resume.experience.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Work Experience</div>
            ${resume.experience.map(exp => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${exp.title}</div>
                        <div class="resume-item-date">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
                    </div>
                    <div class="resume-item-subtitle">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                    <div class="resume-item-description">${exp.responsibilities}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.education && resume.education.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Education</div>
            ${resume.education.map(edu => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                        <div class="resume-item-date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
                    </div>
                    <div class="resume-item-subtitle">${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
                    ${edu.description ? `<div class="resume-item-description">${edu.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.projects && resume.projects.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Projects</div>
            ${resume.projects.map(proj => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${proj.name}</div>
                    </div>
                    <div class="resume-item-description">${proj.description}</div>
                    ${proj.technologies ? `<div class="resume-item-description"><em>Technologies: ${proj.technologies}</em></div>` : ''}
                    ${proj.link ? `<div class="resume-item-description"><a href="${proj.link}">${proj.link}</a></div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.skills && resume.skills.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Technical Skills</div>
            <div class="resume-skills">
                ${resume.skills.map(skill => `<span class="resume-skill">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        ${resume.certifications && resume.certifications.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Certifications</div>
            ${resume.certifications.map(cert => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${cert.name}</div>
                        <div class="resume-item-date">${formatDate(cert.date)}</div>
                    </div>
                    <div class="resume-item-subtitle">${cert.organization}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.achievements && resume.achievements.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Achievements & Awards</div>
            ${resume.achievements.map(ach => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${ach.title}</div>
                        <div class="resume-item-date">${formatDate(ach.date)}</div>
                    </div>
                    <div class="resume-item-description">${ach.description}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.languages && resume.languages.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">Languages</div>
            ${resume.languages.map(lang => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${lang.language}</div>
                        <div class="resume-item-subtitle">${lang.proficiency}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;
}

function renderATSTemplate(resume) {
    return `
        <div class="resume-header">
            <div class="resume-name">${resume.name || 'YOUR NAME'}</div>
            <div class="resume-title">${resume.title || 'PROFESSIONAL TITLE'}</div>
            <div class="resume-contact">
                ${resume.email ? `Email: ${resume.email}` : ''} 
                ${resume.phone ? ` | Phone: ${resume.phone}` : ''} 
                ${resume.location ? ` | Location: ${resume.location}` : ''} 
                ${resume.linkedin ? ` | LinkedIn: ${resume.linkedin}` : ''} 
                ${resume.github ? ` | GitHub: ${resume.github}` : ''}
            </div>
        </div>
        
        ${resume.summary ? `
        <div class="resume-section">
            <div class="resume-section-title">SUMMARY</div>
            <div class="resume-item-description">${resume.summary}</div>
        </div>
        ` : ''}
        
        ${resume.experience && resume.experience.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">EXPERIENCE</div>
            ${resume.experience.map(exp => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${exp.title.toUpperCase()}</div>
                        <div class="resume-item-date">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
                    </div>
                    <div class="resume-item-subtitle">${exp.company.toUpperCase()}${exp.location ? `, ${exp.location.toUpperCase()}` : ''}</div>
                    <div class="resume-item-description">${exp.responsibilities}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.education && resume.education.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">EDUCATION</div>
            ${resume.education.map(edu => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${edu.degree.toUpperCase()}${edu.field ? ` IN ${edu.field.toUpperCase()}` : ''}</div>
                        <div class="resume-item-date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
                    </div>
                    <div class="resume-item-subtitle">${edu.institution.toUpperCase()}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
                    ${edu.description ? `<div class="resume-item-description">${edu.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.projects && resume.projects.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">PROJECTS</div>
            ${resume.projects.map(proj => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${proj.name.toUpperCase()}</div>
                    </div>
                    <div class="resume-item-description">${proj.description}</div>
                    ${proj.technologies ? `<div class="resume-item-description">Technologies: ${proj.technologies}</div>` : ''}
                    ${proj.link ? `<div class="resume-item-description">Link: ${proj.link}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.skills && resume.skills.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">SKILLS</div>
            <div class="resume-item-description">${resume.skills.join(', ')}</div>
        </div>
        ` : ''}
        
        ${resume.certifications && resume.certifications.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">CERTIFICATIONS</div>
            ${resume.certifications.map(cert => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${cert.name.toUpperCase()}</div>
                        <div class="resume-item-date">${formatDate(cert.date)}</div>
                    </div>
                    <div class="resume-item-subtitle">${cert.organization.toUpperCase()}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.achievements && resume.achievements.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">ACHIEVEMENTS</div>
            ${resume.achievements.map(ach => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${ach.title.toUpperCase()}</div>
                        <div class="resume-item-date">${formatDate(ach.date)}</div>
                    </div>
                    <div class="resume-item-description">${ach.description}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${resume.languages && resume.languages.length > 0 ? `
        <div class="resume-section">
            <div class="resume-section-title">LANGUAGES</div>
            ${resume.languages.map(lang => `
                <div class="resume-item">
                    <div class="resume-item-header">
                        <div class="resume-item-title">${lang.language.toUpperCase()}</div>
                        <div class="resume-item-subtitle">${lang.proficiency.toUpperCase()}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;
}

function applyCustomization(preview) {
    const accentColor = state.customization.accentColor;
    const fontSize = state.customization.fontSize;
    const spacing = state.customization.spacing;
    
    // Apply accent color
    preview.style.setProperty('--accent-color', accentColor);
    
    // Apply font size
    const fontSizes = {
        small: '10pt',
        medium: '11pt',
        large: '12pt'
    };
    preview.style.fontSize = fontSizes[fontSize] || '11pt';
    
    // Apply spacing
    const spacings = {
        compact: '0.5rem',
        normal: '1rem',
        relaxed: '1.5rem'
    };
    
    document.querySelectorAll('.resume-section').forEach(section => {
        section.style.marginBottom = spacings[spacing] || '1rem';
    });
}

// ===== Customization Panel =====

function updateCustomizationPanel() {
    const templateSelect = document.getElementById('template-select');
    const colorBtns = document.querySelectorAll('.color-btn');
    const fontSelect = document.getElementById('font-select');
    const fontSizeSelect = document.getElementById('fontsize-select');
    const spacingSelect = document.getElementById('spacing-select');
    
    if (templateSelect) {
        templateSelect.value = state.customization.template;
    }
    
    colorBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === state.customization.accentColor) {
            btn.classList.add('active');
        }
    });
    
    if (fontSelect) {
        fontSelect.value = state.customization.font;
    }
    
    if (fontSizeSelect) {
        fontSizeSelect.value = state.customization.fontSize;
    }
    
    if (spacingSelect) {
        spacingSelect.value = state.customization.spacing;
    }
}

function addCustomizationListeners() {
    const templateSelect = document.getElementById('template-select');
    const colorBtns = document.querySelectorAll('.color-btn');
    const fontSelect = document.getElementById('font-select');
    const fontSizeSelect = document.getElementById('fontsize-select');
    const spacingSelect = document.getElementById('spacing-select');
    
    if (templateSelect) {
        templateSelect.addEventListener('change', (e) => {
            state.customization.template = e.target.value;
            updateCurrentResume({});
            renderPreview();
        });
    }
    
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            state.customization.accentColor = btn.dataset.color;
            updateCustomizationPanel();
            updateCurrentResume({});
            renderPreview();
        });
    });
    
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            state.customization.font = e.target.value;
            updateCurrentResume({});
            renderPreview();
        });
    }
    
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', (e) => {
            state.customization.fontSize = e.target.value;
            updateCurrentResume({});
            renderPreview();
        });
    }
    
    if (spacingSelect) {
        spacingSelect.addEventListener('change', (e) => {
            state.customization.spacing = e.target.value;
            updateCurrentResume({});
            renderPreview();
        });
    }
}

// ===== Resume Strength Indicator =====

function calculateResumeStrength(resume) {
    if (!resume) return 0;
    
    let score = 0;
    const maxScore = 100;
    
    // Personal information (20 points)
    if (resume.name) score += 5;
    if (resume.title) score += 5;
    if (resume.email) score += 5;
    if (resume.phone || resume.location) score += 5;
    
    // Summary (10 points)
    if (resume.summary && resume.summary.length > 50) score += 10;
    
    // Education (15 points)
    if (resume.education && resume.education.length > 0) {
        score += 10;
        if (resume.education.some(e => e.institution && e.degree)) score += 5;
    }
    
    // Experience (20 points)
    if (resume.experience && resume.experience.length > 0) {
        score += 10;
        if (resume.experience.some(e => e.title && e.company && e.responsibilities)) score += 10;
    }
    
    // Projects (10 points)
    if (resume.projects && resume.projects.length > 0) {
        score += 5;
        if (resume.projects.some(p => p.name && p.description)) score += 5;
    }
    
    // Skills (15 points)
    if (resume.skills && resume.skills.length >= 5) score += 15;
    else if (resume.skills && resume.skills.length > 0) score += 5;
    
    // Certifications (5 points)
    if (resume.certifications && resume.certifications.length > 0) score += 5;
    
    // Achievements (5 points)
    if (resume.achievements && resume.achievements.length > 0) score += 5;
    
    return Math.min(score, maxScore);
}

function updateStrengthIndicator() {
    const resume = getCurrentResume();
    if (!resume) return;
    
    const strength = calculateResumeStrength(resume);
    const strengthValue = document.getElementById('strength-value');
    const strengthFill = document.getElementById('strength-fill');
    const strengthDetails = document.getElementById('strength-details');
    
    if (strengthValue) {
        strengthValue.textContent = `${strength}%`;
    }
    
    if (strengthFill) {
        strengthFill.style.width = `${strength}%`;
    }
    
    if (strengthDetails) {
        const checks = [
            { label: 'Personal Information', complete: resume.name && resume.email },
            { label: 'Professional Summary', complete: resume.summary && resume.summary.length > 50 },
            { label: 'Education', complete: resume.education && resume.education.length > 0 },
            { label: 'Experience', complete: resume.experience && resume.experience.length > 0 },
            { label: 'Projects', complete: resume.projects && resume.projects.length > 0 },
            { label: 'Skills', complete: resume.skills && resume.skills.length >= 5 },
            { label: 'Certifications', complete: resume.certifications && resume.certifications.length > 0 }
        ];
        
        strengthDetails.innerHTML = checks.map(check => `
            <div class="strength-detail ${check.complete ? 'complete' : 'incomplete'}">
                ${check.complete ? '✓' : '○'} ${check.label}
            </div>
        `).join('');
    }
}

// ===== Export Functions =====

function downloadPDF() {
    window.print();
}

function saveResume() {
    const resume = getCurrentResume();
    if (resume) {
        saveToLocalStorage();
        showToast('Resume saved successfully!');
    }
}

// ===== Mobile Preview Toggle =====

function toggleMobilePreview() {
    const preview = document.querySelector('.builder-preview');
    preview.classList.toggle('show');
}

// ===== Initialize Application =====

function init() {
    // Load from localStorage
    loadFromLocalStorage();
    
    // Navigation event listeners
    document.getElementById('build-resume-nav')?.addEventListener('click', navigateToDashboard);
    document.getElementById('create-resume-hero')?.addEventListener('click', navigateToDashboard);
    document.getElementById('create-resume-cta')?.addEventListener('click', navigateToDashboard);
    document.getElementById('explore-templates-nav')?.addEventListener('click', () => {
        document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('explore-templates-hero')?.addEventListener('click', () => {
        document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('back-to-landing')?.addEventListener('click', navigateToLanding);
    document.getElementById('back-to-dashboard')?.addEventListener('click', navigateToDashboard);
    
    document.getElementById('new-resume-dashboard')?.addEventListener('click', createNewResume);
    document.getElementById('new-resume-section')?.addEventListener('click', createNewResume);
    document.getElementById('create-first-resume')?.addEventListener('click', createNewResume);
    
    document.getElementById('download-pdf')?.addEventListener('click', downloadPDF);
    document.getElementById('save-resume-btn')?.addEventListener('click', saveResume);
    document.getElementById('toggle-preview-mobile')?.addEventListener('click', toggleMobilePreview);
    
    // Section navigation
    document.querySelectorAll('.section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            renderSection(btn.dataset.section);
        });
    });
    
    // Customization panel
    addCustomizationListeners();
    
    // Template cards on landing page
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            state.customization.template = card.dataset.template;
            createNewResume();
        });
    });
    
    // Mobile menu toggle
    document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'white';
        navMenu.style.padding = '1rem';
        navMenu.style.borderBottom = '1px solid #e2e8f0';
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', init);
