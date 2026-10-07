// lib/defaultData.js
// Local certificate images + proper cert URLs

export const DEFAULT_PROJECTS = [
  {
    num: '01', emoji: '✍️', title: 'AI Air Writing',
    desc: 'Real-time AI system — draw in the air using only your index finger. MediaPipe hand tracking + OpenCV virtual canvas. Full color palette & eraser support.',
    stack: 'Python,OpenCV,MediaPipe', category: 'cv',
    githubUrl: 'https://github.com/codertheashish/Ai-Air-Writing',
    image: '/projects/Ai_air_writing.png',
  },
  {
    num: '02', emoji: '🤖', title: 'ARC Chatbot',
    desc: 'Voice-enabled Python chatbot with text & speech response. NLP fundamentals + TTS integration. Conversational AI that listens and talks back.',
    stack: 'Python,NLP,pyttsx3', category: 'ai',
    githubUrl: 'https://github.com/codertheashish/ARC-Chatbot',
    image: '/projects/Arc_chatbot.png',
  },
  {
    num: '03', emoji: '🧥', title: 'Invisible Cloak',
    desc: 'Harry Potter-style real-time invisibility. HSV color masking replaces a cloth with live background — seamless illusion.',
    stack: 'Python,OpenCV,HSV Masking', category: 'cv',
    githubUrl: 'https://github.com/codertheashish/Invisible-Cloth',
    image: '/projects/Invisible_cloak.png',
  },
  {
    num: '04', emoji: '😊', title: 'Emotion Detection',
    desc: 'Browser-based real-time emotion detection via Face-API.js. 7 emotions detected live from webcam.',
    stack: 'HTML/JS,Face-API.js,WebRTC', category: 'ai',
    githubUrl: 'https://github.com/codertheashish/Emotion-Detection',
    image: '/projects/Emotion_detection.png',
  },
  {
    num: '05', emoji: '🧠', title: 'AI Resume Analyzer',
    desc: 'Smart AI-powered resume analysis platform with ATS scoring, resume parsing, job description matching, skill-gap detection.',
    stack: 'Python,Flask,Gemini AI,PDF Parsing', category: 'ai',
    githubUrl: 'https://github.com/codertheashish/AI-Resume-Analyzer',
    image: '/projects/AI_resume_analyzer.png',
  },
  {
    num: '06', emoji: '🕵️', title: 'Deepfake Detection',
    desc: 'AI-powered image deepfake detector that classifies real and manipulated faces using CNN model with TensorFlow and OpenCV.',
    stack: 'Python,TensorFlow,OpenCV,CNN', category: 'cv',
    githubUrl: 'https://github.com/codertheashish/Deepfake-Detection',
    image: '/projects/Deepfake_detection.png',
  },
  {
    num: '07', emoji: '🖐️', title: 'AR Hand Tracking',
    desc: 'Real-time AR hand tracking using MediaPipe and OpenCV, enabling gesture recognition with 21 hand landmarks.',
    stack: 'Python,OpenCV,MediaPipe', category: 'cv',
    githubUrl: 'https://github.com/codertheashish/AR-Hand-Tracking',
    image: '/projects/AR_hand_tracking.png',
  },
  {
    num: '08', emoji: '🎂', title: 'Birthday Surprise Site',
    desc: 'Cinematic interactive birthday experience with CSS animations, background music, memory gallery.',
    stack: 'HTML,CSS,JS,Web Audio', category: 'web',
    githubUrl: 'https://github.com/codertheashish/Happy-Birthday',
    image: '/projects/Birthday_site.png',
  },
];

// Certificates — local images from /public/certificates/
// certUrl = '' means image viewer modal (no external link needed)
// certUrl = 'https://...' means external link
export const DEFAULT_CERTS = [
  {
    emoji: '☁️',
    name: 'Generative AI Foundations',
    org: 'Amazon Web Services (AWS)',
    certUrl: '',
    image: '/certificates/aws_gen_ai.jpg',
  },
  {
    emoji: '🐍',
    name: 'Python 101 for Data Science',
    org: 'Cognitive Class — IBM',
    certUrl: '',
    image: '/certificates/python101.jpg',
  },
  {
    emoji: '🤖',
    name: 'AI Appreciate',
    org: 'AI Student Community',
    certUrl: '',
    image: '/certificates/ai-appreciate.jpg',
  },
  {
    emoji: '🤖',
    name: 'AI Aware',
    org: 'AI Student Community',
    certUrl: '',
    image: '/certificates/ai-aware.jpg',
  },
  {
    emoji: '🛡️',
    name: 'Cybersecurity Analyst Simulation',
    org: 'IAA via Forage',
    certUrl: '',
    image: '/certificates/cybersecurity-analyst.jpg',
  },
  {
    emoji: '📊',
    name: 'MS Excel Mastery',
    org: 'Simplilearn',
    certUrl: '',
    image: '/certificates/ms-excel.jpg',
  },
  {
    emoji: '📊',
    name: 'Power BI Workshop',
    org: 'Office Master',
    certUrl: '',
    image: '/certificates/power-bi-workshop.jpg',
  },
  {
    emoji: '🤝',
    name: 'Professional Networking',
    org: 'HP LIFE',
    certUrl: '',
    image: '/certificates/hp-life.jpg',
  },
  {
    emoji: '🏆',
    name: 'Hackathon Participation',
    org: 'SRIMT',
    certUrl: '',
    image: '/certificates/hackathon_in_srimt.jpg',
  },
  {
    emoji: '💻',
    name: 'C Programming Basics',
    org: 'Simplilearn',
    certUrl: '',
    image: '/certificates/c-programming-basics.jpg',
  },
  {
    emoji: '💼',
    name: 'Training & Internship Offer',
    org: 'Techpile Technology',
    certUrl: '',
    image: '/certificates/Techpile_training_offer_letter.jpeg',
  },
];

