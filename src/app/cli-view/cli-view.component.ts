import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiCallerService } from './api-caller.service';
import { File } from './File';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-cli-view',
  templateUrl: './cli-view.component.html',
  styleUrls: ['./cli-view.component.css']
})
export class CliViewComponent implements OnInit {
  files : File[] = new Array();
  selectedFile: File;
  constructor(private http:HttpClient, private apiCallerService: ApiCallerService) { 
    this.getFileList();
  }

  download(name) {
    this.apiCallerService.download(name);
  }
  
  delete(name) {
    this.apiCallerService.delete(name);
  }

  list() {
    console.log(this.apiCallerService.list());
  }

  clean() {
    this.apiCallerService.clean();
  }

  getFileList() {
    this.apiCallerService.list()
    .subscribe(
      (res: any) => {
        res.forEach(file => {
           this.files.push({name: file.name, fileId: file.fileId, keyId: file.keyId});
        });
  
      },
      err => {
        console.log("Error occured");
        
      });
  }

  onSelect(file: File): void {
    this.selectedFile = file;
  }

  ngOnInit() {
  }

}
