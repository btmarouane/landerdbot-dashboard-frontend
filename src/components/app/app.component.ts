import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import {response} from 'express';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'Twitter Bot Admin V1.0';
  usersForm: FormGroup;
  keywords = '';
  paramsForm: FormGroup;
  serverApi = 'http://localhost:8000/api';

  response: any;

  serverStatus = false;
  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient
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
    this.onCheckServerStatus();
    this.onFetchUsers();
    this.onFetchKeywords();
  }

  ngOnDestroy(): void {
  }

  onCheckServerStatus(): void{
    this.httpClient.get(this.serverApi + '/serverStatus')
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
    this.httpClient.post(this.serverApi + 'switchServer', `{"state": ${state}`)
        .subscribe(response => {
          this.response = response;
          this.onCheckServerStatus();
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
      },
        error => {
        this.response = error.error;
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
          },
          error => {
            this.response = error.error;
          });
  }
}
