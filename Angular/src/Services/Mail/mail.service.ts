import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private apiUrl ='http://localhost:5220/api/Mail/send-email'; // שנה את ה-URL לפי הגדרות השרת שלך

  constructor(private http: HttpClient) { }

  /**
   * שולח אימייל באמצעות ה-API
   * @param emailRequest פרטי האימייל לשליחה
   * @returns Observable של תשובת השרת
   */
  sendEmail(emailRequest: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json'
      });

    // השימוש ב-{ observe: 'response' } מאפשר לנו לקבל את תשובת ה-HTTP המלאה
    return this.http.post<any>(this.apiUrl, emailRequest, {
      headers,
      observe: 'response'
    }).pipe(
      map(response => {
        // בדיקה אם הסטטוס קוד הוא 200, נתייחס לזה כהצלחה
        if (response.status === 200) {
          console.log('המייל נשלח בהצלחה:', response);
          return response.body || { success: true };
        } else {
          // במקרה של סטטוס אחר
          throw new Error(`שגיאה בשליחת האימייל: ${response.status}`);
        }
      }),
      catchError(error => {
        // אם הסטטוס הוא 200 אבל עדיין יש שגיאה, נחזיר הצלחה
        if (error.status === 200) {
          console.log('המייל נשלח בהצלחה למרות השגיאה', error);
          return of({ success: true });
        }
        
        console.error('שגיאה בשליחת האימייל:', error);
        throw error;
      })
    );
  }
}
