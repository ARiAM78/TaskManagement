using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly TaskContext _context;

    public TasksController(TaskContext context)
    {
        _context = context;
    }

    // GET: api/tasks (Get all tasks or filter by EntityId)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Task>>> GetTasks([FromQuery] int? entityId)
    {
        try
        {
            if (entityId.HasValue)
            {
                var filteredTasks = await _context.Tasks
                    .Where(t => t.EntityId == entityId.Value)
                    .ToListAsync();

                if (filteredTasks.Count == 0)
                    return NotFound($"No tasks found for EntityId {entityId.Value}.");

                return Ok(filteredTasks);
            }

            var allTasks = await _context.Tasks.ToListAsync();
            return Ok(allTasks);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while fetching tasks: {ex.Message}");
        }
    }

    // GET: api/tasks/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Task>> GetTaskById(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound($"Task with ID {id} not found.");

        return Ok(task);
    }

    // POST: api/tasks (Create a new task)
    [HttpPost]
    public async Task<ActionResult<Task>> PostTask(Task task)
    {
        try
        {
            if (task == null || task.EntityId == 0)
                return BadRequest("Task must have a valid EntityId.");

            if (string.IsNullOrEmpty(task.Title) || string.IsNullOrEmpty(task.Description) || task.DueDate == default)
                return BadRequest("All required fields must be provided.");

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    // PUT: api/tasks/{id} (Update a task)
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTask(int id, Task updatedTask)
    {
        try
        {
            if (id != updatedTask.Id)
                return BadRequest("Task ID mismatch.");

            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound("Task not found.");

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.DueDate = updatedTask.DueDate;
            task.Status = updatedTask.Status;
            task.EntityId = updatedTask.EntityId;

            await _context.SaveChangesAsync();
            return Ok(task);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    // DELETE: api/tasks/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        try
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound("Task not found.");

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}
