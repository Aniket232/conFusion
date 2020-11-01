import { Injectable } from '@angular/core';
import {Feedback} from '../shared/feedback';
import { Observable, of } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {baseURL} from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private ProcessHTTPMsgService: ProcessHTTPMsgService) { }

    submitFeedback(feedback:Feedback): Observable<Feedback> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      return this.http.post<Feedback>(baseURL + 'feedback' , feedback,httpOptions)
        .pipe(catchError(this.ProcessHTTPMsgService.handleError));
    }
}
