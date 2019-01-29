import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction} from '../transaction';

@Injectable({
  providedIn: 'root'
})
export class AdminViewService {
  private url='http://172.20.10.2:3000'
  private urlAdd  = this.url+'/api/AddUser';
  private urlDelete= this.url+'/api/DeleteUser';
  public compteur=0;
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

   sliceT(timestamp) {
    var where_to_slice = 0;
    for (var g=0; g<timestamp.length; g++){
      if (timestamp[g] === "T"){
          where_to_slice = g;
      }
    };
    var date ='Day:'.concat(timestamp.slice(0,where_to_slice).concat('\n Time:'.concat(timestamp.slice(where_to_slice+1,timestamp.length-1))));
  return date;

  }


  //get transaction
  getAllAdd() {
    this.compteur=0;
    this.transactionsAdd=[];
    return new Promise((resolve,reject)=> {
      this.http.get(`${this.urlAdd}`).subscribe(
        data  => {
        var k = 0;
        while(data[k]){
            let transaction= new Transaction();
            transaction.DocumentId= this.sliceContact(data[k].document);
            transaction.User=this.sliceContact(data[k].userToAdd);
            transaction.TimeStamp=this.sliceT(data[k].timestamp);
            transaction.Type="Add Access";
            transaction.Index=this.compteur;
            this.transactionsAdd.push(transaction);
            this.compteur++;
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
      this.transactionsDelete=[]
      return new Promise((resolve,reject)=> {
        this.http.get(`${this.urlDelete}`).subscribe(
          data  => {
          var k = 0;
          while(data[k]){
              let transaction= new Transaction();
              transaction.DocumentId= this.sliceContact(data[k].document);
              transaction.User=this.sliceContact(data[k].userToDelete);
              transaction.TimeStamp=this.sliceT(data[k].timestamp);
              transaction.Type="Delete Access";
              transaction.Index=this.compteur;
              this.transactionsDelete.push(transaction);
              this.compteur++;
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

  addAtUpload(){
   
    var jsonUpload= {
      "$class": "org.example.mynetwork.Document",
      "DocumentId" : "fileID2",
      "owner": "u1",
      "description": "test",
      "UsersWithAccess": [
        "u1"
      ]
    }
    //var document=new Document();
    console.log("add upload");
    this.http.post(this.url+'/api/Document',jsonUpload).subscribe(
      data  => {
        console.log(data)
    },
      error  => { 
      console.log("Error", error); 
      }
      )
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