using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Serilog;

namespace CHATTINGAPI.Extensions
{
    public static class AddErrorFileLogServiceExtension
    {
        public static IServiceCollection AddErrorFileLogServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Configure Serilog with file logging
            Log.Logger = new LoggerConfiguration()
            .WriteTo.File("Logs/exception-{Date}.log")
            // Add other sinks or configuration options here
            .CreateLogger();

            // Add logging to services
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.ClearProviders();
                loggingBuilder.AddSerilog();
            });
            return services;

        }
    }
}