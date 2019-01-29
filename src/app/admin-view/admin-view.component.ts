import { Component, OnInit } from '@angular/core';
import {AdminViewService} from './admin-view.service'
import { NgModule } from '@angular/core';
import { Transaction} from '../transaction';
//import { Transaction } from '../transaction';
@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
  public transactionsAdd: Transaction[]=[];

  public testAdd=[];
  public transactionsDelete: Transaction[]=[];
  public testDelete=[];
  constructor(
    private adminviewservice: AdminViewService,

  ) { }

  ngOnInit() {
    console.log("test")
    this.adminviewservice.getAllAdd().then((value) => {
      this.testAdd.push(value);
      this.transactionsAdd=this.testAdd;
    }).catch((error)=>console.error(error));

    console.log("test 2")
    this.adminviewservice.getAllDelete().then((value) => {
      this.testDelete.push(value);
      this.transactionsDelete=this.testDelete;
    }).catch((error)=>console.error(error));
    //this.transactions = this.adminviewservice.getAll();
  }
  onClickMe(){
    console.log("onclick")
    var action='Delete'
    this.adminviewservice.addModify(action);
  }

}