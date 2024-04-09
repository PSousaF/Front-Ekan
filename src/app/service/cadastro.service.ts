import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const url = environment.API;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  params: new HttpParams
};

@Injectable({
  providedIn: 'root'
})
export class BeneficiarioService {

  constructor(private http: HttpClient) { }

  cadastraBeneficiario(data: any) {
    return this.http.post<any>(url+`/beneficiarios/cadastro`, data,  httpOptions);
  }

  listaBeneficiario() {
    return this.http.get<any>(url + `/beneficiarios/listar`, httpOptions);
  }

  docBeneficiarioPorId(userId: number) {
    return this.http.get<any>(url+`/beneficiarios/documentos/${userId}`, httpOptions);
  }

  atualizaBeneficiario(userId: number, data: any) {
    return this.http.put<any>(url + `/beneficiarios/atualiza/${userId}`, data, httpOptions);
  }

  deletarBeneficiario(userId: number) {
    return this.http.delete<any>(url + `/beneficiarios/deletar/${userId}`, httpOptions);
  }
}
