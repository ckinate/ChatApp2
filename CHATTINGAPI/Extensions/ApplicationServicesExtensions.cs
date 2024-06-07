using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CHATTINGAPI.Data;
using CHATTINGAPI.Data.SignalR;
using CHATTINGAPI.Helpers;
using CHATTINGAPI.Interfaces;
using CHATTINGAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace CHATTINGAPI.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<CloudinarySettings>(configuration.GetSection("CloudinarySettings"));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            //  services.AddScoped<ILikesRepository, LikesRepository>();
            //  services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<LogUserActivity>();
            // services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddDbContext<DataContext>(option =>
            {
                option.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddSignalR();
            services.AddSingleton<PresenceTracker>();



            return services;

        }



    }
}