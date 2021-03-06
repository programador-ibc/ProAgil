import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService
            , public router: Router
            , private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  showMenu() {
    return this.router.url !== "/user/login";
  }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.toastr.show("Logout");
    this.router.navigate(["/user/login"]);
  }

  entrar() {
    this.router.navigate(["/user/login"]);
  }

  Username() {
    return sessionStorage.getItem("username");
  }

}
