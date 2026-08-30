import { Injectable } from '@angular/core';

export interface Discussion {
  id: number;
  communityId: number;
  title: string;
  content?: string;
  author: string;
  time: string;
  likes: number;
  liked: boolean;
  replies: number;
  hashtags?: string[];
}

export interface Community {
  id: number;
  name: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  discussions: Discussion[] = [

    {
      id: 1,
      communityId: 1,
      title: 'What movie ending completely shocked you?',
      content: 'Which movie ending surprised you the most?',
      author: 'MovieWatcher',
      time: '2h',
      likes: 127,
      liked: false,
      replies: 34,
      hashtags: ['movies', 'endings', 'cinema']
    },

    {
      id: 2,
      communityId: 2,
      title: 'What is the best game you have played this year?',
      content: 'Which game has been your favorite this year and why?',
      author: 'Gamer27',
      time: '4h',
      likes: 127,
      liked: false,
      replies: 18,
      hashtags: ['gaming', 'games', 'recommendations']
    },

    {
      id: 3,
      communityId: 5,
      title: 'Which anime character had the best development?',
      content: 'Which anime character do you think had the best character development?',
      author: 'OtakuSoul',
      time: '5h',
      likes: 127,
      liked: false,
      replies: 42,
      hashtags: ['anime', 'characters', 'development']
    },

    {
      id: 4,
      communityId: 4,
      title: 'Which book changed the way you think?',
      content: 'Tell us about a book that changed your perspective on something.',
      author: 'PageTurner',
      time: '7h',
      likes: 127,
      liked: false,
      replies: 21,
      hashtags: ['books', 'reading', 'recommendations']
    },

    {
      id: 5,
      communityId: 3,
      title: 'Have you ever experienced something unexplained?',
      content: 'Share something strange or unexplained that happened to you.',
      author: 'NightOwl',
      time: '9h',
      likes: 127,
      liked: false,
      replies: 29,
      hashtags: ['mystery', 'paranormal', 'stories']
    },

    {
      id: 6,
      communityId: 1,
      title: 'Who is the greatest movie villain of all time?',
      content: 'Which movie villain do you think is the greatest of all time?',
      author: 'FilmFan',
      time: '11h',
      likes: 127,
      liked: false,
      replies: 51,
      hashtags: ['movies', 'villains', 'cinema']
    }

  ];


  communities: Community[] = [

    {
      id: 1,
      name: 'Cinephile Circle',
      icon: '🎬'
    },

    {
      id: 2,
      name: 'GameVerse',
      icon: '🎮'
    },

    {
      id: 3,
      name: 'Beyond the Unknown',
      icon: '👻'
    },

    {
      id: 4,
      name: 'The Bookworm Society',
      icon: '📚'
    },

    {
      id: 5,
      name: 'Anime Haven',
      icon: '🌙'
    }

  ];


  getDiscussions(): Discussion[] {
    return this.discussions;
  }


  addDiscussion(discussion: Discussion) {
    this.discussions.unshift(discussion);
  }


  // Get one specific discussion
  getDiscussionById(id: number): Discussion | undefined {

    return this.discussions.find(
      discussion => discussion.id === id
    );

  }


  // Get the community belonging to a discussion
  getCommunity(communityId: number): Community | undefined {

    return this.communities.find(
      community => community.id === communityId
    );

  }

}
