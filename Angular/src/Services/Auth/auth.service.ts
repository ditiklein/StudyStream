import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7147/api/Auth'; 

  constructor(private http: HttpClient) {}

  registerUser( name: string,email: string, password: string, role: string ): Observable<any> 
  {
    const user ={name,email,password,role}
    return this.http.post<any>(`${this.apiUrl}/register`,user);
  }
  loginUser(credentials: { email: string; password: string }): Observable<any> {
  
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

}
