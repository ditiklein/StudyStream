import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { user } from '../../../Models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'https://localhost:7147/api/User';
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
   return this.http.get<any>(this.apiUrl);
  }
  addUser(user:user): Observable<any> 
  {
     return this.http.post<any>(this.apiUrl, {firstName:user.firstName, lastName:user.lastName,password:user.password,email: user.email });
  }
  updateUser(id: string, updates: any): Observable<any> {
     return this.http.put(`${this.apiUrl}/${id}`, updates); 
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // getCourseById(id: string): Observable<user> {
    
  //   return this.http.get<user>(`${this.apiUrl}/${id}`);
  // }
  // enrollStudentInCourse(courseId: string, userId: string): Observable<any> {
    
  //   return this.http.post(`${this.apiUrl}/${courseId}/enroll`, { userId });
  // }

  // unenrollStudentFromCourse(courseId: string, userId: string): Observable<any> {

  //   return this.http.delete(`${this.apiUrl}/${courseId}/unenroll`, {  body: { userId } });
  // }

  // getCoursesByStudentId(studentId: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/student/${studentId}`);
  // }
  getUserGrowthData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-registration-growth`);
  }

}
