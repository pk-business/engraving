export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: Date;
  likes: number;
}
