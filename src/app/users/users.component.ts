import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
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
      Swal.fire('Hi',e?.error.message, 'error')
    }
  }

  async delete(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then(async (result) => {
      if (result.value) {
        try {
          const res: any = await this.api.delete('leaveManagement/deleteUser/' + id, true).toPromise();
          await this.get();
        } catch (e) {
          Swal.fire('Hi',e?.error.message, 'error')
        }
        Swal.fire(
          'Removed!',
          'removed successfully.',
          'success'
        )
      } 
    })
  
  }

}
