import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CompareRequest, ConvertRequest, CalculateRequest, QuantityResponse
} from '../models/measurement.models';

@Injectable({ providedIn: 'root' })
export class MeasurementService {

  private base = `${environment.apiBase}/quantities`;

  constructor(private http: HttpClient) {}

  // Each method maps to one C# API endpoint.
  // HttpClient returns an Observable — the component subscribes to get the result.
  // The JWT is automatically attached by JwtInterceptor — no manual header needed here.

  compare(req: CompareRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${this.base}/compare`, req);
  }

  convert(req: ConvertRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${this.base}/convert`, req);
  }

  calculate(req: CalculateRequest): Observable<QuantityResponse> {
    return this.http.post<QuantityResponse>(`${this.base}/calculate`, req);
  }
}
