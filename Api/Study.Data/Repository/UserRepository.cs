
using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using Study.Core.Interface.InterfaceRepository;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Study.Data.Repository
{
    public class UserRepository : IUserRepository
    {
        readonly DataContext _datacontext;

        public UserRepository(DataContext context)
        {
            _datacontext = context;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _datacontext.UserList.ToListAsync();
        }

        public async Task<User> AddAsync(User user)
        {
              var User = _datacontext.UserList.Add(user);
               
                return user;
            
            
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _datacontext.UserList.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _datacontext.UserList.FirstOrDefaultAsync(u => u.Email == email);
        }


        public int GetIndexById(int id)
        {
            return _datacontext.UserList.ToList().FindIndex(u => u.Id == id);
        }

        public async Task<User> UpdateAsync(User user, int id)
        {

            var existingUser = _datacontext.UserList.FirstOrDefault(c => c.Id == id);
            if (existingUser == null) return null;



            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Password = user.Password;
            existingUser.Email = user.Email;
            existingUser.UpdateBy = user.UpdateBy;
            existingUser.UpdateAt = DateTime.Now;

            
                
                return user;
           
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = _datacontext.UserList.FirstOrDefault(c => c.Id == id);
            if (user == null) return false;
           
                _datacontext.UserList.Remove(user);
                
                return true;
           
            
        }
    }
}
