using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Entities
{
   public class Premission
    {
        [Key]
        public int Id { get; set; }
        public int PremissionName { get; set; }
        public int Description { get; set; }
    }
}
