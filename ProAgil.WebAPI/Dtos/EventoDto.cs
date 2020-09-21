using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Campo obrigatório")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Local entre 3 e 100 caracteres")]
        public string Local { get; set; }

        //No curso não foi especificado que o tipo da DataEvento deve ser DateTime e não string como foi dito nos vídeos
        //Apenas na seção de perguntas e respostas: https://www.udemy.com/course/angular-dotnetcore-efcore/learn/lecture/13945944#questions/9898824
        //Outro detalhe percebido, foi que ao definir o tipo DateTime tenho que importar a biblioteca System.

        public DateTime DataEvento { get; set; }

        [Required (ErrorMessage = "O tema deve ser preenchido!")]
        public string Tema { get; set; }

        [Range(2, 120000, ErrorMessage = "Quantidade de pessoas é entre 2 e 120000")]
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }

        [Phone]
        public string Telefone { get; set; }
        
        [EmailAddress]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }        
    }
}