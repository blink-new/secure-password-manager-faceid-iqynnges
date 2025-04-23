
export function generatePassword(
  length = 16,
  includeUppercase = true,
  includeLowercase = true,
  includeNumbers = true,
  includeSymbols = true
) {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  let availableChars = '';
  let password = '';
  
  // Add character types based on parameters
  if (includeUppercase) availableChars += uppercaseChars;
  if (includeLowercase) availableChars += lowercaseChars;
  if (includeNumbers) availableChars += numberChars;
  if (includeSymbols) availableChars += symbolChars;
  
  // Ensure at least one character type is selected
  if (availableChars.length === 0) {
    availableChars = lowercaseChars + numberChars;
  }
  
  // Generate the password
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars[randomIndex];
  }
  
  // Ensure the password contains at least one character from each selected type
  let finalPassword = password;
  
  if (includeUppercase && !containsCharFrom(finalPassword, uppercaseChars)) {
    finalPassword = replaceRandomChar(finalPassword, uppercaseChars);
  }
  
  if (includeLowercase && !containsCharFrom(finalPassword, lowercaseChars)) {
    finalPassword = replaceRandomChar(finalPassword, lowercaseChars);
  }
  
  if (includeNumbers && !containsCharFrom(finalPassword, numberChars)) {
    finalPassword = replaceRandomChar(finalPassword, numberChars);
  }
  
  if (includeSymbols && !containsCharFrom(finalPassword, symbolChars)) {
    finalPassword = replaceRandomChar(finalPassword, symbolChars);
  }
  
  return finalPassword;
}

// Helper function to check if a string contains any character from a character set
function containsCharFrom(str, charSet) {
  for (let i = 0; i < str.length; i++) {
    if (charSet.includes(str[i])) {
      return true;
    }
  }
  return false;
}

// Helper function to replace a random character in a string with a character from a character set
function replaceRandomChar(str, charSet) {
  const randomIndex = Math.floor(Math.random() * str.length);
  const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
  
  return (
    str.substring(0, randomIndex) +
    randomChar +
    str.substring(randomIndex + 1)
  );
}

// Function to evaluate password strength
export function evaluatePasswordStrength(password) {
  if (!password) return { score: 0, label: 'None' };
  
  let score = 0;
  
  // Length check
  if (password.length >= 12) {
    score += 3;
  } else if (password.length >= 8) {
    score += 2;
  } else if (password.length >= 6) {
    score += 1;
  }
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1; // Uppercase
  if (/[a-z]/.test(password)) score += 1; // Lowercase
  if (/[0-9]/.test(password)) score += 1; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Symbols
  
  // Repetition and sequence checks
  if (/(.)\\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/.test(password.toLowerCase())) {
    score -= 1; // Common sequences
  }
  
  // Common patterns check
  const commonPatterns = ['password', '123456', 'qwerty', 'admin'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score -= 2;
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(score, 5));
  
  // Map score to label
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  
  return {
    score,
    label: labels[score]
  };
}