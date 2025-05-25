// import { Component, OnInit } from '@angular/core';
// import { UsersService } from '../../Services/Auth/Users/users.service';
// import { user } from '../../Models/User';
// import { MailService } from '../../Services/Mail/mail.service';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-massage',
//   standalone: true,

//   imports: [ FormsModule],
//   templateUrl: './massage.component.html',
//   styleUrl: './massage.component.css'
// })
// export class MassageComponent implements OnInit {
//   users: user[] = [];
//   loading: boolean = false;
//   error: string | null = null;
//   success: string | null = null;
  
//   // מודל לטופס שליחת הודעות
//   messageForm = {
//     subject: '',
//     body: ''
//   };
  
//   // סטטוס שליחת הודעות
//   sendingMessages: boolean = false;

//   constructor(
//     private usersService: UsersService,
//     private mailService: MailService
//   ) {}

//   ngOnInit(): void {
//     this.fetchUsers();
//   }

//   fetchUsers(): void {
//     this.loading = true;
//     this.error = null;

//     this.usersService.getUsers().subscribe({
//       next: (response) => {
//         this.users = response;
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'שגיאה בטעינת המשתמשים: ' + err.message;
//         this.loading = false;
//         console.error('שגיאה בטעינת המשתמשים:', err);
//       }
//     });
//   }
  
//   sendMessageToAllUsers(): void {
//     // בדיקת תקינות השדות
//     if (!this.messageForm.subject.trim() || !this.messageForm.body.trim()) {
//       this.error = 'יש למלא את כל השדות';
//       return;
//     }
    
//     this.sendingMessages = true;
//     this.error = null;
//     this.success = null;
    
//     // מונה לבדיקת ההצלחה
//     let successCount = 0;
//     let errorCount = 0;
//     let processedCount = 0;
    
//     // שליחת הודעה לכל המשתמשים ברשימה
//     this.users.forEach(user => {
//       const emailRequest = {
//         To: user.email, // נניח שלמשתמש יש שדה Email
//         Subject: this.messageForm.subject,
//         Body: this.messageForm.body
//       };
      
//       this.mailService.sendEmail(emailRequest).subscribe({
//         next: () => {
//           successCount++;
//           processedCount++;
//           this.checkCompletion(successCount, errorCount, processedCount);
//         },
//         error: (err) => {
//           console.error(`שגיאה בשליחת הודעה למשתמש ${user.email}:`, err);
//           errorCount++;
//           processedCount++;
//           this.checkCompletion(successCount, errorCount, processedCount);
//         }
//       });
//     });
//   }
  
//   // בדיקה האם הסתיימה שליחת כל ההודעות
//   private checkCompletion(successCount: number, errorCount: number, processedCount: number): void {
//     if (processedCount === this.users.length) {
//       this.sendingMessages = false;
      
//       if (errorCount === 0) {
//         this.success = `נשלחו ${successCount} הודעות בהצלחה!`;
//         // איפוס הטופס לאחר שליחה מוצלחת
//         this.messageForm.subject = '';
//         this.messageForm.body = '';
//       } else {
//         this.error = `נשלחו ${successCount} הודעות בהצלחה, נכשלו ${errorCount} הודעות.`;
//       }
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UsersService } from '../../Services/Auth/Users/users.service';
import { user } from '../../Models/User';
import { MailService } from '../../Services/Mail/mail.service';
import { UserSelectionDialogComponent, UserSelectionDialogData } from '../user-selection-dialog/user-selection-dialog.component';

@Component({
  selector: 'app-massage',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './massage.component.html',
  styleUrl: './massage.component.css'
})
export class MassageComponent implements OnInit {
  // נתונים בסיסיים
  users: user[] = [];
  selectedUsers: user[] = [];
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  
  // מודל לטופס שליחת הודעות
  messageForm = {
    subject: '',
    body: ''
  };
  
  // סטטוס שליחת הודעות
  sendingMessages: boolean = false;
  
