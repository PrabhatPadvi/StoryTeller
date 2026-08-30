import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DiscussionService } from '../services/discussion';


interface Comment {

  id: number;

  author: string;

  content: string;

  likes: number;

  liked: boolean;

  replies: Comment[];

  repliesExpanded: boolean;

  // Username being replied to
  replyToAuthor?: string;

}


@Component({
  selector: 'app-discussion',

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './discussion.html',

  styleUrl: './discussion.css',
})
export class Discussion {


  discussion: any = null;


  /* ==========================================
     CURRENT USER
  ========================================== */

  currentUser = 'NightWalker27';


  /* ==========================================
     NORMAL COMMENT
  ========================================== */

  newComment = '';


  /* ==========================================
     REPLY SYSTEM
  ========================================== */

  replyingToId: number | null = null;

  replyingToComment: Comment | null = null;

  replyingToAuthor: string | null = null;

  /*
   * Top-level comment that contains the reply
   * being replied to.
   */
  replyingToRoot: Comment | null = null;

  replyText = '';


  /* ==========================================
     EDIT SYSTEM
  ========================================== */

  editingComment: Comment | null = null;

  editText = '';


  /* ==========================================
     REPORT SYSTEM
  ========================================== */

  reportingComment: Comment | null = null;

  reportReason = '';

  /*
   * Additional explanation when the user
   * selects "Other".
   */
  reportDetails = '';

  reportReasons = [
    'Spam',
    'Harassment or bullying',
    'Hate speech',
    'Inappropriate content',
    'Other'
  ];


  /*
   * Reports are stored here for now.
   *
   * Later this can be connected to
   * a backend/database.
   */
  reports: {
    commentId: number;
    author: string;
    reason: string;
    details: string | null;
  }[] = [];


  /* ==========================================
     REPORT SUCCESS
  ========================================== */

  reportSuccess = false;


  /* ==========================================
     COMMENTS
  ========================================== */

  comments: Comment[] = [

    {
      id: 1,

      author: 'PlayerOne',

      content:
        'For me, it has to be the game I played last month. The story was incredible.',

      likes: 12,

      liked: false,

      repliesExpanded: false,

      replies: [

        {
          id: 2,

          author: 'Gamer27',

          content:
            'I completely agree. The story was probably my favorite part too.',

          likes: 4,

          liked: false,

          repliesExpanded: false,

          replies: [],

          replyToAuthor: 'PlayerOne'
        },

        {
          id: 3,

          author: 'PlayerOne',

          content:
            'Exactly! I did not expect the ending at all.',

          likes: 2,

          liked: false,

          repliesExpanded: false,

          replies: [],

          replyToAuthor: 'Gamer27'
        }

      ]
    },


    {
      id: 4,

      author: 'NightOwl',

      content:
        'I would choose something completely different. Gameplay matters more to me.',

      likes: 8,

      liked: false,

      repliesExpanded: false,

      replies: [

        {
          id: 5,

          author: 'PixelKnight',

          content:
            'That is fair. What kind of gameplay do you usually enjoy?',

          likes: 3,

          liked: false,

          repliesExpanded: false,

          replies: [],

          replyToAuthor: 'NightOwl'
        }

      ]
    }

  ];


  /* ==========================================
     CONSTRUCTOR
  ========================================== */

