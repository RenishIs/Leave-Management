import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user;
  constructor(
    public auth: AuthService,
  ) { }


  ngOnInit(): void {
    this.auth.localStorageBehaviour.subscribe(res => {
        this.user = this.auth.getUser();
    });
  }

  get checkRole() {
    return (this.user && (this.user?.role == 'hr' || this.user?.role == 'admin'))
  }

}
