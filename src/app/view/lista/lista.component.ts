import { Component, Injectable, OnInit } from '@angular/core';
import { transition, style, animate, trigger } from '@angular/animations';
import { BeneficiarioService } from 'src/app/service/cadastro.service';
import { Router } from '@angular/router';
import { take, catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';

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

interface InputModel {
  valor: string;
  placeholder: string;
}

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  animations: [fadeIn, fadeOut]
})

@Injectable({
  providedIn: 'root'
})

export class ListaComponent implements OnInit {
  inputsDocs: InputModel[] = [];
  noData:boolean = false;
  noDataDoc:boolean = false;
  deleteItem:boolean = false;
  modalAberto:boolean = false;
  alertShow:boolean = false;
  errorOnSave:boolean = false;
  addBtnDoc:boolean = false;
  loadingDoc:boolean = false;
  modalTitulo: string = "Novo ";
  botaoModal:string = "Cadastrar";
  nomeValor: string = "";
  telValor: string = "";
  nascValor: string = "";
  alertStyle: string = "";
  alertMsg: string = "";
  salvaData: string = "";
  idValor: number = 0;
  tipo: number = 0;
  cont:number = 1;
  data:any;
  dataDoc:any;

  constructor(
    private services: BeneficiarioService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getListabeneficiarios();
  }

  abrirModal(item:number, id: number= 0, nome: string= '', tel: string= '', nasc: string= ''): void {
    this.tipo = item;
    this.addBtnDoc = false;
    this.cont = 1;
    this.inputsDocs = [];
    this.errorOnSave = false;
    switch (item) {
      case 1:
        this.modalTitulo = "Novo "
        this.botaoModal = "Cadastrar"
        this.deleteItem = false;
        this.coletaBeneficiario();
        break;  

      case 2:
        this.modalTitulo = "Deletar "
        this.botaoModal = "Deletar"
        this.deleteItem = true;
        this.addBtnDoc = true;
        this.coletaBeneficiario(id, nome, tel, nasc);
        break;
  
      case 3:
        this.modalTitulo = "Atualizar "
        this.botaoModal = "Salvar"
        this.deleteItem = false;
        this.addBtnDoc = true;
        this.coletaBeneficiario(id, nome, tel, nasc);
        break;

      default:
        this.modalTitulo = "Novo "
        this.botaoModal = "Cadastrar"
    }

    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.getListabeneficiarios();
  }

  exeModal() {

  }

  coletaBeneficiario(id: number= 0, nome: string= '', tel: string= '', nasc: string= '') {
    this.idValor = id;
    this.nomeValor = nome;
    this.telValor = tel;
    this.nascValor = nasc;
  }
  submitItem() {
    switch (this.tipo) {
      case 1:
        this.cadastrarBeneficiario(this.idValor, this.nomeValor, this.telValor, this.nascValor);
        break;
      
      case 2:
        this.deletarBeneficiario(this.idValor);
        break;  

      case 3:
        this.atualizarBeneficiario(this.idValor, this.nomeValor, this.telValor, this.nascValor);
        break;

    
      default:
        this.cadastrarBeneficiario(this.idValor, this.nomeValor, this.telValor, this.nascValor);
    }
  }

  adicionarDoc() {
   // this.inputsDocs.push('');  //('','')
    const novoInput1: InputModel = { valor: ``, placeholder: `Tipo` };
    const novoInput2: InputModel = { valor: ``, placeholder: `Descrição` };
    this.inputsDocs.push(novoInput1, novoInput2);
    this.cont++;
  }

  apagaDoc(i: number): void {
    this.inputsDocs.splice(i, 1);
  }

  pegarValores() {
    // Aqui você pode acessar os valores dos inputs
    console.log(this.inputsDocs.map(input => input.valor));
  }

  formatarTelefone(telefone: string) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  formatarData(data: string){
    const dataObj = new Date(data);
    return this.datePipe.transform(dataObj, 'dd/MM/yyyy');
  }
  
  validaNome(event: any) {
    event.target.value.length > 3 ? (this.cleanDataErro(), this.errorOnSave = false) : this.dataErro("OPS! Nome tem menos de três caracteres")
  }

  validaTelefone(event: any) {
    const TelNumero = event.target.value.replace(/[^0-9]/g, '');
    TelNumero.length === 11 ? (this.cleanDataErro(), this.errorOnSave = false) : this.dataErro("OPS! Número de telefone parece estar inválido")
  }

  validaData(event: any) {
    this.salvaData = ''
      const ajusteDataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    
      if (!ajusteDataRegex.test(event.target.value)) {
        return ;
      }

      const [dia, mes, ano] = event.target.value.split('/').map(Number);
      this.salvaData = ano+'-'+mes.toString().padStart(2, '0') +'-'+dia.toString().padStart(2, '0');
      const date = new Date(ano, mes - 1, dia);
    
        (date.getFullYear() === ano &&
        date.getMonth() === mes - 1 &&
        date.getDate() === dia) ? (this.cleanDataErro(), this.errorOnSave = false) : this.dataErro("OPS! Data parece estar inválida")
}

  dataErro(texto:string) {
    this.salvaData = ''
    this.alertStyle = "alert-warning";
    this.alertMsg = texto;
    this.alertShow = true;
    this.errorOnSave = true;
  }

