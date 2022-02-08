import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiInterfaceService } from '../services/api-interface.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-MembersArea',
  templateUrl: './MembersArea.component.html',
  styleUrls: ['./MembersArea.component.scss']
})
export class MembersAreaComponent implements OnInit {

  user = this.auth.getUser();

  leaves: any[] = [];

  constructor(public auth: AuthService,
    private _snackBar: MatSnackBar,
    private api: ApiInterfaceService,
  ) { }

  async ngOnInit() {
    await this.get();
  }

  async get() {
    try {
      const res: any = await this.api.get('leaveManagement/getLeavesById/' + this.user._id, true).toPromise();
      this.leaves = res?.data;
    } catch (e) {
      this._snackBar.open(e?.error.message);
    }
  }

  async delete(id) {
    try {
      const res: any = await this.api.delete('leaveManagement/deleteLeave/' + id, true).toPromise();
      await this.get();
    } catch (e) {
      this._snackBar.open(e?.error.message)
    }
  }

  getDates(item) {
    debugger
    let date = item.map(_ => _.date);
    return date.join(",");
  }

}
