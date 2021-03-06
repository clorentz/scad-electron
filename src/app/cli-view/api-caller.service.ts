import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiCallerService {

  constructor(private http: HttpClient) { }

  public upload(files: Set<File>): {[key:string]:Observable<number>} {
    // this will be the our resulting map
    const status = {};
    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', "http://localhost:3002/upload", formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });
      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });
    // return the map of progress.observables
    return status;
  }

  download(name) {
    let body = JSON.stringify({"name": name});
    this.http.post('http://localhost:3002/download/', body, httpOptions)
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
        
      });
  }
  
  delete(name) {
    let body = JSON.stringify({"name": name});
    this.http.post('http://localhost:3002/delete/', body, httpOptions)
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
    return this.http.post('http://localhost:3002/list/', body, httpOptions);
  }

  clean() {
    this.http.get('http://localhost:3002/clean').subscribe(res => {
      console.log(res);
    }, 
    err => {
      console.log("Error occured: " + err);
    });
  }

  getFile(name) {
    let body = JSON.stringify({"name": name});
    return this.http.post('http://localhost:3002/getFile/', body, httpOptions);
  }

  getUsers() {
    return this.http.get('http://localhost:3002/getUsers');
  }

  addUserBlockchain(name, file) {
    let body = JSON.stringify({ 
      '$class': 'org.example.mynetwork.AddUser',
      "document": file.toString(),
      "userToAdd": name.toString() 
    });
    this.http.post("http://192.168.43.176:3000/api/AddUser", body, httpOptions).subscribe(res => {
      console.log("Operation on blockchin successful");
    }, err => {
      console.error(err);
    }
    
    );
  }

  removeUserBlockchain(name, file) {
    let body = JSON.stringify({ 
      '$class': 'org.example.mynetwork.DeleteUser',
      "document": file.toString(),
      "userToDelete": name.toString()
    });
    this.http.post("http://192.168.43.176:3000/api/DeleteUser", body, httpOptions).subscribe(res => {
      console.log("Operation on blockchin successful");
    });
  }
}
