using Microsoft.EntityFrameworkCore;
using Study.Core.Entities;
using Study.Core.Interface.InterfaceRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Study.Data.Repository
{
    public class TranscriptRepository : ITranscriptRepository
    {
        readonly DataContext _datacontext;

        public TranscriptRepository(DataContext context)
        {
            _datacontext = context;
        }

        public async Task<IEnumerable<Transcript>> GetAllAsync()
        {
            return await _datacontext.TranscriptList.ToListAsync();
        }

        public async Task<Transcript> AddAsync(Transcript transcript)
        {
            _datacontext.TranscriptList.Add(transcript);
            return transcript;

        }

        public async Task<Transcript?> GetByIdAsync(int id)
        {
            return await _datacontext.TranscriptList.FirstOrDefaultAsync(t => t.Id == id);
        }

        public int GetIndexById(int id)
        {
            return _datacontext.TranscriptList.ToList().FindIndex(t => t.Id == id);
        }
        public async Task<Transcript> GetTranscriptByLessonIdAsync(int lessonId)
        {
            return await _datacontext.TranscriptList
                .FirstOrDefaultAsync(t => t.LessonId == lessonId);
        }


        public async Task<Transcript> UpdateAsync(Transcript transcript, int id)
        {
            var existingTranscript = _datacontext.TranscriptList.FirstOrDefault(c => c.Id == id);
            if (existingTranscript == null) return null;



            existingTranscript.LessonId = transcript.LessonId;
            existingTranscript.TranscriptUrl = transcript.TranscriptUrl;
            existingTranscript.UpdateBy = transcript.UpdateBy;
            existingTranscript.UpdateAt = DateTime.Now;


            return transcript;


        }

        public async Task<bool> DeleteAsync(int id)
        {
            var transcript = _datacontext.TranscriptList.FirstOrDefault(c => c.Id == id);
            if (transcript == null) return false;

            _datacontext.TranscriptList.Remove(transcript);
            return true;

        }
    }
}