using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CHATTINGAPI.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? PhotoUrl { get; set; }

        public int Age { get; set; }
        public string? KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string? Gender { get; set; }
        public string? Introduction { get; set; }

        public string? LookingFor { get; set; }
        public string? Interests { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }

        public ICollection<PhotoDto>? Photos { get; set; }

    }

    public class PhotoDto
    {
        public int Id { get; set; }
        public string? Url { get; set; }
        public bool IsMain { get; set; }
    }
}