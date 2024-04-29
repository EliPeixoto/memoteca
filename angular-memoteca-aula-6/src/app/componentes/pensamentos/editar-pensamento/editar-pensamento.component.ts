import { Router, ActivatedRoute } from '@angular/router';
import { PensamentoService } from './../pensamento.service';
import { Pensamento } from './../pensamento';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-editar-pensamento',
  templateUrl: './editar-pensamento.component.html',
  styleUrls: ['./editar-pensamento.component.css']
})
export class EditarPensamentoComponent implements OnInit {
  formulario!: FormGroup;

  pensamento: Pensamento = {
    id: 0,
    conteudo: '',
    autoria: '',
    modelo: ''
  }

  constructor(
    private service: PensamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      conteudo: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/(.|\s)*\S(.|\s)*/)
      ])],
      autoria: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        this.lowercaseValidator() 
      ])],
      modelo: ['modelo1']
    })

    
    const id = this.route.snapshot.paramMap.get('id')
    this.service.buscarPorId(parseInt(id!)).subscribe((pensamento) => {
      this.pensamento = pensamento
    })
  }


  
  editarPensamento() {
    if(this.formulario.valid){
    this.service.editar(this.pensamento).subscribe(() => {
      this.router.navigate(['/listarPensamento'])
    })
  }
  }

  cancelar() {
    this.router.navigate(['/listarPensamento'])
  }

  lowercaseValidator(): (control: FormControl) => { [key: string]: any } | null {
    return (control: FormControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && value !== value.toLowerCase()) {
        return { 'lowercase': { value: control.value } };
      }
      return null;
    };
 }

 habilitarBotao(): string {
  if(this.formulario.valid) {
    return 'botao'
  } else {
    return 'botao__desabilitado'
  }
}

}
