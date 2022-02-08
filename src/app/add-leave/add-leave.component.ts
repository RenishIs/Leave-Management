import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiInterfaceService } from '../services/api-interface.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddLeaveComponent implements OnInit {

  user = this.auth.getUser();

  //To bind reactive form controls
  loginForm: FormGroup;
  maxDate = new Date();

  selectedDate;

  daysSelected: any[] = [];
  event: any;


  constructor(
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private api: ApiInterfaceService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {

    this.loginForm = this.formBuilder.group({
      reason: ['', Validators.required],
      dates: [],
      noOfLeaves: [],
      user_id: [this.user?._id]
    });
  }

  holidayFilter(d: Date) {
    const day = d?.getDay();
    /* Prevent Saturday and Sunday for select. */
    return day !== 0 && day !== 6;
  }
  ngOnInit() {
  }


  async login() {
    console.log('daysSelected: ', this.daysSelected);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      try {
        this.loginForm.value.dates = this.daysSelected;
        this.loginForm.value.noOfLeaves = this.noOfLeave(this.daysSelected);
        await this.api.post('leaveManagement/addLeave', this.loginForm.value, true).toPromise();
        this.router.navigateByUrl('/home')
      } catch (error) {
        console.log('error: ', error);
        Swal.fire('Hi',error?.error.message, 'error')
      }
    }
  }
  
  noOfLeave(daysSelected: any[]): any {
    let full = daysSelected.filter((item) => {
      return item.isFull;
    })

    let half = daysSelected.filter((item) => {
      return !item.isFull;
    })
    return full.length + (half.length / 2)
  }



  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.daysSelected.find(x => x?.date === date) ? "selected" : null;
  };

  select(event: any, calendar: any) {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.daysSelected.findIndex(x => x?.date === date);
    if (index < 0) {
      this.daysSelected.push({
        date: date,
        isFull: true
      });
    }
    else {
      this.daysSelected.splice(index, 1);
    }
    console.log('daysSelected: ', this.daysSelected);

    calendar.updateTodaysDate();
  }

  setType(event, item) {
    item.isFull = event.value === 'false' ? false : true;
  }
}
