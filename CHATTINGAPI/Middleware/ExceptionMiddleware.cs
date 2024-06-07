using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using CHATTINGAPI.Errors;

namespace CHATTINGAPI.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        private readonly ILoggerFactory _loggerFactory;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env, ILoggerFactory loggerFactory)
        {
            _env = env;
            _logger = logger;
            _next = next;
            _loggerFactory = loggerFactory;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                var response = _env.IsDevelopment()
                       ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                       : new ApiException(context.Response.StatusCode, "Internal Server error");

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(response, options);
                await context.Response.WriteAsync(json);

                //This is use for loggerFactory
                var logger = _loggerFactory.CreateLogger<ExceptionMiddleware>();
                logger.LogError(ex, ex.Message);

            }

        }
    }
}