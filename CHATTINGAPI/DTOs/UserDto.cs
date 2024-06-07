using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHATTINGAPI.DTOs
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;

        public string? PhotoUrl { get; set; }
        public string? KnownAs { get; set; }

        public string? Gender { get; set; }
    }
}