import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _accountService: AccountService, private _toastr: ToastrService,
  private fb:FormBuilder, private _router: Router) { }
  model: any = {};
  registerForm!: FormGroup;
  @Output() cancelRegister = new EventEmitter();
  maxDate: Date = new Date();

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }
  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      userName: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country:['',Validators.required] ,
      password: ['',Validators.required],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]] 
    })
  }


  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      
      return control?.value === control?.parent?.get(matchTo)?.value ? null : {isNotMatching:true}
    }
    
  }

  register() {
  
    this._accountService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this._router.navigateByUrl('/members');
        console.log(`The register User is ${JSON.stringify(res)}`);
        this.cancel();
      },
      error: (error) => {
        this._toastr.error(error.error);
      }
  })
    console.log(JSON.stringify(this.registerForm.value));
  }
  cancel() {
    this.cancelRegister.emit(false);
  }

}
