using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Entities
{
   public class RolePremission
    {
        public int Id { get; set; }
        
        public int RoleId { get; set; }
        
        [ForeignKey(nameof(RoleId))]

        public Role? Role { get; set; }

        public int PremmisionId { get; set; }
        
        [ForeignKey(nameof(PremmisionId))]

        public Premission? Premission { get; set; }

    }
}
