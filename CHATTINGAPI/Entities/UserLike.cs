using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHATTINGAPI.Entities
{
    public class UserLike
    {
        public AppUser? SourceUser { get; set; }
        public int SourceUserId { get; set; }
        public AppUser? LikeUser { get; set; }
        public int LikeUserId { get; set; }
    }
}