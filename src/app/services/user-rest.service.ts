import { Injectable } from '@angular/core';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()
export class UserRestService {

  private baseUrl: string = 'http://localhost:8081/';

  constructor(private http: InterceptorService) { 
  }

  register(registerData) {
    return this.http.post(this.baseUrl +'register', registerData )
      .map(response => response.json());
  }

  login(loginData) {
    return this.http.post(this.baseUrl + 'login', loginData)
      .map(response => response.json());
  }

  updatePassword(updatePasswordData) {
    return this.http.post(this.baseUrl + 'updatePassword', updatePasswordData)
      .map(response => response.json());
  }

  updateImage(updateImageData) {
    return this.http.post(this.baseUrl + 'updateImage', updateImageData)
      .map(response => response.json());
  }

  home() {
    return this.http.get(this.baseUrl + 'home')
      .map(response => response.json());
  }



}
