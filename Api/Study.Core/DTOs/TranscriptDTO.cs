using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.DTOs
{
    public class TranscriptDTO
    {
        public int Id { get; set; }
        public int LessonId { get; set; }
        public string? TranscriptUrl { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UpdateBy { get; set; }
        public DateTime UpdateAt { get; set; }

    }
}
