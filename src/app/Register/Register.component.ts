import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AddTechnologyComponent } from '../add-technology/add-technology.component';
import { ApiInterfaceService } from '../services/api-interface.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-Register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.scss']
})
export class RegisterComponent implements OnInit {

  //To bind reactive form controls
  loginForm: FormGroup;
  rolesArray: any[] = [];
  technologyArray: any[] = [];
  interviewrId: any;
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private api: ApiInterfaceService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      technology: [[]],
      role: ['', Validators.required],
    });

    this.loginForm.get('role').valueChanges.subscribe(res => {
        if (res == this.interviewrId) {
          this.loginForm.get('technology').addValidators([Validators.required]);
        } else {
          this.loginForm.get('technology').clearValidators();
        }
        this.loginForm.get('technology').updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.getAllRoles();
    this.getTechnology();
  }

  getAllRoles() {
    this.api.get('employee/getAllRoles').subscribe((res: any) => {
      this.rolesArray = res.data;
      this.interviewrId = this.rolesArray.find(x => x.role == 'interviewer')._id;
    });
  }

  getTechnology() {
    this.api.get('technology/').subscribe((res: any) => {
      this.technologyArray = res.data;
    });
  }

  deleteTechnology(id: string) {
    this.api.delete(`technology/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.getTechnology();
        this.snackbar.open(res.message, 'close', { duration: 2000 });
      }
    });
  }

  async register() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    try {
      await this.auth.register(this.loginForm.value);
      this.router.navigateByUrl('/')
    } catch (error) {
      console.log('error: ', error);
      Swal.fire('Hi', error?.error.message, 'error')
    }
  }

  addTechnology() {
    const dialogRef = this.dialog.open(AddTechnologyComponent, {
      width: 'auto',
      hasBackdrop: false,
      id: "technology"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTechnology();
    });
  }
}
