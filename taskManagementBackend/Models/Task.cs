public class Task
{
    public int Id { get; set; }
    public required string Title { get; set; } // Required property
    public required string Description { get; set; } // Required property
    public DateTime DueDate { get; set; }
    public required string Status { get; set; } // "Pending" or "Completed"

    public Task(string title, string description, DateTime dueDate, string status)
    {
        Title = title;
        Description = description;
        DueDate = dueDate;
        Status = status;
    }

    public Task() { }
}
