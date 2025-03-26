import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UsersService } from '../../Services/Auth/Users/users.service';

@Component({
  selector: 'app-add-user',
  imports: [MatIconModule, MatButtonModule, FormsModule, RouterLinkActive, RouterLink,
    RouterOutlet, MatInputModule, MatCardModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  UserForm!: FormGroup;
  courseId: string = '';
  constructor(private fb: FormBuilder, private userService: UsersService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.UserForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]]

    });
  }
  ngOnInit(): void {
    
    };
  
  onSubmit() {
    if (this.UserForm.valid) {
        this.userService.addUser( this.UserForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Error adding lesson', err);
          alert('Failed to add lesson');
        }
      });
    }
  }

  onCancel() {
    // הוסף כאן את הלוגיקה לביטול הטופס
    console.log('Cancel button clicked');
    // לדוגמה, ניווט חזרה לעמוד הקורס
    this.router.navigate(['/users']);
  }

}
