import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DiscussionService } from '../services/discussion';
@Component({
  selector: 'app-create-discussion',
  imports: [FormsModule, RouterLink],
  templateUrl: './create-discussion.html',
  styleUrl: './create-discussion.css'
})
export class CreateDiscussion {

  constructor(
  private router: Router,
  private discussionService: DiscussionService
) {}

  communities = [
    {
      id:1,
      name: 'Cinephile Circle',
      icon: '🎬'
    },
    {
      id:2,
      name: 'GameVerse',
      icon: '🎮'
    },
    {
      id:3,
      name: 'Beyond the Unknown',
      icon: '👻'
    },
    {
      id:4,
      name: 'The Bookworm Society',
      icon: '📚'
    },
    {id:5,
      name: 'Anime Haven',
      icon: '🍥'
    }
  ];

  selectedCommunity = 'Cinephile Circle';

  title = '';

  content = '';


  publishDiscussion() {

  if (!this.title.trim() || !this.content.trim()) {
    return;
  }

  const selected = this.communities.find(
    community => community.name === this.selectedCommunity
  );

  if (!selected) {
    return;
  }

  const discussion = {
    id: Date.now(),
    communityId: selected.id,
    title: this.title,
    author: 'NightWalker27',
    time: 'Just now',
    replies: 0
  };

  this.discussionService.addDiscussion(discussion);

  console.log('New discussion:', discussion);

  this.router.navigate(['/communities']);
}

}
