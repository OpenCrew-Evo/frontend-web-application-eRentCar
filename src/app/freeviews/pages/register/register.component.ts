import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "../../../my-profile/services/client.service";
import {MatStepper} from "@angular/material/stepper";
import {AuthService} from "../../../api/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  showPassword: Boolean = false;
  userNameAndPasswordForm: FormGroup;
  personalInformationForm: FormGroup;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder,
              private clientService: ClientService,
              private authService: AuthService) {
      this.userNameAndPasswordForm = this.formBuilder.group({
        userName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern("^(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$")]],
        password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"), Validators.minLength(8)]]
      });

      this.personalInformationForm = this.formBuilder.group({
        names: ["", [Validators.required, Validators.maxLength(30)]],
        lastNames: ["", [Validators.required, Validators.maxLength(30)]],
        address: ["", [Validators.required, Validators.maxLength(50)]],
        cellphoneNumber: ["", [Validators.required, Validators.pattern("^(9)([0-9]){8}$")]],
        pathImageProfile: ["", [Validators.required]]
      });
  }

  ngOnInit(): void {}

  validateUser(stepper: MatStepper) {
    this.authService.register(
      {
        username: this.userNameAndPasswordForm.value.userName,
        email: this.userNameAndPasswordForm.value.email,
        password: this.userNameAndPasswordForm.value.password,
        roles: [
          "ROLE_USER"
        ]
      }
    ).subscribe((response: any) => {
      if (response.id !== null) {
        localStorage.setItem("userId", JSON.stringify(response.id));
        stepper.next();
      }
      else {
        alert('The username already exist');
      }
    });
  }

  registerClient(stepper: MatStepper) {
    const newClient: any = {
      names: this.personalInformationForm.value.names,
      lastNames: this.personalInformationForm.value.lastNames,
      address: this.personalInformationForm.value.address,
      cellphoneNumber: this.personalInformationForm.value.cellphoneNumber,
      imagePath: this.personalInformationForm.value.pathImageProfile,
      averageResponsibility: -1,
      responseTime: -1,
      rate: -1,
      userId: JSON.parse(<string>localStorage.getItem("userId"))
    }

    this.clientService.create(newClient).subscribe((response: any) => {
      localStorage.setItem("clientId", response.id);
      stepper.next();
    });
  }
}
