import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { transition, style, animate, trigger } from '@angular/animations';
import { LoginService } from 'src/app/service/login.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';


const enterTransition = transition(':enter', [
  style({
    opacity: 0
  }),
  animate('.3s ease-in', style({
    opacity: 1
  }))
]);

const leaveTrans = transition(':leave', [
  style({
    opacity: 1
  }),
  animate('.3s ease-out', style({
    opacity: 0
  }))
])

const fadeIn = trigger('fadeIn', [
  enterTransition
]);

const fadeOut = trigger('fadeOut', [
  leaveTrans
]);
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeIn, fadeOut]
})

@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl('')
  });

  refreshTimeOut:any;
  nameInput = "";
  passInput = "";
  showError = false;
  errorMsg = "";
  errorStyle = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
  ) { }
  
  ngOnInit(): void {
    this.loginService.logout();
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.router.navigate(['/lista']);
  }
  aonSubmit() {
    if(this.verifyError())
      return;
    this.showError = false;
    this.errorMsg = ""
    const user: string = this.loginForm.controls.login.value as string;
    const pass: string = this.loginForm.controls.password.value as string;

    this.loginService.login(user, pass).pipe(take(1)).subscribe(res => {
        const { data, success } = res;
        if (!success) {
          this.errorStyle = "alert-danger"
          this.errorMsg = data.error != null || data.error != "" ? data.error : "Usuário e/ou Senha inválido(s)"
          this.showError = true;
          return;
        }
        if (this.isLoggedSuccess(data.token)) {
          this.successLogin();
          return;
        }
        //this.errorMsg = data.error != null && data.error != "" ? data.error : "Erro, Contactar o Admnistrador"
      },
        erro => {
          this.errorMsg = this.errorMsg != null && this.errorMsg != "" ? this.errorMsg : "Usuário e/ou Senha inválido(s)!"
          this.errorStyle = "alert-danger"
          if(this.errorMsg != "")
            this.showError = true;
        });
       /* this.refreshTimeOut = setInterval(() => {
          this.showError = false;
        }, 4500);*/
  }

  verifyError() {
    this.errorStyle = ""
    this.errorMsg = ""
    if(this.loginForm.controls.password.value === "" && this.loginForm.controls.login.value === "") {
      this.errorStyle = "alert-warning"
      this.errorMsg = "Preencha Todos os Campos"
      this.showError = true;
      return true;
    }
    else if (this.loginForm.controls.password.value === "") {
      this.errorStyle = "lert-warning"
      this.errorMsg = "Preencha Usuario"
      this.showError = true;
      return true;
    }
    else if (this.loginForm.controls.login.value === "") {
      this.errorStyle = "lert-warning"
      this.errorMsg = "Preencha Senha"
      this.showError = true;
      return true;
    }
    return false;
  }

  successLogin() {
    this.router.navigate(['/lista']);
  }

  isLoggedSuccess(token: any): boolean {
    return token != null && token != "";
  }

  leaveError() {
    clearInterval(this.refreshTimeOut);
    this.showError = false;
  }
}
