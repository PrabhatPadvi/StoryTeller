import { Injectable } from '@angular/core';

export interface Story {
  id: number;
  type: string;
  icon: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  stories: Story[] = [
    {
  id: 1,
  type: 'Dream',
  icon: '🌙',
  title: 'The strangest dream I had last night',
  content: 'I found myself walking through a city I had never seen before. Everything felt strangely familiar...',
  author: 'NightWalker27',
  likes: 124,
  comments: 23,
  createdAt: new Date()
},

{
  id: 2,
  type: 'Real Life',
  icon: '🌎',
  title: 'Something unexpected happened today',
  content: 'I was walking home when a complete stranger stopped me and told me something I will probably never forget...',
  author: 'NightWalker27',
  likes: 87,
  comments: 14,
  createdAt: new Date()
},

{
  id: 3,
  type: 'Thought',
  icon: '💭',
  title: 'Why do we remember some moments forever?',
  content: 'Sometimes a tiny moment from years ago stays in our minds while we completely forget what happened yesterday.',
  author: 'NightWalker27',
  likes: 56,
  comments: 9,
  createdAt: new Date()
},

{
  id: 4,
  type: 'Real Life',
  icon: '🌎',
  title: 'A stranger changed my day',
  content: 'Sometimes the smallest conversations with strangers can stay with us for years.',
  author: 'NightWalker27',
  likes: 42,
  comments: 7,
  createdAt: new Date()
}
  ];

  getStories(): Story[] {
    return this.stories;
  }

  addStory(story: Story) {
    this.stories.unshift(story);
  }

}
