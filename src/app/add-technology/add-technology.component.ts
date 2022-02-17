import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiInterfaceService } from '../services/api-interface.service';

@Component({
  selector: 'app-add-technology',
  templateUrl: './add-technology.component.html',
  styleUrls: ['./add-technology.component.scss']
})
export class AddTechnologyComponent implements OnInit {

  form: FormGroup;
  technologyArray: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private api: ApiInterfaceService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      technologyName: ['', [Validators.required]]
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.api.post('technology/create', { technologyName: this.form.value.technologyName }).subscribe((res: any) => {
      if (res.success) {
        this.cancel();
        this.snackbar.open(res.message, 'close', { duration: 2000 });
      }
    });
  }

  cancel() {
    const data = this.dialog.getDialogById("technology");
    data.close();
  }

}
