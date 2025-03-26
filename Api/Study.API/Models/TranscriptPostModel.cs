using System.ComponentModel.DataAnnotations;

namespace Study.API.Models
{
    public class TranscriptPostModel
    {
        public int LessonId { get; set; }  // מזהה השיעור

        public string TranscriptUrl { get; set; }  // קישור לתמלול

    }
}
