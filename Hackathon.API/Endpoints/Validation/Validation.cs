namespace Hackathon.API.Endpoints.Validation;

public static class Validation
{
	public static bool ValidatePrompt(string prompt)
	{
		if (string.IsNullOrEmpty(prompt))
			throw new ArgumentException("Prompt is null or empty");

		return true;
	}
}