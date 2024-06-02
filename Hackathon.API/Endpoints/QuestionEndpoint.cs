using Hackathon.Persistence;
using Hackathon.Persistence.Entities;
namespace Hackathon.API.Endpoints;
using System;
using System.Net.Http.Json;
using System.Text;
using Newtonsoft.Json;

public static class QuestionEndpoint 
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("assist", AnswerQuestion);

        return app;
    }

    
    public static async Task<IResult> AnswerQuestion(string query, HackathonDbContext context)
    {
        HttpClient httpClient = new HttpClient();  

        httpClient.Timeout = TimeSpan.FromMinutes(10);

        try
        {
            Validation.Validation.ValidatePrompt(query);
        }
        catch (Exception err)
        {
            Results.UnprocessableEntity();
        }
        
        await context.Questions
            .AddAsync(
                new Question()
                {
                    Id = Guid.NewGuid(),
                    Content = query
                });
        await context.SaveChangesAsync();

        var payload = new { query = query };

        var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync("http://localhost:8000/assist", content);

        var responseString = await response.Content.ReadAsStringAsync();

        var answer = JsonConvert.DeserializeObject<Query>(responseString);

        Console.WriteLine(query);
        Console.WriteLine(responseString);

        return Results.Ok(answer);
    }
}

public class Query
{
    public string query { get; set; }
}