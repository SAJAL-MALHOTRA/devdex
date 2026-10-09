import type { Education, Experience, Project } from '@/types/profile';

export interface Database {
  public: {
    Tables: {
      developer_profiles: {
        Row: {
          id: string;
          username: string;
          name: string;
          role: string;
          location: string;
          bio: string;
          phone: string;
          email: string;
          website: string;
          github: string;
          linkedin: string;
          x: string;
          availability: string;
          skills: string[];
          projects: Project[];
          experience: Experience[];
          education: Education[];
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          name: string;
          role?: string;
          location?: string;
          bio?: string;
          phone: string;
          email: string;
          website?: string;
          github?: string;
          linkedin?: string;
          x?: string;
          availability?: string;
          skills?: string[];
          projects?: Project[];
          experience?: Experience[];
          education?: Education[];
          is_published?: boolean;
        };
        Update: Partial<Database['public']['Tables']['developer_profiles']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