  constructor(
    private route: ActivatedRoute,
    private discussionService: DiscussionService
  ) {

    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      this.discussion =
        this.discussionService.getDiscussionById(id);

    });

  }


  /* ==========================================
     COMMUNITY
  ========================================== */

  getCommunity() {

    if (!this.discussion) {
      return undefined;
    }

    return this.discussionService.getCommunity(
      this.discussion.communityId
    );

  }


  /* ==========================================
     ADD TOP-LEVEL COMMENT
  ========================================== */

  addComment() {

    const text = this.newComment.trim();

    if (!text) {
      return;
    }

    this.comments.push({

      id: Date.now(),

      author: this.currentUser,

      content: text,

      likes: 0,

      liked: false,

      replies: [],

      repliesExpanded: false

    });

    this.newComment = '';

  }


  /* ==========================================
     LIKE / UNLIKE
  ========================================== */

  toggleLike(comment: Comment) {

    if (comment.liked) {

      comment.likes--;

      comment.liked = false;

    } else {

      comment.likes++;

      comment.liked = true;

    }

  }


  /* ==========================================
     SHOW / HIDE REPLIES
  ========================================== */

  toggleReplies(comment: Comment) {

    comment.repliesExpanded =
      !comment.repliesExpanded;

  }


  /* ==========================================
     CHECK COMMENT OWNERSHIP
  ========================================== */

  isOwnComment(comment: Comment): boolean {

    return comment.author === this.currentUser;

  }


  /* ==========================================
     START EDIT
  ========================================== */

  startEdit(comment: Comment) {

    if (!this.isOwnComment(comment)) {
      return;
    }

    this.cancelReply();

    this.cancelReport();

    this.editingComment = comment;

    this.editText = comment.content;

  }


  /* ==========================================
     SAVE EDIT
  ========================================== */

  saveEdit() {

    if (!this.editingComment) {
      return;
    }

    const text = this.editText.trim();

    if (!text) {
      return;
    }

    this.editingComment.content = text;

    this.cancelEdit();

  }


  /* ==========================================
     CANCEL EDIT
  ========================================== */

  cancelEdit() {

    this.editingComment = null;

    this.editText = '';

  }


  /* ==========================================
     DELETE COMMENT / REPLY
  ========================================== */

  deleteComment(comment: Comment) {

    if (!this.isOwnComment(comment)) {
      return;
    }


    /*
     * Check top-level comments first.
     */
    const topLevelIndex =
      this.comments.findIndex(
        item => item.id === comment.id
      );


    if (topLevelIndex !== -1) {

      this.comments.splice(
        topLevelIndex,
        1
      );


      if (
        this.replyingToComment?.id === comment.id
      ) {

        this.cancelReply();

      }


      if (
        this.editingComment?.id === comment.id
      ) {

        this.cancelEdit();

      }


      if (
        this.reportingComment?.id === comment.id
      ) {

        this.cancelReport();

      }


      return;

    }


    /*
     * Search replies.
     */
    for (const root of this.comments) {

      const replyIndex =
        root.replies.findIndex(
          reply => reply.id === comment.id
        );


      if (replyIndex !== -1) {

        root.replies.splice(
          replyIndex,
          1
        );


        if (
          this.replyingToComment?.id === comment.id
        ) {

          this.cancelReply();

        }


        if (
          this.editingComment?.id === comment.id
        ) {

          this.cancelEdit();

        }


        if (
          this.reportingComment?.id === comment.id
        ) {

          this.cancelReport();

        }


        return;

      }

    }

  }


  /* ==========================================
     START REPLY
  ========================================== */

  startReply(
    comment: Comment,
    rootComment?: Comment
  ) {

    this.cancelEdit();

    this.cancelReport();


    /*
     * Store the exact comment/reply
     * selected by the user.
     */
    this.replyingToId = comment.id;

    this.replyingToComment = comment;

    this.replyingToAuthor = comment.author;


    /*
     * Store the root comment if
     * replying to an existing reply.
     */
    this.replyingToRoot =
      rootComment ?? null;


    this.replyText = '';

  }


  /* ==========================================
     CANCEL REPLY
  ========================================== */

  cancelReply() {

    this.replyingToId = null;

    this.replyingToComment = null;

    this.replyingToAuthor = null;

    this.replyingToRoot = null;

    this.replyText = '';

  }


  /* ==========================================
     POST REPLY
  ========================================== */

  postReply() {

    if (!this.replyingToComment) {
      return;
    }


    const text = this.replyText.trim();

    if (!text) {
      return;
    }


    const parent =
      this.replyingToComment;


    const reply: Comment = {

      id: Date.now(),

      author: this.currentUser,

      content: text,

      likes: 0,

      liked: false,

      replies: [],

      repliesExpanded: false,

      replyToAuthor:
        parent.author

    };


    /* ========================================
       REPLY TO TOP-LEVEL COMMENT
    ======================================== */

    if (!this.replyingToRoot) {

      parent.replies.push(reply);

      parent.repliesExpanded = true;

    }


    /* ========================================
       REPLY TO EXISTING REPLY
    ======================================== */

    else {

      const root =
        this.replyingToRoot;


      const replyIndex =
        root.replies.findIndex(
          existingReply =>
            existingReply.id === parent.id
        );


      /*
       * Insert immediately after
       * the selected reply.
       */
      if (replyIndex !== -1) {

        root.replies.splice(
          replyIndex + 1,
          0,
          reply
        );

      } else {

        root.replies.push(reply);

      }


      root.repliesExpanded = true;

    }


    /*
     * Fixed reply box disappears.
     */
    this.cancelReply();

  }


  /* ==========================================
     FIND ROOT COMMENT
  ========================================== */

  getRootComment(
    replyId: number
  ): Comment | undefined {

    return this.comments.find(comment =>
      comment.replies.some(reply =>
        reply.id === replyId
      )
    );

  }


  /* ==========================================
     START REPORT
  ========================================== */

  startReport(comment: Comment) {

    /*
     * Do not allow users to report
     * their own comments.
     */
    if (this.isOwnComment(comment)) {
      return;
    }


    /*
     * Cancel other active modes.
     */
    this.cancelEdit();

    this.cancelReply();


    /*
     * Hide previous success message.
     */
    this.reportSuccess = false;


    /*
     * Store the exact comment/reply
     * being reported.
     */
    this.reportingComment = comment;

    this.reportReason = '';

    this.reportDetails = '';

  }


  /* ==========================================
     CANCEL REPORT
  ========================================== */

  cancelReport() {

    this.reportingComment = null;

    this.reportReason = '';

    this.reportDetails = '';

  }


  /* ==========================================
     SUBMIT REPORT
  ========================================== */

  submitReport() {

    if (!this.reportingComment) {
      return;
    }


    if (!this.reportReason) {
      return;
    }


    if (
      this.reportReason === 'Other' &&
      !this.reportDetails.trim()
    ) {
      return;
    }


    /* ========================================
       SAVE REPORT
    ======================================== */

    this.reports.push({

      commentId:
        this.reportingComment.id,

      author:
        this.reportingComment.author,

      reason:
        this.reportReason,

      details:
        this.reportReason === 'Other'
          ? this.reportDetails.trim()
          : null

    });


    /* ========================================
       CLOSE REPORT MODAL
    ======================================== */

    this.reportingComment = null;


    /* ========================================
       CLEAR FORM
    ======================================== */

    this.reportReason = '';

    this.reportDetails = '';


    /* ========================================
       SHOW SUCCESS TOAST
    ======================================== */

    this.reportSuccess = true;


    /* ========================================
       AUTO HIDE AFTER 3 SECONDS
    ======================================== */

    setTimeout(() => {

      this.reportSuccess = false;

    }, 3000);

  }


  /* ==========================================
     CLOSE SUCCESS TOAST
  ========================================== */

  closeReportSuccess() {

    this.reportSuccess = false;

  }

}
