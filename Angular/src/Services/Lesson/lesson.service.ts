import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Lesson } from '../../Models/Lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService {


  private baseUrl = 'http://localhost:5220/api/Lesson';

  constructor(private http: HttpClient) { }

  getLessonsWithTranscript(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/with-transcript`);
  }

  getLessonsWithoutTranscript(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/without-transcript`);
  }
}
