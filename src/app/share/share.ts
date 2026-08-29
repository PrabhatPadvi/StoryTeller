import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoryService, Story } from '../services/story';

@Component({
  selector: 'app-share',
  imports: [ReactiveFormsModule],
  templateUrl: './share.html',
  styleUrl: './share.css',
})
export class Share {

  storyForm = new FormGroup({
    category: new FormControl('Dream'),
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    story: new FormControl('', [
      Validators.required,
      Validators.minLength(10)
    ]),
  });

  submitted = false;

  constructor(private storyService: StoryService) {}

  publishStory() {

    this.submitted = true;

    if (this.storyForm.invalid) {
      this.storyForm.markAllAsTouched();
      return;
    }

    const formValue = this.storyForm.value;

    const newStory: Story = {
  id: Date.now(),

  type: formValue.category ?? 'Dream',

  icon:
    formValue.category === 'Dream'
      ? '🌙'
      : formValue.category === 'Real Life'
        ? '🌎'
        : '💭',

  title: formValue.title ?? '',

  content: formValue.story ?? '',

  author: 'NightWalker27',

  likes: 0,

  comments: 0,

  createdAt: new Date()
};

    this.storyService.addStory(newStory);

    console.log(newStory);
  }

}