  // סטטיסטיקות
  lastSentCount: number = 0;

  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  // טעינת רשימת המשתמשים
  fetchUsers(): void {
    this.loading = true;
    this.error = null;

    this.usersService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'שגיאה בטעינת המשתמשים: ' + err.message;
        this.loading = false;
        console.error('שגיאה בטעינת המשתמשים:', err);
      }
    });
  }
  
  // פתיחת Dialog לבחירת משתמשים
  openUserSelectionDialog(): void {
    // בדיקת תקינות השדות לפני פתיחת הדיאלוג
    if (!this.messageForm.subject.trim() || !this.messageForm.body.trim()) {
      this.error = 'יש למלא את כל השדות לפני בחירת הנמענים';
      this.clearMessagesAfterDelay();
      return;
    }
    
    this.error = null;
  
    const dialogData: UserSelectionDialogData = {
      users: this.users,
      selectedUsers: this.selectedUsers,
      messageSubject: this.messageForm.subject,
      messageBody: this.messageForm.body
    };
  
    const dialogRef = this.dialog.open(UserSelectionDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: dialogData,
      disableClose: false,
      autoFocus: false, // ← שינוי כאן
      restoreFocus: false, // ← הוספה כאן
      hasBackdrop: true, // ← הוספה כאן
      backdropClass: 'dialog-backdrop', // ← הוספה כאן
      panelClass: 'dialog-panel', // ← הוספה כאן
      direction: 'rtl'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        this.selectedUsers = result.selectedUsers;
        this.sendToSelectedUsers();
      }
    });
  }
    sendToSelectedUsers(): void {
    if (this.selectedUsers.length === 0) {
      this.error = 'יש לבחור לפחות נמען אחד';
      this.clearMessagesAfterDelay();
      return;
    }
    
    this.sendingMessages = true;
    this.error = null;
    this.success = null;
    
    // מונה להצלחה ושגיאות
    let successCount = 0;
    let errorCount = 0;
    let processedCount = 0;
    
    // שליחת הודעה לכל המשתמשים הנבחרים
    this.selectedUsers.forEach(user => {
      const emailRequest = {
        To: user.email,
        Subject: this.messageForm.subject,
        Body: this.createEmailBody(user)
      };
      
      this.mailService.sendEmail(emailRequest).subscribe({
        next: () => {
          successCount++;
          processedCount++;
          this.checkSendingCompletion(successCount, errorCount, processedCount);
        },
        error: (err) => {
          console.error(`שגיאה בשליחת הודעה למשתמש ${user.email}:`, err);
          errorCount++;
          processedCount++;
          this.checkSendingCompletion(successCount, errorCount, processedCount);
        }
      });
    });
  }
  
  // יצירת תוכן האימייל עם פרטים אישיים
  private createEmailBody(user: user): string {
    const userName = user.firstName || user.lastName || 'משתמש יקר';
    return `שלום ${userName},\n\n${this.messageForm.body}\n\nבברכה,\nצוות המערכת`;
  }
  
  // בדיקת סיום תהליך השליחה
  private checkSendingCompletion(successCount: number, errorCount: number, processedCount: number): void {
    if (processedCount === this.selectedUsers.length) {
      this.sendingMessages = false;
      this.lastSentCount = successCount;
      
      if (errorCount === 0) {
        this.success = `🎉 נשלחו ${successCount} הודעות בהצלחה לכל הנמענים!`;
        this.clearForm();
        this.clearSelection();
      } else if (successCount > 0) {
        this.success = `⚠️ נשלחו ${successCount} הודעות בהצלחה`;
        this.error = `${errorCount} הודעות נכשלו בשליחה`;
      } else {
        this.error = `❌ כל ${errorCount} ההודעות נכשלו בשליחה. אנא בדוק את החיבור ונסה שוב`;
      }
      
      this.clearMessagesAfterDelay();
    }
  }

  // הסרת הודעות מצב לאחר זמן מסוים
  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.success = null;
      this.error = null;
    }, 5000);
  }
  
  // ניקוי הטופס
  clearForm(): void {
    this.messageForm.subject = '';
    this.messageForm.body = '';
    this.error = null;
    this.success = null;
  }

  // ניקוי בחירת המשתמשים
  clearSelection(): void {
    this.selectedUsers = [];
  }
  
  // שליחה לכל המשתמשים (שיטה ישנה לתאימות)
  sendMessageToAllUsers(): void {
    this.selectedUsers = [...this.users];
    this.sendToSelectedUsers();
  }
}