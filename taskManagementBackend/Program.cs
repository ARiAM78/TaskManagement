using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<TaskContext>(options =>
    options.UseSqlite("Data Source=tasks.db")); // SQLite for local storage

builder.Services.AddControllers();

// Allow CORS for React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000") // Frontend origin
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable CORS globally
app.UseCors("AllowReactApp");

app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
