import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  StoryService,
  Story
} from '../services/story';

import {
  StoryCommentComponent
} from '../story-comment/story-comment';

import {
  StoryComment
} from '../story-comment/story-comment.model';


@Component({
  selector: 'app-explore',

  imports: [
    FormsModule,
    StoryCommentComponent
  ],

  templateUrl: './explore.html',

  styleUrl: './explore.css',
})
export class Explore {

  selectedCategory = 'For You';


  /* ==========================================
     NEW COMMENT
  ========================================== */

  commentText = '';


  /* ==========================================
     REPLY SYSTEM
  ========================================== */

  replyingTo: StoryComment | null = null;

  replyText = '';

  replyingStory: Story | null = null;


  /* ==========================================
     CURRENTLY OPEN STORY
  ========================================== */

  expandedStoryId: number | null = null;


  /* ==========================================
     COMMENTS
  ========================================== */

  comments: {
    [storyId: number]: StoryComment[];
  } = {

    /* ========================================
       STORY 1
    ======================================== */

    1: [

      {
        id: 1,

        author: 'Dreamer27',

        content:
          'That sounds like such a strange dream.',

        likes: 8,

        liked: false,

        repliesExpanded: false,

        replies: [

          {
            id: 2,

            author: 'NightWalker27',

            content:
              'Yeah, it felt incredibly real.',

            likes: 3,

            liked: false,

            repliesExpanded: false,

            replyToAuthor: 'Dreamer27',

            replies: [

              {
                id: 3,

                author: 'Dreamer27',

                content:
                  'I know exactly what you mean.',

                likes: 2,

                liked: false,

                repliesExpanded: false,

                replyToAuthor: 'NightWalker27',

                replies: [

                  {
                    id: 4,

                    author: 'NightWalker27',

                    content:
                      'Dreams can be really strange sometimes 😄',

                    likes: 0,

                    liked: false,

                    repliesExpanded: false,

                    replyToAuthor: 'Dreamer27',

                    replies: []

                  }

                ]

              }

            ]

          }

        ]

      },


      {
        id: 5,

        author: 'NightOwl',

        content:
          'I have had dreams like this too.',

        likes: 4,

        liked: false,

        repliesExpanded: false,

        replies: []

      }

    ],


    /* ========================================
       STORY 2
    ======================================== */

    2: [

      {
        id: 10,

        author: 'CuriousMind',

        content:
          'Now I really want to know what happened next.',

        likes: 6,

        liked: false,

        repliesExpanded: false,

        replies: []

      }

    ],


    /* ========================================
       STORY 3
    ======================================== */

    3: [],


    /* ========================================
       STORY 4
    ======================================== */

    4: []

  };


  /* ==========================================
     LIKED STORIES
  ========================================== */

  likedStories = new Set<number>();


  /* ==========================================
     REPORT SYSTEM
  ========================================== */

  reportingComment: StoryComment | null = null;

  /* Story report system */
  reportingStory: Story | null = null;


  reportReason = '';


  reportDetails = '';


  reportReasons = [

    'Spam',

    'Harassment or bullying',

    'Hate speech',

    'Inappropriate content',

    'Other'

  ];


  /*
   * Temporary local report storage.
   *
   * Later this can be connected to
   * the Spring Boot backend/database.
   */

  reports: {

    commentId: number;

    author: string;

    reason: string;

    details: string | null;

  }[] = [];


  /* Story reports are stored separately from comment reports. */
  storyReports: {

    storyId: number;

    author: string;

    reason: string;

    details: string | null;

  }[] = [];


  /* ==========================================
     REPORT SUCCESS
  ========================================== */

  reportSuccess = false;


  /* ==========================================
     CONSTRUCTOR
  ========================================== */

  constructor(
    private storyService: StoryService
  ) {}


  /* ==========================================
     STORIES
  ========================================== */

  get stories(): Story[] {

    return this.storyService.getStories();

  }


  /* ==========================================
     CATEGORY
  ========================================== */

  selectCategory(category: string) {

    this.selectedCategory = category;

  }


  get filteredStories(): Story[] {

    if (
      this.selectedCategory === 'For You'
    ) {

      return this.stories;

    }


    return this.stories.filter(
      story =>
        story.type === this.selectedCategory
    );

  }


  /* ==========================================
     STORY LIKE
  ========================================== */

  toggleLike(story: Story) {

    if (
      this.likedStories.has(story.id)
    ) {

      story.likes--;

      this.likedStories.delete(story.id);

    } else {

      story.likes++;

      this.likedStories.add(story.id);

    }

  }


  isLiked(story: Story): boolean {

    return this.likedStories.has(story.id);

  }


  /* ==========================================
     GET COMMENTS
  ========================================== */

  getComments(
    story: Story
  ): StoryComment[] {

    if (!this.comments[story.id]) {

      this.comments[story.id] = [];

    }


    return this.comments[story.id];

  }


  /* ==========================================
     OPEN / CLOSE COMMENTS
  ========================================== */

