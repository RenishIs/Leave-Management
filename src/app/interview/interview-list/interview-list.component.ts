import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddInterviewComponent } from '../add-interview/add-interview.component';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss']
})
export class InterviewListComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  addInterview() {
    const dialogRef = this.dialog.open(AddInterviewComponent, {
      width: 'auto',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
