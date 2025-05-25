// import { Component } from '@angular/core';
// import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { FormsModule } from '@angular/forms';
// import { user } from '../../Models/User';
// import { UsersService } from '../../Services/Auth/Users/users.service';
// import { MatTableModule } from '@angular/material/table';
// import { MatSortModule } from '@angular/material/sort';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatChipsModule } from '@angular/material/chips';
// import { CommonModule } from '@angular/common';
// import { EditUserComponent } from '../../edit-user/edit-user.component';
// import { AddUserComponent } from '../add-user/add-user.component';

// @Component({
//   selector: 'app-show-users',
//   standalone: true,
//   imports: [MatIconModule,MatButtonModule,RouterLinkActive, MatChipsModule,
//     RouterLink,MatTableModule,MatSortModule,MatPaginatorModule,
//     RouterOutlet,MatIconModule, MatButtonModule, FormsModule, FormsModule,CommonModule],
//   templateUrl: './show-users.component.html',
//   styleUrl: './show-users.component.css'
// })
// export class ShowUsersComponent {
//   courseId: string = '';
//   Users: user[] = [];
//   filteredUsers: user[] = []; // המשתנה שיכיל את המשתמשים המסוננים
//   displayedColumns: string[] = ['user', 'email', 'role', 'status', 'joinDate', 'actions'];

//   // משתנים לחיפוש

//   constructor( private dialog: MatDialog,private activatedRoute: ActivatedRoute, private usersService: UsersService ,private router: Router,
//   ) {}

//   ngOnInit(): void {
    
//         this.loadUsers();
//         // קריאה לפונקציה אחרי שקיבלנו את ה-ID
//       }
    
// loadUsers(): void {
//    this.usersService.getUsers().subscribe({
//       next: (data) => {
//         console.log("Data from server:", data); // הוסף את זה

//         this.Users = data;
        
        
        
//       },
//       error: (error) => {
//         console.error('Error fetching courses:', error);
        
//       }
//     });
//   }
//   openAddUserDialog(): void {
//     const dialogRef = this.dialog.open(AddUserComponent, {
//       width: '400px', // Adjust the width as per requirement
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         // Reload the users list after adding a new user
//         this.loadUsers();
//       }
//     });
//   }

//   deleteUser(User:user )
//   {
//      this.usersService.deleteUser(User.id).subscribe({
//         next: () => {
//           this.Users = this.Users.filter(l => l.id !== User.id);
//         },
//         error: () => {
//           // this.openErrorDialog('שגיאה במחיקת הקורס');
//         }
//       });
//     }
//   editUser(User:user ): void {
   
//       const course: user = this.Users.find(c => c.id === User.id) || { email: '', firstName: '', lastName: '', password:'' ,id:'' ,createdAt:'',active:false};
//       if (!course) return;
    
//       const dialogRef = this.dialog.open(EditUserComponent, {
//         width: '400px',
//         data: {
//        email: course.email,
//        name: course.firstName,
//         }
//       });
    
//       dialogRef.afterClosed().subscribe(result => {
//         if (result) {
    
    
//           this.usersService.updateUser(User.id, result).subscribe({
//             next: () => this.loadUsers(),
//             error: () => console.log('שגיאה בעדכון הקורס')
            
//           });
//         }
//       });
//     }

//     }



  

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
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-show-users',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLinkActive, MatChipsModule,
    RouterLink, MatTableModule, MatSortModule, MatPaginatorModule,
    RouterOutlet, MatIconModule, MatButtonModule, FormsModule, FormsModule, CommonModule],
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.css'
})
export class ShowUsersComponent {
  courseId: string = '';
  Users: user[] = [];
  filteredUsers: user[] = []; // המשתנה שיכיל את המשתמשים המסוננים
  displayedColumns: string[] = ['user', 'email', 'role', 'status', 'joinDate', 'actions'];

  // משתנה לחיפוש
  searchTerm: string = '';

  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }
    
  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        console.log("Data from server:", data);
        this.Users = data;
        this.filteredUsers = data; // בהתחלה, הרשימה המסוננת זהה לרשימה המלאה
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  // פונקציה לסינון המשתמשים לפי מילת חיפוש
  filterUsers(): void {
    // אם אין מילת חיפוש, הצג את כל המשתמשים
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.Users;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredUsers = this.Users.filter(user => 
      user.firstName?.toLowerCase().includes(searchTermLower) || 
      user.lastName?.toLowerCase().includes(searchTermLower) || 
      user.email?.toLowerCase().includes(searchTermLower) 
    );
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '400px', // Adjust the width as per requirement
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload the users list after adding a new user
        this.loadUsers();
      }
    });
  }

  deleteUser(User: user) {
    this.usersService.deleteUser(User.id).subscribe({
      next: () => {
        this.Users = this.Users.filter(l => l.id !== User.id);
        this.filteredUsers = this.filteredUsers.filter(l => l.id !== User.id);
      },
      error: () => {
        // this.openErrorDialog('שגיאה במחיקת המשתמש');
      }
    });
  }

  editUser(User: user): void {
    const user: user = this.Users.find(c => c.id === User.id) || { email: '', firstName: '', lastName: '', password: '', id: '', createdAt: '', active: false };
    if (!user) return;
    
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: {
        email: user.email,
        name: user.firstName,
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.updateUser(User.id, result).subscribe({
          next: () => this.loadUsers(),
          error: () => console.log('שגיאה בעדכון המשתמש')
        });
      }
    });
  }
}