  toggleComments(story: Story) {

    if (
      this.expandedStoryId === story.id
    ) {

      this.expandedStoryId = null;

      this.commentText = '';

      this.cancelReply();

    } else {

      this.expandedStoryId = story.id;

      this.commentText = '';

      this.cancelReply();

    }

  }


  /* ==========================================
     ADD TOP-LEVEL COMMENT
  ========================================== */

  addComment(story: Story) {

    const text =
      this.commentText.trim();


    if (!text) {

      return;

    }


    const comment: StoryComment = {

      id: Date.now(),

      author: 'NightWalker27',

      content: text,

      likes: 0,

      liked: false,

      replies: [],

      repliesExpanded: false

    };


    this.getComments(story).push(comment);


    story.comments++;


    this.commentText = '';

  }


  /* ==========================================
     COMMENT LIKE
  ========================================== */

  toggleCommentLike(
    comment: StoryComment
  ) {

    if (comment.liked) {

      comment.likes--;

      comment.liked = false;

    } else {

      comment.likes++;

      comment.liked = true;

    }

  }


  /* ==========================================
     START REPLY
  ========================================== */

  replyToComment(
    comment: StoryComment,
    story: Story
  ) {

    this.replyingTo = comment;

    this.replyingStory = story;

    this.replyText = '';

  }


  /* ==========================================
     CANCEL REPLY
  ========================================== */

  cancelReply() {

    this.replyingTo = null;

    this.replyingStory = null;

    this.replyText = '';

  }


  /* ==========================================
     POST REPLY
  ========================================== */

  postReply(story: Story) {

    if (!this.replyingTo) {

      return;

    }


    const text =
      this.replyText.trim();


    if (!text) {

      return;

    }


    const parent =
      this.replyingTo;


    const reply: StoryComment = {

      id: Date.now(),

      author: 'NightWalker27',

      content: text,

      likes: 0,

      liked: false,

      replies: [],

      repliesExpanded: false,

      replyToAuthor: parent.author

    };


    /*
     * Add reply to the exact
     * comment/reply selected.
     */

    parent.replies.push(reply);


    /*
     * Automatically show replies.
     */

    parent.repliesExpanded = true;


    /*
     * Increase story comment count.
     */

    story.comments++;


    /*
     * Close fixed reply box.
     */

    this.cancelReply();

  }


  /* ==========================================
     POST REPLY FOR CURRENT STORY
  ========================================== */

  postReplyForCurrentStory() {

    if (!this.replyingStory) {

      return;

    }


    this.postReply(
      this.replyingStory
    );

  }


  /* ==========================================
     EDIT COMMENT / REPLY
  ========================================== */

  editComment(
    comment: StoryComment
  ) {

    /*
     * StoryCommentComponent already
     * updates the text.
     *
     * This method is kept so the
     * parent receives the event.
     */

    console.log(
      'Comment updated:',
      comment
    );

  }


  /* ==========================================
     DELETE COMMENT / REPLY
  ========================================== */

  deleteComment(
    comment: StoryComment
  ) {

    const story =
      this.findStoryContainingComment(
        comment
      );


    if (!story) {

      return;

    }


    const deletedCount =
      this.countCommentTree(
        comment
      );


    const removed =
      this.removeCommentFromTree(
        this.getComments(story),
        comment
      );


    if (!removed) {

      return;

    }


    story.comments =
      Math.max(
        0,
        story.comments - deletedCount
      );


    /*
     * If the user was replying to
     * the deleted comment/reply,
     * close the reply box.
     */

    if (
      this.replyingTo === comment ||
      this.isReplyInsideDeletedTree(
        this.replyingTo,
        comment
      )
    ) {

      this.cancelReply();

    }

  }


  /* ==========================================
     FIND STORY CONTAINING COMMENT
  ========================================== */

  private findStoryContainingComment(
    target: StoryComment
  ): Story | null {

    for (
      const story of this.stories
    ) {

      const rootComments =
        this.getComments(story);


      if (
        this.containsComment(
          rootComments,
          target
        )
      ) {

        return story;

      }

    }


    return null;

  }


  /* ==========================================
     CHECK COMMENT TREE
  ========================================== */

  private containsComment(
    comments: StoryComment[],
    target: StoryComment
  ): boolean {

    for (
      const comment of comments
    ) {

      if (
        comment === target
      ) {

        return true;

      }


      if (
        this.containsComment(
          comment.replies,
          target
        )
      ) {

        return true;

      }

    }


    return false;

  }


  /* ==========================================
     REMOVE COMMENT FROM TREE
  ========================================== */

  private removeCommentFromTree(
    comments: StoryComment[],
    target: StoryComment
  ): boolean {

    const index =
      comments.indexOf(target);


    if (index !== -1) {

      comments.splice(
        index,
        1
      );

      return true;

    }


    for (
      const comment of comments
    ) {

      if (
        this.removeCommentFromTree(
          comment.replies,
          target
        )
      ) {

        return true;

      }

    }


    return false;

  }


