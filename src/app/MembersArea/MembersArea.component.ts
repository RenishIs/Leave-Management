import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
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
      Swal.fire('Hi',e?.error.message, 'error')
    }
  }

  async delete(id) {
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
          const res: any = await this.api.delete('leaveManagement/deleteLeave/' + id, true).toPromise();
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

  getDates(item) {
    debugger
    let date = item.map(_ => _.date);
    return date.join(",");
  }

}
