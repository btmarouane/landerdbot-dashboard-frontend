import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    error: any;

    constructor(private authService: AuthService,
                private router: Router) { }

    ngOnInit() {
    }

    login(username: string, password: string) {
        this.authService.login(username, password).subscribe(
            success => this.router.navigate(['dashboard']),
            error => this.error = error
        );
    }
}
