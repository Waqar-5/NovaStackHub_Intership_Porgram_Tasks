# 📩 Contact Form — Level 1 Task 1 (NovaStack Hub Internship)

A modern, responsive, and interactive Contact Form web application built using **pure HTML, CSS, and JavaScript (no frameworks)**. This project demonstrates real-world frontend development skills like form validation, DOM manipulation, and responsive UI design.

---

## 🚀 Live Demo
https://cool-resonance-0880.wa5134810.workers.dev/


---

## 📌 Project Overview

This project is part of the **NovaStack Hub Internship – Level 1 Task 1**.

It is a fully functional contact form system with:
- Real-time validation
- Clean UI/UX design
- Error handling
- Success feedback message
- Responsive layout for all devices

---

## ✨ Features

### 🎨 UI/UX Features
- Modern two-panel layout (Info panel + Form panel)
- Fully responsive design (mobile-friendly)
- Smooth animations for success message
- Clean typography using Google Fonts (Poppins)
- Professional gradient design

### ⚡ JavaScript Features
- Live form validation (on input)
- Custom error messages under each field
- Email validation using regex
- Prevent form submission if invalid
- Success message after valid submission
- Form data collected into a structured object

---

## 🧠 Validation Rules

- **Name** → Required, minimum 2 characters  
- **Email** → Required, valid email format  
- **Subject** → Required  
- **Message** → Required, minimum 10 characters  

---

## 🛠️ Tech Stack

- HTML5 → Structure  
- CSS3 → Styling & Responsive Design  
- JavaScript (ES6) → Logic & Validation  

---

## 📁 Project Structure

Level1_Task1_ContactForm/
│
├── index.html # Main structure

├── style.css # Styling & responsive design

├── script.js # Validation & form logic

└── README.md # Documentation


---

## ⚙️ How It Works

1. User enters details in the form  
2. JavaScript validates each field in real-time  
3. Errors are shown instantly if input is invalid  
4. On valid submission:
   - Data is collected into an object
   - Success message is displayed
   - Form resets automatically

---

## 📤 Form Data Structure

```js
{
  name: "User Name",
  email: "user@example.com",
  subject: "Message Subject",
  message: "User message content"
}
