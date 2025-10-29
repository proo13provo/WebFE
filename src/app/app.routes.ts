import { Routes } from '@angular/router';
import {Component} from '@angular/core';
import {DashBoard} from './page/dash-board/dash-board';
import {Layout} from './page/layout/layout';
import {Login} from './page/login/login';
import {Main} from './page/main/main';
import {Detail} from './page/detail/detail';
import {Signup} from './page/signup/signup';

export const routes: Routes = [
  {
    path: 'main',
    component: Main,
  },

  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'detail',
    component: Detail,

  },
  {
    path: 'dashboard',
    component: DashBoard,
  }
  // {
  //   path: '',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: DashBoard,
  //     }
  //   ]
  // }
];
