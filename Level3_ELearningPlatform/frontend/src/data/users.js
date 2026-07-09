// Mock dataset standing in for a MongoDB `users` collection.

export const currentUser = {
  id: 'u001',
  name: 'Waqar Ahmed',
  email: 'waqar@example.com',
  role: 'student',
  avatarInitials: 'WA',
  joinedDate: '2026-01-14',
  streak: 6,
  totalHoursLearned: 23,
  certificatesEarned: 1,
};

export const instructors = [
  { id: 'i001', name: 'Ayesha Raza', title: 'Senior Frontend Engineer', avatarInitials: 'AR' },
  { id: 'i002', name: 'Hamza Tariq', title: 'Full-Stack Developer', avatarInitials: 'HT' },
  { id: 'i003', name: 'Sana Iqbal', title: 'Data Scientist', avatarInitials: 'SI' },
  { id: 'i004', name: 'Fatima Noor', title: 'Product Designer', avatarInitials: 'FN' },
];
