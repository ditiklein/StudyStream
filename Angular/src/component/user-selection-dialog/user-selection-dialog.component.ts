import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { user } from '../../Models/User';

export interface UserSelectionDialogData {
  users: user[];
  selectedUsers: user[];
  messageSubject: string;
  messageBody: string;
}

@Component({
  selector: 'app-user-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './user-selection-dialog.component.html',
  styleUrl: './user-selection-dialog.component.css'
})
export class UserSelectionDialogComponent implements OnInit {
  selectedUsers: user[] = [];
  searchTerm: string = '';

  constructor(
    public dialogRef: MatDialogRef<UserSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserSelectionDialogData
  ) {}

  ngOnInit(): void {
    // העתקת המשתמשים הנבחרים מהנתונים המועברים
    this.selectedUsers = [...this.data.selectedUsers];
  }

  // קבלת טקסט תצוגה מקוצר של ההודעה
  getPreviewText(text: string): string {
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  }

  // בחירת כל המשתמשים
  selectAll(): void {
    this.selectedUsers = [...this.data.users];
  }

  // ביטול כל הבחירות
  clearAll(): void {
    this.selectedUsers = [];
  }

  // בדיקה האם כל המשתמשים נבחרו
  get allSelected(): boolean {
    return this.selectedUsers.length === this.data.users.length && this.data.users.length > 0;
  }

  // החלפת מצב בחירה של משתמש
  toggleUser(user: user): void {
    const index = this.selectedUsers.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  // בדיקה האם משתמש נבחר
  isSelected(user: user): boolean {
    return this.selectedUsers.some(u => u.id === user.id);
  }

  // פילטור משתמשים לפי חיפוש
  get filteredUsers(): user[] {
    if (!this.searchTerm.trim()) {
      return this.data.users;
    }
    
    const searchTerm = this.searchTerm.toLowerCase().trim();
    return this.data.users.filter(user => 
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm)) ||
      (user.email && user.email.toLowerCase().includes(searchTerm))
    );
  }

  // אישור הבחירה
  confirm(): void {
    this.dialogRef.close({
      confirmed: true,
      selectedUsers: this.selectedUsers
    });
  }

  // ביטול הדיאלוג
  cancel(): void {
    this.dialogRef.close({
      confirmed: false,
      selectedUsers: []
    });
  }
}
