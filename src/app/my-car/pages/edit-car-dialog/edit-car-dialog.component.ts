import {Component, EventEmitter, Inject, OnInit, Optional, Output} from '@angular/core';
import {Car} from "../../../search-car/model/car";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {CarsService} from "../../../search-car/services/cars.service";
import {CarBrandsService} from "../../../search-car/services/car-brands.service";
import {CarBrand} from "../../../search-car/model/car-brand";
import {CarModelsService} from "../../../search-car/services/car-models.service";

export interface dataClient{
  clientId:number
  car:Car
}
export interface dataCarModel{
  id:number
  name:string
  imagPath:string
  carBrand: CarBrand
}
@Component({
  selector: 'app-edit-car-dialog',
  templateUrl: './edit-car-dialog.component.html',
  styleUrls: ['./edit-car-dialog.component.css']
})
export class EditCarDialogComponent implements OnInit {
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
  carId:number
  model:dataCarModel
  @Output() submitClicked=new EventEmitter<any>()
  mode: any
  brand: any

  constructor(@Optional() @Inject(MAT_DIALOG_DATA)public data:dataClient,
              private carBradService:CarBrandsService,private carService:CarsService,
              private modelService:CarModelsService) {
    this.categories=["LITTLE","MEDIUM","LARGE","PREMIUM","MINIVAN","SUVS"]
    this.conditions=["REGULAR","GOOD","EXCELLENT"]
    this.address=data.car.address
    this.type=data.car.manual.valueOf()
    this.carValueInDollars = String(data.car.carValueInDollars)
    this.year=String(data.car.year)
    this.mileage=String(data.car.mileage)
    this.seating=String(data.car.seating)
    this.extraInformation=data.car.extraInformation
    this.rentAmountDay=String(data.car.rentAmountDay)
    this.imagePath=data.car.imagePath
    this.category=data.car.category
    this.mechanicCondition=data.car.mechanicConditions
    console.log(data.car.carModel)
    console.log(data.car.carModel.carBrand.id)
    this.brandId=data.car.carModel.carBrand.id
    this.modelId=data.car.carModel.id
    this.clientId=data.clientId
    this.carId = data.car.id
    this.model = {
      id: data.car.carModel.id,
      name: data.car.carModel.name,
      imagPath: data.car.carModel.imagePath,
      carBrand: data.car.carModel.carBrand
    }
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
  getModel(id:number){
    this.modelService.getById(id).subscribe(response =>{
      console.log(response)
      this.model.id = response.id,
      this.model.name = response.name,
      this.model.imagPath = response.imagePath

    })
    console.log(this.model)
  }
  getBrand(id:number){
    this.carBradService.getById(id).subscribe(response =>{
      this.model.carBrand.id = response.id
      this.model.carBrand.name = response.name
      this.model.carBrand.imagePath = response.imagePath
    })
    console.log(this.model)
  }
  editClick(){
    this.getBrand(this.brandId)
    this.getModel(this.modelId)
    let data={
      id:this.carId,
      address:this.address,
      year:Number(this.year),
      mileage:Number(this.mileage),
      seating:Number(this.seating),
      manual:this.type,
      carValueInDollars:Number(this.carValueInDollars),
      extraInformation:this.extraInformation,
      rate: 0,
      rentAmountDay:Number(this.rentAmountDay),
      imagePath:this.imagePath,
      category:this.category,
      mechanicCondition:this.mechanicCondition,
      carModel: this.model,
      clientId: this.clientId
    }
    console.log(data)
    this.carService.update(this.carId,this.model.id,data).subscribe(response=>{
      console.log(response)
    })
    this.submitClicked.emit("a");
  }
  ngOnInit(): void {
    this.getBrands()
  }

}
