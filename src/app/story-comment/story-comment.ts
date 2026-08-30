import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { StoryComment } from './story-comment.model';


@Component({
  selector: 'app-story-comment',

  imports: [
    FormsModule
  ],

  templateUrl: './story-comment.html',

  styleUrl: './story-comment.css'
})
export class StoryCommentComponent {

  @Input()
  comment!: StoryComment;


  /* ==========================================
     CURRENT USER
  ========================================== */

  currentUser = 'NightWalker27';


  /* ==========================================
     EDIT SYSTEM
  ========================================== */

  isEditing = false;

  editText = '';


  /* ==========================================
     EVENTS
  ========================================== */

  @Output()
  like =
    new EventEmitter<StoryComment>();


  @Output()
  reply =
    new EventEmitter<StoryComment>();


  @Output()
  edit =
    new EventEmitter<StoryComment>();


  @Output()
  delete =
    new EventEmitter<StoryComment>();


  /* ==========================================
     REPORT
  ========================================== */

  @Output()
  report =
    new EventEmitter<StoryComment>();


  /* ==========================================
     OWNERSHIP
  ========================================== */

  get isOwnComment(): boolean {

    return (
      this.comment.author ===
      this.currentUser
    );

  }


  /* ==========================================
     TOGGLE REPLIES
  ========================================== */

  toggleReplies(): void {

    this.comment.repliesExpanded =
      !this.comment.repliesExpanded;

  }


  /* ==========================================
     LIKE
  ========================================== */

  toggleLike(): void {

    this.like.emit(
      this.comment
    );

  }


  /* ==========================================
     REPLY
  ========================================== */

  startReply(): void {

    this.reply.emit(
      this.comment
    );

  }


  /* ==========================================
     START EDIT
  ========================================== */

  startEdit(): void {

    this.isEditing = true;

    this.editText =
      this.comment.content;

  }


  /* ==========================================
     CANCEL EDIT
  ========================================== */

  cancelEdit(): void {

    this.isEditing = false;

    this.editText = '';

  }


  /* ==========================================
     SAVE EDIT
  ========================================== */

  saveEdit(): void {

    const text =
      this.editText.trim();


    if (!text) {

      return;

    }


    this.comment.content =
      text;


    this.isEditing = false;

    this.editText = '';


    this.edit.emit(
      this.comment
    );

  }


  /* ==========================================
     DELETE
  ========================================== */

  deleteComment(): void {

    this.delete.emit(
      this.comment
    );

  }


  /* ==========================================
     REPORT
  ========================================== */

  reportComment(): void {

    /*
     * Do not report own comment.
     */

    if (this.isOwnComment) {

      return;

    }


    this.report.emit(
      this.comment
    );

  }


  /* ==========================================
     CHILD LIKE
  ========================================== */

  onChildLike(
    comment: StoryComment
  ): void {

    this.like.emit(
      comment
    );

  }


  /* ==========================================
     CHILD REPLY
  ========================================== */

  onChildReply(
    comment: StoryComment
  ): void {

    this.reply.emit(
      comment
    );

  }


  /* ==========================================
     CHILD EDIT
  ========================================== */

  onChildEdit(
    comment: StoryComment
  ): void {

    this.edit.emit(
      comment
    );

  }


  /* ==========================================
     CHILD DELETE
  ========================================== */

  onChildDelete(
    comment: StoryComment
  ): void {

    this.delete.emit(
      comment
    );

  }


  /* ==========================================
     CHILD REPORT
  ========================================== */

  onChildReport(
    comment: StoryComment
  ): void {

    this.report.emit(
      comment
    );

  }

}
