using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CHATTINGAPI.DTOs;
using CHATTINGAPI.Entities;
using CHATTINGAPI.Extensions;
using CHATTINGAPI.Helpers;
using CHATTINGAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CHATTINGAPI.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if (likesParams.Predicate == "liked")
            {
                likes = likes.Where(x => x.SourceUserId == likesParams.UserId);
                users = likes.Select(like => like.LikeUser);
            }
            if (likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(x => x.LikeUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likeUsers = users.Select(user => new LikeDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                City = user.City,
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url,
                Age = user.DateOfBirth.CalculateAge(),
                Id = user.Id



            });

            return await PagedList<LikeDto>.CreateAsync(likeUsers, likesParams.PageNumber, likesParams.PageSize);


        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users.Include(l => l.LikedUsers).FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}