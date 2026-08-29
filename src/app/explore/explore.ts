import { Component } from '@angular/core';
import { StoryService } from '../services/story';
@Component({
  selector: 'app-explore',
  imports: [],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore {

  selectedCategory = 'For You';

  constructor(private storyService: StoryService) {}

  get stories() {
    return this.storyService.getStories();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  get filteredStories() {

    if (this.selectedCategory === 'For You') {
      return this.stories;
    }

    return this.stories.filter(
      story => story.type === this.selectedCategory
    );
  }

}
