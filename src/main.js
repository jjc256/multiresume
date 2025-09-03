// Data handling
const STORAGE_KEY = 'multiResumeData';

function defaultData() {
    return {
        contact: {name: '', email: '', phone: '', website: '', github: ''},
        summaries: [],
        experiences: [],
        projects: [],
        education: [],
        coursework: [],
        skills: [],
        honors: [],
        resumes: []
    };
}

function loadData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData();
    } catch (e) {
        return defaultData();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2,5);
}

let data = loadData();
data.contact = data.contact || {name: '', email: '', phone: '', website: '', github: ''};
data.education = data.education || [];
data.resumes.forEach(r => { r.education = r.education || []; });

// Add section functions
function saveContact() {
    data.contact.name = document.getElementById('contactName').value.trim();
    data.contact.email = document.getElementById('contactEmail').value.trim();
    data.contact.phone = document.getElementById('contactPhone').value.trim();
    data.contact.website = document.getElementById('contactWebsite').value.trim();
    data.contact.github = document.getElementById('contactGithub').value.trim();
    saveData();
    render();
}

function addSummary() {
    const text = document.getElementById('summaryText').value.trim();
    if (!text) return;
    data.summaries.push({id: uid(), text});
    document.getElementById('summaryText').value = '';
    saveData();
    render();
}

function addExperience() {
    const role = document.getElementById('expRole').value.trim();
    const org = document.getElementById('expOrg').value.trim();
    const dates = document.getElementById('expDates').value.trim();
    const highlights = document.getElementById('expHighlights').value.split('\n').map(s=>s.trim()).filter(Boolean);
    if (!role || !org) return;
    data.experiences.push({id: uid(), role, org, dates, highlights});
    document.getElementById('expRole').value = '';
    document.getElementById('expOrg').value = '';
    document.getElementById('expDates').value = '';
    document.getElementById('expHighlights').value = '';
    saveData();
    render();
}

function addProject() {
    const title = document.getElementById('projTitle').value.trim();
    const link = document.getElementById('projLink').value.trim();
    const highlights = document.getElementById('projHighlights').value.split('\n').map(s=>s.trim()).filter(Boolean);
    if (!title) return;
    data.projects.push({id: uid(), title, link, highlights});
    document.getElementById('projTitle').value = '';
    document.getElementById('projLink').value = '';
    document.getElementById('projHighlights').value = '';
    saveData();
    render();
}

function addEducation() {
    const school = document.getElementById('eduSchool').value.trim();
    const degree = document.getElementById('eduDegree').value.trim();
    const dates = document.getElementById('eduDates').value.trim();
    if (!school || !degree) return;
    data.education.push({id: uid(), school, degree, dates});
    document.getElementById('eduSchool').value = '';
    document.getElementById('eduDegree').value = '';
    document.getElementById('eduDates').value = '';
    saveData();
    render();
}

function addCoursework() {
    const category = document.getElementById('courseCategory').value.trim();
    const items = document.getElementById('courseItems').value.trim();
    if (!category || !items) return;
    data.coursework.push({id: uid(), category, items});
    document.getElementById('courseCategory').value = '';
    document.getElementById('courseItems').value = '';
    saveData();
    render();
}

function addSkill() {
    const category = document.getElementById('skillCategory').value.trim();
    const items = document.getElementById('skillItems').value.trim();
    if (!category || !items) return;
    data.skills.push({id: uid(), category, items});
    document.getElementById('skillCategory').value = '';
    document.getElementById('skillItems').value = '';
    saveData();
    render();
}

function addHonor() {
    const text = document.getElementById('honorText').value.trim();
    if (!text) return;
    data.honors.push({id: uid(), text});
    document.getElementById('honorText').value = '';
    saveData();
    render();
}

let editState = null; // {section: string, id: string}

function startEdit(section, id) {
    editState = {section, id};
    render();
}

function cancelEdit() {
    editState = null;
    render();
}

