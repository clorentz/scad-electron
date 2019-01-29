import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction} from '../transaction';

@Injectable({
  providedIn: 'root'
})
export class AdminViewService {
  private url='http://192.168.43.176:3000/api';
  private urlAdd  = this.url + '/AddUser';
  private urlDelete= this.url + '/DeleteUser';
  //public transactionC :  TransactionComponent;
  public transactionsAdd: Transaction[]=[];
  public transactionsDelete: Transaction[]=[];
  constructor(private http: HttpClient) { }
  
 sliceContact(contact){
    var where_to_slice = 0;
    for (var g=0; g<contact.length; g++){
      if (contact[g] === "#"){
          where_to_slice = g;
      }
    };
  return contact.slice(where_to_slice+1,contact.length)
  }

  //get transaction
  getAllAdd() {
    return new Promise((resolve,reject)=> {
      this.http.get(`${this.urlAdd}`).subscribe(
        data  => {
        var k = 0;
        while(data[k]){
            let transaction= new Transaction();
            transaction.DocumentId= this.sliceContact(data[k].document);
            transaction.User=this.sliceContact(data[k].userToAdd);
            transaction.Timestamp = data[k].timestamp;
            this.transactionsAdd.push(transaction);
            k++;
          }  
          resolve(this.transactionsAdd);
        },
        error  => {
          reject(error)
        console.log("Error", error); 
        }
        )
      });
    }

    getAllDelete() {
      return new Promise((resolve,reject)=> {
        this.http.get(`${this.urlDelete}`).subscribe(
          data  => {
          console.log('data delete')
          console.log(data)
          var k = 0;
          while(data[k]){
              let transaction= new Transaction();
              transaction.DocumentId= this.sliceContact(data[k].document);
              transaction.User=this.sliceContact(data[k].userToDelete);
              transaction.Timestamp = data[k].timestamp;
              this.transactionsDelete.push(transaction);
              k++;
            }  
            resolve(this.transactionsDelete);
          },
          error  => {
            reject(error)
          console.log("Error", error); 
          }
          )
        });
      }
   
   /*var json=[{
      "$class": "org.example.mynetwork.Document",
      "DocumentId": "J",
      "owner": "resource:org.example.mynetwork.User#u1",
      "description": "string",
      "UsersWithAccess": [
          "resource:org.example.mynetwork.User#u2"
      ]
  },
  {
      "$class": "org.example.mynetwork.Document",
      "DocumentId": "string2",
      "owner": "resource:org.example.mynetwork.User#u1",
      "description": "string",
      "UsersWithAccess": [
          "resource:org.example.mynetwork.User#u2",
          "resource:org.example.mynetwork.User#u3"
      ]
  }
];*/
  
  
    
 //return this.transactions
   //var result=this.http.get(`${this.url}`);


  //post transaction 

  addAtUpload(/*document: Document*/){
   
    var jsonUpload= {
      "$class": "org.example.mynetwork.Document",
      "DocumentId" : "string",
      "owner": {},
      "description": "string",
      "UsersWithAccess": [
        {}
      ]
    }
    var jsonSend={uri: 'http://localhost:3000/api/Document', json: jsonUpload}
    
    //var document=new Document();
    console.log("add upload");
    console.log(jsonSend);
    this.http.post('http://localhost:3000/api/Document',jsonUpload);
  }

  //actions Delete or Add +User
  addModify(action){
    var jsonModify={
      "$class": "org.example.mynetwork.AddUser",
      "document": {},
      "userToAdd": {},
    }
    var jsonSend={uri:  'http://localhost:3000/api/'+action, json: jsonModify}
    var document=new Document();
    console.log("add modify");
    console.log(jsonSend)
    return this.http.post(`${this.url}`,document);
  }

}