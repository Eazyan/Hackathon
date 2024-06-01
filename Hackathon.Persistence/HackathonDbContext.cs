using Hackathon.Persistence.Configurations;
using Hackathon.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hackathon.Persistence;

public class HackathonDbContext(DbContextOptions<HackathonDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new QuestionConfiguration());
        
        base.OnModelCreating(modelBuilder);
    }

    public DbSet<Question> Questions { get; set; }
}