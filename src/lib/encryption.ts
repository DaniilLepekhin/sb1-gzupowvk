import { Buffer } from 'buffer';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

export class ContentEncryption {
  private static async generateKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('secure-course-materials'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: ALGORITHM, length: KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(content: string, password: string): Promise<string> {
    const key = await this.generateKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoder = new TextEncoder();
    
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      encoder.encode(content)
    );

    // Combine IV and encrypted content
    const combined = new Uint8Array(iv.length + new Uint8Array(encryptedContent).length);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedContent), iv.length);
    
    return Buffer.from(combined).toString('base64');
  }

  static async decrypt(encryptedContent: string, password: string): Promise<string> {
    const key = await this.generateKey(password);
    const decoder = new TextDecoder();
    
    const combined = Buffer.from(encryptedContent, 'base64');
    const iv = combined.slice(0, IV_LENGTH);
    const content = combined.slice(IV_LENGTH);

    try {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: ALGORITHM,
          iv
        },
        key,
        content
      );

      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Invalid password or corrupted content');
    }
  }
}