import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Explore } from './explore/explore';
import { Share } from './share/share';
import { Communities } from './communities/communities';
import { Discussion } from './discussion/discussion';
import { CreateDiscussion } from './create-discussion/create-discussion';
import { Profile } from './profile/profile';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'explore',
    component: Explore
  },

  {
    path: 'share',
    component: Share
  },

  {
    path: 'communities',
    component: Communities
  },

  {
    path: 'discussion/:id',
    component: Discussion
  },

  {
    path: 'create-discussion',
    component: CreateDiscussion
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
  path: 'profile',
  component: Profile
},

];
