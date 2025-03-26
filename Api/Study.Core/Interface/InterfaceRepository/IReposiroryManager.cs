using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Interface.InterfaceRepository
{
    public  interface IReposiroryManager
    {
         IRepository<User> _repositoryUser { get; }
         IRepository<Lesson> _repositoryLesson { get; }
         IRepository<Transcript> _repositoryTranscript { get; }
         IRepository<Folder> _repositoryFolder { get; }
         IRoleRepository _roleRepositorycs { get; }
         IUserRepository _userRoleRepository { get; }

           
        public Task SaveAsync();

    }
}