function addResume() {
    const name = document.getElementById('resumeName').value.trim();
    if (!name) return;
    data.resumes.push({id: uid(), name, summaries: [], education: [], experiences: [], projects: [], coursework: [], skills: [], honors: []});
    document.getElementById('resumeName').value = '';
    saveData();
    render();
}

function editResume(id) {
    startEdit('resume', id);
}

function removeById(arr, id) {
    const idx = arr.indexOf(id);
    if (idx >= 0) arr.splice(idx,1);
}

// Rendering
function render() {
    renderContact();
    renderLists();
    renderResumes();
}
function renderList(elementId, items, section, renderDisplay, renderEditor) {
    const list = document.getElementById(elementId);
    list.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        if (editState && editState.section === section && editState.id === item.id) {
            renderEditor(li, item);
        } else {
            renderDisplay(li, item);
        }
        list.appendChild(li);
    });
}

function renderLists() {
    renderList('summaryList', data.summaries, 'summaries', (li, s) => {
        li.textContent = s.text + ' ';
        const btn = document.createElement('button');
        btn.textContent = 'Edit';
        btn.onclick = () => startEdit('summaries', s.id);
        li.appendChild(btn);
    }, (li, s) => {
        const input = document.createElement('input');
        input.value = s.text;
        li.appendChild(input);
        const save = document.createElement('button');
        save.textContent = 'Save';
        save.onclick = () => {
            s.text = input.value.trim();
            saveData();
            cancelEdit();
        };
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = cancelEdit;
        li.appendChild(save);
        li.appendChild(cancel);
    });

    renderList('experienceList', data.experiences, 'experiences', (li, e) => {
        li.textContent = `${e.role} @ ${e.org} `;
        const btn = document.createElement('button');
        btn.textContent = 'Edit';
        btn.onclick = () => startEdit('experiences', e.id);
        li.appendChild(btn);
    }, (li, e) => {
        const role = document.createElement('input');
        role.value = e.role;
        li.appendChild(role);
        const org = document.createElement('input');
        org.value = e.org;
        li.appendChild(org);
        const dates = document.createElement('input');
        dates.value = e.dates;
        li.appendChild(dates);
        const highlights = document.createElement('textarea');
        highlights.value = e.highlights.join('\n');
        li.appendChild(highlights);
        const save = document.createElement('button');
        save.textContent = 'Save';
        save.onclick = () => {
            e.role = role.value.trim();
            e.org = org.value.trim();
            e.dates = dates.value.trim();
            e.highlights = highlights.value.split('\n').map(s=>s.trim()).filter(Boolean);
            saveData();
            cancelEdit();
        };
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = cancelEdit;
        li.appendChild(save);
        li.appendChild(cancel);
    });

    renderList('projectList', data.projects, 'projects', (li, p) => {
        li.textContent = p.title + ' ';
        const btn = document.createElement('button');
        btn.textContent = 'Edit';
        btn.onclick = () => startEdit('projects', p.id);
        li.appendChild(btn);
    }, (li, p) => {
        const title = document.createElement('input');
        title.value = p.title;
        li.appendChild(title);
        const link = document.createElement('input');
        link.value = p.link;
        li.appendChild(link);
        const highlights = document.createElement('textarea');
        highlights.value = p.highlights.join('\n');
        li.appendChild(highlights);
        const save = document.createElement('button');
        save.textContent = 'Save';
        save.onclick = () => {
            p.title = title.value.trim();
            p.link = link.value.trim();
            p.highlights = highlights.value.split('\n').map(s=>s.trim()).filter(Boolean);
            saveData();
            cancelEdit();
        };
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = cancelEdit;
        li.appendChild(save);
        li.appendChild(cancel);
    });

    renderList('educationList', data.education, 'education', (li, e) => {
        li.textContent = `${e.school} -- ${e.degree} `;
        const btn = document.createElement('button');
        btn.textContent = 'Edit';
        btn.onclick = () => startEdit('education', e.id);
        li.appendChild(btn);
    }, (li, e) => {
        const school = document.createElement('input');
        school.value = e.school;
        li.appendChild(school);
        const degree = document.createElement('input');
        degree.value = e.degree;
        li.appendChild(degree);
        const dates = document.createElement('input');
        dates.value = e.dates;
        li.appendChild(dates);
        const save = document.createElement('button');
        save.textContent = 'Save';
        save.onclick = () => {
            e.school = school.value.trim();
            e.degree = degree.value.trim();
            e.dates = dates.value.trim();
            saveData();
            cancelEdit();
        };
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = cancelEdit;
        li.appendChild(save);
        li.appendChild(cancel);
    });

    renderList('courseworkList', data.coursework, 'coursework', (li, c) => {
        li.textContent = `${c.category}: ${c.items} `;
        const btn = document.createElement('button');
        btn.textContent = 'Edit';
        btn.onclick = () => startEdit('coursework', c.id);
        li.appendChild(btn);
    }, (li, c) => {
        const category = document.createElement('input');
        category.value = c.category;
        li.appendChild(category);
        const items = document.createElement('input');
        items.value = c.items;
        li.appendChild(items);
        const save = document.createElement('button');
        save.textContent = 'Save';
        save.onclick = () => {
            c.category = category.value.trim();
            c.items = items.value.trim();
            saveData();
            cancelEdit();
        };
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = cancelEdit;
        li.appendChild(save);
        li.appendChild(cancel);
    });

    renderList('skillList', data.skills, 'skills', (li, s) => {
        li.textContent = `${s.category}: ${s.items} `;
        const btn = document.createElement('button');
        btn.textContent = 'Edit';
        btn.onclick = () => startEdit('skills', s.id);
        li.appendChild(btn);
    }, (li, s) => {
        const category = document.createElement('input');
        category.value = s.category;
        li.appendChild(category);
        const items = document.createElement('input');
        items.value = s.items;
        li.appendChild(items);
        const save = document.createElement('button');
        save.textContent = 'Save';
        save.onclick = () => {
            s.category = category.value.trim();
            s.items = items.value.trim();
            saveData();
            cancelEdit();
        };
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = cancelEdit;
        li.appendChild(save);
        li.appendChild(cancel);
    });

    renderList('honorList', data.honors, 'honors', (li, h) => {
        li.textContent = h.text + ' ';
        const btn = document.createElement('button');
        btn.textContent = 'Edit';
        btn.onclick = () => startEdit('honors', h.id);
        li.appendChild(btn);
    }, (li, h) => {
        const input = document.createElement('input');
        input.value = h.text;
        li.appendChild(input);
        const save = document.createElement('button');
        save.textContent = 'Save';
        save.onclick = () => {
            h.text = input.value.trim();
            saveData();
            cancelEdit();
        };
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = cancelEdit;
        li.appendChild(save);
        li.appendChild(cancel);
    });
}

