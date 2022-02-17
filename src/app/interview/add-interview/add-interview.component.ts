import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddTechnologyComponent } from 'src/app/add-technology/add-technology.component';
import { ApiInterfaceService } from 'src/app/services/api-interface.service';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.scss']
})
export class AddInterviewComponent implements OnInit {
  technologyArray: any[] = [];
  interviewForm: FormGroup;
  @ViewChild('picker') picker: any;
  item: any;
  interviewRoundArray = ['first', 'second', 'third', 'fourth']
  constructor(
    private api: ApiInterfaceService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 
    this.item = data;
  }

  ngOnInit(): void {
    this.getTechnology();
    this.interviewForm = this.formBuilder.group({
      candidateName: ['', [Validators.required]],
      technology: ['', [Validators.required]],
      experience: [null, [Validators.required, Validators.pattern(/^\d{0,5}(\.\d{1,5})?$/)]],
      schedule: [null, [Validators.required]],
      interviewRound: ['', [Validators.required]],
    });

    if (!!this.item) {
      this.interviewForm.patchValue(this.item.data);
    }
  }

  getTechnology() {
    this.api.get('technology/').subscribe((res: any) => {
      this.technologyArray = res.data;
    });
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

  deleteTechnology(id: string) {
    this.api.delete(`technology/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.getTechnology();
        this.snackbar.open(res.message, 'close', { duration: 2000 });
      }
    });
  }

  save() {
    if (this.interviewForm.invalid) {
      this.interviewForm.markAllAsTouched();
      return;
    }
    this.interviewForm.value.schedule = new Date(this.interviewForm.value.schedule).toISOString();
    const apiCall = this.item.type == 'edit' 
    ? this.api.put(`interview/${this.item.data._id}`, this.interviewForm.value)
    : this.api.post('interview/create', this.interviewForm.value) 
    apiCall.subscribe((res: any) => {
      if (res.success) {
        this.cancel();
        this.snackbar.open(res.message, 'close', { duration: 2000 });
      }
    });
  }

  cancel() {
    this.dialog.closeAll();
  }
}
