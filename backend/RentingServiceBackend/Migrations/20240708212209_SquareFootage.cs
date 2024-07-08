using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentingServiceBackend.Migrations
{
    /// <inheritdoc />
    public partial class SquareFootage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "SquareFootage",
                table: "Posts",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SquareFootage",
                table: "Posts");
        }
    }
}
