import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../constants/common.constant';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    userid = new BehaviorSubject<number>(0);
    constructor(private httpClient: HttpClient) { }


    // Login
    login(data) {
        return this.httpClient.post(`${URL}UserLogin`, data);
    }


}
