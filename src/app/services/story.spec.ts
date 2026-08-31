import { TestBed } from '@angular/core/testing';

import { StoryService } from './story';

describe('StoryService', () => {
  let service: StoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return stories', () => {
    const stories = service.getStories();

    expect(stories).toBeTruthy();
    expect(stories.length).toBeGreaterThan(0);
  });

  it('should add a story', () => {
    const initialLength = service.getStories().length;

    const newStory = {
      id: 5,
      type: 'Dream',
      icon: '🌙',
      title: 'Test Story',
      content: 'This is a test story.',
      author: 'TestUser',
      likes: 0,
      comments: 0,
      createdAt: new Date()
    };

    service.addStory(newStory);

    expect(service.getStories().length).toBe(initialLength + 1);
    expect(service.getStories()[0]).toEqual(newStory);
  });
});
