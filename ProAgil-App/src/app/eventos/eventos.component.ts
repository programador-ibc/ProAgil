import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  
 _filtroLista: string;

 get filtroLista(): string {
   return this._filtroLista;
 }

 set filtroLista(value: string) {
   this._filtroLista = value;
   this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
 }

  eventosFiltrados: Evento[];
  eventos: Evento[];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef;

  constructor(private eventoService: EventoService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getEventos();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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

  getEventos() {
    this.eventoService.getAllEventos().subscribe((_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      console.log(this.eventos);
    }, error => {
      console.log(error);
    });
  }


}
