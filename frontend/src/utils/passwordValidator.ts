export type PasswordStrengthLevel = "Weak" | "Fair" | "Good" | "Strong";

export interface PasswordRules {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface StrengthResult {
  score: number;       // Number of rules passed (0 to 5)
  rules: PasswordRules;
  level: PasswordStrengthLevel;
}

/**
 * Validates a password against the 5 security rules and determines its strength level.
 * 
 * Rules:
 * 1. Minimum 8 characters
 * 2. At least 1 uppercase letter
 * 3. At least 1 lowercase letter
 * 4. At least 1 number
 * 5. At least 1 special character
 * 
 * Strength Calculation:
 * - 0-1 rules passed -> Weak
 * - 2-3 rules passed -> Fair
 * - 4 rules passed   -> Good
 * - 5 rules passed   -> Strong
 */
export const calculatePasswordStrength = (password: string): StrengthResult => {
  const rules: PasswordRules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  // Calculate score (number of true rules)
  const score = Object.values(rules).filter(Boolean).length;

  let level: PasswordStrengthLevel = "Weak";
  if (score >= 5) {
    level = "Strong";
  } else if (score === 4) {
    level = "Good";
  } else if (score >= 2) {
    level = "Fair";
  }

  return {
    score,
    rules,
    level,
  };
};
