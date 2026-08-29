import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  protected showStoryMessage = signal(false);

  protected shareStory() {
    this.showStoryMessage.set(true);
  }

}
