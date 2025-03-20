import { supabase } from './supabase';
import { ContentEncryption } from './encryption';

interface CourseMaterial {
  id: string;
  courseId: string;
  dayNumber: number;
  type: 'text' | 'video';
  content: string;
  contentHash: string;
}

export class CourseMaterialsManager {
  private static ENCRYPTION_KEY = import.meta.env.VITE_MATERIALS_ENCRYPTION_KEY;

  static async addMaterial(material: Omit<CourseMaterial, 'id' | 'contentHash'>): Promise<void> {
    const encryptedContent = await ContentEncryption.encrypt(
      material.content,
      this.ENCRYPTION_KEY
    );

    const contentHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(material.content)
    ).then(hash => Buffer.from(hash).toString('hex'));

    const { error } = await supabase
      .from('course_materials')
      .insert({
        course_id: material.courseId,
        day_number: material.dayNumber,
        type: material.type,
        content: encryptedContent,
        content_hash: contentHash
      });

    if (error) throw error;
  }

  static async getMaterial(courseId: string, dayNumber: number, type: 'text' | 'video'): Promise<string> {
    const { data, error } = await supabase
      .from('course_materials')
      .select('content, content_hash')
      .eq('course_id', courseId)
      .eq('day_number', dayNumber)
      .eq('type', type)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Material not found');

    const decryptedContent = await ContentEncryption.decrypt(
      data.content,
      this.ENCRYPTION_KEY
    );

    // Verify content integrity
    const contentHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(decryptedContent)
    ).then(hash => Buffer.from(hash).toString('hex'));

    if (contentHash !== data.content_hash) {
      throw new Error('Content integrity check failed');
    }

    return decryptedContent;
  }
}