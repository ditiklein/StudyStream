import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { user } from '../../Models/User';
import { UsersService } from '../../Services/Auth/Users/users.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { EditUserComponent } from '../../edit-user/edit-user.component';

@Component({
  selector: 'app-show-users',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,RouterLinkActive, MatChipsModule,
    RouterLink,MatTableModule,MatSortModule,MatPaginatorModule,
    RouterOutlet,MatIconModule, MatButtonModule, FormsModule, FormsModule,CommonModule],
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.css'
})
export class ShowUsersComponent {
  courseId: string = '';
  Users: user[] = [];
  filteredUsers: user[] = []; // המשתנה שיכיל את המשתמשים המסוננים
  displayedColumns: string[] = ['user', 'email', 'role', 'status', 'joinDate', 'actions'];

  // משתנים לחיפוש

  constructor( private dialog: MatDialog,private activatedRoute: ActivatedRoute, private usersService: UsersService ,private router: Router,
  ) {}

  ngOnInit(): void {
    
        this.loadUsers();
        // קריאה לפונקציה אחרי שקיבלנו את ה-ID
      }
    
loadUsers(): void {
   this.usersService.getUsers().subscribe({
      next: (data) => {
        console.log("Data from server:", data); // הוסף את זה

        this.Users = data;
        
        
        
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
        
      }
    });
  }
  deleteUser(User:user )
  {
     this.usersService.deleteUser(User.id).subscribe({
        next: () => {
          this.Users = this.Users.filter(l => l.id !== User.id);
        },
        error: () => {
          // this.openErrorDialog('שגיאה במחיקת הקורס');
        }
      });
    }
  editUser(User:user ): void {
   
      const course: user = this.Users.find(c => c.id === User.id) || { email: '', firstName: '', lastName: '', password:'' ,id:'' ,createdAt:'',active:false};
      if (!course) return;
    
      const dialogRef = this.dialog.open(EditUserComponent, {
        width: '400px',
        data: {
       email: course.email,
       name: course.firstName,
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
    
    
          this.usersService.updateUser(User.id, result).subscribe({
            next: () => this.loadUsers(),
            error: () => console.log('שגיאה בעדכון הקורס')
            
          });
        }
      });
    }

    }



  




