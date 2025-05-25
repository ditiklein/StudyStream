using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.DTOs
{
    public class StatticsDTO
    {
        public class UserStatisticsDto
        {
            public int UserId { get; set; }
            public string Username { get; set; } = string.Empty;
            public int FolderCount { get; set; }
            public int LessonCount { get; set; }
        }

        public class SystemStatisticsDto
        {
            public int TotalUsers { get; set; }
            public int TotalFolders { get; set; }
            public int TotalFiles { get; set; }
        }
    }
}
