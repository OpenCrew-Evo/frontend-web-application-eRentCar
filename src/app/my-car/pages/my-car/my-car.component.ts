import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Car} from "../../../search-car/model/car";
import {ClientService} from "../../../my-profile/services/client.service";
import {MatDialog} from "@angular/material/dialog";
import {EditCarDialogComponent} from "../edit-car-dialog/edit-car-dialog.component";
import {CarsService} from "../../../search-car/services/cars.service";
import {CarModelsService} from "../../../search-car/services/car-models.service";
import {CarBrandsService} from "../../../search-car/services/car-brands.service";
import {AddCarDialogComponent} from "../add-car-dialog/add-car-dialog.component";

@Component({
  selector: 'app-my-car',
  templateUrl: './my-car.component.html',
  styleUrls: ['./my-car.component.css']
})
export class MyCarComponent implements OnInit {
  clientId !: string | null;
  clientCars!: Car[];
  cars:any
  clientIdAux:number

  constructor(private clientsService:ClientService,
              private carsService: CarsService,
              private carModelsService: CarModelsService,
              private carBrandsService: CarBrandsService,
              private editCarDialog: MatDialog,public dialog:MatDialog) {
    this.clientId = localStorage.getItem('clientId');
    this.cars=[]
    this.clientIdAux=Number(this.clientId)-4
  }
  getCars(){
    this.clientId=this.clientIdAux.toString()
    this.clientsService.getById(this.clientId).subscribe(response=>{
      this.cars=response.cars
      console.log(this.cars)
      console.log("aaaa")
    })
  }
  ngOnInit(): void {
    this.getCars();
  }

  /*getCars(): void {
    this.carsService.getCarsByClientId(this.clientId).subscribe((response: any) => {
      this.clientCars = response.content;

      for (let i = 0; i < this.clientCars.length; i++) {
        this.getModelName(i, this.clientCars[i].carModelId);
      }
    });
  }

  getModelName(index: number, carModelId: number): any {
    this.carModelsService.getById(carModelId).subscribe((response: any) => {
      this.clientCars[index].model = response.name;
      this.getBrandName(index, response.carBrandId);
    });
  }

  getBrandName(index: number, carBrandId: number): any {
    this.carBrandsService.getById(carBrandId).subscribe((response: any) => {
      this.clientCars[index].brand = response.name;
    });
  }*/
  openAddCarDialog(){
    const dialogRef=this.dialog.open(AddCarDialogComponent,{data:{client:this.clientId}})
    dialogRef.componentInstance.submitClicked.subscribe(result=>{
      this.getCars()
    })
  }
  openEditDialogCar(): void {
    /*const car: Car = {
      id: uuid(),
      address: "",
      brand: "",
      year: 2021,
      model: "",
      mileage: 0,
      seating: 4,
      manual: true,
      carValueInDollars: 0,
      extraInformation: "",
      imagePath: "car.png",
      rate: 0,
      rentAmountDay: 0,
      clientId: this.clientId
    }*/

    const dialogRef = this.editCarDialog.open(EditCarDialogComponent, {
      width: "400px",
      data: {
        //car: car,
        clientId: this.clientId,
        edit: false
      }
    });

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response !== undefined) {
        this.clientCars = this.clientCars.concat(response);
      }
    })
  }


}
