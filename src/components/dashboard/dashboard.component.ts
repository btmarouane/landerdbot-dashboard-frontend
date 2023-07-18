import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{
    title = 'Twitter Bot Admin V1.0';
    usersForm: FormGroup;
    keywords = '';
    paramsForm: FormGroup;
    stateForms: FormGroup;
    serverApi = 'http://147.182.207.208:8000/api';

    response: any;

    serverStatus = false;
    constructor(
        private fb: FormBuilder,
        private httpClient: HttpClient,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    )
    {
    }

    ngOnInit(): void {
        this.usersForm = this.fb.group({
            users: ['']
        });
        this.paramsForm = this.fb.group({
            keywords: ['']
        });
        this.stateForms = this.fb.group({
            state: ['']
        });
        this.onCheckServerStatus();
        this.onFetchUsers();
        this.onFetchKeywords();
    }

    ngOnDestroy(): void {
    }

    onCheckServerStatus(): void{
        this.httpClient.get(this.serverApi + '/serverStatus/')
            .subscribe(response => {
                    this.response = response;
                    this.serverStatus = this.response;
                },
                error => {
                    this.response = error.error;
                });
    }

    onSwitchServer(): void{
        const state = this.serverStatus !== true;
        this.stateForms.controls.state.setValue(state);
        const data = this.stateForms.getRawValue();
        this.httpClient.post(this.serverApi + '/serverStatus/update/', data)
            .subscribe(response => {
                    this.response = response;
                    this.onCheckServerStatus();
                    this.snackBar.open(`Bot switched to ${this.serverStatus} successfully`, 'OK');
                },
                error => {
                    this.response = error.error;
                });
    }

    onFetchUsers(): void{
        this.httpClient.get(this.serverApi + '/users/')
            .subscribe(response => {
                    this.response = response;
                    this.usersForm.controls.users.setValue(this.response);
                },
                error => {
                    console.log(error);
                    this.response = error.error;
                });
    }
    onSaveUsers(): void{
        const data = this.usersForm.getRawValue();
        this.httpClient.post(this.serverApi + '/users/update/', data)
            .subscribe(response => {
                    this.response = response;
                    this.onCheckServerStatus();
                    this.snackBar.open('Users updated successfully', 'OK');
                },
                error => {
                    this.response = error.error;
                    this.snackBar.open('Error occurred. Please try again later', 'OK');
                });
    }

    onFetchKeywords(): void{
        this.httpClient.get(this.serverApi + '/keywords/')
            .subscribe(response => {
                    this.response = response;
                    this.paramsForm.controls.keywords.setValue(this.response);
                },
                error => {
                    this.response = error.error;
                });
    }
    onSaveKeywords(): void{
        const data = this.paramsForm.getRawValue();
        this.httpClient.post(this.serverApi + '/keywords/update/', data)
            .subscribe(response => {
                    this.response = response;
                    this.onCheckServerStatus();
                    this.snackBar.open('Keywords updated successfully', 'OK');
                },
                error => {
                    this.response = error.error;
                    this.snackBar.open('Error occurred. Please try again later', 'OK');
                });
    }

    onLogOut() {
        this.authService.logout();
        this.router.navigate(['login']);
    }
}
