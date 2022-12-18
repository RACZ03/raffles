import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

const URL = environment.APIUrl;

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private headers!: HttpHeaders;
  constructor(
    private http: HttpClient,
    private router: Router,
    private alertSvc: AlertService
  ) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getAuthToken()
    });
  }

  private getAuthToken():string {
    return localStorage.getItem('token') || '';
  }

  send(type: string, path: string, params: any = null): Promise<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getAuthToken()
    });

    let promise = new Promise((resolve, reject) => {
      switch(type) {
        case 'get':
          this.http.get<any>(`${ URL }/${ path }`, { headers: headers })
                  .subscribe({
                    next: (response: any) => {
                      resolve(response);
                    },
                    error: (error: any) => {
                      reject(error);
                    }
                  }); break;
        case 'post':
          this.http.post<any>(`${ URL }/${ path }`, params, { headers: headers })
                  .subscribe({
                    next: (response: any) => {
                      resolve(response);
                    },
                    error: (error: any) => {
                      reject(error);
                    }
                  }); break;
        case 'put':
          this.http.put<any>(`${ URL }/${ path }`, params, { headers: headers })
                  .subscribe({
                    next: (response: any) => {
                      resolve(response);
                    },
                    error: (error: any) => {
                      reject(error);
                    }
                  }); break;
        case 'delete':
          this.http.delete<any>(`${ URL }/${ path }`, { headers: headers })
                  .subscribe({
                    next: (response: any) => {
                      resolve(response);
                    },
                    error: (error: any) => {
                      reject(error);
                    }
                  }); break;
      }
    });

    return promise.catch( async (error: any) => {
      if ( error.error == null || error.error.error != undefined) {
        return error;
      }

      let  { error_message, token_invalid } = error.error;
      // Refresh token
      if ( error_message != undefined ) {
        let resp = await this.refreshToken();
        if ( resp ) {
          this.send(type, path, params);
        } else {
          this.logout();
        }
      } else if ( token_invalid ) {
        // logout
        this.logout();
      }
    });

  }
  

  private async refreshToken(): Promise<any>
  {
    let refresh_token = localStorage.getItem('refresh_token');
    if ( refresh_token && refresh_token != '' ) {
    
      let promise = new Promise((resolve, reject) => {

        let headers2 = new HttpHeaders({
          'Authorization': 'Bearer ' + refresh_token
        });

        this.http.post<any>(`${ URL }/api/token/refresh`, {}, { headers: headers2} )
        .subscribe({
          next: (response: any) => {
            let { access_token, refresh_token } = response;
            if ( access_token === undefined || refresh_token === undefined) {
              reject(false);
            } else {
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              
              localStorage.setItem('token', access_token);
              localStorage.setItem('refresh_token', refresh_token);
              resolve(true);
            }
          }, error: (error: any) => {
            reject(false);
          }
        })
      });

      return promise.catch( (error: any) => {
        this.alertSvc.showAlert(4, 'Not found', 'Error');
      });
    }
    else
    {
      this.router.navigate(['/auth/login']);
    }
  }

  private logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('identity');
    this.router.navigateByUrl('/auth/login');
  }

}
