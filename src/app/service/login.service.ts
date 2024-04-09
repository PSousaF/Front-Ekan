import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  subscribe(arg0: (response: any) => void) {
    throw new Error("Método não implementado.");
  }

  userAuthenticated = new EventEmitter<boolean>();

  constructor(private http: HttpClient,
    private router: Router) { }
    
  login(username: string, password: string) {
    return this.http.post<any>(`${environment.API}/user/login`,
      {
        username: username,
        password: password
      })
      .pipe(map(response => {
        const { data } = response
        if (response && response.success && data.user.ativo === 1) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', JSON.stringify(data.token).replaceAll(/"/g, ''));
          this.userAuthenticated.emit(true);
        }
        return response;
      }));
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userAuthenticated.emit(false);
    this.router.navigate(['/login']);
  }

}