function renderContact() {
    document.getElementById('contactName').value = data.contact.name;
    document.getElementById('contactEmail').value = data.contact.email;
    document.getElementById('contactPhone').value = data.contact.phone;
    document.getElementById('contactWebsite').value = data.contact.website;
    document.getElementById('contactGithub').value = data.contact.github;
}

function renderResumes() {
    const container = document.getElementById('resumeContainer');
    container.innerHTML = '';
    data.resumes.forEach(resume => {
        const div = document.createElement('div');
        div.className = 'resume-block';
        if (editState && editState.section === 'resume' && editState.id === resume.id) {
            const input = document.createElement('input');
            input.value = resume.name;
            div.appendChild(input);
            const save = document.createElement('button');
            save.textContent = 'Save';
            save.onclick = () => {
                const val = input.value.trim();
                if (val) {
                    resume.name = val;
                    saveData();
                }
                cancelEdit();
            };
            const cancel = document.createElement('button');
            cancel.textContent = 'Cancel';
            cancel.onclick = cancelEdit;
            div.appendChild(save);
            div.appendChild(cancel);
        } else {
            const name = document.createElement('h3');
            name.textContent = resume.name;
            div.appendChild(name);
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit Name';
            editBtn.onclick = () => editResume(resume.id);
            div.appendChild(editBtn);
        }

        div.appendChild(createSelection(resume, 'Summary', data.summaries, resume.summaries));
        div.appendChild(createSelection(resume, 'Education', data.education, resume.education, e => `${e.school} -- ${e.degree}`));
        div.appendChild(createSelection(resume, 'Experience', data.experiences, resume.experiences, e => `${e.role} @ ${e.org}`));
        div.appendChild(createSelection(resume, 'Projects', data.projects, resume.projects, p => p.title));
        div.appendChild(createSelection(resume, 'Coursework', data.coursework, resume.coursework, c => `${c.category}`));
        div.appendChild(createSelection(resume, 'Skills', data.skills, resume.skills, s => `${s.category}`));
        div.appendChild(createSelection(resume, 'Honors', data.honors, resume.honors, h => h.text));

        const btn = document.createElement('button');
        btn.textContent = 'Show LaTeX';
        btn.onclick = () => {
            const latex = generateLatex(resume.id);
            document.getElementById('latexOutput').value = latex;
        };
        div.appendChild(btn);

        container.appendChild(div);
    });
}

