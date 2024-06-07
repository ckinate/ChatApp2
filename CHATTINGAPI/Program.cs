using System.Text;
using CHATTINGAPI.Data;
using CHATTINGAPI.Data.SignalR;
using CHATTINGAPI.Entities;
using CHATTINGAPI.Extensions;
using CHATTINGAPI.Interfaces;
using CHATTINGAPI.Middleware;
using CHATTINGAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Use the extension method to add services
builder.Services.AddApplicationServices(builder.Configuration);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddCors();
// Use the extension method to add services
builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddErrorFileLogServices(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Seed the database
using (var scope = app.Services.CreateScope())
{
  var services = scope.ServiceProvider;
  try
  {
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();

    await Seed.SeedUsers(userManager, roleManager);

  }
  catch (Exception ex)
  {
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred while seeding the database.");
  }
}

// Retrieve allowed origins from appsettings.json
var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}
if (app.Environment.IsProduction())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}
//This middleware is use to handle exception
app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

if (allowedOrigins != null && allowedOrigins.Length > 0)
{
  app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins(allowedOrigins));
}

app.UseAuthentication();


app.UseAuthorization();

app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

app.Run();
