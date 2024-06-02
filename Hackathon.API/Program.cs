using Hackathon.API.Endpoints;
using Hackathon.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var config  = builder.Configuration;
    
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();
services.AddEndpointsApiExplorer();

services.AddDbContext<HackathonDbContext>(
    options =>
    {
         options.UseNpgsql(config.GetConnectionString(nameof(HackathonDbContext)));
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapUserEndpoints();
app.UseHttpsRedirection();
app.Run();