function createSelection(resume, label, items, selected, displayFn) {
    displayFn = displayFn || (x => x.text);
    const wrapper = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = label;
    wrapper.appendChild(title);
    const list = document.createElement('div');
    items.forEach(item => {
        const id = `${label}-${resume.id}-${item.id}`;
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = id;
        cb.checked = selected.includes(item.id);
        cb.addEventListener('change', () => {
            if (cb.checked) selected.push(item.id); else removeById(selected, item.id);
            saveData();
        });
        const lab = document.createElement('label');
        lab.htmlFor = id;
        lab.textContent = displayFn(item);
        list.appendChild(cb);
        list.appendChild(lab);
        list.appendChild(document.createElement('br'));
    });
    wrapper.appendChild(list);
    return wrapper;
}

// LaTeX generation
const LATEX_PREAMBLE = String.raw`\documentclass[10pt, letterpaper]{article}
% Packages:
\usepackage[
    ignoreheadfoot,
    top=2 cm,
    bottom=2 cm,
    left=2 cm,
    right=2 cm,
    footskip=1.0 cm,
]{geometry}
\usepackage{titlesec}
\usepackage{tabularx}
\usepackage{array}
\usepackage[dvipsnames]{xcolor}
\definecolor{primaryColor}{RGB}{0, 0, 0}
\usepackage{enumitem}
\usepackage{fontawesome5}
\usepackage{amsmath}
\usepackage[
    pdftitle={Resume},
    pdfauthor={Author},
    pdfcreator={LaTeX},
    colorlinks=true,
    urlcolor=primaryColor,
]{hyperref}
\usepackage[pscoord]{eso-pic}
\usepackage{calc}
\usepackage{bookmark}
\usepackage{lastpage}
\usepackage{changepage}
\usepackage{paracol}
\usepackage{ifthen}
\usepackage{needspace}
\usepackage{iftex}
\ifPDFTeX
    \input{glyphtounicode}
    \pdfgentounicode=1
    \usepackage[T1]{fontenc}
    \usepackage[utf8]{inputenc}
    \usepackage{lmodern}
\fi
\usepackage{charter}
\raggedright
\AtBeginEnvironment{adjustwidth}{\partopsep0pt}
\pagestyle{empty}
\setcounter{secnumdepth}{0}
\setlength{\parindent}{0pt}
\setlength{\topskip}{0pt}
\setlength{\columnsep}{0.15cm}
\pagenumbering{gobble}
\titleformat{\section}{\needspace{4\baselineskip}\bfseries\large}{}{0pt}{}[\vspace{1pt}\titlerule]
\titlespacing{\section}{-1pt}{0.3 cm}{0.2 cm}
\renewcommand\labelitemi{$\vcenter{\hbox{\small$\bullet$}}$}
\newenvironment{highlights}{\begin{itemize}[topsep=0.10 cm,parsep=0.10 cm,partopsep=0pt,itemsep=0pt,leftmargin=0 cm + 10pt]}{\end{itemize}}
\newenvironment{highlightsforbulletentries}{\begin{itemize}[topsep=0.10 cm,parsep=0.10 cm,partopsep=0pt,itemsep=0pt,leftmargin=10pt]}{\end{itemize}}
\newenvironment{onecolentry}{\begin{adjustwidth}{0 cm + 0.00001 cm}{0 cm + 0.00001 cm}}{\end{adjustwidth}}
\newenvironment{twocolentry}[2][]{\onecolentry\def\secondColumn{#2}\setcolumnwidth{\fill, 7.5 cm}\begin{paracol}{2}}{\switchcolumn \raggedleft \secondColumn\end{paracol}\endonecolentry}
\newenvironment{threecolentry}[3][]{\onecolentry\def\thirdColumn{#3}\setcolumnwidth{, \fill, 4.5 cm}\begin{paracol}{3}}{\switchcolumn[2]\raggedleft \thirdColumn\end{paracol}\endonecolentry}
\begin{document}`;

