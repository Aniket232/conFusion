import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { from, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor( private http: HttpClient,
    private ProcessHTTPMsgService: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions').pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions/' + id).pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion[]>(baseURL + 'Promotions?featured=true').pipe(map(Promotions => Promotions[0])).pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }
  getPromotionIds(): Observable<number[] | any> {
    return this.getPromotions().pipe(map(Promotions => Promotions.map(promotion => promotion.id)))
      .pipe(catchError(error => error));
  }
  putPromotion(promotion: Promotion): Observable<Promotion> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Promotion>(baseURL + 'promotions/' + promotion.id, promotion, httpOptions)
      .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }
}
