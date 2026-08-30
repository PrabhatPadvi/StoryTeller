import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DiscussionService } from '../services/discussion';

interface Community {
  id: number;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-create-discussion',
  imports: [FormsModule, RouterLink],
  templateUrl: './create-discussion.html',
  styleUrl: './create-discussion.css'
})
export class CreateDiscussion implements OnInit {

  constructor(
    private router: Router,
    private discussionService: DiscussionService
  ) {}


  /*
   * All available communities.
   *
   * We keep this list here so the page knows
   * the community names and IDs.
   */
  allCommunities: Community[] = [

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


  /*
   * Only joined communities will be placed here.
   */
  communities: Community[] = [];


  selectedCommunity = '';

  title = '';

  content = '';


  ngOnInit() {

    this.loadJoinedCommunities();

  }


  loadJoinedCommunities() {

    const saved =
      localStorage.getItem('joinedCommunities');


    if (!saved) {

      this.communities = [];

      return;

    }


    const joinedIds: number[] =
      JSON.parse(saved);


    this.communities =
      this.allCommunities.filter(
        community =>
          joinedIds.includes(community.id)
      );


    /*
     * Automatically select the first
     * joined community.
     */
    if (this.communities.length > 0) {

      this.selectedCommunity =
        this.communities[0].name;

    }

  }


  publishDiscussion() {

    if (!this.title.trim()) {
      return;
    }


    if (!this.content.trim()) {
      return;
    }


    const selected =
      this.communities.find(
        community =>
          community.name === this.selectedCommunity
      );


    if (!selected) {
      return;
    }


    const discussion = {

      id: Date.now(),

      communityId: selected.id,

      title: this.title.trim(),

      content: this.content.trim(),

      author: 'NightWalker27',

      time: 'Just now',

      replies: 0,
      likes: 0,
  liked: false,

      hashtags: this.extractHashtags(
        this.title + ' ' + this.content
      )

    };


    this.discussionService.addDiscussion(
      discussion
    );


    this.router.navigate([
      '/communities'
    ]);

  }


  extractHashtags(text: string): string[] {

    const matches =
      text.match(/#[a-zA-Z0-9_]+/g);


    if (!matches) {
      return [];
    }


    return [
      ...new Set(
        matches.map(tag =>
          tag.substring(1).toLowerCase()
        )
      )
    ];

  }

}