  cleanDataErro() {
    setTimeout(() => {
      this.alertStyle = "";
      this.alertMsg = "";
      this.alertShow = false;
    }, 1500);
  }

  /***********************************************Requests*************************************************************/

  getListabeneficiarios() {
    this.noData = false
    this.data = []
    this.services.listaBeneficiario().pipe(take(1)).subscribe(res => {
      this.data  = res;
      res == 0 ? this.noData = true : this.noData = false
  })
  }

  exibirDocumentos(id: number): void {
    this.noDataDoc = false
    this.loadingDoc = true;
    this.services.docBeneficiarioPorId(id).pipe(
      switchMap((res) => {
        this.dataDoc = res;
        this.loadingDoc = false;
        this.dataDoc == 0 ? this.noDataDoc = true : this.noDataDoc = false
        return [];
      }),
      catchError((error) => {
        console.error('Erro na requisição:', error);
        this.dataDoc = 'Erro ao carregar os dados';
        return throwError(error);
      }),
    ).subscribe(() => {
      this.loadingDoc = false;
      this.dataDoc == 0 ? this.noDataDoc = true : this.noDataDoc = false
    });
  }

  cadastrarBeneficiario(id:number, nome:string, tel:string, nasc:string) {
    let tempObjeto: { tipo_Documento?: string, descricao?: string } = {};
    let documentoLista:{ tipo_Documento?: string, descricao?: string }[] = [];
        this.inputsDocs.forEach(obj => {
          if (obj.placeholder === 'Tipo') {
              tempObjeto.tipo_Documento = obj.valor;
          } else if (obj.placeholder === 'Descrição') {
              tempObjeto.descricao = obj.valor;
              documentoLista.push({ ...tempObjeto });
          }
      });
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); 
      const dia = hoje.getDate().toString().padStart(2, '0'); 
      const saveJson: any = {
        id: null,
        name: nome,  
        telefone: tel,
        data_Nascimento: this.salvaData,
        data_Inclusao: ano+'-'+mes +'-'+dia,
        data_Atualizacao:  ano+'-'+mes +'-'+dia,
        documentoLista: documentoLista
      };
      console.log(saveJson)
      if(id > 0) {      
        this.services.atualizaBeneficiario(id, saveJson).pipe(take(1)).subscribe(res => {
        this.alertStyle = "alert-success";
        this.alertMsg = "Atualizado com sucesso";
        this.alertShow = true;
        this.errorOnSave = true;
        this.fecharModal();
      });
      setTimeout(() => {
        this.alertStyle = "";
        this.alertMsg = "";
        this.alertShow = false;
      }, 1500);''}
      else {
      this.services.cadastraBeneficiario(saveJson).pipe(take(1)).subscribe(res => {
        this.alertStyle = "alert-success";
        this.alertMsg = "Cadastrado com sucesso";
        this.alertShow = true;
        this.errorOnSave = true;
        this.fecharModal();
      });
      setTimeout(() => {
        this.alertStyle = "";
        this.alertMsg = "";
        this.alertShow = false;
      }, 1500);''
    }
  }
  atualizarBeneficiario(id:number, nome:string, tel:string, nasc:string) {
    let tempObjeto: { tipo_Documento?: string, descricao?: string } = {};
    let documentoLista:{ tipo_Documento?: string, descricao?: string }[] = [];
        this.inputsDocs.forEach(obj => {
          if (obj.placeholder === 'Tipo') {
              tempObjeto.tipo_Documento = obj.valor;
          } else if (obj.placeholder === 'Descrição') {
              tempObjeto.descricao = obj.valor;
              documentoLista.push({ ...tempObjeto });
          }
      });
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); 
      const dia = hoje.getDate().toString().padStart(2, '0'); 
      const saveJson: any = {
        id: null,
        name: nome,  
        telefone: tel,
        data_Nascimento: this.salvaData,
        data_Inclusao: ano+'-'+mes +'-'+dia,
        data_Atualizacao:  ano+'-'+mes +'-'+dia,
        documentoLista: documentoLista
      };
      console.log(saveJson)
      if(id > 0) {      
        this.services.atualizaBeneficiario(id, saveJson).pipe(take(1)).subscribe(res => {
        this.alertStyle = "alert-success";
        this.alertMsg = "Atualizado com sucesso";
        this.alertShow = true;
        this.errorOnSave = true;
        this.fecharModal();
      });
      setTimeout(() => {
        this.alertStyle = "";
        this.alertMsg = "";
        this.alertShow = false;
      }, 1500);''}
      else {
      this.services.cadastraBeneficiario(saveJson).pipe(take(1)).subscribe(res => {
        this.alertStyle = "alert-success";
        this.alertMsg = "Cadastrado com sucesso";
        this.alertShow = true;
        this.errorOnSave = true;
        this.fecharModal();
      });
      setTimeout(() => {
        this.alertStyle = "";
        this.alertMsg = "";
        this.alertShow = false;
      }, 1500);''
    }
  }
  deletarBeneficiario(id:number) {
    this.services.deletarBeneficiario(id).pipe(take(1)).subscribe(res => {
        this.alertStyle = "alert-success";
        this.alertMsg = "Deletado com sucesso";
        this.alertShow = true;
        this.errorOnSave = true;
        this.fecharModal();
    });
    setTimeout(() => {
      this.alertStyle = "";
      this.alertMsg = "";
      this.alertShow = false;
    }, 1500);
  }


}
