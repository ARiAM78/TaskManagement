using Microsoft.EntityFrameworkCore;

public class TaskContext : DbContext
{
    // Constructor to initialize the DbContext with the options passed from the Startup class
    public TaskContext(DbContextOptions<TaskContext> options) : base(options) { }

    // DbSet representing the Tasks table in the database
    public DbSet<Task> Tasks { get; set; }

    // This method allows for additional configuration of the model
    // such as setting relationships between tables, defining constraints, etc.
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // Call the base method
    }
}
