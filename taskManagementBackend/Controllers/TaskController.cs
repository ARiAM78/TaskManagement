using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly TaskContext _context;

    public TasksController(TaskContext context)
    {
        _context = context;
    }

    // GET: api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Task>>> GetTasks()
    {
        var tasks = await _context.Tasks.ToListAsync();
        if (tasks == null || tasks.Count == 0)
        {
            return NotFound("No tasks found.");
        }
        return Ok(tasks);
    }

    // POST: api/tasks
    [HttpPost]
    public async Task<ActionResult<Task>> PostTask(Task task)
    {
        if (task == null)
        {
            return BadRequest("Task cannot be null.");
        }

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(PostTask), new { id = task.Id }, task);
    }

    // PUT: api/tasks/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTask(int id, Task task)
    {
        if (id != task.Id)
        {
            return BadRequest("Task ID mismatch");
        }

        if (task == null || string.IsNullOrEmpty(task.Title) || string.IsNullOrEmpty(task.Description))
        {
            return BadRequest("Invalid task data. Please check the input fields.");
        }

        var existingTask = await _context.Tasks.FindAsync(id);
        if (existingTask == null)
        {
            return NotFound("Task not found.");
        }

        // Update task properties, ensuring status is updated only if provided
        existingTask.Title = task.Title;
        existingTask.Description = task.Description;
        existingTask.DueDate = task.DueDate;
        existingTask.Status = !string.IsNullOrEmpty(task.Status) ? task.Status : existingTask.Status;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "Error updating the task. Please try again.");
        }

        return NoContent();  // Successful update, return 204 No Content status
    }

    // DELETE: api/tasks/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound("Task not found.");
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
