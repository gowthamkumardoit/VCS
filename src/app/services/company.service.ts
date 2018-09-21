import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../constants/common.constant';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient: HttpClient) { }

  // Get Company Details
  getCompanyList() {
    return this.httpClient.get(`${URL}Companydetails`);
   }

  // Post Company Data
   createCompany(data) {
     return this.httpClient.post(`${URL}Companydetails`, data);
   }

   // Update Company
   updateCompany(data) {
     return this.httpClient.put(`${URL}Companydetails/${data.id}`, data);
   }

   // Delete Company
   deleteCompany(data) {
     return this.httpClient.delete(`${URL}Companydetails/${data.id}`);
   }

   // Get Company Profile Details
  getCompanyProfilesList() {
    return this.httpClient.get(`${URL}Companyprofiles`);
  }

  // Post Profile Data
  createProfile(data) {
    return this.httpClient.post(`${URL}Companyprofiles`, data);
  }

  // Update Profile
  updateProfile(data) {
    return this.httpClient.put(`${URL}Companyprofiles/${data.id}`, data);
  }

  // Delete Profile
  deleteProfile(data) {
    return this.httpClient.delete(`${URL}Companyprofiles/${data.id}`);
  }

  // Get Director Details
  getDirectorList() {
    return this.httpClient.get(`${URL}directors1`);
  }

  // Post Profile Data
  createDirector(data) {
    return this.httpClient.post(`${URL}directors1`, data);
  }

  // Update Profile
  updateDirector(data) {
    return this.httpClient.put(`${URL}directors1/${data.id}`, data);
  }

  // Delete Profile
  deleteDirector(data) {
    return this.httpClient.delete(`${URL}directors1/${data.id}`);
  }
}
