import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './view/login/login.component';
import { DefaultComponent } from './components/default/default.component';
import { ListaComponent } from './view/lista/lista.component';

const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  {path: 'login', component: LoginComponent, data: { title: 'Login' }},
  {
    path: 'lista', component: DefaultComponent, data: { title: 'Lista' },
    children: [
      { path: '', component: ListaComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
