import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators}from '@angular/forms'
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../Services/Auth/auth.service';

import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;
 constructor(private fb: FormBuilder,private authService: AuthService,private router: Router,private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;
      this.authService.loginUser(userData).subscribe({
            next: (response) => {
                sessionStorage.setItem('token',response.token);
                this.router.navigate(['users']);
            },
            error: (err) => {
              
              // this.openErrorDialog('Error:You need to register ');
            }
          });

    }
  }
  change(){
    this.router.navigate(['/register']);

  }
  navigateToRegister() {
    // Navigate to registration page
    // this.router.navigate(['/register']);
  }

  // ngOnInit(): void {
  //   this.addUserForm = this.fb.group({
  //     userGroup: this.fb.group({ // 💡 יש לוודא שהשם תואם גם ב-HTML
  //       email: ['', [Validators.required]],
  //       password: ['', Validators.required]
  //     })
  //   });
         

  // }

  //   // openErrorDialog(message: string): void {
  //   //     this.dialog.open(ErrorDialogComponent, {
  //   //       data: { message },
  //   //       width: '300px'
  //   //     });
  //   //   }
  // onSubmit() {
    
  //     if (this.addUserForm.valid) {
  //       const userData = this.addUserForm.get('userGroup')?.value;
  //      this.authService.loginUser(userData).subscribe({
  //       next: (response) => {
  //           sessionStorage.setItem('token',response.token);
  //           this.router.navigate(['users']);
  //       },
  //       error: (err) => {
          
  //         // this.openErrorDialog('Error:You need to register ');
  //       }
  //     });


  }


