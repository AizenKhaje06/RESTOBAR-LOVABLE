import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadMenuImage = async (file: File): Promise<string | null> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from('menu-images')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const deleteMenuImage = async (imagePath: string): Promise<boolean> => {
  try {
    const fileName = imagePath.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from('menu-images')
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
