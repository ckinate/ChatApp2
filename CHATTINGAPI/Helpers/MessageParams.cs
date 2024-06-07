using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHATTINGAPI.Helpers
{
    public class MessageParams : PaginationParams
    {
        public string Username { get; set; } = string.Empty;
        public string Container { get; set; } = "Unread";
    }
}