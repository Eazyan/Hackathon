using Hackathon.Persistence;
using Hackathon.Persistence.Entities;

namespace Hackathon.API.Endpoints;

public static class QuestionEndpoint 
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("question", AnswerQuestion);

        return app;
    }

    
    public static async Task<IResult> AnswerQuestion(string question, HackathonDbContext context)
    {
        await context.Questions
            .AddAsync(
                new Question()
                {
                    Id = Guid.NewGuid(),
                    Content = question
                });
        await context.SaveChangesAsync();
        
        // Запрос в CLI ? :) 
        // Представили? Имаджинируйте.
        
        return Results.Ok();
    }
}