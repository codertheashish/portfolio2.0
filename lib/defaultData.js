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
