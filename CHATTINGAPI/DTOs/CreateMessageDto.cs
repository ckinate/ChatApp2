using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHATTINGAPI.DTOs
{
    public class CreateMessageDto
    {
        public string RecipientUserName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}