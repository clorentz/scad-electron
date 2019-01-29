import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiCallerService } from '../api-caller.service';
import { File } from '../File';
import {User } from './User';

@Component({
  selector: 'app-file-rights',
  templateUrl: './file-rights.component.html',
  styleUrls: ['./file-rights.component.css']
})
export class FileRightsComponent implements OnInit {

  file: File = new File();
  users: User[] = new Array();

  constructor(private route: ActivatedRoute,
    private apiCaller: ApiCallerService,
    private location: Location) { }

  ngOnInit() {
    this.getFile();
    this.getUsers();
  }

  getFile(): void {
    const name = +this.route.snapshot.paramMap.get('name');
    this.apiCaller.getFile(name).subscribe(
      (res: any) => {
        this.file.name = res.name;
      },
      err => {

      }
    );
  }

  getUsers(): void {
    this.apiCaller.getUsers().subscribe(
      (res: any) => {
        res.forEach(user => {
          this.users.push({"login": user.login, "pubKey": user.pubKey});          
        });
      }
    );
  }
}
