import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'login',  component: LoginComponent  },
  { path: 'signup', component: SignupComponent  },
  { path: '',       redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,          // Needed for formGroup / formControlName directives
    RouterModule.forChild(routes)
  ]
})
export class AuthModule {}