const LATEX_END = String.raw`\end{document}`;

function escapeLatex(str) {
    return str.replace(/\\/g,'\\textbackslash{}').replace(/([%&#_$^{}])/g,'\\$1');
}

function buildHeader() {
    const c = data.contact;
    if (!c.name) return '';
    const parts = [];
    if (c.email) parts.push(`\\href{mailto:${escapeLatex(c.email)}}{${escapeLatex(c.email)}}`);
    if (c.phone) parts.push(escapeLatex(c.phone));
    if (c.website) parts.push(`\\href{${escapeLatex(c.website)}}{${escapeLatex(c.website)}}`);
    if (c.github) parts.push(`\\href{${escapeLatex(c.github)}}{${escapeLatex(c.github)}}`);
    let out = `\n%-----------%\n% Header\n%-----------%\n\\begin{center}\n{\\LARGE ${escapeLatex(c.name)}}\\\\\n`;
    if (parts.length) out += parts.join(' $|$ ') + '\\n';
    out += `\\end{center}\n`;
    return out;
}

function buildEducation(resume) {
    if (resume.education.length === 0) return '';
    let out = `\n%-----------%\n% Education\n%-----------%\n\\section{Education}\n`;
    resume.education.forEach((id, idx) => {
        const e = data.education.find(x=>x.id===id);
        if (!e) return;
        out += `\\begin{twocolentry}{${escapeLatex(e.dates)}}\n\\textbf{${escapeLatex(e.school)}} -- ${escapeLatex(e.degree)}\\end{twocolentry}\n`;
        if (idx !== resume.education.length-1) out += `\\vspace{0.2 cm}\n`;
    });
    return out;
}

function buildSummary(resume) {
    if (resume.summaries.length === 0) return '';
    let out = `\n%-----------%\n% Summary\n%-----------%\n\\section{Summary}\n`;
    resume.summaries.forEach(id => {
        const s = data.summaries.find(x=>x.id===id);
        if (s) out += `\\begin{onecolentry}\n${escapeLatex(s.text)}\n\\end{onecolentry}\n`;
    });
    return out;
}

function buildExperiences(resume) {
    if (resume.experiences.length === 0) return '';
    let out = `\n%-----------%\n% Experience\n%-----------%\n\\section{Experience}\n`;
    resume.experiences.forEach((id, idx) => {
        const e = data.experiences.find(x=>x.id===id);
        if (!e) return;
        out += `\\begin{twocolentry}{${escapeLatex(e.dates)}}\n\\textbf{${escapeLatex(e.role)}}, ${escapeLatex(e.org)}\\end{twocolentry}\n\\vspace{0.1 cm}\n\\begin{onecolentry}\n\\begin{highlights}\n`;
        e.highlights.forEach(h => { out += `    \\item ${escapeLatex(h)}\n`; });
        out += `\\end{highlights}\n\\end{onecolentry}\n`;
        if (idx !== resume.experiences.length-1) out += `\\vspace{0.2 cm}\n`;
    });
    return out;
}

function buildProjects(resume) {
    if (resume.projects.length === 0) return '';
    let out = `\n%-----------%\n% Projects\n%-----------%\n\\section{Projects}\n`;
    resume.projects.forEach((id, idx) => {
        const p = data.projects.find(x=>x.id===id);
        if (!p) return;
        const secondCol = p.link ? `\\href{${escapeLatex(p.link)}}{${escapeLatex(p.link)}}` : '';
        out += `\\begin{twocolentry}{${secondCol}}\n\\textbf{${escapeLatex(p.title)}}\\end{twocolentry}\n`;
        if (p.highlights.length) {
            out += `\\vspace{0.1 cm}\n\\begin{onecolentry}\n\\begin{highlights}\n`;
            p.highlights.forEach(h=>{ out += `    \\item ${escapeLatex(h)}\n`; });
            out += `\\end{highlights}\n\\end{onecolentry}\n`;
        }
        if (idx !== resume.projects.length-1) out += `\\vspace{0.2 cm}\n`;
    });
    return out;
}

function buildCoursework(resume) {
    if (resume.coursework.length === 0) return '';
    let out = `\n%-----------%\n% Coursework\n%-----------%\n\\section{Relevant Coursework}\n\\begin{onecolentry}\n`;
    resume.coursework.forEach((id, idx) => {
        const c = data.coursework.find(x=>x.id===id);
        if (!c) return;
        out += `\\textbf{${escapeLatex(c.category)}:} ${escapeLatex(c.items)}`;
        if (idx !== resume.coursework.length-1) out += ` \\\\`; // line break
    });
    out += `\n\\end{onecolentry}\n`;
    return out;
}

function buildSkills(resume) {
    if (resume.skills.length === 0) return '';
    let out = `\n%-----------%\n% Technical Skills\n%-----------%\n\\section{Technical Skills}\n\\begin{onecolentry}\n`;
    resume.skills.forEach((id, idx) => {
        const s = data.skills.find(x=>x.id===id);
        if (!s) return;
        out += `\\textbf{${escapeLatex(s.category)}:} ${escapeLatex(s.items)}`;
        if (idx !== resume.skills.length-1) out += ` \\\\`;
    });
    out += `\n\\end{onecolentry}\n`;
    return out;
}

function buildHonors(resume) {
    if (resume.honors.length === 0) return '';
    let out = `\n%-----------%\n% Awards and Honors\n%-----------%\n\\section{Awards and Honors}\n\\begin{onecolentry}\n\\begin{highlights}\n`;
    resume.honors.forEach(id => {
        const h = data.honors.find(x=>x.id===id);
        if (h) out += `    \\item ${escapeLatex(h.text)}\n`;
    });
    out += `\\end{highlights}\n\\end{onecolentry}\n`;
    return out;
}

function generateLatex(resumeId) {
    const resume = data.resumes.find(r=>r.id===resumeId);
    if (!resume) return '';
    return LATEX_PREAMBLE +
        buildHeader() +
        buildSummary(resume) +
        buildEducation(resume) +
        buildExperiences(resume) +
        buildProjects(resume) +
        buildCoursework(resume) +
        buildSkills(resume) +
        buildHonors(resume) +
        '\n' + LATEX_END;
}

function copyLatex() {
    const text = document.getElementById('latexOutput').value;
    navigator.clipboard.writeText(text);
    alert('LaTeX copied to clipboard');
}

window.addSummary = addSummary;
window.addExperience = addExperience;
window.addProject = addProject;
window.addEducation = addEducation;
window.addCoursework = addCoursework;
window.addSkill = addSkill;
window.addHonor = addHonor;
window.addResume = addResume;
window.copyLatex = copyLatex;
window.saveContact = saveContact;
window.editResume = editResume;

render();
