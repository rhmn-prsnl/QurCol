export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'faculty';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  thumbnail: string;
  created_at: string;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  order_position: number;
  videos?: Video[];
}

export interface Video {
  id: number;
  module_id: number;
  title: string;
  youtube_id: string;
  description: string;
  order_position: number;
}

export interface News {
  id: number;
  title: string;
  content: string;
  category: string;
  image: string;
  created_at: string;
}
