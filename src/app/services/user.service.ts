import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../constants/common.constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {}

  // Get User Data
  getUsersList() {
   return this.httpClient.get(`${URL}usercreates`);
  }

  // Post User Data
  postUserData(data) {
    return this.httpClient.post(`${URL}usercreates`, data);
  }

  // Update User Data
  updateUser(data) {
    return this.httpClient.put(`${URL}usercreates/${data.id}`, data);
  }

  // Delete User
  deleteUser(data) {
    return this.httpClient.delete(`${URL}usercreates/${data.id}`);
  }

  // Load live roles 
  loadLiveRoles() {
    return this.httpClient.get(`${URL}UserRole1`);
  }
}
