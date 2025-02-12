using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace taskManagementBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddEntityIdToTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserEmail",
                table: "Tasks");

            migrationBuilder.AddColumn<int>(
                name: "EntityId",
                table: "Tasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntityId",
                table: "Tasks");

            migrationBuilder.AddColumn<string>(
                name: "UserEmail",
                table: "Tasks",
                type: "TEXT",
                nullable: true);
        }
    }
}
