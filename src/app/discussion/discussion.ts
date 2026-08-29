import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Comment {
  id: number;
  author: string;
  content: string;
  replies: Comment[];
}

@Component({
  selector: 'app-discussion',
  imports: [FormsModule, RouterLink],
  templateUrl: './discussion.html',
  styleUrl: './discussion.css',
})
export class Discussion {

  discussion = {
    community: 'GameVerse',
    icon: '🎮',
    title: 'What is the best game you have played this year?',
    author: 'Gamer27',
    time: '4h'
  };

  comments: Comment[] = [
    {
      id: 1,
      author: 'PlayerOne',
      content: 'For me, it has to be the game I played last month. The story was incredible.',
      replies: [
        {
          id: 2,
          author: 'Gamer27',
          content: 'I completely agree. The story was probably my favorite part too.',
          replies: [
            {
              id: 3,
              author: 'PlayerOne',
              content: 'Exactly! I did not expect the ending at all.',
              replies: []
            }
          ]
        }
      ]
    },

    {
      id: 4,
      author: 'NightOwl',
      content: 'I would choose something completely different. Gameplay matters more to me.',
      replies: [
        {
          id: 5,
          author: 'PixelKnight',
          content: 'That is fair. What kind of gameplay do you usually enjoy?',
          replies: []
        }
      ]
    }
  ];

  newComment = '';

  addComment() {

    if (!this.newComment.trim()) {
      return;
    }

    this.comments.push({
      id: Date.now(),
      author: 'NightWalker27',
      content: this.newComment,
      replies: []
    });

    this.newComment = '';
  }

}