  /* ==========================================
     COUNT COMMENT + ALL REPLIES
  ========================================== */

  private countCommentTree(
    comment: StoryComment
  ): number {

    let count = 1;


    for (
      const reply of comment.replies
    ) {

      count +=
        this.countCommentTree(
          reply
        );

    }


    return count;

  }


  /* ==========================================
     CHECK DELETED REPLY TREE
  ========================================== */

  private isReplyInsideDeletedTree(
    target: StoryComment | null,
    deletedComment: StoryComment
  ): boolean {

    if (!target) {

      return false;

    }


    return (
      target === deletedComment ||
      this.containsComment(
        deletedComment.replies,
        target
      )
    );

  }


  /* ==================================================
     REPORT SYSTEM
  ================================================== */


  /* ==========================================
     OPEN REPORT
  ========================================== */

  openReport(
    comment: StoryComment
  ) {

    /*
     * Do not allow reporting your own
     * comment.
     */

    if (
      comment.author === 'NightWalker27'
    ) {

      return;

    }


    /*
     * Close reply mode.
     */

    this.cancelReply();


    /*
     * Store the exact comment.
     */

    this.reportingComment =
      comment;


    /*
     * Reset form.
     */

    this.reportReason = '';

    this.reportDetails = '';


    /*
     * Hide any previous success toast.
     */

    this.reportSuccess = false;

  }


  /* ==========================================
     CLOSE REPORT
  ========================================== */

  /* ==================================================
     STORY REPORT SYSTEM
  ================================================== */

  /* ==========================================
     OPEN STORY REPORT
  ========================================== */

  openStoryReport(
  story: Story,
  event?: Event
): void {

  event?.stopPropagation();

  this.cancelReply();

  this.reportingStory = story;
  this.reportingComment = null;

  this.reportReason = '';
  this.reportDetails = '';
  this.reportSuccess = false;

  document.body.style.overflow = 'hidden';
}


  /* ==========================================
     CLOSE STORY REPORT
  ========================================== */

  closeStoryReport(): void {

  this.reportingStory = null;

  this.reportReason = '';
  this.reportDetails = '';

  this.reportSuccess = false;

  // Restore page scrolling
  document.body.style.overflow = '';

}


  /* ==========================================
     SUBMIT STORY REPORT
  ========================================== */

  submitStoryReport(): void {

  if (
    !this.reportingStory ||
    !this.canSubmitReport()
  ) {
    return;
  }

  this.storyReports.push({

    storyId: this.reportingStory.id,

    author: this.reportingStory.author,

    reason: this.reportReason,

    details:
      this.reportReason === 'Other'
        ? this.reportDetails.trim()
        : null

  });

  // Close report modal
  this.reportingStory = null;

  // Clear report form
  this.reportReason = '';
  this.reportDetails = '';

  // IMPORTANT: allow page scrolling again
  document.body.style.overflow = '';

  // Show success notification
  this.reportSuccess = true;

  // Automatically hide after 3 seconds
  setTimeout(() => {

    this.reportSuccess = false;

  }, 3000);
}


  closeReport(): void {

  this.reportingComment = null;

  this.reportReason = '';
  this.reportDetails = '';

  this.reportSuccess = false;

  // Restore page scrolling
  document.body.style.overflow = '';

}


  /* ==========================================
     SELECT REPORT REASON
  ========================================== */

  selectReportReason(
    reason: string
  ) {

    this.reportReason = reason;


    /*
     * If user switches away from
     * Other, remove old details.
     */

    if (reason !== 'Other') {

      this.reportDetails = '';

    }

  }


  /* ==========================================
     REPORT DETAILS LENGTH
  ========================================== */

  get reportDetailsLength(): number {

    return this.reportDetails.length;

  }


  /* ==========================================
     CHECK IF REPORT CAN BE SUBMITTED
  ========================================== */

  canSubmitReport(): boolean {

  // Must be reporting either a comment or a story
  if (
    !this.reportingComment &&
    !this.reportingStory
  ) {
    return false;
  }

  // A reason must be selected
  if (!this.reportReason) {
    return false;
  }

  // "Other" requires an explanation
  if (
    this.reportReason === 'Other'
  ) {

    return (
      this.reportDetails.trim().length > 0
    );

  }

  return true;
}


  /* ==========================================
     SUBMIT REPORT
  ========================================== */

  submitReport(): void {

  if (
    !this.reportingComment ||
    !this.canSubmitReport()
  ) {
    return;
  }

  // Your existing report-saving logic here...


  // Close report modal
  this.reportingComment = null;

  // Clear form
  this.reportReason = '';
  this.reportDetails = '';

  // IMPORTANT
  document.body.style.overflow = '';

  // Show success notification
  this.reportSuccess = true;

  setTimeout(() => {

    this.reportSuccess = false;

  }, 3000);
}


  /* ==================================================
     CLOSE SUCCESS TOAST
  ================================================== */

  closeReportSuccess(): void {

  this.reportSuccess = false;

  // Restore page scrolling
  document.body.style.overflow = '';

}

}


