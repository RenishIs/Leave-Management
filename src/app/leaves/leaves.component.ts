import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiInterfaceService } from '../services/api-interface.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent {
  user = this.auth.getUser();

  leaves: any[] = [];
  users: any[] = [];
  all: any[] = [];

  constructor(public auth: AuthService,
    private _snackBar: MatSnackBar,
    private api: ApiInterfaceService,
  ) { }

  async ngOnInit() {
    await this.getUsers();
    try {
      const res: any = await this.api.get('leaveManagement/leaves', true).toPromise();
      this.leaves = res?.data;
      this.all = this.leaves;
    } catch (e) {
      this._snackBar.open(e?.error.message)
    }

  }
  async getUsers() {
    try {
      const res: any = await this.api.get('leaveManagement/users', true).toPromise();
      this.users = res?.data;

    } catch (e) {
      this._snackBar.open(e?.error.message)
    }

  }


  getUserName(id) {
    let rightUser = this.users.find(_ => _._id === id);
    return rightUser?.firstName + " " + rightUser?.lastName;
  }

  getDates(item) {
    let date = item.dates.map(_ => _.date);
    date.join(",");
  }

  setType(event) {
    if (event.value === "null") {
      this.leaves = this.all;
    } else {
      this.leaves = this.all.filter(_ => _.user_id === event.value._id)
    }
  }
}