// ── Built-in content for About / Skills / Experience / Education ──
// Used until the matching Google Sheet tab has rows (Admin → "Import current content").
export const DEFAULT_ABOUT_TEXT = [
  { text: "I'm a B.Tech CSE (AI & ML) student at SRIMT Lucknow (AKTU, 2024–2028), deeply passionate about using Python and Machine Learning to solve real-world problems that actually matter." },
  { text: 'From computer vision tools to voice-enabled chatbots and emotion detection systems — I love building projects that feel like magic. Every line of code is a chance to push what I thought was possible.' },
  { text: 'Currently working as a Gen AI Intern at Techpile Technology Pvt. Ltd., where I apply ML concepts in real production environments. I believe the best learning happens when you build things people actually use.' },
  { text: 'Always exploring new ML papers, contributing to open source, and leveling up — one commit at a time. 🚀' },
];
export const DEFAULT_ABOUT_INFO = [
  { ico: '🎓', main: 'B.Tech CSE (AI & ML)', sub: 'SRIMT · AKTU, Lucknow · 2024–2028' },
  { ico: '💼', main: 'Gen AI Intern', sub: 'Techpile Technology Pvt. Ltd.' },
  { ico: '📍', main: 'Lucknow, Uttar Pradesh', sub: 'Origin: Kushinagar, UP' },
  { ico: '📧', main: 'codertheashish@gmail.com', sub: 'Available for opportunities' },
  { ico: '⚡', main: 'Python · AI · ML · Computer Vision', sub: 'Core expertise' },
];
export const DEFAULT_EXPERIENCE = [
  {
    date: '2025 — PRESENT', role: 'Gen AI Intern', company: 'Techpile Technology Pvt. Ltd.',
    desc: 'Working on real-world Generative AI / ML projects, applying computer vision and Python-based automation to solve production-level problems. Collaborating with development teams to build intelligent solutions at scale.',
    tags: 'Python, Gen AI, Computer Vision',
  },
  {
    date: '2025 — HACKATHON', role: 'Hackathon Participant', company: 'SRIMT Hackathon — Lucknow',
    desc: 'Built rapid-prototype solutions under pressure. Applied AI/ML skills in a competitive environment. Received participation certificate — experience in team-based problem solving and fast delivery.',
    tags: 'Hackathon, Teamwork, Problem Solving',
  },
];
export const DEFAULT_EDUCATION = [
  {
    date: '2024 — PRESENT', degree: 'B.Tech — CSE (AI & ML)', institute: 'SRIMT, AKTU — Lucknow · Expected 2028',
    desc: 'Bachelor of Technology in Computer Science Engineering with specialization in AI and ML. Building strong foundations in DSA, ML theory, and practical project development — one semester at a time.',
    tags: 'AI/ML, DSA, Algorithms, AKTU',
  },
];
export const DEFAULT_SKILL_GROUPS = [
  { ico: '🐍', name: '// LANGUAGES',  pills: 'Python,Java,C,HTML,CSS,JavaScript' },
  { ico: '🧠', name: '// AI / ML',    pills: 'TensorFlow,OpenCV,MediaPipe,Face-API.js,NLP' },
  { ico: '🚀', name: '// FRAMEWORKS', pills: 'Flask,Streamlit,Kivy' },
  { ico: '💾', name: '// DATA & DB',  pills: 'MySQL,Power BI,MS Excel' },
  { ico: '🛠️', name: '// TOOLS & OS', pills: 'Git,GitHub,Linux,VS Code,Jupyter' },
  { ico: '💡', name: '// CONCEPTS',   pills: 'OOP,REST API,Agile,Problem Solving' },
];
export const DEFAULT_SKILL_BARS = [
  { name: 'Python', pct: 90 }, { name: 'OpenCV / Computer Vision', pct: 80 },
  { name: 'Machine Learning / TensorFlow', pct: 75 }, { name: 'Flask / Streamlit', pct: 72 },
  { name: 'MySQL / Data Analysis', pct: 68 },
];
export const DEFAULTS = {
  AboutText: DEFAULT_ABOUT_TEXT, AboutInfo: DEFAULT_ABOUT_INFO, Experience: DEFAULT_EXPERIENCE,
  Education: DEFAULT_EDUCATION, SkillGroups: DEFAULT_SKILL_GROUPS, SkillBars: DEFAULT_SKILL_BARS,
};
