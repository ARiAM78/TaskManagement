public class Task
{
    public int Id { get; set; } // Primary Key
    public required string Title { get; set; }
    public required string Description { get; set; }
    public DateTime DueDate { get; set; }
    public required string Status { get; set; } // "Pending" or "Completed"

    // Foreign key to associate the task with a specific Entity
    public int EntityId { get; set; }

    // Constructor for creating a new task with all required properties
    public Task(string title, string description, DateTime dueDate, string status, int entityId)
    {
        Title = title;
        Description = description;
        DueDate = dueDate;
        Status = status;
        EntityId = entityId;
    }

    // Default constructor (required for Entity Framework)
    public Task() { }
}