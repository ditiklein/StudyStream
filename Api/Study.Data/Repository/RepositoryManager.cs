using Microsoft.EntityFrameworkCore;
using Study.Core.Entities;
using Study.Core.Interface.InterfaceRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Data.Repository
{
    public class RepositoryManager : IReposiroryManager
    {

        private readonly DataContext _dataContext;

        public IRepository<User> _repositoryUser { get; }
        public IRepository<Lesson> _repositoryLesson { get; }
        public IRepository<Transcript> _repositoryTranscript { get; }
        public IRepository<Folder> _repositoryFolder { get; }
        public IRoleRepository _roleRepositorycs { get; }
        public IUserRepository _userRoleRepository { get; }

        public RepositoryManager(DataContext context, IRoleRepository Role, IUserRepository userRole, IRepository<User> User, IRepository<Lesson> Lesson, IRepository<Transcript> Transcript, IRepository<Folder> Folder)
        {
            _dataContext = context;
            _repositoryFolder = Folder;
            _repositoryLesson = Lesson;
            _repositoryTranscript = Transcript;
            _repositoryUser = User;
            _roleRepositorycs = Role;
            _userRoleRepository = userRole;
        }

        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }



    }
}
