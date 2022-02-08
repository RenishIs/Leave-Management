import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss']
})
export class LoginComponent implements OnInit {
  //To bind reactive form controls
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }


  async login() {
    try {
      await this.auth.signIn((this.loginForm.value.email)?.trim(), this.loginForm.value.password);
      this.router.navigateByUrl('/')
    } catch (error) {
      console.log('error: ', error);
      Swal.fire('Hi',error?.error.message, 'error')
    }
  }
}
