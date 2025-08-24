# 📘 Automated Answer Sheet Assessment System using LLMs  

🚀 Final Year Project (FYP) — Automating the evaluation of handwritten student papers with **AI & LLMs**.  

This project leverages **OCR models, Large Language Models (LLMs), and rubric-based evaluation** to make the assessment process faster, more accurate, and scalable for educators.  

🎬 **[Watch Demo Video](https://lnkd.in/dW-zjJhE)**  
💻 **[View Repository](https://lnkd.in/dseunytK)**  

---

## ✨ Key Features  

### 📝 Handwritten Text Recognition (OCR)  
Integrated with **4 different OCR-powered models** for robust handwritten text understanding:  
- **GPT-4o-mini (paid)** – for controlled testing.  
- **GPT-4o-mini (free via Azure)** – accessed through GitHub Marketplace.  
- **LLaMA 3.2 11B Vision-Instruct** – open-source, hosted on Azure (GitHub Marketplace).  
- **H2O VL-Mississippi** – Hugging Face model, running on Google Colab GPU, served via **ngrok + Flask API**.  

➡️ The **Flask server** receives `base64-encoded images` + a **question prompt**, processes them, and returns structured answers.  

### 📊 Rubric-Based Evaluation  
- Teachers can upload **grading rubrics**.  
- Ensures **fair & consistent** evaluation.  

### 🤖 AI Evaluation (Gemini)  
- Context-aware, semantic evaluation of answers.  
- Goes beyond keyword matching.  

### 📄 Auto-Generated Reports  
- **.docx files** for each student.  
- Includes: per-question marks, feedback, and a summary.  

### 🔗 Tech Stack  
- **Frontend**: React.js  
- **Backend**: Node.js + Express + Flask (for OCR APIs)  
- **Database**: MongoDB Atlas  
- **Authentication**: Firebase Authentication  
- **Hosting/Tools**: Google Colab + ngrok + GitHub Marketplace models  

---

## 🎬 Demo  

📹 **[Watch the full demo video](https://lnkd.in/dW-zjJhE)**  


---

## ⚙️ Installation & Setup  

### 1️⃣ Clone Repository  
```bash
git clone https://github.com/khubaib11/AUTOMATED-ANSWER-SHEET-ASSESSMENT-SYSTEM.git
cd AUTOMATED-ANSWER-SHEET-ASSESSMENT-SYSTEM
