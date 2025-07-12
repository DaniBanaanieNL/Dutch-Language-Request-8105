import { emailService } from './emailService';
import { hashPassword, comparePassword } from '../utils/passwordUtils';

// Simuleerd een backend database voor verificatiecodes en gebruikers
const verificationCodes = new Map();
const users = new Map();

/**
 * Authenticatieservice voor gebruikersregistratie en -verificatie
 */
export const authService = {
  /**
   * Genereert een willekeurige 4-cijferige code
   * @returns {string} Een 4-cijferige code
   */
  generateVerificationCode: () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  },

  /**
   * Registreert een nieuwe gebruiker en verzendt een verificatiecode
   * @param {Object} userData - Gebruikersgegevens
   * @returns {Promise<Object>} Resultaat van de registratie
   */
  registerUser: async (userData) => {
    try {
      // Controleer of de gebruiker al bestaat
      if (users.has(userData.email)) {
        return {
          success: false,
          message: 'Dit e-mailadres is al geregistreerd'
        };
      }

      // Versleutel het wachtwoord
      const hashedPassword = await hashPassword(userData.password);
      
      // Genereer een 4-cijferige code
      const verificationCode = authService.generateVerificationCode();
      
      // Sla de code op met een vervaltijd van 30 minuten
      const expiryTime = new Date(Date.now() + 30 * 60 * 1000);
      verificationCodes.set(userData.email, {
        code: verificationCode,
        expires: expiryTime,
        userData: { 
          ...userData,
          password: hashedPassword // Sla het versleutelde wachtwoord op
        }
      });
      
      // Verstuur de verificatiecode via e-mail
      const emailContent = `
        Beste ${userData.name},
        
        Bedankt voor je registratie bij EduPlatform!
        
        Je verificatiecode is: ${verificationCode}
        
        Deze code is 30 minuten geldig. Gebruik deze code om je registratie te bevestigen.
        
        Met vriendelijke groet,
        Het EduPlatform Team
      `;
      
      await emailService.sendEmail({
        to: userData.email,
        subject: 'Verificatiecode voor je EduPlatform account',
        body: emailContent
      });
      
      return {
        success: true,
        message: 'Verificatiecode verzonden naar je e-mail',
        email: userData.email
      };
    } catch (error) {
      console.error('Registratiefout:', error);
      return {
        success: false,
        message: 'Er is een fout opgetreden bij de registratie'
      };
    }
  },

  /**
   * Verifieert een gebruiker met de opgegeven verificatiecode
   * @param {string} email - E-mailadres van de gebruiker
   * @param {string} code - Verificatiecode
   * @returns {Promise<Object>} Resultaat van de verificatie
   */
  verifyUser: async (email, code) => {
    try {
      const verification = verificationCodes.get(email);
      
      if (!verification) {
        return {
          success: false,
          message: 'Geen verificatiecode gevonden voor dit e-mailadres'
        };
      }
      
      if (new Date() > verification.expires) {
        verificationCodes.delete(email);
        return {
          success: false,
          message: 'Verificatiecode is verlopen, vraag een nieuwe code aan'
        };
      }
      
      if (verification.code !== code) {
        return {
          success: false,
          message: 'Ongeldige verificatiecode'
        };
      }

      // Als de verificatie succesvol is en het een nieuwe registratie betreft,
      // sla de gebruiker op in de database
      if (verification.userData) {
        users.set(email, verification.userData);
      }
      
      // Verwijder de verificatiecode
      verificationCodes.delete(email);
      
      return {
        success: true,
        message: 'Verificatie succesvol',
        user: verification.userData
      };
    } catch (error) {
      console.error('Verificatiefout:', error);
      return {
        success: false,
        message: 'Er is een fout opgetreden bij de verificatie'
      };
    }
  },

  /**
   * Logt een gebruiker in
   * @param {string} email - E-mailadres van de gebruiker
   * @param {string} password - Wachtwoord van de gebruiker
   * @returns {Promise<Object>} Resultaat van de login
   */
  loginUser: async (email, password) => {
    try {
      // Haal de gebruiker op
      const user = users.get(email);
      
      if (!user) {
        return {
          success: false,
          message: 'Gebruiker niet gevonden'
        };
      }

      // Controleer het wachtwoord
      const isValidPassword = await comparePassword(password, user.password);
      
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Ongeldig wachtwoord'
        };
      }

      // Genereer een verificatiecode voor twee-factor authenticatie
      const verificationCode = authService.generateVerificationCode();
      const expiryTime = new Date(Date.now() + 30 * 60 * 1000);
      
      verificationCodes.set(email, {
        code: verificationCode,
        expires: expiryTime,
        userData: user
      });

      // Verstuur de verificatiecode
      const emailContent = `
        Beste ${user.name},
        
        Je verificatiecode voor het inloggen bij EduPlatform is: ${verificationCode}
        
        Deze code is 30 minuten geldig.
        
        Met vriendelijke groet,
        Het EduPlatform Team
      `;
      
      await emailService.sendEmail({
        to: email,
        subject: 'Inlogcode voor je EduPlatform account',
        body: emailContent
      });

      return {
        success: true,
        message: 'Verificatiecode verzonden naar je e-mail',
        email
      };
    } catch (error) {
      console.error('Inlogfout:', error);
      return {
        success: false,
        message: 'Er is een fout opgetreden bij het inloggen'
      };
    }
  }
};