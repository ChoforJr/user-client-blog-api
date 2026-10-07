export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  userId: string;
  publishedAt: string | null;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  createdAt: string;
}

export interface Account {
  id: string;
  username: string;
  createdAt: string;
  role: string;
  displayName: string;
  bio: string | null;
}

export interface PublicBlogData {
  posts: Post[];
  comments: Comment[];
  profiles: Profile[];
  error: string | null;
}

export interface AccountResponse {
  user: {
    id: string;
    username: string;
    createdAt: string;
    role: string;
    profile: {
      displayName: string;
      bio: string | null;
    };
  };
}

export interface ApiFailure {
  errors?: string | string[] | { message?: string }[];
  message?: string;
}
