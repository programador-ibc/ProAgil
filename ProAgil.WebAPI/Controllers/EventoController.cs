using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;

        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // GET api/values
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _repo.GetAllEventoAsync(true); 

                var results = _mapper.Map<EventoDto[]>(eventos);

                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> upload()
        {
            try
            {
                var file = Request.Form.Files[0];   //obtém o arquivo do formulário
                var folderName = Path.Combine("Resources","Images"); //diretório onde eu quero armazenar
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName); //Combina o diretório onde quero armazenar mais o diretório da aplicação

                if (file.Length > 0) { //verifica se o arquivo existe
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName; //converte o arquivo e atribui na variável filename
                    var fullPath = Path.Combine(pathToSave, filename.Replace("\""," ").Trim()); //verifica se o arquivo possui aspas ou espaços e combina com o caminho completo 

                    using(var stream = new FileStream(fullPath, FileMode.Create)) //Instancia um FileStream passando os parâmetros do caminho completo em modo de criação
                    {
                        await file.CopyToAsync(stream); //copia o arquivo para o FileStream
                    } 
                }

                return Ok();
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");
            }

            //return BadRequest("Erro ao tentar realizar upload");
        }

        // GET api/values/1
        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, true); 

               var results = _mapper.Map<EventoDto>(evento);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }
        }

        // GET api/values/getByTema/angular
        [HttpGet("getByTema/{Tema}")]
        public async Task<IActionResult> Get(string Tema)
        {
            try
            {
                var eventos = await _repo.GetAllEventoAsyncByTema(Tema, true);

                var results = _mapper.Map<EventoDto[]>(eventos);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }
        }

        // GET api/values/
        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model); 

                _repo.Add(evento);

               if(await _repo.SaveChangesAsync()){
                   return Created($"/api/evento/{model.Id}",_mapper.Map<EventoDto>(evento));
               }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");
            }

            return BadRequest();
        }

        // GET api/values/
        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDto model)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, false);
                if (evento == null) return NotFound();

                var idLotes = new List<int>();
                var idRedesSociais = new List<int>();

                model.Lotes.ForEach(lote => idLotes.Add(lote.Id));
                model.RedesSociais.ForEach(redeSocial => idRedesSociais.Add(redeSocial.Id));

                // foreach (var lote in model.Lotes)
                //     idLotes.Add(lote.Id);

                // foreach (var redeSocial in model.RedesSociais)
                //     idRedesSociais.Add(redeSocial.Id);


                var lotes = evento.Lotes.Where(
                    lote => !idLotes.Contains(lote.Id))
                    .ToArray();

                var redesSociais = evento.RedesSociais.Where(
                    redeSocial => !idRedesSociais.Contains(redeSocial.Id))
                    .ToArray();

                if (lotes.Length > 0) _repo.DeleteRange(lotes);
                if (redesSociais.Length > 0) _repo.DeleteRange(redesSociais);

                _mapper.Map(model, evento);

                _repo.Update(evento);

               if(await _repo.SaveChangesAsync()){
                   return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
               }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

            return BadRequest();
        }

        // GET api/values/1
        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, false);
                if (evento == null) return NotFound();


                _repo.Delete(evento);

               if(await _repo.SaveChangesAsync()){
                   return Ok();
               }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

            return BadRequest();
        }

    }
}