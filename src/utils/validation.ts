/**
 * Centralized Validation Utilities for SMS User Portal
 *
 * Implements strict frontend validation for:
 * 1. Passwords (min 8 chars, uppercase, lowercase, number, special char)
 * 2. Confirm Password matching
 * 3. Person Names (alphabetic + spaces only, no numbers, no special characters)
 * 4. Pakistani Phone Numbers (+923XXXXXXXXX / 03XXXXXXXXX)
 * 5. Email addresses
 */

export interface PasswordValidationRules {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordValidationResult extends ValidationResult {
  rules: PasswordValidationRules;
}

export const PASSWORD_ERROR_MESSAGE =
  'Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number, and special character.';

export const NAME_ERROR_MESSAGE = 'Name can only contain letters and spaces.';

export const PHONE_ERROR_MESSAGE =
  'Please enter a valid Pakistani mobile number (e.g. 03001234567).';

/**
 * Validates strong password rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (
  password: string,
  isRequired = true
): PasswordValidationResult => {
  if (!password) {
    return {
      isValid: !isRequired,
      error: isRequired ? 'Password is required.' : undefined,
      rules: {
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
      },
    };
  }

  const rules: PasswordValidationRules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const isValid =
    rules.minLength &&
    rules.hasUpper &&
    rules.hasLower &&
    rules.hasNumber &&
    rules.hasSpecial;

  return {
    isValid,
    error: isValid ? undefined : PASSWORD_ERROR_MESSAGE,
    rules,
  };
};

/**
 * Validates confirm password against password
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: 'Please confirm your password.',
    };
  }
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match.',
    };
  }
  return { isValid: true };
};

/**
 * Validates person names:
 * - Alphabetic characters only
 * - Spaces allowed between names
 * - NO numbers
 * - NO special characters, symbols, or emojis
 */
export const validateName = (
  name: string,
  isRequired = true,
  fieldLabel = 'Name'
): ValidationResult => {
  const trimmed = (name || '').trim();

  if (!trimmed) {
    return {
      isValid: !isRequired,
      error: isRequired ? `${fieldLabel} is required.` : undefined,
    };
  }

  // Alphabetic characters only with spaces between words
  const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
  if (!nameRegex.test(trimmed)) {
    return {
      isValid: false,
      error: NAME_ERROR_MESSAGE,
    };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: `${fieldLabel} must be at least 2 characters.`,
    };
  }

  return { isValid: true };
};

/**
 * Validates Pakistani mobile phone numbers:
 * - Primary format: +923XXXXXXXXX (13 chars: +923 followed by 9 digits)
 * - Local format: 03XXXXXXXXX (11 digits: 03 followed by 9 digits)
 * - Rejects any non-Pakistani or malformed phone numbers
 */
export const validatePakistaniPhone = (
  phone: string,
  isRequired = false
): ValidationResult => {
  const trimmed = (phone || '').trim();

  // If completely empty
  if (!trimmed) {
    return {
      isValid: !isRequired,
      error: isRequired ? 'Phone number is required.' : undefined,
    };
  }

  // Exactly 11 digits starting with 03 (e.g. 03001234567)
  const isLocalFormat = /^03\d{9}$/.test(trimmed);

  // Exactly 12 digits starting with +923 (e.g. +923001234567)
  const isInternationalFormat = /^\+923\d{9}$/.test(trimmed);

  if (!isLocalFormat && !isInternationalFormat) {
    return {
      isValid: false,
      error: PHONE_ERROR_MESSAGE,
    };
  }

  return { isValid: true };
};

/**
 * Formats a Pakistani phone input to persist +92 and restrict to Pakistani mobile digits
 */
export const formatPakistaniPhone = (value: string): string => {
  if (!value) return '+92';

  // Extract digits and any leading plus
  let cleaned = value.replace(/[^\d+]/g, '');

  // Normalize common inputs to +92 format
  if (/^03\d*/.test(cleaned)) {
    cleaned = '+92' + cleaned.slice(1);
  } else if (/^3\d*/.test(cleaned)) {
    cleaned = '+92' + cleaned;
  } else if (/^923\d*/.test(cleaned)) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+92')) {
    cleaned = '+92' + cleaned.replace(/^\+?92?/, '');
  }

  // Ensure +92 prefix is maintained
  const prefix = '+92';
  // Keep only digits after +92
  const rest = cleaned.slice(3).replace(/\D/g, '');

  // Pakistani mobile numbers have 10 digits after +92 (3XXXXXXXXX)
  const truncatedRest = rest.slice(0, 10);

  return prefix + truncatedRest;
};

/**
 * Validates email address format
 */
export const validateEmail = (
  email: string,
  isRequired = true
): ValidationResult => {
  const trimmed = (email || '').trim();

  if (!trimmed) {
    return {
      isValid: !isRequired,
      error: isRequired ? 'Email address is required.' : undefined,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address.',
    };
  }

  return { isValid: true };
};

/**
 * Validates a required text field:
 * - Rejects null, undefined, empty string, whitespace-only string
 * - Trims input
 * - Checks optional minimum length
 */
export const validateRequired = (
  value: string | undefined | null,
  fieldLabel = 'This field',
  minLength = 1
): ValidationResult => {
  const trimmed = (value || '').trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: `${fieldLabel} is required.`,
    };
  }

  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldLabel} must be at least ${minLength} characters.`,
    };
  }

  return { isValid: true };
};

/**
 * Validates date inputs:
 * - Must not be empty if required
 * - Must be a valid date
 * - Can enforce no future dates
 */
export const validateDate = (
  dateStr: string | undefined | null,
  fieldLabel = 'Date',
  options: { disallowFuture?: boolean; isRequired?: boolean } = { isRequired: true }
): ValidationResult => {
  const trimmed = (dateStr || '').trim();
  const isRequired = options.isRequired !== false;

  if (!trimmed) {
    return {
      isValid: !isRequired,
      error: isRequired ? `${fieldLabel} is required.` : undefined,
    };
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return {
      isValid: false,
      error: `Please enter a valid ${fieldLabel.toLowerCase()}.`,
    };
  }

  if (options.disallowFuture) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      return {
        isValid: false,
        error: `${fieldLabel} cannot be in the future.`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Validates select dropdown inputs:
 * - Rejects empty string, placeholder values (e.g. "")
 */
export const validateSelect = (
  value: string | undefined | null,
  fieldLabel = 'Selection',
  invalidValues: string[] = ['', '-- Select --']
): ValidationResult => {
  const trimmed = (value || '').trim();

  if (!trimmed || invalidValues.includes(trimmed)) {
    return {
      isValid: false,
      error: `Please select a ${fieldLabel.toLowerCase()}.`,
    };
  }

  return { isValid: true };
};

/**
 * Validates alphanumeric fields (such as employee numbers, identifiers)
 */
export const validateAlphanumeric = (
  value: string | undefined | null,
  fieldLabel = 'Identifier',
  isRequired = true
): ValidationResult => {
  const trimmed = (value || '').trim();

  if (!trimmed) {
    return {
      isValid: !isRequired,
      error: isRequired ? `${fieldLabel} is required.` : undefined,
    };
  }

  // Letters, numbers, dashes, underscores, and slashes
  const regex = /^[A-Za-z0-9\-_/]+$/;
  if (!regex.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldLabel} can only contain letters, numbers, hyphens, and slashes.`,
    };
  }

  return { isValid: true };
};
