using Microsoft.EntityFrameworkCore;
using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Data
{
    public class DataContext:DbContext
    {
        public DbSet<User> UserList { get; set; }
        public DbSet<Lesson> LessonList { get; set; }
        public DbSet<Folder> FolderList { get; set; }
        public DbSet<Transcript> TranscriptList { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=DESKTOP-8ED3CL9;Initial Catalog=Study;Integrated Security=false;  Trusted_Connection = SSPI; MultipleActiveResultSets = true; TrustServerCertificate = true");
        }
         


    }
}
