using AutoMapper;
using Study.Core.DTOs;
using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using Study.Core.Interface.InterfaceRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Study.Core.Interface.IntarfaceService.ITranscriptService;

namespace Study.Service
{

    public class TranscriptService : ITranscriptService
    {
        readonly IRepository<Transcript> _transcriptRepository;
        readonly IMapper _mapper;
        readonly IReposiroryManager  _repositoryManager;


        public TranscriptService(IRepository<Transcript> transcriptRepository, IMapper mapper, IReposiroryManager repositoryManager)
        {
            _transcriptRepository = transcriptRepository;
            _mapper = mapper;
            _repositoryManager = repositoryManager;
        }

        public async Task<IEnumerable<TranscriptDTO>> GetAllTranscriptAsync()
        {
            var transcripts =await _transcriptRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<TranscriptDTO>>(transcripts);
        }

        public async Task<TranscriptDTO> GetTranscriptByIdAsync(int id)
        {
            var transcript =await _transcriptRepository.GetByIdAsync(id);
            return _mapper.Map<TranscriptDTO>(transcript);
        }

        public async Task<TranscriptDTO> UpdateTranscriptAsync(int id, TranscriptDTO transcript)
        {

            var Transcript = _mapper.Map<Transcript>(transcript);
            var result = await _transcriptRepository.UpdateAsync(Transcript, id);
            if (result == null)
                return null;
            await _repositoryManager.SaveAsync();
            return _mapper.Map<TranscriptDTO>(result);
        }

        public async Task<TranscriptDTO> AddTranscriptAsync(TranscriptDTO transcriptDTO)
        {
            if (await GetTranscriptByIdAsync(transcriptDTO.Id) != null)
                return null;
            var transcript = _mapper.Map<Transcript>(transcriptDTO);
            Transcript t= await _transcriptRepository.AddAsync(transcript);
            await _repositoryManager.SaveAsync();
            var tD = _mapper.Map<TranscriptDTO>(t);
            return tD;
        }

        public async Task<bool> DeleteTranscriptAsync(int id)
        {
            bool l = await _transcriptRepository.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
            return l;
        }
    }


}

