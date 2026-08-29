import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DiscussionService } from '../services/discussion';
interface Community {
  id: number;
  name: string;
  description: string;
  icon: string;
  members: number;
  joined: boolean;
}

@Component({
  selector: 'app-communities',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './communities.html',
  styleUrl: './communities.css',
})
export class Communities {

  selectedCommunityId = 0;

  constructor(private discussionService: DiscussionService) {}

  communities: Community[] = [
    {
      id: 1,
      name: 'Cinephile Circle',
      description: 'Movies, cinema, theories, reviews and unforgettable endings.',
      icon: '🎬',
      members: 12400,
      joined: false
    },
    {
      id: 2,
      name: 'GameVerse',
      description: 'Games, gaming experiences, theories and recommendations.',
      icon: '🎮',
      members: 20100,
      joined: false
    },
    {
      id: 3,
      name: 'Beyond the Unknown',
      description: 'Supernatural events, mysteries, paranormal stories and the unexplained.',
      icon: '👻',
      members: 4700,
      joined: false
    },
    {
      id: 4,
      name: 'The Bookworm Society',
      description: 'Books, authors, characters, literature and recommendations.',
      icon: '📚',
      members: 8200,
      joined: false
    },
    {
      id: 5,
      name: 'Anime Haven',
      description: 'Anime, manga, characters, theories and recommendations.',
      icon: '🌙',
      members: 15800,
      joined: false
    }
  ];

  joinCommunity(community: Community) {
    community.joined = true;
  }

  leaveCommunity(community: Community) {
    community.joined = false;

    if (this.selectedCommunityId === community.id) {
      this.selectedCommunityId = 0;
    }
  }

  selectCommunity(id: number) {
    this.selectedCommunityId = id;
  }

  get joinedCommunities() {
    return this.communities.filter(community => community.joined);
  }

  get visibleDiscussions() {

  const discussions = this.discussionService.getDiscussions();

  if (this.selectedCommunityId === 0) {
    return discussions.filter(discussion =>
      this.communities.some(
        community =>
          community.id === discussion.communityId &&
          community.joined
      )
    );
  }

  return discussions.filter(
    discussion => discussion.communityId === this.selectedCommunityId
  );
}

  getCommunity(communityId: number) {
    return this.communities.find(
      community => community.id === communityId
    );
  }

}
