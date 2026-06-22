// ===== Contact Form Validation & Submission =====

const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

const fields = {
  name: {
    input: document.getElementById('name'),
    error: document.getElementById('nameError'),
    validate: (value) => {
      if (!value.trim()) return 'Name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    }
  },
  email: {
    input: document.getElementById('email'),
    error: document.getElementById('emailError'),
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return 'Email is required.';
      if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    }
  },
  subject: {
    input: document.getElementById('subject'),
    error: document.getElementById('subjectError'),
    validate: (value) => {
      if (!value.trim()) return 'Subject is required.';
      return '';
    }
  },
  message: {
    input: document.getElementById('message'),
    error: document.getElementById('messageError'),
    validate: (value) => {
      if (!value.trim()) return 'Message cannot be empty.';
      if (value.trim().length < 10) return 'Message should be at least 10 characters.';
      return '';
    }
  }
};

// Live validation as the user types
Object.values(fields).forEach(field => {
  field.input.addEventListener('input', () => {
    const errorText = field.validate(field.input.value);
    showFieldError(field, errorText);
  });
});

function showFieldError(field, errorText) {
  field.error.textContent = errorText;
  field.input.classList.toggle('invalid', Boolean(errorText));
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  let isFormValid = true;

  Object.values(fields).forEach(field => {
    const errorText = field.validate(field.input.value);
    showFieldError(field, errorText);
    if (errorText) isFormValid = false;
  });

  if (!isFormValid) {
    successMessage.classList.remove('show');
    return;
  }

  // Simulate sending — collect form data (ready to be wired to a backend / EmailJS / Formspree later)
  const formData = {
    name: fields.name.input.value.trim(),
    email: fields.email.input.value.trim(),
    subject: fields.subject.input.value.trim(),
    message: fields.message.input.value.trim()
  };

  console.log('Form submitted:', formData);

  // Show success message
  successMessage.classList.add('show');

  // Reset form
  form.reset();

  // Hide success message after a few seconds
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 4000);
});
