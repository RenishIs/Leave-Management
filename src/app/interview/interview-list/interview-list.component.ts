import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiInterfaceService } from 'src/app/services/api-interface.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocketMessageService } from 'src/app/services/socket-message.service';
import { AddInterviewComponent } from '../add-interview/add-interview.component';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss']
})
export class InterviewListComponent implements OnInit {
  interviewList: any[] = [];
  user: any;

  constructor(
    private dialog: MatDialog,
    private api: ApiInterfaceService,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private socketMessageService: SocketMessageService
  ) {
    this.socketMessageService.on('accepted').subscribe(res => {
      this.getAllInterview();
    });
   }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.getAllInterview();
  }

  getAllInterview() {
    this.api.get('interview/').subscribe((res: any) => {
      if (res.success) {
        this.interviewList = res.data;
      }
    });
  }

  addInterview(item?: any, type?: any) {
    const dialogRef = this.dialog.open(AddInterviewComponent, {
      width: '350px',
      hasBackdrop: false,
      data: (!!item) ?
        {
          data: item,
          type: type
        }
        : null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllInterview();
    });
  }

  deleteInterview(id: any) {
    this.api.delete(`interview/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.snackbar.open(res.message, 'close', { duration: 2000 });
        this.getAllInterview();
      }
    });
  }

  acceptInterview(id: any) {
    this.api.put(`interview/acceptInterview/${id}`, { interviewer: this.user._id }).subscribe((res: any) => {
      if (res.success) {
        this.snackbar.open(res.message, 'close', { duration: 2000 });
        this.socketMessageService.emit('acceptInterview', []);
        this.getAllInterview();
      }
    });
  }
}
