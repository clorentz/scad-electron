import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-cli-view',
  templateUrl: './cli-view.component.html',
  styleUrls: ['./cli-view.component.css']
})
export class CliViewComponent implements OnInit {

  constructor(private http:HttpClient) { }

  create() {
    let body = JSON.stringify({"filePath": "./drive/test.txt"});
    this.http.post('http://localhost:3000/upload/', body, httpOptions)
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
        
      });
  }

  download() {
    let body = JSON.stringify({"fileId": "1QUEhBQEF5YSSCXKjcukpDmgmHQBwqS9q"});
    this.http.post('http://localhost:3000/download/', body, httpOptions)
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
        
      });
  }
  
  delete() {
    let body = JSON.stringify({"id": 1111});
    this.http.post('http://localhost:3000/delete/', body, httpOptions)
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
        
      });
  }

  list() {
    let body = JSON.stringify({"id": 1111});
    this.http.post('http://localhost:3000/list/', body, httpOptions)
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
        
      });
  }

  clean() {
    this.http.get('http://localhost:3000/clean').subscribe(res => {
      console.log(res);
    }, 
    err => {
      console.log("Error occured: " + err);
    });
  }

  ngOnInit() {
  }

}
