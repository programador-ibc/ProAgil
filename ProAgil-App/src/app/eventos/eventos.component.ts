import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { defineLocale, listLocales } from 'ngx-bootstrap/chronos';
import { ptBrLocale, arLocale, deLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

defineLocale('de', deLocale);
defineLocale('ar', arLocale);
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  
 _filtroLista: string;
  fileNameToUpdate: string;

 get filtroLista(): string {
   return this._filtroLista;
 }

 set filtroLista(value: string) {
   this._filtroLista = value;
   this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
 }

  titulo = "Eventos";
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  modoSalvar = 'post';
  bodyDeletarEvento = "";
  dataEvento: Date;
  file: File;
  dataAtual: string;

  constructor(
    private eventoService: EventoService
  , private modalService: BsModalService
  , private fb: FormBuilder
  , private localeService: BsLocaleService
  , private toastr: ToastrService
  ) {
      this.localeService.use('pt-br');
   }

  ngOnInit(): void {
    this.validation();
    this.getEventos();
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  novoEvento(template: any){
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  excluirEvento(evento: Evento, template: any){
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }


  confirmeDelete(template: any){
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastr.success('Deletado com Sucesso!');
      }, error => { 
        this.toastr.error(`Erro ao tentar Deletar: ${error}`);
      }
    );
  }

  onFileChange(event){
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  uploadImagem() {
    if (this.modoSalvar === 'post'){
      const nomeArquivo = this.evento.imagemURL.split('\\', 3)
      
      //Adiciona a data no nome para diferenciar a imagem com o mesmo nome

      const nomeArquivoAtual =new Date().getMilliseconds().toString() + nomeArquivo[2];    

      this.evento.imagemURL = nomeArquivoAtual;

      this.eventoService.postUpload(this.file, nomeArquivoAtual).subscribe( () => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      });
    }else{
      this.evento.imagemURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate).subscribe( () => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      });
    }
  }

  salvarAlteracao(template: any) {

    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          (evento: Evento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com Sucesso!');
        }, error =>
        {
          this.toastr.error(`Erro ao tentar Inserir: ${error}`);
        });
      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          (evento: Evento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com Sucesso!');
        }, error =>
        {
          this.toastr.error(`Erro ao tentar Editar: ${error}`);
        });
      }
    } 
  }


  getEventos() {
    this.eventoService.getAllEventos().subscribe((_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      //console.log(this.eventos);
    }, error => {
      this.toastr.error(`Erro ao tentar Carregar eventos: ${error}`);
    });
  }


}
