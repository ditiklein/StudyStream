using Microsoft.EntityFrameworkCore;
using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.InteropServices;
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

        public DbSet<SharedLesson> SharedLessons { get; set; }


        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }


    }
}
