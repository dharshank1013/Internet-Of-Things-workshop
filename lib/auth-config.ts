// lib/auth-config.ts

export const ADMIN_EMAILS: string[] = [
  'dharshank24@karunya.edu.in',
  'sammichael@karunya.edu.in',
  'matrixkarunya@gmail.com',
  'prathamaj@karunya.edu.in',
];

export const ALLOWED_STUDENT_DOMAIN = 'karunya.edu.in';

export const isAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
};

export const isAllowedStudent = (email?: string | null): boolean => {
  if (!email) return false;
  return email.toLowerCase().endsWith(`@${ALLOWED_STUDENT_DOMAIN}`);
};
