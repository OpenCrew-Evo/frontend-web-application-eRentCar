 import { Component, OnInit } from '@angular/core';
 import {ClientService} from "../../../my-profile/services/client.service";

@Component({
  selector: 'app-my-rentals',
  templateUrl: './my-rentals.component.html',
  styleUrls: ['./my-rentals.component.css']
})
export class MyRentalsComponent implements OnInit {
  nameModel:String
  nameBrand:String
  mileage:number
  manual:boolean
  carYear:number
  carValue:number
  rentValue:number
  clientId !: string | null;
  rents:any
  constructor(private clientsService:ClientService) {
    this.nameModel="Huracan"
    this.nameBrand="Lamborghini"
    this.mileage=50
    this.manual=true
    this.carValue=5000
    this.carYear=2015
    this.rentValue=90
    this.clientId = localStorage.getItem('clientId');
    this.rents=[]
  }

  getRents(){
    let aux=Number(this.clientId)-4
    this.clientId=aux.toString()
    this.clientsService.getById(this.clientId).subscribe(response=>{
      this.rents=response.rents
    })
  }
  ngOnInit(): void {
    this.getRents()
  }

}
