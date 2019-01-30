import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
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
  // myForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private apiCaller: ApiCallerService,
    private location: Location, 
    // private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.getFile();
    this.getUsers();
    // this.myForm = this.fb.group({
    //   pubKeys: this.fb.array([])
    // });
  }

  getFile(): void {
    const name = this.route.snapshot.paramMap.get('name');
    console.log(name);
    this.apiCaller.getFile(name).subscribe(
      (res: any) => {
        console.log(res);
        this.file.name = res.name;
        this.file.fileId = res.fileId;
      },
      err => {

      }
    );
  }

  getUsers(): void {
    this.apiCaller.getUsers().subscribe(
      (res: any) => {
        res.forEach(user => {
          this.users.push({"login": user.login, "pubKey": user.pubKey, checked: false});          
        });
      }
    );
  }

  addU2() {
    console.log(this.file.fileId);
    this.apiCaller.addUserBlockchain("u2", this.file.fileId);
  }

  removeU2() {
    this.apiCaller.removeUserBlockchain("u2", this.file.fileId);
  }

  // onChange(pubKey: string, isChecked: boolean) {
  //   const pubKeysFormArray = <FormArray>this.myForm.controls.pubKeys;

  //   if (isChecked) {
  //     pubKeysFormArray.push(new FormControl(pubKey));
  //   } else {
  //     let index = pubKeysFormArray.controls.findIndex(x => x.value == pubKey)
  //     pubKeysFormArray.removeAt(index);
  //   }
  // }

  changeUserRights() {
    console.log(this.users);
  }
}
