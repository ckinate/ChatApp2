using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CHATTINGAPI.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string? Username { get; set; }
        [Required] public string? KnownAs { get; set; }
        [Required] public string? Gender { get; set; }
        [Required] public DateTime DateOfBirth { get; set; }
        [Required] public string? City { get; set; }
        [Required] public string? Country { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}