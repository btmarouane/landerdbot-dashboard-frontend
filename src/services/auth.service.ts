import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

import jwtDecode from 'jwt-decode';
import * as moment from 'moment';

@Injectable()
export class AuthService {

    private apiRoot = 'http://147.182.207.208:8000/auth/';

    constructor(private http: HttpClient) { }

    private setSession(authResult) {
        const token = authResult.access;
        const payload = <JWTPayload> jwtDecode(token);
        const expiresAt = moment.unix(payload.exp);

        localStorage.setItem('token', authResult.access);
        localStorage.setItem('refresh', authResult.refresh);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    get token(): string {
        return localStorage.getItem('token');
    }
    get refresh(): string{
        return localStorage.getItem('refresh');
    }
    login(username: string, password: string) {
        return this.http.post(
            this.apiRoot.concat('login/'),
            { username, password }
        ).pipe(
            tap(response => this.setSession(response)),
            shareReplay(),
        );
    }
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('expires_at');
    }

    refreshToken() {
        if (moment().isBetween(this.getExpiration().subtract(1, 'days'), this.getExpiration())) {
            return this.http.post(
                this.apiRoot.concat('refresh-token/'),
                { refresh: this.refresh }
            ).pipe(
                tap(response => this.setSession(response)),
                shareReplay(),
            ).subscribe();
        }
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);

        return moment(expiresAt);
    }

    isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', 'Bearer '.concat(token))
            });

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        if (this.authService.isLoggedIn()) {
            this.authService.refreshToken();

            return true;
        } else {
            this.authService.logout();
            this.router.navigate(['login']);

            return false;
        }
    }
}

interface JWTPayload {
    user_id: number;
    username: string;
    email: string;
    exp: number;
}
