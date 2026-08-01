// lib/defaultData.js
// ================================================================
// Default Projects + Certs — Google Sheets connect hone se pehle
// yeh data show hoga. Sheet connect hone ke baad Sheet ka data aayega.
// ================================================================

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

export const DEFAULT_CERTS = [
  { emoji: '🤖', name: 'Generative AI Foundations', org: 'Amazon Web Services (AWS) · 2 Badges', certUrl: 'YOUR_AWS_CERT_LINK' },
  { emoji: '🐍', name: 'Python 101 for Data Science', org: 'Cognitive Class — IBM', certUrl: 'YOUR_IBM_CERT_LINK' },
  { emoji: '🤖', name: 'AI Appreciate + AI Aware', org: 'AI Student Community · 2 Badges', certUrl: 'YOUR_AI_CERT_LINK' },
  { emoji: '🛡️', name: 'Cybersecurity Analyst Simulation', org: 'IAA via Forage', certUrl: 'YOUR_FORAGE_CERT_LINK' },
  { emoji: '📊', name: 'MS Excel Mastery', org: 'Simplilearn', certUrl: 'YOUR_EXCEL_CERT_LINK' },
  { emoji: '📊', name: 'Power BI', org: 'Office Master', certUrl: 'YOUR_POWERBI_CERT_LINK' },
  { emoji: '🤝', name: 'Professional Networking', org: 'HP LIFE', certUrl: 'YOUR_HPLIFE_CERT_LINK' },
  { emoji: '🏆', name: 'Hackathon Participation', org: 'SRIMT Hackathon', certUrl: 'YOUR_HACKATHON_CERT_LINK' },
  { emoji: '💻', name: 'C Programming Fundamentals', org: 'Simplilearn', certUrl: 'YOUR_C_CERT_LINK' },
];
