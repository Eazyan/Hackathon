using Hackathon.Persistence;
using Hackathon.Persistence.Entities;
namespace Hackathon.API.Endpoints;
using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;

public static class QuestionEndpoint 
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("assist", AnswerQuestion);

        return app;
    }

    
    public static async Task<IResult> AnswerQuestion(string query, HackathonDbContext context)
    {
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

        try
        {
            string pythonScriptPath = FindPythonScript("Neural-network", "classification.py");
            string pythonInterpreterPath = FindPythonInterpreter("PythonApplication", "myenv", "Scripts", "python.exe");

            ProcessStartInfo start = new ProcessStartInfo();
            start.FileName = pythonInterpreterPath;
            start.Arguments = $"{pythonScriptPath} {query}";
            start.WorkingDirectory = Path.GetDirectoryName(pythonScriptPath);
            start.UseShellExecute = false;
            start.RedirectStandardOutput = true;
            start.RedirectStandardError = true; // Захват стандартного вывода ошибок
            start.CreateNoWindow = true;
            
            using (Process process = Process.Start(start))
            {
                using (StreamReader reader = process.StandardOutput)
                {
                    string result = reader.ReadToEnd();
                    return Results.Ok(result);
                }
            }
        }
        catch(Exception e)
        {
            throw e;
        }
        
        return Results.Accepted();
    }

    static string FindPythonScript(string directory, string scriptName)
    {
        return FindFile(directory, scriptName);
    }

    static string FindPythonInterpreter(string directory, string venvDirectory, string scriptsDirectory, string pythonExe)
    {
        return FindFile(directory, Path.Combine(venvDirectory, scriptsDirectory, pythonExe));
    }

    static string FindFile(string directory, string fileName)
    {
        // Получение начального каталога сборки
        string currentDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        while (currentDirectory != null)
        {
            string foundPath = SearchDirectory(currentDirectory, directory, fileName);
            if (foundPath != null)
            {
                return foundPath;
            }

            // Переход в родительский каталог
            currentDirectory = Directory.GetParent(currentDirectory)?.FullName;
        }

        // Если файл не найден, вернуть null
        return null;
    }

    static string SearchDirectory(string baseDirectory, string targetDirectory, string fileName)
    {
        // Получение полного пути к целевой директории
        string targetPath = Path.Combine(baseDirectory, targetDirectory);

        if (Directory.Exists(targetPath))
        {
            string filePath = Path.Combine(targetPath, fileName);
            if (File.Exists(filePath))
            {
                return filePath;
            }

            // Рекурсивный поиск в подкаталогах
            foreach (string subDirectory in Directory.GetDirectories(targetPath))
            {
                string foundPath = SearchDirectory(subDirectory, string.Empty, fileName);
                if (foundPath != null)
                {
                    return foundPath;
                }
            }
        }

        return null;
    }
}
