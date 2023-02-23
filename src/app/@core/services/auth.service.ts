import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConnectionService } from '../utils/connection.service';

const URL: string = environment.APIUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public token: any = null;
  public identity: any = '';
  public headers!: HttpHeaders;

  constructor(
    private http: HttpClient,
    private router: Router,
    private connectionSvc: ConnectionService
  ) {
  }

  getAuthToken():string {
    return localStorage.getItem('token') || '';
  }

  login(user: any): Promise<any>
  {
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('password', user.password);

    return new Promise((resolve, reject) => {
      this.http.post<any>(`${ URL }/login`, formData)
      .subscribe({
        next: (response: any) => {
          let { access_token, refresh_token } = response;
          if ( access_token === undefined || refresh_token === undefined) {
            reject('Incorrect credentials');
          } else {
            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            let headers = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + access_token
            });

            this.http.get<any>(`${ URL }/usuario/obtenerPorTelefono/${ user.email }/`, { headers: headers })
            .subscribe({
              next: (response: any) => {
                resolve(response);
              },
              error: (error: any) => {
                resolve(error);
              }
            });
          }
        }, error: (error: any) => {
          resolve(error);
        }, complete: () => {
          // console.log('Complete');
        }
      })
    });
  }

  async getIdentity()
  {
    let value = localStorage.getItem('identity');
    let identity = (value != null) ? value : '';
    if(identity && identity != "undefined")
      this.identity = identity;
    else
      this.identity = null;

    return this.identity;
  }

  async getToken()
  {
    let token = localStorage.getItem('token');
    if(token != "undefined")
    {
      this.token = token;
    }
    else{
        this.token = null;
    }
      return this.token;
  }

  async validaToken(): Promise<boolean>
  {
    this.getToken();
    if ( !this.token && this.token != '')
    {
      this.router.navigate(['/auth/login']);
      return Promise.resolve(false);
    }

    return new Promise<boolean>(async resolve => {

      this.getIdentity();
      if ( this.identity && this.identity != '' )
      {
        resolve( true );
      }
      else
      {
        resolve( false );
        this.router.navigate(['/auth/login']);
      }
    });
  }

  async validaAdmin(): Promise<boolean> {
    this.token = this.getToken();

    if ( !this.token) {
      this.router.navigate(['/auth/login']);
      return Promise.resolve(false);
    }

    return new Promise<boolean>(async resolve => {

      this.identity = this.getIdentity();
      let exists = this.identity?.roles.find( (role: any) => role.nombre == 'ADMIN');
      if ( exists != undefined ) {
        resolve( true );
      } else {
        resolve( false );
        this.router.navigate(['/pages/home']);
      }
    });
  }
  
  async logout(email: string)
  {
    // Revisar este metodo
    // let resp = await this.connectionSvc.send('put', `users/updateLastLogin?email=${email}`);
    
    this.token = null;
    this.identity = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('identity');
    localStorage.removeItem('business');
    localStorage.removeItem('roles');
    this.router.navigateByUrl('/auth/login');
  }
}
