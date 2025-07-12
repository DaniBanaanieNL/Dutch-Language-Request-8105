/**
 * Browser-compatibele wachtwoordversleuteling met Web Crypto API
 */

/**
 * Genereert een willekeurige salt
 * @returns {Promise<string>} Base64-gecodeerde salt
 */
async function generateSalt() {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return btoa(String.fromCharCode(...salt));
}

/**
 * Converteert een string naar een ArrayBuffer
 * @param {string} str - De string om te converteren
 * @returns {ArrayBuffer} De geconverteerde ArrayBuffer
 */
function stringToArrayBuffer(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Converteert een ArrayBuffer naar een hex string
 * @param {ArrayBuffer} buffer - De ArrayBuffer om te converteren
 * @returns {string} Hex string representatie
 */
function arrayBufferToHex(buffer) {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, '0');
    return paddedHexCode;
  });
  return hexCodes.join('');
}

/**
 * Versleutelt een wachtwoord met PBKDF2 en SHA-256
 * @param {string} password - Het wachtwoord om te versleutelen
 * @param {string} [providedSalt] - Optionele salt (voor verificatie)
 * @returns {Promise<string>} Versleuteld wachtwoord in formaat: salt$hash
 */
export async function hashPassword(password, providedSalt = null) {
  try {
    // Genereer of gebruik bestaande salt
    const salt = providedSalt || await generateSalt();
    
    // Converteer wachtwoord en salt naar ArrayBuffer
    const passwordBuffer = stringToArrayBuffer(password);
    const saltBuffer = stringToArrayBuffer(salt);
    
    // Importeer het wachtwoord als cryptografische sleutel
    const key = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    // Genereer hash met PBKDF2
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 100000, // 100k iteraties voor goede beveiliging
        hash: 'SHA-256'
      },
      key,
      256 // 256 bits output
    );
    
    // Converteer naar hex en combineer met salt
    const hashHex = arrayBufferToHex(hashBuffer);
    return `${salt}$${hashHex}`;
  } catch (error) {
    console.error('Fout bij het hashen van wachtwoord:', error);
    throw new Error('Wachtwoord versleuteling gefaald');
  }
}

/**
 * Vergelijkt een plaintext wachtwoord met een gehashed wachtwoord
 * @param {string} password - Het plaintext wachtwoord
 * @param {string} hashedPassword - Het gehashte wachtwoord (salt$hash)
 * @returns {Promise<boolean>} True als wachtwoorden overeenkomen
 */
export async function comparePassword(password, hashedPassword) {
  try {
    // Splits salt en hash
    const [salt, originalHash] = hashedPassword.split('$');
    
    if (!salt || !originalHash) {
      throw new Error('Ongeldig wachtwoord formaat');
    }
    
    // Hash het ingevoerde wachtwoord met dezelfde salt
    const newHashedPassword = await hashPassword(password, salt);
    const [, newHash] = newHashedPassword.split('$');
    
    // Veilige vergelijking (timing attack resistant)
    return timingSafeEqual(originalHash, newHash);
  } catch (error) {
    console.error('Fout bij het vergelijken van wachtwoord:', error);
    return false;
  }
}

/**
 * Timing-safe vergelijking van twee strings
 * @param {string} a - Eerste string
 * @param {string} b - Tweede string
 * @returns {boolean} True als strings gelijk zijn
 */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Valideert wachtwoordsterkte
 * @param {string} password - Het wachtwoord om te valideren
 * @returns {Object} Validatie resultaat met score en feedback
 */
export function validatePasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  let strength = 'Zeer zwak';
  if (score >= 4) strength = 'Sterk';
  else if (score >= 3) strength = 'Gemiddeld';
  else if (score >= 2) strength = 'Zwak';
  
  return {
    score,
    strength,
    checks,
    isValid: score >= 3 // Minimaal 3 van de 5 criteria
  };
}