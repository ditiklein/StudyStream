import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemStatisticsDto, UserStatisticsDto } from '../../Models/UserGrowth';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private apiUrl = 'http://localhost:5220/api/Statstics';

  constructor(private http: HttpClient) { }

  // קריאה לסטטיסטיקות של משתמשים
  getUserStatistics(): Observable<UserStatisticsDto[]> {
    return this.http.get<any>(`${this.apiUrl}/user-statistics`);
  }

  // קריאה לסטטיסטיקות של המערכת
  getSystemStatistics(): Observable<SystemStatisticsDto> {
    return this.http.get<any>(`${this.apiUrl}/system-statistics`);
  }
  getUserGrowthData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-registration-growth`);
  }
}
