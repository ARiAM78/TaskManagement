using Microsoft.EntityFrameworkCore;

public class TaskContext : DbContext
{
    // Constructor to initialize the DbContext with the options passed from the Startup class
    public TaskContext(DbContextOptions<TaskContext> options) : base(options) { }

    // DbSet representing the Tasks table in the database
    public DbSet<Task> Tasks { get; set; }

    // This method allows for additional configuration of the model
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // Call the base method

        // Specify additional configurations here
        modelBuilder.Entity<Task>().Property(t => t.Title).IsRequired();
        modelBuilder.Entity<Task>().Property(t => t.Description).HasMaxLength(500);

        // Configuration for EntityId
        modelBuilder.Entity<Task>().Property(t => t.EntityId).IsRequired(); // Ensure EntityId is required
    }
}
