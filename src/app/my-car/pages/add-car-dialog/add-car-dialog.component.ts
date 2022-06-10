import {EventEmitter, Component, OnInit, Output, Optional, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CarBrandsService} from "../../../search-car/services/car-brands.service";
import {CarsService} from "../../../search-car/services/cars.service";
export interface dataClient{
  client:any
}

@Component({
  selector: 'app-add-car-dialog',
  templateUrl: './add-car-dialog.component.html',
  styleUrls: ['./add-car-dialog.component.css']
})
export class AddCarDialogComponent implements OnInit {
  categories:any
  conditions:any
  brands:any
  models:any
  address:string
  type:boolean
  carValueInDollars:string
  year:string
  mileage:string
  seating:string
  extraInformation:string
  rentAmountDay:string
  imagePath:string
  category:string
  mechanicCondition:string
  brandId:number
  modelId:number
  clientId:number
  @Output() submitClicked=new EventEmitter<any>()
  constructor(@Optional() @Inject(MAT_DIALOG_DATA)public data:dataClient,
              private carBradService:CarBrandsService,private carService:CarsService) {
    this.categories=["LITTLE","MEDIUM","LARGE","PREMIUM","MINIVAN","SUVS"]
    this.conditions=["REGULAR","GOOD","EXCELLENT"]
    this.address="Av La Marina"
    this.type=true
    this.carValueInDollars="1000"
    this.year="2022"
    this.mileage="10"
    this.seating="5"
    this.extraInformation=""
    this.rentAmountDay="50"
    this.imagePath=""
    this.category="LITTLE"
    this.mechanicCondition="GOOD"
    this.brandId=1
    this.modelId=1
    this.clientId=data.client
  }
  getBrands(){
    this.carBradService.getAll().subscribe(response=>{
      this.brands=response.content
      this.models=response.content[0].carModels
    })
  }
  change(){
    this.carBradService.getById(this.brandId).subscribe(response=>{
      this.models=response.carModels
      this.modelId=response.carModels[0].id
    })
  }
  addClick(){
    let data={
      address:this.address,
      year:Number(this.year),
      mileage:Number(this.mileage),
      seating:Number(this.seating),
      manual:this.type,
      rate: 0,
      carValueInDollars:Number(this.carValueInDollars),
      extraInformation:this.extraInformation,
      rentAmountDay:Number(this.rentAmountDay),
      imagePath:this.imagePath,
      category:this.category,
      mechanicCondition:this.mechanicCondition
    }
    console.log(data)
    this.carService.create(this.clientId,this.modelId,data).subscribe(response=>{
      console.log(response)
    })
    this.submitClicked.emit("a");
  }
  ngOnInit(): void {
    this.getBrands()
  }

}
