export interface StoryComment {

  id: number;

  author: string;

  content: string;

  likes: number;

  liked: boolean;

  replies: StoryComment[];

  repliesExpanded: boolean;

  replyToAuthor?: string;

}
