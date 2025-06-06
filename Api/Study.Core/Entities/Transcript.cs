﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Entities
{
    [Table("Transcripts")]
    public class Transcript
    {
        public int Id { get; set; }
        public string? TranscriptUrl { get; set; }
        public string? UserName { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UpdateBy { get; set; }
        public DateTime UpdateAt { get; set; }
        public int LessonId { get; set; }
        public Lesson? Lessom { get; set; }

    }
}
