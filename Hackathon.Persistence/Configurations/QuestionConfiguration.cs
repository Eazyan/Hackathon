using Hackathon.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hackathon.Persistence.Configurations;

public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.HasKey(q => q.Id);
        
        builder
            .Property(q => q.Content)
            .IsRequired();
    }
}