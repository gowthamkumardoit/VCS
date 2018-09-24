import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { URL } from '../constants/common.constant';
import { map} from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  visible: boolean;
  navigationBarShow = new BehaviorSubject<boolean>(false);
  constructor(private httpClient: HttpClient) { this.visible = false; }

  // Get User Details
  getRolesList() {
   return this.httpClient.get(`${URL}userroles`);
  }

  // Post User Data
  createRole(data) {
    return this.httpClient.post(`${URL}userroles`, data);
  }

  // Update Role
  updateRole(data) {
    return this.httpClient.put(`${URL}userroles/${data.id}`, data);
  }

  // Delete Role
  deleteRole(data) {
    return this.httpClient.delete(`${URL}userroles/${data.id}`);
  }


  // For Navigation Purpose
  hide() { this.visible = false; }

  show() { this.visible = true; }

  toggle() { this.visible = !this.visible; }
}
