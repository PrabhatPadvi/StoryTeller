import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Discussion,
  DiscussionService
} from '../services/discussion';


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

  imports: [
    DecimalPipe,
    FormsModule
  ],

  templateUrl: './communities.html',

  styleUrl: './communities.css',

})


export class Communities {


  /* ==================================================
     COMMUNITY SELECTION
  ================================================== */

  selectedCommunityId = 0;



  /* ==================================================
     REPORT SYSTEM
  ================================================== */

  reportModalOpen = false;

  reportSuccess = false;


  reportingDiscussion: Discussion | null = null;


  selectedReportReason = '';


  reportOtherReason = '';



  /* ==================================================
     OPEN DISCUSSION
  ================================================== */

  openDiscussion(id: number) {

    this.router.navigate([
      '/discussion',
      id
    ]);

  }



  /* ==================================================
     CONSTRUCTOR
  ================================================== */

  constructor(

    private discussionService: DiscussionService,

    private router: Router

  ) {


    const saved =
      localStorage.getItem(
        'joinedCommunities'
      );


    if (saved) {

      const joinedIds: number[] =
        JSON.parse(saved);


      this.communities.forEach(
        community => {

          community.joined =
            joinedIds.includes(
              community.id
            );

        }
      );

    }

  }



  /* ==================================================
     COMMUNITIES
  ================================================== */

  communities: Community[] = [

    {

      id: 1,

      name: 'Cinephile Circle',

      description:
        'Movies, cinema, theories, reviews and unforgettable endings.',

      icon: '🎬',

      members: 12400,

      joined: false

    },


    {

      id: 2,

      name: 'GameVerse',

      description:
        'Games, gaming experiences, theories and recommendations.',

      icon: '🎮',

      members: 20100,

      joined: false

    },


    {

      id: 3,

      name: 'Beyond the Unknown',

      description:
        'Supernatural events, mysteries, paranormal stories and the unexplained.',

      icon: '👻',

      members: 4700,

      joined: false

    },


    {

      id: 4,

      name: 'The Bookworm Society',

      description:
        'Books, authors, characters, literature and recommendations.',

      icon: '📚',

      members: 8200,

      joined: false

    },


    {

      id: 5,

      name: 'Anime Haven',

      description:
        'Anime, manga, characters, theories and recommendations.',

      icon: '🌙',

      members: 15800,

      joined: false

    }

  ];



  /* ==================================================
     JOIN COMMUNITY
  ================================================== */

  joinCommunity(
    community: Community
  ) {

    community.joined = true;

    this.saveJoinedCommunities();

  }



  /* ==================================================
     LEAVE COMMUNITY
  ================================================== */

  leaveCommunity(
    community: Community
  ) {

    community.joined = false;


    if (
      this.selectedCommunityId ===
      community.id
    ) {

      this.selectedCommunityId = 0;

    }


    this.saveJoinedCommunities();

  }



  /* ==================================================
     SAVE JOINED COMMUNITIES
  ================================================== */

  saveJoinedCommunities() {

    const joinedIds =
      this.communities

        .filter(
          community =>
            community.joined
        )

        .map(
          community =>
            community.id
        );


    localStorage.setItem(

      'joinedCommunities',

      JSON.stringify(joinedIds)

    );

  }



  /* ==================================================
     SELECT COMMUNITY
  ================================================== */

  selectCommunity(id: number) {

    this.selectedCommunityId = id;

  }



  /* ==================================================
     JOINED COMMUNITIES
  ================================================== */

  get joinedCommunities() {

    return this.communities.filter(
      community =>
        community.joined
    );

  }



  /* ==================================================
     VISIBLE DISCUSSIONS
  ================================================== */

  get visibleDiscussions() {

    const discussions =
      this.discussionService
        .getDiscussions();


    if (
      this.selectedCommunityId === 0
    ) {

      return discussions.filter(
        discussion =>

          this.communities.some(

            community =>

              community.id ===
              discussion.communityId &&

              community.joined

          )

      );

    }


    return discussions.filter(

      discussion =>

        discussion.communityId ===
        this.selectedCommunityId

    );

  }



  /* ==================================================
     GET COMMUNITY
  ================================================== */

  getCommunity(
    communityId: number
  ) {

    return this.communities.find(

      community =>

        community.id ===
        communityId

    );

  }



  /* ==================================================
     TOGGLE LIKE
  ================================================== */

  toggleLike(
    discussion: Discussion,
    event: Event
  ) {

    /*
     * Prevent the card click from
     * opening the discussion.
     */

    event.stopPropagation();


    discussion.liked =
      !discussion.liked;


    if (discussion.liked) {

      discussion.likes++;

    } else {

      discussion.likes--;

    }

  }



  /* ==================================================
     OPEN REPORT MODAL
  ================================================== */

  openReportModal(

    discussion: Discussion,

    event: Event

  ) {

    /*
     * VERY IMPORTANT:
     * Prevent clicking Report from
     * opening the discussion card.
     */

    event.stopPropagation();


    this.reportingDiscussion =
      discussion;


    this.selectedReportReason =
      '';


    this.reportOtherReason =
      '';


    this.reportModalOpen =
      true;


    /*
     * Prevent background scrolling
     * while modal is open.
     */

    document.body.style.overflow =
      'hidden';

  }



  /* ==================================================
     CLOSE REPORT MODAL
  ================================================== */

  closeReportModal() {

    this.reportModalOpen =
      false;


    this.reportingDiscussion =
      null;


    this.selectedReportReason =
      '';


    this.reportOtherReason =
      '';


    document.body.style.overflow =
      '';

  }



  /* ==================================================
     SELECT REPORT REASON
  ================================================== */

  selectReportReason(
    reason: string
  ) {

    this.selectedReportReason =
      reason;


    /*
     * Clear the custom explanation
     * when the user switches away
     * from Other.
     */

    if (reason !== 'Other') {

      this.reportOtherReason =
        '';

    }

  }



  /* ==================================================
     CHECK WHETHER REPORT CAN BE SUBMITTED
  ================================================== */

  canSubmitReport(): boolean {

    if (
      !this.selectedReportReason
    ) {

      return false;

    }


    if (
      this.selectedReportReason ===
      'Other'
    ) {

      return (
        this.reportOtherReason.trim()
          .length > 0
      );

    }


    return true;

  }



  /* ==================================================
     SUBMIT REPORT
  ================================================== */

  submitReport() {

    if (
      !this.canSubmitReport()
    ) {

      return;

    }


    /*
     * At this stage this is where
     * a real backend/API request
     * can eventually be placed.
     *
     * For now the report is handled
     * on the frontend.
     */

    const report = {

      discussionId:
        this.reportingDiscussion?.id,

      reason:
        this.selectedReportReason,

      details:
        this.reportOtherReason.trim()

    };


    /*
     * Keep the object available for
     * future backend integration.
     */

    console.log(
      'Discussion report submitted:',
      report
    );


    /*
     * Close modal first.
     */

    this.closeReportModal();


    /*
     * Show success notification.
     */

    this.reportSuccess =
      true;


    /*
     * Automatically hide after
     * 3 seconds.
     */

    setTimeout(() => {

      this.reportSuccess =
        false;

    }, 3000);

  }



  /* ==================================================
     CLOSE SUCCESS TOAST
  ================================================== */

  closeReportSuccess(): void {

    this.reportSuccess =
      false;

  }

}
