import { Injectable } from '@angular/core';

export interface Discussion {
  id: number;
  communityId: number;
  title: string;
  author: string;
  time: string;
  replies: number;
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
      author: 'MovieWatcher',
      time: '2h',
      replies: 34
    },
    {
      id: 2,
      communityId: 2,
      title: 'What is the best game you have played this year?',
      author: 'Gamer27',
      time: '4h',
      replies: 18
    },
    {
      id: 3,
      communityId: 5,
      title: 'Which anime character had the best development?',
      author: 'OtakuSoul',
      time: '5h',
      replies: 42
    },
    {
      id: 4,
      communityId: 4,
      title: 'Which book changed the way you think?',
      author: 'PageTurner',
      time: '7h',
      replies: 21
    },
    {
      id: 5,
      communityId: 3,
      title: 'Have you ever experienced something unexplained?',
      author: 'NightOwl',
      time: '9h',
      replies: 29
    },
    {
      id: 6,
      communityId: 1,
      title: 'Who is the greatest movie villain of all time?',
      author: 'FilmFan',
      time: '11h',
      replies: 51
    }
  ];

  getDiscussions(): Discussion[] {
    return this.discussions;
  }

  addDiscussion(discussion: Discussion) {
    this.discussions.unshift(discussion);
  }

}
