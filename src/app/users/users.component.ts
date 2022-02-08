import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiInterfaceService } from '../services/api-interface.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  user = this.auth.getUser();

  users: any[] = [];

  constructor(public auth: AuthService,
    private _snackBar: MatSnackBar,
    private api: ApiInterfaceService,
  ) { }

  async ngOnInit() {
    await this.get();
  }

  private async get() {
    try {
      const res: any = await this.api.get('leaveManagement/users/', true).toPromise();
      this.users = res?.data;
    } catch (e) {
      this._snackBar.open(e?.error.message);
    }
  }

  async delete(id){
    try {
      const res: any = await this.api.delete('leaveManagement/deleteUser/' + id, true).toPromise();
      await this.get();
    } catch (e) {
      this._snackBar.open(e?.error.message)
    }
  }

}
